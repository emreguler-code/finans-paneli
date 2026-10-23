<?php
if (!isset($action)) { http_response_code(404); exit; }

// One event represents one business operation, including its immediate settlement.
function grossPartyEffect(array $e): int {
 if (empty($e['party_id']) || !empty($e['scheduled'])) return 0;
 $n=(int)$e['amount_cents'];
 return match($e['kind']) {'Alacak','Ödeme'=>$n,'Borç','Tahsilat'=>-$n,'Açılış'=>$e['direction']==='Borç'?-$n:$n,default=>0};
}
function settlementSign(array $e): int {
 return in_array($e['kind'],['Alacak','Borç']) ? ($e['kind']==='Alacak'?1:-1) : 0;
}
function partyEffect(array $e): int {
 $gross=grossPartyEffect($e);
 return $gross ? $gross-(($gross>0?1:-1)*(int)($e['settled_cents']??0)) : 0;
}
function cashEffect(array $e): int {
 if (!empty($e['scheduled'])) return 0;
 $n=(int)$e['amount_cents'];
 if (!empty($e['settled_cents']) && !empty($e['account_id'])) return settlementSign($e)*(int)$e['settled_cents'];
 if ($e['kind']==='Nakit avans') return $n;
 if (!empty($e['card_id']) && in_array($e['kind'],['Tahsilat','Ödeme'])) return 0;
 return match($e['kind']) {'Tahsilat'=>$n,'Ödeme','Kart ödemesi'=>-$n,default=>0};
}
function cardEffect(array $e): int {
 if (!empty($e['scheduled'])) return 0;
 $n=(int)$e['amount_cents'];
 if (!empty($e['settled_cents']) && !empty($e['card_id'])) return -settlementSign($e)*(int)$e['settled_cents'];
 if (!empty($e['card_id']) && in_array($e['kind'],['Tahsilat','Ödeme'])) return $e['kind']==='Ödeme'?$n:-$n;
 return match($e['kind']) {'Kart harcaması','Nakit avans','Kart aktarımı'=>$n,'Kart iadesi','Kart ödemesi'=>-$n,default=>0};
}
function allocations(array $events): array {
 $out=['matches'=>[],'open'=>[],'advances'=>[]];$groups=[];$byId=array_column($events,null,'id');
 foreach($events as $e)if(!$e['cancelled']&&!empty($e['party_id'])&&($n=partyEffect($e))){ $lane='main';if(($e['return_mode']??'')==='later'&&in_array($e['operation'],['supplier_return','customer_return']))$lane='return-'.$e['id'];elseif(!empty($e['linked_id'])&&in_array($e['operation'],['collection','return_payment'])){$original=$byId[$e['linked_id']]??null;if($original&&($original['return_mode']??'')==='later')$lane='return-'.$original['id'];}$groups[$e['party_id'].'|'.$lane][]=$e+['net'=>$n];}
 foreach($groups as $group=>$rows){$pid=(int)explode('|',$group)[0];
  usort($rows,fn($a,$b)=>[$a['due_date']?:'9999-12-31',$a['event_date'],$a['id']]<=>[$b['due_date']?:'9999-12-31',$b['event_date'],$b['id']]);
  $pos=[];$neg=[];foreach($rows as $e){$e['left']=abs($e['net']);if($e['net']>0)$pos[]=$e;else $neg[]=$e;}
  $pi=0;$ni=0;
  while($pi<count($pos)&&$ni<count($neg)){
   $p=&$pos[$pi];$n=&$neg[$ni];$used=min($p['left'],$n['left']);
   $p['left']-=$used;$n['left']-=$used;
   $bill=in_array($p['kind'],['Ödeme','Tahsilat'])?$n:$p;$pay=$bill['id']===$p['id']?$n:$p;
   $out['matches'][]=['bill_id'=>(int)$bill['id'],'payment_id'=>(int)$pay['id'],'amount_cents'=>$used,'party_id'=>(int)$pid,'date'=>max($p['event_date'],$n['event_date'])];
   if(!$p['left'])$pi++;if(!$n['left'])$ni++;unset($p,$n);
  }
  foreach([...$pos,...$neg] as $e)if($e['left']){
   $out['open'][]=['id'=>(int)$e['id'],'partyId'=>(int)$pid,'name'=>$e['party_name']??'','desc'=>$e['description'],'type'=>$e['net']>0?'alacak':'borç','amount'=>$e['left']/100,'amount_cents'=>$e['left'],'due'=>$e['due_date']?:null];
   if(in_array($e['kind'],['Ödeme','Tahsilat']))$out['advances'][]=['id'=>(int)$e['id'],'party_id'=>(int)$pid,'party_name'=>$e['party_name']??'','kind'=>$e['net']>0?'Verilen avans':'Alınan avans','amount_cents'=>$e['left']];
  }
 }
 return $out;
}
function eventInput(PDO $db,array $b,?array $old): array {
 $op=field($b,'operation',40) ?: ($old['operation']??'');
 $kinds=['purchase_invoice'=>'Borç','purchase_no_invoice'=>'Borç','supplier_return'=>'Alacak','sale'=>'Alacak','customer_return'=>'Borç','salary'=>'Borç','employee_purchase'=>'Alacak','employee_expense'=>'Alacak','collection'=>'Tahsilat','payment'=>'Ödeme','expense'=>'Ödeme','income'=>'Tahsilat','refund'=>'Tahsilat','transfer'=>'Virman','card_payment'=>'Kart ödemesi','cash_advance'=>'Nakit avans','card_transfer'=>'Kart aktarımı','opening'=>'Açılış','return_payment'=>'Ödeme'];
 if(!isset($kinds[$op]))throw new DomainException('İşlem türünü seçin.');
 $returnMode=field($b,'returnMode',20)?:'offset';if(!in_array($returnMode,['offset','later']))throw new DomainException('İade yöntemi geçersiz.');
 $kind=$kinds[$op];$pid=!empty($b['partyId'])?(int)$b['partyId']:null;$p=$pid?row($db,'parties',$pid):null;
 if($p){$allowed=match($p['type']){'Tedarikçi'=>['purchase_invoice','purchase_no_invoice','supplier_return','payment','collection','opening'],'Personel'=>['salary','employee_purchase','employee_expense','collection','payment','opening'],'Müşteri'=>['sale','customer_return','collection','return_payment','opening'],default=>[]};if(!in_array($op,$allowed))throw new DomainException('Bu işlem cari türüne uygun değil.');}
 elseif(in_array($op,['purchase_invoice','purchase_no_invoice','supplier_return','sale','customer_return','salary','employee_purchase','employee_expense','opening']))throw new DomainException('Cari seçin.');
 if(!empty($b['lockedPartyId'])&&(int)$b['lockedPartyId']!==$pid)throw new DomainException('Bu form başka cariye kaydedilemez.');
 $n=cents($b);if($n<=0)throw new DomainException('Tutar sıfırdan büyük olmalı.');
 $scheduled=(int)!empty($b['scheduled']);if($p&&$scheduled)throw new DomainException('Cari işlemi gerçekleşen tarihte kaydedin; vade alanını kullanın.');
 $date=validDate(field($b,'date',10,true),$scheduled===1);$due=field($b,'due',10);$due=$due?validDate($due,true):null;
 if($scheduled&&!$due)$due=$date;
 $time=field($b,'time',8)?:'12:00:00';if(!preg_match('/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/D',$time))throw new DomainException('Saat geçersiz.');if(strlen($time)===5)$time.=':00';
 $account=field($b,'account',40)?:null;$target=field($b,'target',40)?:null;$card=!empty($b['cardId'])?(int)$b['cardId']:null;$targetCard=!empty($b['targetCardId'])?(int)$b['targetCardId']:null;
 $settled=in_array($kind,['Alacak','Borç'])?cents($b,'settled'):0;
 if($settled<0||$settled>$n)throw new DomainException('Ödenen/tahsil edilen tutar toplamı aşamaz.');
 if(in_array($op,['salary','employee_purchase']))$settled=0;
 if($op==='employee_expense')$settled=$n;
 // Company pays on behalf of employee: receivable increases and money leaves.
 if($op==='employee_expense')$kind='Ödeme';
 $link=!empty($b['linkedId'])?(int)$b['linkedId']:null;
 if(($p&&$p['type']==='Tedarikçi'&&$op==='collection')||$op==='return_payment'){
  if(!$link)throw new DomainException('Tahsil edilecek mevcut iadeyi seçin.');$r=row($db,'fin_events',$link);
  if($r['cancelled']||$r['party_id']!=$pid||$r['operation']!==($op==='collection'?'supplier_return':'customer_return'))throw new DomainException('Tahsilat bu carinin aktif iadesine bağlı olmalı.');
 }
 if($link&&in_array($op,['card_payment','card_transfer'])){ $q=$db->prepare('SELECT card_id FROM card_statements WHERE id=?');$q->execute([$link]);$linkedCard=$q->fetchColumn();if(!$linkedCard||(int)$linkedCard!==($op==='card_payment'?$card:$targetCard))throw new DomainException('Ekstre seçilen karta ait değil.');}
 if(in_array($op,['transfer','card_payment','cash_advance','card_transfer'])){
  if($pid)throw new DomainException('Cari ekranında virman yapılamaz.');
  if($op==='transfer'){if(!$account||!$target||$account===$target)throw new DomainException('Farklı kaynak ve hedef hesap seçin.');$card=null;$targetCard=null;}
  if($op==='card_payment'){if(!$account||!$card)throw new DomainException('Kaynak hesap ve ödenecek kart seçin.');$target=null;$targetCard=null;}
  if($op==='cash_advance'){if(!$card||!$account)throw new DomainException('Kaynak kart ve paranın gireceği hesap seçin.');$target=null;$targetCard=null;}
  if($op==='card_transfer'){if(!$card||!$targetCard||$card===$targetCard)throw new DomainException('Farklı iki kart seçin.');$account=null;$target=null;}
 }else{
  $target=null;$targetCard=null;
  if($card)$account=null;
  if((in_array($kind,['Tahsilat','Ödeme'])||$settled)&&!$card&&!$account)throw new DomainException('İşlem hesabı seçin.');
  if(!in_array($kind,['Tahsilat','Ödeme'])&&!$settled){$account=null;$card=null;}
 }
 foreach([['parties',$pid],['accounts',$account],['accounts',$target],['cards',$card],['cards',$targetCard]] as [$table,$id])if($id&&!row($db,$table,$id)['active'])throw new DomainException('Arşivlenmiş hesaba işlem eklenemez.');
 $period=field($b,'periodDate',10)?:$date;$period=validDate($period,true);
 if(!$card)$period=$date;
 if($scheduled&&$card)throw new DomainException('Kartta gelecek dönem için dönem tarihi veya taksit kullanın.');
 $direction=field($b,'direction',10)?:'Alacak';if(!in_array($direction,['Alacak','Borç']))throw new DomainException('Bakiye yönü geçersiz.');
 return ['kind'=>$kind,'operation'=>$op,'amount_cents'=>$n,'settled_cents'=>$op==='employee_expense'?0:$settled,'event_date'=>$date,'event_time'=>$time,'period_date'=>$period,'due_date'=>$due,'party_id'=>$pid,'account_id'=>$account,'target_id'=>$target,'card_id'=>$card,'target_card_id'=>$targetCard,'linked_id'=>$link,'direction'=>$direction,'description'=>field($b,'description',1000),'category'=>'Genel','tag'=>field($b,'tag',80)?:'Genel','document_no'=>field($b,'document',160),'scheduled'=>$scheduled,'payment_purpose'=>field($b,'paymentPurpose',40),'return_mode'=>$returnMode];
}
function saveOperation(PDO $db,array $b): array {
 global $actor;$id=!empty($b['id'])?(int)$b['id']:null;permit($id?'edit':'create');$old=$id?row($db,'fin_events',$id):null;
 if($old){versionCheck($old,$b);if($old['cancelled'])throw new DomainException('İptal edilen kaydı önce geri açın.');}
 $v=eventInput($db,$b,$old);$reason=$id?field($b,'reason',1000,true):'';
 if($id){$db->prepare('UPDATE fin_events SET '.implode(',',array_map(fn($k)=>"$k=?",array_keys($v))).',version=version+1 WHERE id=?')->execute([...array_values($v),$id]);audit($db,'event',(string)$id,'edit',$old,row($db,'fin_events',$id),$reason);return ['id'=>$id];}
 $count=(int)($b['installments']??1);if($count<1||$count>36)throw new DomainException('Taksit sayısı 1–36 olmalı.');
 if($count>1&&(!$v['card_id']||$v['scheduled']||in_array($v['operation'],['card_payment','cash_advance','card_transfer'])))throw new DomainException('Taksit yalnız kartla harcama veya iade için kullanılabilir.');
 if($count>1&&$v['party_id'])throw new DomainException('Cari işlemde taksit yerine tek kart ödemesi kaydedin; taksit ayrıntısını karttan ekleyin.');
 $key=requestKey($b);$ids=[];$base=intdiv($v['amount_cents'],$count);$rem=$v['amount_cents']%$count;
 if($count>1&&$base===0)throw new DomainException('Taksit tutarı çok küçük.');
 for($i=0;$i<$count;$i++){
  $part=$v;if($count>1){$d=new DateTimeImmutable($v['period_date']);$month=$d->modify('first day of this month')->modify("+$i month");$part['period_date']=$month->setDate((int)$month->format('Y'),(int)$month->format('m'),min((int)$d->format('d'),(int)$month->format('t')))->format('Y-m-d');$part['amount_cents']=$base+($i<$rem?1:0);$part['description']=trim($v['description'].' · '.($i+1).'/'.$count.' taksit');}
  $part['installment_group']=$count>1?$key:'';
  $db->prepare('INSERT INTO fin_events(request_key,'.implode(',',array_keys($part)).',created_by) VALUES('.implode(',',array_fill(0,count($part)+2,'?')).')')->execute([$count>1?$key.'-'.$i:$key,...array_values($part),$actor['id']]);$new=(int)$db->lastInsertId();$ids[]=$new;audit($db,'event',(string)$new,'create',null,row($db,'fin_events',$new));
 }return ['id'=>$ids[0],'ids'=>$ids];
}
function saveStatement(PDO $db,array $b): array {
 permit('edit');$card=row($db,'cards',(int)($b['cardId']??0));$id=(int)($b['id']??0);
 $q=$db->prepare('SELECT * FROM card_statements WHERE card_id=? AND id=?');$q->execute([$card['id'],$id]);$old=$id?$q->fetch():null;if($id&&!$old)throw new DomainException('Ekstre bulunamadı.');if($old){versionCheck($old,$b);if(field($b,'date',10)!==$old['cut_date'])throw new DomainException('Ekstre kesim tarihi değiştirilemez; doğru tarih için yeni ekstre girin.');}
 $date=validDate(field($b,'date',10,true));$due=validDate(field($b,'due',10,true),true);if($due<$date)throw new DomainException('Son ödeme kesimden önce olamaz.');$total=cents($b,'total');
 $reason=$old?field($b,'reason',1000,true):'';
 if(!$old){$check=$db->prepare('SELECT id FROM card_statements WHERE card_id=? AND cut_date=?');$check->execute([$card['id'],$date]);if($check->fetchColumn())throw new DomainException('Bu tarih için ekstre var; mevcut ekstreyi düzeltin.');}
 if($old)$db->prepare('UPDATE card_statements SET total_cents=?,due_date=?,version=version+1 WHERE id=?')->execute([$total,$due,$id]);
 else{$db->prepare('INSERT INTO card_statements(card_id,cut_date,due_date,total_cents,created_by) VALUES(?,?,?,?,?)')->execute([$card['id'],$date,$due,$total,$GLOBALS['actor']['id']]);$id=(int)$db->lastInsertId();}
 $q=$db->prepare('SELECT * FROM card_statements WHERE id=?');$q->execute([$id]);$new=$q->fetch();audit($db,'statement',(string)$id,$old?'edit':'create',$old,$new,$reason);
 $db->prepare('UPDATE cards SET statement_date=?,due=?,version=version+1 WHERE id=?')->execute([$date,$due,$card['id']]);return ['id'=>$id];
}
function enhanceCardState(PDO $db,array $s): array {
 $statements=$db->query('SELECT * FROM card_statements ORDER BY cut_date,id')->fetchAll();
 $statementsByCard=[];foreach($statements as $st)$statementsByCard[$st['card_id']][]=$st;
 $eventsByCard=[];foreach($s['events'] as $event){foreach(array_unique(array_filter([$event['card_id'],$event['target_card_id']])) as $id)$eventsByCard[$id][]=$event;}
 foreach($s['events'] as &$e){$e['tag']=$e['tag']?:'Genel';$e['period_date']=$e['period_date']?:$e['event_date'];$e['scheduled']=(bool)$e['scheduled'];$e['settled_cents']=(int)$e['settled_cents'];$e['target_card_id']=$e['target_card_id']?(int)$e['target_card_id']:null;$e['operation']=$e['operation']?:match($e['kind']){'Alacak'=>'sale','Borç'=>'purchase_no_invoice','Kart ödemesi'=>'card_payment','Virman'=>'transfer','Ödeme'=>'payment','Tahsilat'=>'collection','Açılış'=>'opening','Kart harcaması'=>'expense','Kart iadesi'=>'refund',default=>'expense'};}unset($e);
 foreach($s['cards'] as &$c){
  $own=$statementsByCard[$c['id']]??[];$cardEvents=$eventsByCard[$c['id']]??[];$list=[];$priorDate=null;$latestPaid=0;$latestTotal=0;$latestRemaining=0;$latestDifference=0;
  foreach($own as $si=>$st){$known=0;$paid=0;$paidAtNext=0;$nextCut=$own[$si+1]['cut_date']??null;
   foreach($cardEvents as $e){if($e['cancelled']||$e['scheduled'])continue;$source=$e['card_id']==$c['id'];$destination=$e['target_card_id']==$c['id'];if(!$source&&!$destination)continue;
    $effect=$source?$e['card_effect']:-$e['amount_cents'];$repay=$destination||in_array($e['operation'],['card_payment'],true);
    $billing=$e['period_date'];if(!$repay&&$billing<=$st['cut_date']&&$e['event_date']<=$st['cut_date']&&(!$priorDate||$billing>$priorDate))$known+=$effect;
    if(!$repay&&$effect<0&&$e['event_date']>$st['cut_date']&&$billing<=$st['cut_date']&&(!$nextCut||$e['event_date']<=$nextCut)){$paid+=-$effect;$paidAtNext+=-$effect;}
    // A repayment is assigned explicitly, otherwise to the oldest remaining statement.
    if($repay&&$e['event_date']>$st['cut_date']){if(!$nextCut||$e['linked_id']==$st['id']||!$e['linked_id']&&$e['event_date']<=$nextCut)$paid+=-$effect;if(!$nextCut||$e['event_date']<=$nextCut)$paidAtNext+=-$effect;}
   }
   $carry=$list?max(0,(int)end($list)['total_cents']-(int)end($list)['paid_at_next_cents']):(int)$c['opening_debt_cents']-(int)$c['opening_unbilled_cents'];
   $difference=(int)$st['total_cents']-$carry-$known;$remaining=max(0,(int)$st['total_cents']-$paid);
   $list[]=$st+['known_cents'=>$known,'carry_cents'=>$carry,'difference_cents'=>$difference,'paid_cents'=>$paid,'paid_at_next_cents'=>$paidAtNext,'remaining_cents'=>$remaining];$priorDate=$st['cut_date'];$latestPaid=$paid;$latestTotal=(int)$st['total_cents'];$latestRemaining=$remaining;$latestDifference=$difference;
  }
  $current=0;$future=0;$postRepay=0;
  foreach($cardEvents as $e){if($e['cancelled']||$e['scheduled'])continue;$source=$e['card_id']==$c['id'];$destination=$e['target_card_id']==$c['id'];if(!$source&&!$destination)continue;$effect=$source?$e['card_effect']:-$e['amount_cents'];
   if($source&&$e['operation']==='card_payment'||$destination){if(!$own)$postRepay+=$effect;continue;}
   if(!$priorDate||$e['period_date']>$priorDate){if($e['period_date']>substr($s['today'],0,7).'-'.str_pad((string)min((int)$c['cut_day'],(int)date('t',strtotime($s['today']))),2,'0',STR_PAD_LEFT)&&$e['period_date']>$s['today'])$future+=$effect;else $current+=$effect;}
  }
  if($own){$c['debt']=($latestTotal-$latestPaid+$current+$future)/100;$c['statement']=max(0,min($latestRemaining,$latestRemaining+min(0,$current),(int)round($c['debt']*100)))/100;$c['statement_date']=end($own)['cut_date'];$c['due']=end($own)['due_date'];}
  else{$current=(int)round($c['debt']*100)-(int)round($c['statement']*100)-$future;}
  if($own)$list[count($list)-1]['remaining_cents']=(int)round($c['statement']*100);
  $c['statement_credit_cents']=$own?max(0,$latestRemaining-(int)round($c['statement']*100)):0;
  $c['statement_total_cents']=$own?$latestTotal:max(0,(int)round($c['statement']*100)-$postRepay);$c['paid_cents']=$own?$latestPaid:max(0,-$postRepay);$c['unbilled_cents']=$current;$c['future_cents']=$future;$c['available_cents']=(int)$c['limit_cents']-(int)round($c['debt']*100);$c['statements']=$list;$c['statement_difference_cents']=$latestDifference;
 }unset($c);$s['schemaVersion']=9;return $s;
}

