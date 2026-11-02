<?php
declare(strict_types=1);
if (!isset($action)) {http_response_code(404);exit;}
// Only application-owned tables; unrelated tables sharing the database are untouched.
require_once __DIR__.'/private-storage.php';
const BACKUP_TABLES=['app_meta','users','login_attempts','accounts','claims','cards','journal','movements','parties','party_entries','fin_events','audit_log','write_requests','card_statements','campaigns','campaign_entries','vehicles','vehicle_records','vehicle_payments'];
const BACKUP_MAX=33554432;
function backupWriteJson(string $path,array $value): void {
 $tmp=$path.'.'.bin2hex(random_bytes(6)).'.tmp';
 try{$bytes=json_encode($value,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);if(file_put_contents($tmp,$bytes,LOCK_EX)!==strlen($bytes))throw new RuntimeException('Yedek bilgisi yazılamadı.');chmod($tmp,0600);if(!rename($tmp,$path))throw new RuntimeException('Yedek bilgisi tamamlanamadı.');}finally{if(is_file($tmp))unlink($tmp);}
}
function backupIniBytes(string $value): int {$n=(int)$value;return $n===0?PHP_INT_MAX:$n*(match(strtolower(substr(trim($value),-1))){'g'=>1073741824,'m'=>1048576,'k'=>1024,default=>1});}
function backupOptions(): array {
 $path=backupRoot(false).'/settings.json';$value=is_file($path)?json_decode(file_get_contents($path),true,16,JSON_THROW_ON_ERROR):[];
 return ['enabled'=>(bool)($value['enabled']??false),'interval'=>'daily','time'=>'03:00','timezone'=>'Europe/Istanbul','retention'=>5,'mode'=>'cron'];
}
function backupCatalog(): array {
 $items=[];foreach(glob(backupRoot().'/*.meta.json')?:[] as $path){$m=json_decode(file_get_contents($path),true);if(is_array($m)&&preg_match('/^[a-f0-9]{32}$/D',$m['id']??'')&&is_file(dirname($path).'/'.$m['id'].'.jsonl'))$items[]=$m;}
 usort($items,fn($a,$b)=>strcmp($b['created_at'],$a['created_at'])?:strcmp($b['id'],$a['id']));return $items;
}
// Called under finans_update, only after a complete backup or explicit settings save.
function backupPrune(array $keep=[]): void {
 $items=backupCatalog();$retain=array_fill_keys($keep,true);
 foreach($items as $item)if(count($retain)<5)$retain[$item['id']]=true;
 foreach($items as $old){if(isset($retain[$old['id']]))continue;$path=backupPath($old['id']);if(!unlink($path))throw new DomainException('Eski yedek silinemedi. Özel yedek klasörü izinlerini kontrol edin.');$meta=backupRoot().'/'.$old['id'].'.meta.json';if(is_file($meta)&&!unlink($meta))throw new DomainException('Eski yedek bilgisi temizlenemedi. Klasör izinlerini kontrol edin.');}
}
function backupPath(string $id): string {
 if(!preg_match('/^[a-f0-9]{32}$/D',$id))throw new DomainException('Geçersiz yedek kimliği.');
 $path=backupRoot().'/'.$id.'.jsonl';if(!is_file($path)||is_link($path))throw new DomainException('Yedek dosyası bulunamadı.');return $path;
}
function backupShape(PDO $db): array {
 if((int)$db->query('SELECT schema_version FROM app_meta WHERE id=1')->fetchColumn()!==12)throw new DomainException('Yedek için uygulama ve veritabanı şeması aynı sürümde olmalı.');
 $tables=$db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);$shape=[];
 foreach(BACKUP_TABLES as $table){if(!in_array($table,$tables,true))throw new DomainException('Veritabanı yapısı eksik; önce güncellemeyi tamamlayın.');
  $q=$db->prepare('SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?');$q->execute([$table]);if(strcasecmp((string)$q->fetchColumn(),'InnoDB')!==0)throw new DomainException('Yedek geri yükleme için uygulama tabloları InnoDB olmalı.');
  $shape[$table]=$db->query("SHOW COLUMNS FROM `$table`")->fetchAll(PDO::FETCH_COLUMN);
 }return $shape;
}
function backupOrder(PDO $db): array {
 $database=(string)$db->query('SELECT DATABASE()')->fetchColumn();$deps=array_fill_keys(BACKUP_TABLES,[]);$q=$db->query('SELECT TABLE_SCHEMA,TABLE_NAME,REFERENCED_TABLE_SCHEMA,REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE (TABLE_SCHEMA=DATABASE() OR REFERENCED_TABLE_SCHEMA=DATABASE()) AND REFERENCED_TABLE_NAME IS NOT NULL');
 foreach($q as $row){$t=$row['TABLE_NAME'];$p=$row['REFERENCED_TABLE_NAME'];if($row['TABLE_SCHEMA']!==$database){if(isset($deps[$p]))throw new DomainException('Başka bir veritabanı uygulama verisine bağlı; geri yükleme uygulanamaz.');continue;}if(isset($deps[$t])&&$row['REFERENCED_TABLE_SCHEMA']!==$database)throw new DomainException('Uygulama başka bir veritabanına bağlı; geri yükleme uygulanamaz.');if(isset($deps[$t])&&$t!==$p){if(!isset($deps[$p]))throw new DomainException('Uygulama dışında bir tablo ilişkisi var; geri yükleme uygulanamaz.');$deps[$t][]=$p;}elseif(!isset($deps[$t])&&isset($deps[$p]))throw new DomainException('Başka bir tablo uygulama verisine bağlı; geri yükleme uygulanamaz.');}
 $order=[];while($deps){$progress=false;foreach($deps as $t=>$parents){if(!array_diff($parents,$order)){$order[]=$t;unset($deps[$t]);$progress=true;}}if(!$progress)throw new DomainException('Tablo ilişkileri güvenli sıraya alınamadı.');}return $order;
}
function backupCreate(PDO $db,string $kind='manual',bool $prune=true,string $requestHash=''): array {
 $root=backupRoot();$shape=backupShape($db);$id=bin2hex(random_bytes(16));$tmp=$root.'/'.$id.'.pending';$path=$root.'/'.$id.'.jsonl';$f=fopen($tmp,'xb');if(!$f)throw new RuntimeException('Yedek oluşturulamadı.');chmod($tmp,0600);
 $hash=hash_init('sha256');$counts=array_fill_keys(BACKUP_TABLES,0);$bytes=0;$stamp=(new DateTimeImmutable())->format('Y-m-d\TH:i:s.uP');
 $write=function(array $row,bool $include=true)use($f,$hash,&$bytes){$line=json_encode($row,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)."\n";$bytes+=strlen($line);if(strlen($line)>2097152)throw new DomainException('Tek bir kayıt yedek satırı sınırını aşıyor; hosting yedeği kullanın.');if($bytes>BACKUP_MAX)throw new DomainException('Yedek 32 MB sınırını aşıyor; hosting üzerinden veritabanı dışa aktarımı kullanın.');if(fwrite($f,$line)!==strlen($line))throw new RuntimeException('Yedek dosyası tamamlanamadı.');if($include)hash_update($hash,$line);};
 try{
  $db->beginTransaction();$write(['format'=>'finans-backup-2','schema'=>12,'created_at'=>$stamp,'kind'=>$kind,'tables'=>$shape]);
  foreach($shape as $table=>$columns){$q=$db->query("SELECT * FROM `$table`");while($row=$q->fetch()){$write(['table'=>$table,'row'=>$row]);$counts[$table]++;}}
  $write(['complete'=>true,'counts'=>$counts,'sha256'=>hash_final($hash)],false);if(!fflush($f))throw new RuntimeException('Yedek diske yazılamadı.');if(function_exists('fsync')&&!fsync($f))throw new RuntimeException('Yedek kalıcı olarak yazılamadı.');fclose($f);$f=null;$db->commit();
  if(!rename($tmp,$path))throw new RuntimeException('Yedek tamamlanamadı.');
  $meta=['id'=>$id,'created_at'=>$stamp,'kind'=>$kind,'schema'=>12,'size'=>filesize($path),'sha256'=>hash_file('sha256',$path),'counts'=>$counts]+($requestHash?['request_hash'=>$requestHash]:[]);backupWriteJson($root.'/'.$id.'.meta.json',$meta);
 }catch(Throwable $e){if($db->inTransaction())$db->rollBack();if(is_resource($f))fclose($f);@unlink($tmp);@unlink($path);throw $e;}
 if($prune)backupPrune([$id]);return $meta;
}
function backupValidate(PDO $db,string $path): array {
 if(filesize($path)>BACKUP_MAX||filesize($path)===0)throw new DomainException('Yedek boş veya 32 MB sınırından büyük.');
 $shape=backupShape($db);$f=fopen($path,'rb');if(!$f)throw new DomainException('Yedek okunamadı.');$hash=hash_init('sha256');$counts=array_fill_keys(BACKUP_TABLES,0);$header=null;$complete=false;
 try{while(($line=fgets($f,2097153))!==false){if(strlen($line)>2097152||!str_ends_with($line,"\n"))throw new DomainException('Yedek satırı eksik veya çok büyük.');$row=json_decode($line,true,64,JSON_THROW_ON_ERROR);if(!is_array($row)||$complete)throw new DomainException('Yedek içeriği geçersiz.');
   if($header===null){if(($row['schema']??0)===11){$shape['cards']=array_values(array_filter($shape['cards'],fn($column)=>$column!=='bank'));}if(($row['format']??'')!=='finans-backup-2'||!in_array($row['schema']??0,[11,12],true)||($row['tables']??[])!==$shape)throw new DomainException('Bu yedek uygulama şemasıyla uyumlu değil. Aynı şema sürümünden Finans yedeği seçin.');$header=$row;hash_update($hash,$line);continue;}
   if(($row['complete']??false)===true){if(($row['counts']??[])!==$counts||!is_string($row['sha256']??null)||!hash_equals(hash_final($hash),$row['sha256']))throw new DomainException('Yedek bütünlük kontrolü başarısız.');$complete=true;continue;}
   $table=$row['table']??'';$data=$row['row']??null;if(!is_string($table)||!isset($shape[$table])||!is_array($data)||array_keys($data)!==$shape[$table])throw new DomainException('Yedekte beklenmeyen tablo veya alan var.');foreach($data as $v)if(!is_scalar($v)&&$v!==null)throw new DomainException('Yedek alanı geçersiz.');$counts[$table]++;hash_update($hash,$line);
  }
  if(!feof($f))throw new DomainException('Yedek dosyası tam okunamadı.');
  if(!$complete||$counts['app_meta']!==1||$counts['users']<1)throw new DomainException('Yedek tamamlanmamış veya yönetici bilgisi eksik.');return ['header'=>$header,'counts'=>$counts];
 }catch(JsonException $e){throw new DomainException('Yedek dosyası okunamadı; geçerli Finans yedeği seçin.');}finally{fclose($f);}
}
function backupReauthenticate(PDO $db,array $body): array {
 global $actor;$key=hash('sha256','backup-'.($actor['id']??'').($_SERVER['REMOTE_ADDR']??''));$attempts=$db->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip_hash=? AND attempted_at>DATE_SUB(NOW(),INTERVAL 15 MINUTE)');$attempts->execute([$key]);if((int)$attempts->fetchColumn()>=5)throw new DomainException('Çok fazla parola denemesi. 15 dakika sonra tekrar deneyin.');$db->prepare('INSERT INTO login_attempts(ip_hash) VALUES(?)')->execute([$key]);$q=$db->prepare('SELECT * FROM users WHERE id=?');$q->execute([$actor['id']]);$admin=$q->fetch();if(!$admin||!password_verify(field($body,'password',128,true),$admin['password_hash']))throw new DomainException('Mevcut yönetici parolası doğrulanamadı.');$db->prepare('DELETE FROM login_attempts WHERE ip_hash=?')->execute([$key]);return $admin;
}
function backupRestore(PDO $db,string $id,array $admin): array {
 $oldEpoch=workspaceEpoch();$changedEpoch=false;$pruned=false;
 $path=backupPath($id);$valid=backupValidate($db,$path);$order=backupOrder($db);$safety=backupCreate($db,'before_restore',false);$f=fopen($path,'rb');if(!$f)throw new RuntimeException('Yedek açılamadı.');
 try{
  $db->beginTransaction();$db->query('SELECT id FROM app_meta WHERE id=1 FOR UPDATE')->fetch();foreach(array_reverse($order) as $table)$db->exec("DELETE FROM `$table`");
  foreach($order as $table){rewind($f);$columns=$valid['header']['tables'][$table];$sql='INSERT INTO `'.$table.'` (`'.implode('`,`',$columns).'`) VALUES ('.implode(',',array_fill(0,count($columns),'?')).')';$insert=$db->prepare($sql);while(($line=fgets($f))!==false){$row=json_decode($line,true,64,JSON_THROW_ON_ERROR);if(($row['table']??'')===$table)$insert->execute(array_values($row['row']));}}
  if((int)$db->query('SELECT schema_version FROM app_meta WHERE id=1')->fetchColumn()!==(int)$valid['header']['schema'])throw new DomainException('Yedek şema kaydı geçersiz.');if($valid['header']['schema']===11)$db->exec('UPDATE app_meta SET schema_version=12 WHERE id=1');
  $q=$db->prepare('SELECT id FROM users WHERE username=?');$q->execute([$admin['username']]);$existing=$q->fetchColumn();
  if($existing){$q=$db->prepare("UPDATE users SET password_hash=?,role='admin',active=1 WHERE id=?");$q->execute([$admin['password_hash'],$existing]);$adminId=(int)$existing;}
  else{unset($admin['id']);$admin['role']='admin';$admin['active']=1;$q=$db->prepare('INSERT INTO users (`'.implode('`,`',array_keys($admin)).'`) VALUES ('.implode(',',array_fill(0,count($admin),'?')).')');$q->execute(array_values($admin));$adminId=(int)$db->lastInsertId();}
  global $actor;$actor['id']=$adminId;
  audit($db,'system',$id,'backup_restore',null,['backup'=>$id,'safety_backup'=>$safety['id']],'Veritabanı yedeği geri yüklendi; mevcut yönetici parolası korundu.');backupPrune([$safety['id']]);$pruned=true;$newEpoch=bin2hex(random_bytes(32));backupWriteJson(backupRoot().'/session-epoch.json',['epoch'=>$newEpoch]);$changedEpoch=true;$db->commit();$_SESSION['workspace_epoch']=$newEpoch;$_SESSION['uid']=$adminId;$_SESSION['username']=$admin['username'];session_regenerate_id(true);$_SESSION['csrf']=bin2hex(random_bytes(32));return $safety;
 }finally{fclose($f);if($db->inTransaction()){$db->rollBack();if($changedEpoch)backupWriteJson(backupRoot().'/session-epoch.json',['epoch'=>$oldEpoch]);}if(!$pruned)backupPrune([$safety['id']]);}
}
function backupClearDemo(PDO $db,?array $admin=null): array {
 if(!$admin&&!$db->query('SELECT demo_date FROM app_meta WHERE id=1')->fetchColumn())throw new DomainException('Örnek veri modu kapalı. Gerçek veri bu işlemle temizlenemez.');
 $oldEpoch=workspaceEpoch();$changedEpoch=false;$order=backupOrder($db);$safety=backupCreate($db,$admin?'before_reset':'before_clear');$db->beginTransaction();
 try{$db->query('SELECT id FROM app_meta WHERE id=1 FOR UPDATE')->fetch();foreach(array_reverse($order) as $table)if(!in_array($table,['app_meta','users','login_attempts'],true))$db->exec("DELETE FROM `$table`");$admin?$db->prepare('DELETE FROM users WHERE id<>?')->execute([$admin['id']]):$db->exec("DELETE FROM users WHERE role<>'admin'");if($admin)$db->exec('DELETE FROM login_attempts');$db->exec('UPDATE app_meta SET demo_date=NULL WHERE id=1');audit($db,'system',$admin?'workspace':'demo',$admin?'factory_reset':'demo_clear',null,['backup'=>$safety['id']],$admin?'Fabrika ayarlarına sıfırlandı; yalnız mevcut yönetici korundu.':'Örnek veri ortamı temizlendi; yönetici hesapları korundu.');$newEpoch=bin2hex(random_bytes(32));backupWriteJson(backupRoot().'/session-epoch.json',['epoch'=>$newEpoch]);$changedEpoch=true;$db->commit();$_SESSION['workspace_epoch']=$newEpoch;return $safety;}catch(Throwable $e){if($db->inTransaction())$db->rollBack();if($changedEpoch)backupWriteJson(backupRoot().'/session-epoch.json',['epoch'=>$oldEpoch]);throw $e;}
}
function backupAutomatic(PDO $db,?DateTimeImmutable $now=null): ?array {
 // Browser activity never creates scheduled backups. Hosting cron owns the clock.
 if(PHP_SAPI!=='cli'||!backupOptions()['enabled'])return null;
 $now=($now??new DateTimeImmutable())->setTimezone(new DateTimeZone('Europe/Istanbul'));
 if($now->format('H')!=='03')return null;
 $day=$now->format('Y-m-d');$path=backupRoot().'/schedule-state.json';$state=is_file($path)?json_decode(file_get_contents($path),true,16,JSON_THROW_ON_ERROR):[];
 if(($state['last_automatic_date']??'')===$day)return null;
 // Also recover safely if the previous process completed the file before marking the day.
 foreach(backupCatalog() as $row)if($row['kind']==='automatic'&&(new DateTimeImmutable($row['created_at']))->setTimezone(new DateTimeZone('Europe/Istanbul'))->format('Y-m-d')===$day){backupWriteJson($path,['last_automatic_date'=>$day]);return null;}
 $meta=backupCreate($db,'automatic');backupWriteJson($path,['last_automatic_date'=>$day]);return $meta;
}
if(str_starts_with($action,'backup_')||in_array($action,['demo_clear','factory_reset'],true)){
 permit('admin');$read=['backup_status','backup_download'];if(in_array($action,$read,true)&&$method!=='GET'||!in_array($action,$read,true)&&$method!=='POST')fail('Bu işlem için yöntem geçersiz.',405);
 if($action==='backup_download'){$id=(string)($_GET['id']??'');$path=backupPath($id);backupValidate($db,$path);header('Content-Type: application/octet-stream');header('Content-Disposition: attachment; filename="finans-yedek-'.$id.'.jsonl"');header('Content-Length: '.filesize($path));header('Cache-Control: no-store, private');readfile($path);exit;}
 if($action==='backup_status')reply(['today'=>date('Y-m-d'),'cronScript'=>realpath(__DIR__.'/../backup-cron.php'),'backups'=>backupCatalog(),'automatic'=>backupOptions(),'demo'=>(bool)$db->query('SELECT demo_date FROM app_meta WHERE id=1')->fetchColumn(),'maxBytes'=>BACKUP_MAX,'uploadMaxBytes'=>min(BACKUP_MAX,backupIniBytes(ini_get('upload_max_filesize')),max(0,backupIniBytes(ini_get('post_max_size'))-65536))]);
 if($action==='backup_auto_tick')reply(['created'=>false,'cronRequired'=>true]);
 if(!(int)$db->query("SELECT GET_LOCK('finans_update',5)")->fetchColumn())fail('Başka bir kayıt veya bakım işlemi sürüyor. Biraz sonra deneyin.',409);
 $response=null;
 try{
  if($action==='backup_create'){
   $key=requestKey($body);$requestHash=hash('sha256',$actor['id'].':'.$key);$ledgerPath=backupRoot().'/manual-requests.json';$ledger=is_file($ledgerPath)?json_decode(file_get_contents($ledgerPath),true,128,JSON_THROW_ON_ERROR):[];
   if(isset($ledger[$requestHash]))$response=['backup'=>$ledger[$requestHash],'duplicate'=>true];
   else{
    $items=backupCatalog();foreach($items as $item)if(($item['request_hash']??'')===$requestHash){$response=['backup'=>$item,'duplicate'=>true];break;}if($response===null){$last=$items[0]??null;$today=(new DateTimeImmutable('now',new DateTimeZone('Europe/Istanbul')))->format('Y-m-d');
    $sameDay=false;foreach($items as $item)if($item['kind']!=='uploaded'&&(new DateTimeImmutable($item['created_at']))->setTimezone(new DateTimeZone('Europe/Istanbul'))->format('Y-m-d')===$today){$sameDay=true;break;}
    if($sameDay&&($body['confirmLatest']??'')!==$last['id'])$response=['confirmationRequired'=>true,'last'=>$last,'willDelete'=>count($items)>=5?end($items):null];
    else{$meta=backupCreate($db,'manual',true,$requestHash);$ledger[$requestHash]=$meta;backupWriteJson($ledgerPath,array_slice($ledger,-64,null,true));$response=['backup'=>$meta];}}
   }
  }
  elseif($action==='backup_settings'){if(!is_bool($body['enabled']??null))throw new DomainException('Otomatik yedek ayarlarını kontrol edin.');backupWriteJson(backupRoot().'/settings.json',['enabled'=>$body['enabled'],'interval'=>'daily']);backupPrune();$response=['automatic'=>backupOptions()];}
  elseif($action==='backup_upload'){
   $file=$_FILES['backup']??null;if(!$file||$file['error']!==UPLOAD_ERR_OK||!is_uploaded_file($file['tmp_name'])||$file['size']>BACKUP_MAX)throw new DomainException('Yedek yüklenemedi. Dosya 32 MB ve hosting yükleme sınırının altında olmalı.');
   $valid=backupValidate($db,$file['tmp_name']);$id=bin2hex(random_bytes(16));$path=backupRoot().'/'.$id.'.jsonl';if(!move_uploaded_file($file['tmp_name'],$path))throw new RuntimeException('Yedek yüklenemedi.');chmod($path,0600);$meta=['id'=>$id,'created_at'=>(new DateTimeImmutable())->format('Y-m-d\TH:i:s.uP'),'kind'=>'uploaded','schema'=>$valid['header']['schema'],'size'=>filesize($path),'sha256'=>hash_file('sha256',$path),'counts'=>$valid['counts'],'original_date'=>$valid['header']['created_at']??null];backupWriteJson(backupRoot().'/'.$id.'.meta.json',$meta);backupPrune([$id]);$response=['backup'=>$meta];
  }
  elseif($action==='backup_restore'){$admin=backupReauthenticate($db,$body);if(field($body,'confirm',40,true)!=='GERİ YÜKLE')throw new DomainException('Geri yükleme onayını yazın.');$response=['safetyBackup'=>backupRestore($db,field($body,'id',32,true),$admin),'csrf'=>$_SESSION['csrf'],'reload'=>true];}
  elseif($action==='factory_reset'){$admin=backupReauthenticate($db,$body);if(field($body,'confirm',60,true)!=='FABRİKA AYARLARINA SIFIRLA')throw new DomainException('Sıfırlama onayını yazın.');$response=['safetyBackup'=>backupClearDemo($db,$admin),'reload'=>true];}
  elseif($action==='demo_clear'){backupReauthenticate($db,$body);if(field($body,'confirm',60,true)!=='DEMO VERİLERİNİ SİL')throw new DomainException('Demo temizleme onayını yazın.');$response=['safetyBackup'=>backupClearDemo($db),'reload'=>true];}
  else fail('Yedek işlemi bulunamadı.',404);
 }finally{if($db->inTransaction())$db->rollBack();$db->query("SELECT RELEASE_LOCK('finans_update')");}
 reply(['ok'=>true]+$response);
}
