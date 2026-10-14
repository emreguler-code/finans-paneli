-- Finans v1 | MySQL 8.0+ or MariaDB 10.6+ | empty database only.
SET NAMES utf8mb4;
CREATE TABLE app_meta (
 id TINYINT PRIMARY KEY,
 demo_date DATE NULL,
 schema_version INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO app_meta(id,demo_date) VALUES(1,NULL);
CREATE TABLE users (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 username VARCHAR(80) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE login_attempts (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 ip_hash CHAR(64) NOT NULL,
 attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 INDEX attempt_window(ip_hash,attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE accounts (
 id VARCHAR(40) PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 type VARCHAR(40) NOT NULL,
 opening_cents BIGINT NOT NULL DEFAULT 0,
 sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE claims (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 description VARCHAR(1000) NOT NULL DEFAULT '',
 type VARCHAR(10) NOT NULL,
 amount_cents BIGINT NOT NULL,
 due DATE NOT NULL,
 CHECK(amount_cents >= 0),
 CHECK(type IN ('alacak','borç'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE cards (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 debt_cents BIGINT NOT NULL,
 statement_cents BIGINT NOT NULL,
 limit_cents BIGINT NOT NULL,
 due DATE NOT NULL,
 CHECK(debt_cents >= 0 AND statement_cents >= 0 AND statement_cents <= debt_cents AND debt_cents <= limit_cents)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE journal (
 id CHAR(36) PRIMARY KEY,
 payload_hash CHAR(64) NOT NULL,
 created_by INT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE movements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 journal_id CHAR(36) NOT NULL,
 account_id VARCHAR(40) NOT NULL,
 claim_id INT UNSIGNED NULL,
 card_id INT UNSIGNED NULL,
 movement_date DATE NOT NULL,
 movement_time TIME NOT NULL,
 name VARCHAR(160) NOT NULL,
 description VARCHAR(1000) NOT NULL DEFAULT '',
 kind VARCHAR(40) NOT NULL,
 amount_cents BIGINT NOT NULL,
 category VARCHAR(80) NOT NULL DEFAULT 'Diğer',
 document_no VARCHAR(160) NOT NULL DEFAULT '',
 FOREIGN KEY(journal_id) REFERENCES journal(id),
 FOREIGN KEY(account_id) REFERENCES accounts(id),
 FOREIGN KEY(claim_id) REFERENCES claims(id),
 FOREIGN KEY(card_id) REFERENCES cards(id),
 INDEX account_date(account_id,movement_date),
 INDEX date_order(movement_date,id),
 CHECK(amount_cents <> 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
