<?php
declare(strict_types=1);
if(!isset($action)){http_response_code(404);exit;}
function backupRoot(bool $create=true): string {
 global $config;
 $path=$config['backup_dir']??(dirname(__DIR__,3).'/.finans-private-'.substr(hash('sha256',$config['db_name'].$config['setup_token']),0,20));
 if(!is_string($path)||!str_starts_with($path,'/'))throw new DomainException('Yedek dizini mutlak bir sunucu yolu olmalı.');
 if(!is_dir($path)){
  if(!$create)return $path;
  if(!@mkdir($path,0700,true)&&!is_dir($path))throw new DomainException('Özel yedek dizini oluşturulamadı. Hostingde web kökü dışında yazılabilir backup_dir tanımlayın.');
 }
 $root=realpath($path);if(!$root)throw new DomainException('Yedek dizini doğrulanamadı.');
 foreach([realpath(dirname(__DIR__,2)),!empty($_SERVER['DOCUMENT_ROOT'])?realpath($_SERVER['DOCUMENT_ROOT']):false] as $web)if($web&&($root===$web||str_starts_with($root,$web.'/')))throw new DomainException('Yedekler web kökü içinde saklanamaz. backup_dir yolunu web kökü dışına alın.');
 if($create&&!is_writable($root))throw new DomainException('Özel yedek dizinine yazılamıyor. Hosting dosya izinlerini kontrol edin.');
 @chmod($root,0700);return $root;
}
function workspaceEpoch(): string {
 $path=backupRoot(false).'/session-epoch.json';if(!is_file($path))return 'initial';
 $value=json_decode(file_get_contents($path),true);$epoch=$value['epoch']??'';
 if($epoch!=='initial'&&!preg_match('/^[a-f0-9]{64}$/D',$epoch))throw new DomainException('Oturum sürümü doğrulanamadı.');return $epoch;
}