function seedDemo(PDO $db,bool $comprehensive=true): array {
 permit('admin');
 // Only administrator credentials and installation configuration survive the test reset.
 foreach(['vehicle_payments','campaign_entries','vehicle_records','vehicles','campaigns','audit_log','card_statements','fin_events','movements','party_entries','journal','claims','parties','cards','accounts','write_requests'] as $table){
  $q=$db->prepare('SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?');$q->execute([$table]);if($q->fetchColumn())$db->exec("DELETE FROM `$table`");
 }
 $db->exec("DELETE FROM users WHERE role<>'admin'");
 $db->exec("UPDATE app_meta SET demo_date='2026-10-13' WHERE id=1");
 $accounts=[['bank','Günlük hesap','Banka hesabı',12000000,'garanti','Örnek Kullanıcı'],['saving','Birikim hesabı','Birikim hesabı',7500000,'yapikredi','Örnek Kullanıcı'],['cash','Nakit kasa','Kasa',2500000,'','']];
 $q=$db->prepare('INSERT INTO accounts(id,name,type,opening_cents,sort_order,bank_code,bank,holder) VALUES(?,?,?,?,?,?,?,?)');foreach($accounts as $i=>$a)$q->execute([$a[0],$a[1],$a[2],$a[3],$i,$a[4],$a[4]==='garanti'?'Garanti BBVA':($a[4]==='yapikredi'?'Yapı Kredi':''),$a[5]]);
 $db->exec("INSERT INTO accounts(id,name,type,opening_cents,sort_order,bank_code,holder,credit_limit_cents,daily_interest_rate) VALUES('kmh','KMH Deneme Hesabı','Kredili Mevduat Hesabı',-500000,4,'garanti','Örnek Kullanıcı',4000000,0.10)");
 $parties=[];foreach([['Yıldız Tedarik','Tedarikçi'],['Ada Tasarım','Müşteri'],['Ayşe Demir','Personel'],['Atlas Danışmanlık','Müşteri']] as [$name,$type]){$db->prepare('INSERT INTO parties(name,title,type) VALUES(?,?,?)')->execute([$name,$name,$type]);$parties[]=(int)$db->lastInsertId();}
 $cards=[];foreach([['Garanti Bonus Kart','garanti','bonus','0823',8000000],['World Kart','yapikredi','world','1947',5000000],['Axess Kart','akbank','axess','6308',10000000]] as $c){$db->prepare("INSERT INTO cards(debt_cents,statement_cents,name,limit_cents,due,statement_date,opening_statement_date,cut_day,last_four,bank_code,program_code,network_code,holder) VALUES(0,0,?,?,'2026-10-20','2026-10-10','2026-10-10',10,?,?,?,'mastercard','Örnek Kullanıcı')")->execute([$c[0],$c[4],$c[3],$c[1],$c[2]]);$cards[]=(int)$db->lastInsertId();}
 $base=['amount'=>'1000','settled'=>'0','date'=>'2026-10-13','time'=>'10:00','description'=>'','account'=>'','cardId'=>'','target'=>'','due'=>'','tag'=>'Genel'];
 $add=function(array $b)use($db,$base){return saveOperation($db,array_merge($base,$b,['requestId'=>sprintf('%08x-%04x-%04x-%04x-%012x',random_int(1,0xfffffff),random_int(0,65535),random_int(0,65535),random_int(0,65535),random_int(0,0xffffffffff))]));};
 $add(['operation'=>'purchase_invoice','partyId'=>$parties[0],'amount'=>'10000','settled'=>'3000','account'=>'bank','description'=>'Kısmi ödenmiş mal alışı','due'=>'2026-10-18','tag'=>'Gıda']);
 $add(['operation'=>'purchase_no_invoice','partyId'=>$parties[0],'amount'=>'4000','description'=>'Vadesiz mal alışı','tag'=>'Kırtasiye']);
 $add(['operation'=>'supplier_return','partyId'=>$parties[0],'amount'=>'1000','description'=>'Borçtan mahsup mal iadesi']);
 $add(['operation'=>'payment','partyId'=>$parties[0],'amount'=>'2000','cardId'=>$cards[0],'description'=>'Tedarikçiye kartlı ödeme','date'=>'2026-10-09','tag'=>'Gıda']);
 $add(['operation'=>'sale','partyId'=>$parties[1],'amount'=>'18500','settled'=>'5000','account'=>'bank','description'=>'Proje hizmeti','due'=>'2026-10-23']);
 $add(['operation'=>'customer_return','partyId'=>$parties[1],'amount'=>'1500','description'=>'Cari hesaptan düşülen iade']);
 $add(['operation'=>'salary','partyId'=>$parties[2],'amount'=>'30000','description'=>'Ekim maaş hak edişi']);
 $add(['operation'=>'employee_purchase','partyId'=>$parties[2],'amount'=>'4000','description'=>'Personel alışverişi','tag'=>'Gıda']);
 $add(['operation'=>'employee_expense','partyId'=>$parties[2],'amount'=>'2000','account'=>'cash','description'=>'Personel adına kişisel ödeme','tag'=>'Otomotiv']);
 $add(['operation'=>'payment','partyId'=>$parties[2],'amount'=>'10000','account'=>'bank','description'=>'Maaş avansı','paymentPurpose'=>'Avans']);
 $add(['operation'=>'expense','cardId'=>$cards[0],'amount'=>'3000','description'=>'Ofis malzemeleri','date'=>'2026-10-08','tag'=>'Kırtasiye']);
 $add(['operation'=>'expense','cardId'=>$cards[0],'amount'=>'6000','description'=>'Taksitli ekipman','installments'=>3,'tag'=>'Otomotiv']);
 $add(['operation'=>'refund','cardId'=>$cards[0],'amount'=>'1500','description'=>'Taksitli ekipman iadesi','installments'=>3,'tag'=>'Otomotiv']);
 $st=saveStatement($db,['cardId'=>$cards[0],'date'=>'2026-10-10','due'=>'2026-10-20','total'=>'16000']);
 $add(['operation'=>'card_payment','cardId'=>$cards[0],'account'=>'bank','amount'=>'4000','description'=>'Ekstre kısmi ödemesi','linkedId'=>$st['id']]);
 $add(['operation'=>'expense','account'=>'bank','amount'=>'2800','description'=>'Planlanan kira','date'=>'2026-10-25','due'=>'2026-10-25','scheduled'=>true]);
 $add(['operation'=>'income','account'=>'cash','amount'=>'1200','description'=>'Planlanan kasa girişi','date'=>'2026-10-19','due'=>'2026-10-19','scheduled'=>true]);
 $add(['operation'=>'transfer','account'=>'bank','target'=>'cash','amount'=>'5000','description'=>'Kasaya para aktarımı']);
 if($comprehensive){
  // Deterministic fictional history; all financial facts go through normal validation/audit.
  $db->exec("UPDATE accounts SET opening_cents=50000000 WHERE id='bank'");
  $more=[];foreach([['Poyraz Gıda','Tedarikçi'],['Mavi Ofis','Tedarikçi'],['Lale Mimarlık','Müşteri'],['Deniz Yazılım','Müşteri'],['Ece Yılmaz','Personel'],['Can Kaya','Personel']] as [$name,$type]){$db->prepare('INSERT INTO parties(name,title,type) VALUES(?,?,?)')->execute([$name,$name,$type]);$more[]=(int)$db->lastInsertId();}
  for($month=4;$month<=10;$month++){
   $last=$month===10?13:27;
   for($day=1;$day<=$last;$day+=2){
    $date=sprintf('2026-%02d-%02d',$month,$day);$suffix=sprintf('%02d%02d',$month,$day);$tag=['Gıda','Kırtasiye','Otomotiv'][($day+$month)%3];
    $common=['date'=>$date,'time'=>sprintf('%02d:%02d',9+$day%8,$day%60),'document'=>'DEMO-'.$suffix,'tag'=>$tag];
    $add(array_merge($common,['operation'=>'income','account'=>'bank','amount'=>(string)(1200+$month*31+$day*7),'description'=>'Demo '.$suffix.' hizmet tahsilatı']));
    $add(array_merge($common,['operation'=>'expense','account'=>$day%3?'bank':'cash','amount'=>(string)(150+$day*11),'description'=>'Demo '.$suffix.' işletme gideri']));
    $add(array_merge($common,['operation'=>$day%3?'purchase_invoice':'purchase_no_invoice','partyId'=>$more[intdiv($day,2)%2],'amount'=>(string)(900+$day*13),'settled'=>'200','account'=>'bank','due'=>date('Y-m-d',strtotime($date.' +20 days')),'description'=>'Demo '.$suffix.' stok alışı']));
    $add(array_merge($common,['operation'=>'sale','partyId'=>$more[2+intdiv($day,2)%2],'amount'=>(string)(1800+$day*17),'settled'=>'600','account'=>'cash','due'=>date('Y-m-d',strtotime($date.' +15 days')),'description'=>'Demo '.$suffix.' proje satışı']));
    $add(array_merge($common,['operation'=>'expense','cardId'=>$cards[$day%3],'amount'=>(string)(250+$day*9),'description'=>'Demo '.$suffix.' kart harcaması']));
    if($day%5===0)$add(array_merge($common,['operation'=>'transfer','account'=>'bank','target'=>'cash','amount'=>'375','description'=>'Demo '.$suffix.' kasa aktarımı']));
    if($day%7===0)$add(array_merge($common,['operation'=>'refund','cardId'=>$cards[$day%3],'amount'=>'75','description'=>'Demo '.$suffix.' kart iadesi']));
   }
   foreach([$more[4],$more[5]] as $employee){$add(['operation'=>'salary','partyId'=>$employee,'amount'=>'18000','date'=>sprintf('2026-%02d-01',$month),'description'=>'Demo aylık maaş tahakkuku']);$add(['operation'=>'payment','partyId'=>$employee,'account'=>'bank','amount'=>'15000','date'=>sprintf('2026-%02d-05',$month),'description'=>'Demo aylık maaş ödemesi']);}
  }
  $add(['operation'=>'expense','account'=>'kmh','amount'=>'250','description'=>'Demo KMH kullanımı']);
  $add(['operation'=>'income','account'=>'kmh','amount'=>'100','description'=>'Demo KMH geri yatırma']);
  foreach($cards as $index=>$card){
   for($month=4;$month<=9;$month++){$st=saveStatement($db,['cardId'=>$card,'date'=>sprintf('2026-%02d-10',$month),'due'=>sprintf('2026-%02d-20',$month),'total'=>(string)(1700+$month*100+$index*50)]);$add(['operation'=>'card_payment','cardId'=>$card,'account'=>'bank','linkedId'=>$st['id'],'amount'=>(string)(1000+$month*50),'date'=>sprintf('2026-%02d-18',$month),'description'=>'Demo geçmiş ekstre ödemesi']);}
   // Restore current statement pointer after historical statements are entered.
   $db->prepare("UPDATE cards SET statement_date='2026-10-10',due='2026-10-20' WHERE id=?")->execute([$card]);
  }
  for($day=14;$day<=28;$day+=2)foreach(['bank','cash','kmh'] as $account)$add(['operation'=>$account==='cash'?'income':'expense','account'=>$account,'amount'=>(string)(450+$day*20),'date'=>sprintf('2026-10-%02d',$day),'scheduled'=>true,'description'=>'Demo planlanan '.$account.' '.$day]);
  $add(['operation'=>'cash_advance','cardId'=>$cards[1],'account'=>'cash','amount'=>'1200','description'=>'Demo karttan nakit avans']);
  $add(['operation'=>'card_transfer','cardId'=>$cards[2],'targetCardId'=>$cards[1],'amount'=>'500','description'=>'Demo kart borcu aktarımı']);
  $add(['operation'=>'expense','cardId'=>$cards[2],'amount'=>'1234.57','installments'=>6,'description'=>'Demo kuruşlu altı taksit']);
 }
 if($comprehensive)seedTrackingDemo($db,$cards,$parties);
 audit($db,'system','demo','create',null,['demo'=>true,'profile'=>$comprehensive?'comprehensive':'compact'],'Yönetici girişi korunarak sentetik deneme verileri oluşturuldu');return ['demoReady'=>true];
}
