<?php
declare(strict_types=1);
if(!isset($action)){http_response_code(404);exit;}
// Resolve conventional hosting roots identically in HTTP and CLI cron processes.
function backupWebBoundary(): string {
 $web=realpath(dirname(__DIR__,2))?:dirname(__DIR__,2);$boundary=$web;
 for($dir=$web;dirname($dir)!==$dir;$dir=dirname($dir)){
  if(in_array(strtolower(basename($dir)),['public_html','httpdocs','httpsdocs','htdocs','wwwroot','www','web','public','html'],true)){$boundary=$dir;break;}
 }
 return $boundary;
}
function backupDefaultPath(): string {
 global $config;
 return dirname(backupWebBoundary()).'/.finans-private-'.substr(hash('sha256',$config['db_name'].$config['setup_token']),0,20);
}
function backupRoot(bool $create=true): string {
 global $config;
 $path=$config['backup_dir']??backupDefaultPath();
 if(!is_string($path)||!str_starts_with($path,'/')||$path==='/'||preg_match('~(?:^|/)[.]{1,2}(?:/|$)~',$path))throw new DomainException('Yedek dizini mutlak bir sunucu yolu olmalı; . ve .. içermemeli.');
 // Validate before mkdir: an unsafe configured path must not create public folders.
 $existing=$path;$tail=[];
 while(!file_exists($existing)&&dirname($existing)!==$existing){array_unshift($tail,basename($existing));$existing=dirname($existing);}
 $base=realpath($existing);if(!$base)throw new DomainException('Yedek dizini doğrulanamadı.');
 $root=$tail?rtrim($base,'/').'/'.implode('/',$tail):$base;
 $webRoots=[backupWebBoundary(),realpath(dirname(__DIR__,2)),!empty($_SERVER['DOCUMENT_ROOT'])?realpath($_SERVER['DOCUMENT_ROOT']):false];
 foreach($webRoots as $web)if($web&&($root===$web||str_starts_with($root,rtrim($web,'/').'/')))throw new DomainException('Yedekler web kökü içinde saklanamaz. api/config.php içindeki backup_dir yolunu public_html / web kökü dışında bir klasöre ayarlayın.');
 if(!is_dir($root)){
  if(!$create)return $root;
  if(!@mkdir($root,0700,true)&&!is_dir($root))throw new DomainException('Özel yedek dizini oluşturulamadı. api/config.php içinde web kökü dışında, PHP tarafından yazılabilir bir backup_dir tanımlayın.');
 }
 if($create&&!is_writable($root))throw new DomainException('Özel yedek dizinine yazılamıyor. Hosting dosya izinlerini kontrol edin.');
 @chmod($root,0700);return $root;
}
function workspaceEpoch(): string {
 $path=backupRoot(false).'/session-epoch.json';if(!is_file($path))return 'initial';
 $value=json_decode(file_get_contents($path),true);$epoch=$value['epoch']??'';
 if($epoch!=='initial'&&!preg_match('/^[a-f0-9]{64}$/D',$epoch))throw new DomainException('Oturum sürümü doğrulanamadı.');return $epoch;
}
