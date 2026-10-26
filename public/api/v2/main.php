<?php
if (!isset($action)) {http_response_code(404);exit;}
permit('view');
function openingInput(PDO $db,array $b,?array $old): array {
 $kind=field($b,'kind',40,true);$kind=['Alış'=>'Borç','Satış'=>'Alacak'][$kind]??$kind;if(!in_array($kind,V2_KINDS,true))throw new DomainException('Geçersiz işlem yönü.');
 $amount=cents($b);if($amount<=0)throw new DomainException('Tutar sıfırdan büyük olmalı.');$date=validDate(field($b,'date',10,true));$time=field($b,'time',8)?:($old['event_time']??date('H:i:s'));if(!preg_match('/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/D',$time))throw new DomainException('Saat geçersiz.');if(strlen($time)===5)$time.=':00';
 $party=!empty($b['partyId'])?(int)$b['partyId']:null;$account=field($b,'account',40)?:null;$target=field($b,'target',40)?:null;$card=!empty($b['cardId'])?(int)$b['cardId']:null;$direction=field($b,'direction',10)?:'Alacak';if(!in_array($direction,['Alacak','Borç']))throw new DomainException('Bakiye yönü geçersiz.');
 $due=in_array($kind,['Alacak','Borç','Açılış'])&&field($b,'due',10)!==''?validDate(field($b,'due',10),true):null;
 if(in_array($kind,['Alacak','Borç','Açılış'])&&!$party)throw new DomainException('Cari seçin.');
 if(in_array($kind,['Virman','Kart harcaması','Kart iadesi','Kart ödemesi']))$party=null;
 if(!in_array($kind,['Tahsilat','Ödeme','Virman','Kart ödemesi']))$account=null;
 if($kind!=='Virman')$target=null;if(!in_array($kind,['Kart harcaması','Kart iadesi','Kart ödemesi','Tahsilat','Ödeme']))$card=null;
 if($card&&in_array($kind,['Tahsilat','Ödeme']))$account=null;
 if(!empty($b['lockedPartyId'])&&(int)$b['lockedPartyId']!==$party&&$kind!=='Virman')throw new DomainException('Bu form bağlı olduğu cari dışında kaydedilemez.');
 foreach([['parties',$party,$old['party_id']??null],['accounts',$account,$old['account_id']??null],['accounts',$target,$old['target_id']??null],['cards',$card,$old['card_id']??null]] as [$table,$id,$prior])if($id){$r=row($db,$table,$id);if(!$r['active']&&((string)$prior!==(string)$id||!$old))throw new DomainException('Arşivlenmiş hesaba yeni işlem eklenemez.');}
 if(in_array($kind,['Tahsilat','Ödeme','Virman','Kart ödemesi'])&&!$account&&!($card&&in_array($kind,['Tahsilat','Ödeme'])))throw new DomainException('İşlem hesabı seçin.');if($kind==='Virman'&&(!$target||$target===$account))throw new DomainException('Virman için farklı iki hesap seçin.');if(str_starts_with($kind,'Kart ')&&!$card)throw new DomainException('Kredi kartı seçin.');
 return ['kind'=>$kind,'amount_cents'=>$amount,'event_date'=>$date,'event_time'=>$time,'due_date'=>$due,'party_id'=>$party,'account_id'=>$account,'target_id'=>$target,'card_id'=>$card,'direction'=>$direction,'description'=>field($b,'description',1000),'category'=>field($b,'category',80)?:'Diğer','document_no'=>field($b,'document',160)];
}
function saveEvent(PDO $db,array $b): array {
 if(!empty($b['operation']))return saveOperation($db,$b);
 if(($b['kind']??'')!=='Açılış')throw new DomainException('İşlem ekranı güncellendi; sayfayı yenileyip işlem türünü seçin.');
 global $actor;$id=!empty($b['id'])?(int)$b['id']:null;permit($id?'edit':'create');$old=$id?row($db,'fin_events',$id):null;if($old){versionCheck($old,$b);if($old['cancelled'])throw new DomainException('İptal edilen kaydı önce yönetici geri açmalı.');}
 $v=openingInput($db,$b,$old);
 $v['period_date']=$v['event_date'];$reason=$id?field($b,'reason',1000,true):'';
 if($id){$db->prepare('UPDATE fin_events SET '.implode(',',array_map(fn($k)=>"$k=?",array_keys($v))).',version=version+1 WHERE id=?')->execute([...array_values($v),$id]);}
 else{$db->prepare('INSERT INTO fin_events(request_key,'.implode(',',array_keys($v)).',created_by) VALUES('.implode(',',array_fill(0,count($v)+2,'?')).')')->execute([requestKey($b),...array_values($v),$actor['id']]);$id=(int)$db->lastInsertId();}
 audit($db,'event',(string)$id,$old?'edit':'create',$old,row($db,'fin_events',$id),$reason);return ['id'=>$id];
}
function saveEntity(PDO $db,string $entity,array $b): array {
 global $actor;$table=match($entity){'party'=>'parties','account'=>'accounts','card'=>'cards','user'=>'users'};$id=$b['id']??null;if($table==='users')permit('admin');else permit($id?'edit':'create');$old=$id?row($db,$table,$id):null;if($old)versionCheck($old,$b);$v=[];$reason=$old?field($b,'reason',1000,!in_array($entity,['account','card','party'],true)):'';
 if($entity==='party'){
 foreach(['name'=>160,'title'=>200,'type'=>20,'phone'=>50,'email'=>160,'tax_no'=>40,'tax_office'=>160,'address'=>1000,'notes'=>1000] as $k=>$len)$v[$k]=field($b,$k,$len,in_array($k,['name','type']));
 if(!in_array($v['type'],['Tedarikçi','Müşteri','Personel']))throw new DomainException('Cari türü geçersiz.');if($v['email']&&!filter_var($v['email'],FILTER_VALIDATE_EMAIL))throw new DomainException('E-posta adresini kontrol edin.');
 $pos=array_key_exists('pos_programs',$b)?$b['pos_programs']:($v['type']==='Tedarikçi'?json_decode($old['pos_programs']??'[]',true):[]);
 if(!is_array($pos)||!array_is_list($pos)||count($pos)>3)throw new DomainException('POS cihazı seçimlerini kontrol edin.');
 foreach($pos as $program)if(!is_string($program)||!in_array($program,['garanti:bonus','akbank:axess','yapikredi:world'],true))throw new DomainException('Geçersiz POS banka / program seçimi.');
 if($v['type']!=='Tedarikçi'&&$pos)throw new DomainException('POS cihazı bilgileri yalnız tedarikçiler içindir.');
 $pos=array_values(array_unique($pos));sort($pos);$v['pos_programs']=json_encode($pos,JSON_THROW_ON_ERROR);
 }elseif($entity==='account'){
 foreach(['name'=>160,'type'=>40,'bank'=>160,'iban'=>40,'holder'=>160] as $k=>$len)$v[$k]=field($b,$k,$len,in_array($k,['name','type']));if(!in_array($v['type'],['Banka hesabı','Kasa','Birikim hesabı','Vadeli hesap','Kredili Mevduat Hesabı']))throw new DomainException('Hesap türü geçersiz.');
 if($v['iban']){$v['iban']=strtoupper(str_replace(' ','',$v['iban']));if(!preg_match('/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/D',$v['iban']))throw new DomainException('IBAN biçimini kontrol edin.');}
 if(array_key_exists('maturityDate',$b))$v['maturity_date']=field($b,'maturityDate',10)!==''?validDate(field($b,'maturityDate',10),true):null;
 if($v['type']==='Kredili Mevduat Hesabı') {
  $v['credit_limit_cents']=array_key_exists('creditLimit',$b)?cents($b,'creditLimit'):(int)($old['credit_limit_cents']??0);
  if($v['credit_limit_cents']<=0)throw new DomainException('KMH limiti sıfırdan büyük olmalı.');
  if(array_key_exists('dailyInterestRate',$b)){
   $rate=str_replace(',','.',field($b,'dailyInterestRate',20));
   if($rate!==''&&(!preg_match('/^\d{1,3}(\.\d{1,6})?$/D',$rate)||(float)$rate>100))throw new DomainException('Günlük faiz oranını yüzde olarak 0–100 arasında girin.');
   $v['daily_interest_rate']=$rate===''?null:$rate;
  }
 }
 if(!$old)$v['opening_cents']=cents($b,'opening',true);
 }elseif($entity==='card'){
 if(array_key_exists('linked_account_id',$b)){
  $linked=field($b,'linked_account_id',40);if($linked!==''){$account=row($db,'accounts',$linked);if(!$account['active']&&($old['linked_account_id']??null)!==$linked)throw new DomainException('Arşivlenmiş hesap yeni bağlantı için seçilemez.');}
 }

 $v=['holder'=>field($b,'holder',160),'name'=>field($b,'name',160,true),'limit_cents'=>cents($b,'limit'),'due'=>validDate(field($b,'due',10,true),true),'statement_date'=>validDate(field($b,'statementDate',10,true)),'cut_day'=>(int)($b['cutDay']??0),'last_four'=>field($b,'lastFour',4)];if($v['limit_cents']<=0||$v['cut_day']<1||$v['cut_day']>31||($v['last_four']&&!preg_match('/^\d{4}$/D',$v['last_four'])))throw new DomainException('Limit, kesim günü veya son dört haneyi kontrol edin.');if($v['due']<$v['statement_date'])throw new DomainException('Son ödeme tarihi hesap kesiminden önce olamaz.');
 if($old&&!empty($old['opening_statement_date'])&&$v['statement_date']<$old['opening_statement_date'])throw new DomainException('Ekstre tarihi başlangıç döneminden önce olamaz.');
 if(array_key_exists('linked_account_id',$b))$v['linked_account_id']=$linked?:null;
 $v['statement_needs_review']=0;if(!$old||empty($old['opening_statement_date']))$v['opening_statement_date']=$v['statement_date'];
 if(!$old){$debt=cents($b,'opening');$statement=cents($b,'statement');if($debt<0||$statement<0||$statement>$debt)throw new DomainException('Ekstre borcu açılış borcunu aşamaz.');$v+=['opening_debt_cents'=>$debt,'opening_unbilled_cents'=>$debt-$statement,'debt_cents'=>0,'statement_cents'=>0];}
 }else{
 $v=['username'=>field($b,'username',80,true),'short_name'=>field($b,'shortName',80,true),'role'=>field($b,'role',20,true)];if(!in_array($v['role'],V2_ROLES,true))throw new DomainException('Rol geçersiz.');$password=field($b,'password',128,!$old);if($password){if(strlen($password)<12||strlen($password)>72)throw new DomainException('Parola 12–72 bayt uzunluğunda olmalı.');$v['password_hash']=password_hash($password,PASSWORD_DEFAULT);}
 }
 if(in_array($entity,['account','card'],true)){
 $catalog=['garanti'=>['bonus'],'yapikredi'=>['world'],'akbank'=>['axess']];
 if(array_key_exists('bank_code',$b)){$v['bank_code']=field($b,'bank_code',40);if($v['bank_code']!==''&&!array_key_exists($v['bank_code'],$catalog))throw new DomainException('Banka seçimini kontrol edin.');}
 if($entity==='card'){
 $bank=$v['bank_code']??($old['bank_code']??'');
 $program=array_key_exists('program_code',$b)?field($b,'program_code',40):($old['program_code']??'');
 if($program!==''&&!in_array($program,$catalog[$bank]??[],true))throw new DomainException('Kart programı seçilen bankaya ait değil.');
 if(array_key_exists('program_code',$b))$v['program_code']=$program;
 if(array_key_exists('network_code',$b)){$v['network_code']=field($b,'network_code',40);if(!in_array($v['network_code'],['','visa','mastercard','troy'],true))throw new DomainException('Ödeme ağını kontrol edin.');}
 }
 }
 $active=array_key_exists('active',$b)?(int)(bool)$b['active']:1;
 if($old && (int)$old['active']!==$active){permit('admin');}
 $v['active']=$active;
 if($entity==='user'&&$old&&$old['role']==='admin'&&$old['active']&&($v['role']!=='admin'||!$active)){
 if((int)$db->query("SELECT COUNT(*) FROM users WHERE role='admin' AND active=1")->fetchColumn()<=1)throw new DomainException('Son aktif yönetici kaldırılamaz.');if((int)$id===$actor['id'])throw new DomainException('Kendi yönetici hesabınızı devre dışı bırakamaz veya rolünü düşüremezsiniz.');}
 if($old){$db->prepare("UPDATE $table SET ".implode(',',array_map(fn($k)=>"$k=?",array_keys($v))).',version=version+1 WHERE id=?')->execute([...array_values($v),$id]);}
 else{if($entity==='account'){$id='acc-'.bin2hex(random_bytes(8));$v=['id'=>$id]+$v;}$db->prepare("INSERT INTO $table (".implode(',',array_keys($v)).') VALUES('.implode(',',array_fill(0,count($v),'?')).')')->execute(array_values($v));if($entity!=='account')$id=(int)$db->lastInsertId();}
 $after=publicRow(row($db,$table,$id));$before=$old?publicRow($old):null;if($entity==='user'&&isset($v['password_hash']))$after['password_changed']=true;audit($db,$entity,(string)$id,$old?'edit':'create',$before,$after,$reason);
 if($entity==='party'&&!$old&&cents($b,'opening')>0){saveEvent($db,['requestId'=>requestKey($b),'kind'=>'Açılış','partyId'=>(int)$id,'amount'=>$b['opening'],'description'=>'Açılış bakiyesi','date'=>$b['date']??today($db),'due'=>$b['due']??'','direction'=>$b['direction']??'Alacak']);}
 return ['id'=>$id];
}
if($method==='GET'){
 if($action==='state')reply(v2state($db));
 if($action==='audit'){permit('view');$entity=field($_GET,'entity',40,true);if($entity==='user')permit('admin');$q=$db->prepare('SELECT * FROM audit_log WHERE entity=? AND entity_id=? ORDER BY id DESC');$q->execute([$entity,field($_GET,'id',80,true)]);reply(['logs'=>$q->fetchAll()]);}
 if($action==='parties'){
  $search=field($_GET,'q',160);$type=field($_GET,'type',20);$db->beginTransaction();$balances=[];
  $events=$db->query('SELECT party_id,kind,amount_cents,direction,scheduled,settled_cents FROM fin_events WHERE cancelled=0 AND party_id IS NOT NULL')->fetchAll();
  foreach($events as $event)$balances[$event['party_id']]=($balances[$event['party_id']]??0)+partyEffect($event);
  $parties=$db->query('SELECT * FROM parties ORDER BY name,id')->fetchAll();$net=array_sum($balances);$total=count($parties);$rows=[];
  $ids=null;if($search&&preg_match_all('/./us',$search)>=3){$q=$db->prepare("SELECT id FROM parties WHERE name LIKE ? ESCAPE '=' OR title LIKE ? ESCAPE '='");$pattern='%'.strtr($search,['='=>'==','%'=>'=%','_'=>'=_']).'%';$q->execute([$pattern,$pattern]);$ids=array_fill_keys($q->fetchAll(PDO::FETCH_COLUMN),true);}
  foreach($parties as $party){if($ids!==null&&!isset($ids[$party['id']]))continue;if($type&&$type!=='Tümü'&&$party['type']!==$type)continue;
   $party['id']=(int)$party['id'];$party['version']=(int)$party['version'];$party['active']=(bool)$party['active'];$party['pos_programs']=json_decode($party['pos_programs']??'[]',true)?:[];$party['balance_cents']=$balances[$party['id']]??0;$rows[]=$party;
  }
  $db->commit();reply(['parties'=>$rows,'total'=>$total,'net_cents'=>$net]);
 }

 fail('İşlem bulunamadı.',404);
}
if(!in_array($action,['event_save','event_status','party_save','account_save','card_save','user_save','statement_save','demo_seed','vehicle_save','vehicle_record_save','campaign_save','campaign_entry_save']))fail('Bu eski işlem yolu kaldırıldı. Sayfayı yenileyin.',410);
$key=requestKey($body);$hash=hash('sha256',json_encode([$actor['id'],$action,$body]));
// Permission checks run before retry lookup: revocation applies immediately.
if(in_array($action,['event_status','user_save','demo_seed']))permit('admin');else permit(!empty($body['id'])?'edit':'create');
if(!(int)$db->query("SELECT GET_LOCK('finans_update',5)")->fetchColumn())fail('Güncelleme sürüyor. Kayıt girişi geçici olarak kapalı.',503);
try{
 $db->beginTransaction();$db->query('SELECT id FROM app_meta WHERE id=1 FOR UPDATE')->fetch();$q=$db->prepare('SELECT * FROM write_requests WHERE request_key=?');$q->execute([$key]);$seen=$q->fetch();
 if($seen){if(!hash_equals($seen['payload_hash'],$hash))throw new DomainException('Aynı kayıt anahtarı farklı içerikle kullanıldı.');$result=json_decode($seen['result_json'],true);$db->rollBack();$result['duplicate']=true;}
 else{
 if($action==='event_save')$result=saveEvent($db,$body);
 elseif($action==='statement_save')$result=saveStatement($db,$body);
 elseif($action==='demo_seed')$result=seedDemo($db,($body['profile']??'comprehensive')!=='compact');
 elseif($action==='event_status'){$id=(int)($body['id']??0);$old=row($db,'fin_events',$id);versionCheck($old,$body);$cancelled=(int)(bool)($body['cancelled']??true);$reason=field($body,'reason',1000,true);$db->prepare('UPDATE fin_events SET cancelled=?,version=version+1 WHERE id=?')->execute([$cancelled,$id]);audit($db,'event',(string)$id,$cancelled?'cancel':'restore',$old,row($db,'fin_events',$id),$reason);$result=['id'=>$id];}
 elseif(in_array($action,['vehicle_save','vehicle_record_save','campaign_save','campaign_entry_save'],true))$result=saveTracking($db,str_replace('_save','',$action),$body);
 else $result=saveEntity($db,str_replace('_save','',$action),$body);
 // A card may carry credit after refunds; reflect it as negative debt rather than discarding real money.
 $db->prepare('INSERT INTO write_requests(request_key,payload_hash,result_json) VALUES(?,?,?)')->execute([$key,$hash,json_encode($result)]);$db->commit();
 }
 $actor=v2Actor($db);reply(['ok'=>true]+$result+['state'=>v2state($db)],200);
}finally{if($db->inTransaction())$db->rollBack();$db->query("SELECT RELEASE_LOCK('finans_update')");}
