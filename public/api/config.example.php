<?php
// Copy to config.php and set your hosting's MySQL credentials.
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'hosting_finans',
    'db_user' => 'hosting_finans',
    'db_password' => 'CHANGE_ME',
    // Set a random value of at least 32 characters. Required only for first setup.
    'setup_token' => 'CHANGE_ME_TO_A_RANDOM_32_CHARACTER_SECRET',
    'require_https' => true,
    // Optional: absolute, writable directory OUTSIDE the web root.
    // Default: a private application-specific directory beside the web root.
    // 'backup_dir' => '/home/hosting-user/finans-private-backups',
];
