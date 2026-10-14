<?php
if (!isset($db)) {http_response_code(404);exit;}
// Packaged hosting uses the bundled copy; development reads the canonical SQL.
$path=__DIR__.'/migrations/002-cari.sql';
if (!is_file($path)) $path=dirname(__DIR__,3).'/database/migrations/002-cari.sql';
$sql=file_get_contents($path);
if ($sql===false) throw new RuntimeException('Cari migrasyonu bulunamadı.');
return $sql;
