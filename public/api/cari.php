<?php
// Loaded by index.php after session/CSRF authentication. Never a standalone API.
if (!isset($db,$action,$body)) {http_response_code(404);exit;}
function amountCents(array $b,string $key='amount',bool $zero=false): int {
 $s=field($b,$key,16,true);if(!preg_match('/^\d{1,9}([.,]\d{1,2})?$/D',$s))fail('Tutarı 1234,56 biçiminde, en fazla iki ondalıkla girin.');
 $p=explode('.',str_replace(',','.',$s));$n=(int)$p[0]*100+(int)str_pad($p[1]??'',2,'0');if(!$zero&&$n===0)fail('Sıfırdan büyük tutar girin.');return $n;
}
function cariDate(array $b,string $key, bool $future=false): string {
 $s=field($b,$key,10,true);$d=DateTimeImmutable::createFromFormat('!Y-m-d',$s);
 global $db;$today=$db->query('SELECT demo_date FROM app_meta WHERE id=1')->fetchColumn()?:date('Y-m-d');
 if(!$d||$d->format('Y-m-d')!==$s||$s<'2000-01-01'||$s>'2100-12-31'||(!$future&&$s>$today))fail('Geçerli bir tarih seçin. İşlem tarihi gelecekte olamaz.');return $s;
}
function cariKey(array $b): string {$s=field($b,'requestId',36,true);if(!preg_match('/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/D',$s))fail('Geçersiz kayıt anahtarı.');return $s;}
function partyRow(array $r): array {foreach(['id','version','balance_cents'] as $k)if(isset($r[$k]))$r[$k]=(int)$r[$k];return $r;}
function shortName(?string $name): string {return $name?explode(' ',trim($name))[0]:'Önceki kayıt';}
function requireParty(PDO $db,int $id): array {$q=$db->prepare('SELECT * FROM parties WHERE id=?');$q->execute([$id]);$r=$q->fetch();if(!$r)throw new DomainException('Cari bulunamadı.');return $r;}
function appendParty(PDO $db,int $party,string $journal,string $date,string $kind,int $cents,string $description,?string $account,?int $actor,string $document=''): void {
 $db->prepare('INSERT INTO party_entries(party_id,journal_id,entry_date,entry_time,kind,description,amount_cents,account_id,created_by,document_no) VALUES(?,?,?,?,?,?,?,?,?,?)')->execute([$party,$journal,$date,date('H:i:s'),$kind,$description,$cents,$account,$actor,$document]);
}
if($action==='parties'&&$method==='GET') {
 $search=field($_GET,'q',160);$type=field($_GET,'type',20);$w=[];$args=[];
 if($search!==''&&preg_match_all('/./us',$search)>=3){$w[]='(p.name LIKE ? OR p.title LIKE ?)';$v='%'.strtr($search,['='=>'==','%'=>'=%','_'=>'=_']).'%';$w[count($w)-1]="(p.name LIKE ? ESCAPE '=' OR p.title LIKE ? ESCAPE '=')";$args=[$v,$v];}
 if($type!==''&&$type!=='Tümü'){$w[]='p.type=?';$args[]=$type;}
 $sql="SELECT p.*,COALESCE(e.balance_cents,0) balance_cents,e.last_date,e.last_time FROM parties p LEFT JOIN (SELECT party_id,SUM(amount_cents) balance_cents,MAX(CONCAT(entry_date,' ',entry_time)) last_date,MAX(entry_time) last_time FROM party_entries GROUP BY party_id) e ON e.party_id=p.id";
 $q=$db->prepare($sql.($w?' WHERE '.implode(' AND ',$w):'').' ORDER BY p.name,p.id');$q->execute($args);$rows=array_map('partyRow',$q->fetchAll());
 $net=(int)$db->query('SELECT COALESCE(SUM(amount_cents),0) FROM party_entries')->fetchColumn();
 reply(['parties'=>$rows,'net_cents'=>$net,'total'=>(int)$db->query('SELECT COUNT(*) FROM parties')->fetchColumn()]);
}
if($action==='party'&&$method==='GET') {
 $id=filter_var($_GET['id']??null,FILTER_VALIDATE_INT);if(!$id)fail('Geçersiz cari.');$p=requireParty($db,$id);
 $q=$db->prepare('SELECT e.*,a.name account_name,u.username FROM party_entries e LEFT JOIN accounts a ON a.id=e.account_id LEFT JOIN users u ON u.id=e.created_by WHERE e.party_id=? ORDER BY e.entry_date,e.entry_time,e.id');$q->execute([$id]);$balance=0;$rows=[];$actors=[];
 foreach($q->fetchAll() as $r){$r['amount_cents']=(int)$r['amount_cents'];$balance+=$r['amount_cents'];$r['balance_cents']=$balance;$r['creator']=shortName($r['username']);$r['created_by']=$r['created_by']===null?0:(int)$r['created_by'];$actors[$r['created_by']]=$r['creator'];unset($r['username']);$rows[]=$r;}
 $p['balance_cents']=$balance;reply(['party'=>partyRow($p),'entries'=>$rows,'actors'=>$actors]);
}
if($action==='party_save'&&$method==='POST') {
 $id=$body['id']??null;if($id!==null&&(!is_int($id)||$id<1))fail('Geçersiz cari.');
 $keys=['name'=>160,'title'=>200,'type'=>20,'phone'=>50,'email'=>160,'tax_no'=>40,'tax_office'=>160,'address'=>1000,'notes'=>1000];$v=[];foreach($keys as $k=>$max)$v[$k]=field($body,$k,$max,in_array($k,['name','type']));
 if(!in_array($v['type'],['Müşteri','Tedarikçi','Personel','Diğer'],true))fail('Geçersiz cari türü.');if($v['email']&&!filter_var($v['email'],FILTER_VALIDATE_EMAIL))fail('E-posta adresini kontrol edin.');
 $cents=$id?0:amountCents($body,'opening',true);$direction=field($body,'direction',10);if($cents&&!in_array($direction,['Alacak','Borç'],true))fail('Açılış yönünü seçin.');
 $date=$id?'':cariDate($body,'date');$due=$id?'':cariDate($body,'due',true);$key=cariKey($body);$hash=hash('sha256',json_encode(['party_save',$id,$v,$cents,$direction,$date,$due,$body['version']??null]));
 $db->beginTransaction();$db->query('SELECT id FROM app_meta WHERE id=1 FOR UPDATE')->fetch();
 $q=$db->prepare('SELECT payload_hash FROM journal WHERE id=?');$q->execute([$key]);$old=$q->fetchColumn();if($old){$db->rollBack();if(!hash_equals($old,$hash))fail('Kayıt anahtarı farklı içerikle tekrar kullanıldı.',409);$q=$db->prepare('SELECT id FROM parties WHERE create_key=?');$q->execute([$key]);reply(['ok'=>true,'id'=>$id?:((int)$q->fetchColumn()),'duplicate'=>true]);}
 if($id){$p=requireParty($db,$id);if((int)($body['version']??0)!==(int)$p['version'])throw new DomainException('Cari başka bir oturumda değişti. Paneli kapatıp yeniden açın.');$q=$db->prepare('UPDATE parties SET name=?,title=?,type=?,phone=?,email=?,tax_no=?,tax_office=?,address=?,notes=?,version=version+1 WHERE id=?');$q->execute([...array_values($v),$id]);$db->prepare('UPDATE claims SET name=? WHERE party_id=?')->execute([$v['name'],$id]);}
 else{$q=$db->prepare('INSERT INTO parties(name,title,type,phone,email,tax_no,tax_office,address,notes,create_key) VALUES(?,?,?,?,?,?,?,?,?,?)');$q->execute([...array_values($v),$key]);$id=(int)$db->lastInsertId();}
 $db->prepare('INSERT INTO journal(id,payload_hash,created_by) VALUES(?,?,?)')->execute([$key,$hash,$_SESSION['uid']]);
 if($cents){$signed=$direction==='Alacak'?$cents:-$cents;appendParty($db,$id,$key,$date,'Açılış',$signed,'Açılış bakiyesi',null,(int)$_SESSION['uid']);$db->prepare('INSERT INTO claims(name,description,type,amount_cents,due,party_id) VALUES(?,?,?,?,?,?)')->execute([$v['name'],'Açılış bakiyesi',$signed>0?'alacak':'borç',$cents,$due,$id]);}
 $db->commit();reply(['ok'=>true,'id'=>$id,'state'=>state($db)],201);
}
if($action==='party_entry'&&$method==='POST') {
 $id=$body['partyId']??null;if(!is_int($id)||$id<1)fail('Geçersiz cari.');$kind=field($body,'kind',20,true);if(!in_array($kind,['Alacak','Borç','Tahsilat','Ödeme'],true))fail('Geçersiz işlem yönü.');
 $cents=amountCents($body);$date=cariDate($body,'date');$due=cariDate($body,'due',true);$desc=field($body,'description',1000,true);$doc=field($body,'document',160);$cash=in_array($kind,['Tahsilat','Ödeme']);$account=$cash?field($body,'account',40,true):null;$key=cariKey($body);
 $hash=hash('sha256',json_encode(['party_entry',$id,$kind,$cents,$date,$due,$desc,$doc,$account]));
 $db->beginTransaction();$db->query('SELECT id FROM app_meta WHERE id=1 FOR UPDATE')->fetch();
 $q=$db->prepare('SELECT payload_hash FROM journal WHERE id=?');$q->execute([$key]);$old=$q->fetchColumn();if($old){$db->rollBack();if(!hash_equals($old,$hash))fail('Kayıt anahtarı farklı içerikle tekrar kullanıldı.',409);reply(['ok'=>true,'duplicate'=>true,'state'=>state($db)]);}
 $p=requireParty($db,$id);$signed=in_array($kind,['Alacak','Ödeme'])?$cents:-$cents;
 if($cash){$q=$db->prepare('SELECT id FROM accounts WHERE id=?');$q->execute([$account]);if(!$q->fetchColumn())throw new DomainException('Hesap bulunamadı.');
  $q=$db->prepare('SELECT id,amount_cents FROM claims WHERE party_id=? AND type=? AND amount_cents>0 ORDER BY due,id FOR UPDATE');$q->execute([$id,$kind==='Tahsilat'?'alacak':'borç']);$claims=$q->fetchAll();$available=array_sum(array_column($claims,'amount_cents'));if($cents>$available)throw new DomainException('Tutar, bu yöndeki açık cari bakiyesini aşamaz.');$left=$cents;
  foreach($claims as $c){$paid=min($left,(int)$c['amount_cents']);if($paid)$db->prepare('UPDATE claims SET amount_cents=amount_cents-? WHERE id=?')->execute([$paid,$c['id']]);$left-=$paid;}
 }else{$db->prepare('INSERT INTO claims(name,description,type,amount_cents,due,party_id) VALUES(?,?,?,?,?,?)')->execute([$p['name'],$desc,$kind==='Alacak'?'alacak':'borç',$cents,$due,$id]);}
 $db->prepare('INSERT INTO journal(id,payload_hash,created_by) VALUES(?,?,?)')->execute([$key,$hash,$_SESSION['uid']]);appendParty($db,$id,$key,$date,$kind,$signed,$desc,$account,(int)$_SESSION['uid'],$doc);
 if($cash)$db->prepare('INSERT INTO movements(journal_id,account_id,movement_date,movement_time,name,description,kind,amount_cents,category,document_no) VALUES(?,?,?,?,?,?,?,?,?,?)')->execute([$key,$account,$date,date('H:i:s'),$p['name'],$desc,$kind,-$signed,'Cari işlem',$doc]);
 $db->commit();reply(['ok'=>true,'state'=>state($db)],201);
}
