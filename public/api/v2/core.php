<?php
// Loaded only by the authenticated API router.
if (!isset($action)) { http_response_code(404); exit; }
const V2_ROLES=['admin','editor','user','viewer'];
const V2_KINDS=['Açılış','Alacak','Borç','Tahsilat','Ödeme','Virman','Kart harcaması','Kart iadesi','Kart ödemesi'];
function v2Actor(PDO $db): ?array {
 if(empty($_SESSION['uid']))return null;
 $q=$db->prepare('SELECT * FROM users WHERE id=?');$q->execute([$_SESSION['uid']]);$u=$q->fetch();
 if(!$u || (isset($u['active'])&&!$u['active']))return null;
 return ['id'=>(int)$u['id'],'username'=>$u['username'],'short_name'=>$u['short_name']??explode(' ',$u['username'])[0],'role'=>((int)$db->query('SELECT schema_version FROM app_meta WHERE id=1')->fetchColumn()>=3?$u['role']:null)??((int)$u['id']==(int)$db->query('SELECT MIN(id) FROM users')->fetchColumn()?'admin':'viewer')];
}
function permit(string $task): void {
 global $actor;
 $role=$actor['role']??'';
 $allowed=match($task){'view'=>V2_ROLES,'create'=>['admin','editor','user'],'edit'=>['admin','editor'],default=>['admin']};
 if(!in_array($role,$allowed,true))fail('Bu işlem için yetkiniz yok.',403);
}
function cents(array $b,string $key='amount',bool $signed=false): int {
 $s=trim((string)($b[$key]??''));$pattern=$signed?'/^-?\d{1,9}([.,]\d{1,2})?$/D':'/^\d{1,9}([.,]\d{1,2})?$/D';
 if(!preg_match($pattern,$s))throw new DomainException('Tutarı 1234,56 biçiminde ve en fazla iki ondalıkla girin.');
 $neg=str_starts_with($s,'-');$parts=explode('.',str_replace(',','.',ltrim($s,'-')));return ((int)$parts[0]*100+(int)str_pad($parts[1]??'',2,'0'))*($neg?-1:1);
}
function today(PDO $db): string {return $db->query('SELECT demo_date FROM app_meta WHERE id=1')->fetchColumn()?:date('Y-m-d');}
function validDate(string $s,bool $future=false): string {
 global $db;$d=DateTimeImmutable::createFromFormat('!Y-m-d',$s);
 if(!$d||$d->format('Y-m-d')!==$s||$s<'2000-01-01'||(!$future&&$s>today($db)))throw new DomainException('Geçerli bir tarih seçin; işlem gelecekte olamaz.');return $s;
}
function requestKey(array $b): string {$key=field($b,'requestId',36,true);if(!preg_match('/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/D',$key))throw new DomainException('Kayıt anahtarı geçersiz.');return $key;}
function audit(PDO $db,string $entity,string $id,string $operation,$before,$after,string $reason=''): void {
 global $actor;$db->prepare('INSERT INTO audit_log(entity,entity_id,operation,actor_id,actor_name,before_json,after_json,reason) VALUES(?,?,?,?,?,?,?,?)')->execute([$entity,$id,$operation,$actor['id']??null,$actor['short_name']??'Sistem',json_encode($before,JSON_UNESCAPED_UNICODE),json_encode($after,JSON_UNESCAPED_UNICODE),$reason]);
}
function row(PDO $db,string $table,$id): array {
 if(!in_array($table,['fin_events','parties','accounts','cards','users'],true))throw new DomainException('Geçersiz kayıt.');
 $q=$db->prepare("SELECT * FROM $table WHERE id=?");$q->execute([$id]);$r=$q->fetch();if(!$r)throw new DomainException('Kayıt bulunamadı.');return $r;
}
function publicRow(array $r): array {unset($r['password_hash']);return $r;}
function versionCheck(array $old,array $b): void {if((int)$old['version']!==(int)($b['version']??0))throw new DomainException('Kayıt başka bir oturumda değişti. Yeniden açıp kontrol edin.');}
function allEvents(PDO $db): array {return $db->query("SELECT e.*,COALESCE(NULLIF(u.short_name,''),u.username,'Önceki kayıt') creator,p.name party_name,a.name account_name,t.name target_name,c.name card_name FROM fin_events e LEFT JOIN users u ON u.id=e.created_by LEFT JOIN parties p ON p.id=e.party_id LEFT JOIN accounts a ON a.id=e.account_id LEFT JOIN accounts t ON t.id=e.target_id LEFT JOIN cards c ON c.id=e.card_id ORDER BY e.event_date,e.event_time,e.id")->fetchAll();}
// Rebuild allocation projections. Active facts remain immutable in the audit trail.
// Receivables use collections; payables use payments. Opposite invoice directions never net each other.
function v2state(PDO $db): array {
 global $actor;
 $db->beginTransaction();try{
 $events=allEvents($db);$acc=$db->query('SELECT * FROM accounts ORDER BY sort_order,id')->fetchAll();$cards=$db->query('SELECT * FROM cards ORDER BY id')->fetchAll();$parties=$db->query('SELECT * FROM parties ORDER BY name,id')->fetchAll();$allocation=allocations($events);$balance=[];$cardbalance=[];$party=[];
 foreach($acc as $a)$balance[$a['id']]=(int)$a['opening_cents'];foreach($cards as $c)$cardbalance[$c['id']]=(int)$c['opening_debt_cents'];foreach($parties as $p)$party[$p['id']]=0;
 foreach($events as &$e){foreach(['id','version','amount_cents','cancelled'] as $k)$e[$k]=(int)$e[$k];foreach(['party_id','card_id','created_by'] as $k)$e[$k]=$e[$k]===null?null:(int)$e[$k];$e['party_effect']=partyEffect($e);$e['cash_effect']=cashEffect($e);$e['card_effect']=cardEffect($e);if(!$e['cancelled']){if($e['party_id'])$party[$e['party_id']]+=$e['party_effect'];if($e['account_id'])$balance[$e['account_id']]+=$e['cash_effect'];if($e['kind']==='Virman'&&!$e['scheduled']){$balance[$e['account_id']]-=$e['amount_cents'];$balance[$e['target_id']]+=$e['amount_cents'];}if($e['card_id'])$cardbalance[$e['card_id']]+=cardEffect($e);if(!empty($e['target_card_id'])&&!$e['scheduled'])$cardbalance[$e['target_card_id']]-=$e['amount_cents'];}$e['party_balance']=$e['party_id']?$party[$e['party_id']]:0;}
 unset($e);$eventsByCard=[];foreach($events as $e)if($e['card_id'])$eventsByCard[$e['card_id']][]=$e;foreach($acc as &$a){$a['balance']=$balance[$a['id']]/100;$a['balance_cents']=$balance[$a['id']];$a['version']=(int)$a['version'];$a['active']=(bool)$a['active'];}unset($a);
 foreach($cards as &$c){$c['id']=(int)$c['id'];$c['version']=(int)$c['version'];$c['active']=(bool)$c['active'];$c['debt']=$cardbalance[$c['id']]/100;$c['limit']=(int)$c['limit_cents']/100;
 // Statement closing date is a real dated snapshot; later purchases do not enter that statement.
 $cut=(int)$c['opening_debt_cents'];foreach($eventsByCard[$c['id']]??[] as $e)if(!$e['cancelled']){if(in_array($e['kind'],['Kart harcaması','Ödeme'])&&$e['event_date']<=$c['statement_date'])$cut+=$e['amount_cents'];elseif(in_array($e['kind'],['Kart ödemesi','Kart iadesi','Tahsilat']))$cut-=$e['amount_cents'];}
 $c['statement']=max(0,min($cardbalance[$c['id']],$cut-((!$c['opening_statement_date']||$c['statement_date']<=$c['opening_statement_date'])?(int)$c['opening_unbilled_cents']:0)))/100;}
 unset($c);foreach($parties as &$p){$p['id']=(int)$p['id'];$p['version']=(int)$p['version'];$p['active']=(bool)$p['active'];$p['balance_cents']=$party[$p['id']];}unset($p);
 $users=$db->query('SELECT id,username,short_name,role,active,version FROM users ORDER BY id')->fetchAll();$tx=[];foreach($events as $e){if($e['cancelled']||!$e['account_id'])continue;$base=['id'=>$e['id'],'date'=>$e['event_date'],'time'=>substr($e['event_time'],0,5),'name'=>$e['party_name']?:($e['card_name']?:$e['description']),'desc'=>$e['description'],'kind'=>$e['kind']==='Virman'?'Transfer':($e['kind']==='Kart ödemesi'?'Kart ödemesi':$e['kind']),'category'=>$e['category'],'document'=>$e['document_no'],'creator'=>$e['creator']];$tx[]=$base+['account'=>$e['account_id'],'amount'=>($e['kind']==='Virman'?-$e['amount_cents']:$e['cash_effect'])/100];if($e['kind']==='Virman')$tx[]=$base+['account'=>$e['target_id'],'amount'=>$e['amount_cents']/100];}
 $result=enhanceCardState($db,['today'=>today($db),'demo'=>(bool)$db->query('SELECT demo_date FROM app_meta WHERE id=1')->fetchColumn(),'user'=>$actor,'accounts'=>$acc,'cards'=>$cards,'parties'=>$parties,'events'=>$events,'claims'=>$allocation['open'],'allocations'=>$allocation['matches'],'advances'=>$allocation['advances'],'users'=>$users,'tx'=>$tx,'schemaVersion'=>7]);$db->commit();return $result;
 }catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
}
