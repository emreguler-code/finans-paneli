<?php
if (!isset($db)) {http_response_code(404);exit;}
return <<<'SQL'
-- Finans 1.1: existing v1 database upgrade. Back up first. No records are deleted.
SET NAMES utf8mb4;
CREATE TABLE IF NOT EXISTS parties (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 title VARCHAR(200) NOT NULL DEFAULT '',
 type VARCHAR(20) NOT NULL,
 phone VARCHAR(50) NOT NULL DEFAULT '',
 email VARCHAR(160) NOT NULL DEFAULT '',
 tax_no VARCHAR(40) NOT NULL DEFAULT '',
 tax_office VARCHAR(160) NOT NULL DEFAULT '',
 address VARCHAR(1000) NOT NULL DEFAULT '',
 notes VARCHAR(1000) NOT NULL DEFAULT '',
 legacy_name VARCHAR(160) NULL UNIQUE,
 create_key CHAR(36) NULL UNIQUE,
 version INT NOT NULL DEFAULT 1,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(type IN ('Tedarikçi','Müşteri','Personel','Diğer'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SET @ddl = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='claims' AND COLUMN_NAME='party_id')=0,
 'ALTER TABLE claims ADD COLUMN party_id INT UNSIGNED NULL, ADD CONSTRAINT fk_claim_party FOREIGN KEY (party_id) REFERENCES parties(id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
CREATE TABLE IF NOT EXISTS party_entries (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 party_id INT UNSIGNED NOT NULL,
 journal_id CHAR(36) NULL UNIQUE,
 migration_claim_id INT UNSIGNED NULL UNIQUE,
 entry_date DATE NOT NULL,
 entry_time TIME NOT NULL,
 kind VARCHAR(20) NOT NULL,
 description VARCHAR(1000) NOT NULL,
 amount_cents BIGINT NOT NULL,
 account_id VARCHAR(40) NULL,
 created_by INT UNSIGNED NULL,
 document_no VARCHAR(160) NOT NULL DEFAULT '',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(party_id) REFERENCES parties(id),
 FOREIGN KEY(journal_id) REFERENCES journal(id),
 FOREIGN KEY(account_id) REFERENCES accounts(id),
 FOREIGN KEY(created_by) REFERENCES users(id),
 FOREIGN KEY(migration_claim_id) REFERENCES claims(id),
 INDEX party_date(party_id,entry_date,entry_time,id),
 CHECK(amount_cents <> 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
START TRANSACTION;
SELECT id FROM app_meta WHERE id=1 FOR UPDATE;
INSERT INTO parties(name,title,type,legacy_name)
 SELECT c.name,c.name,CASE WHEN MIN(c.type)=MAX(c.type) AND MIN(c.type)='borç' THEN 'Tedarikçi' WHEN MIN(c.type)=MAX(c.type) AND MIN(c.type)='alacak' THEN 'Müşteri' ELSE 'Diğer' END,c.name
 FROM claims c WHERE c.amount_cents>0 AND (SELECT schema_version FROM app_meta WHERE id=1)<2 AND NOT EXISTS(SELECT 1 FROM parties p WHERE p.legacy_name=c.name) GROUP BY c.name;
UPDATE claims c JOIN parties p ON p.legacy_name=c.name SET c.party_id=p.id WHERE c.party_id IS NULL AND (SELECT schema_version FROM app_meta WHERE id=1)<2;
INSERT INTO party_entries(party_id,migration_claim_id,entry_date,entry_time,kind,description,amount_cents)
 SELECT c.party_id,c.id,COALESCE(a.demo_date,CURRENT_DATE),'00:00:00','Açılış','Önceki sürümden açık bakiye devri',CASE WHEN c.type='alacak' THEN c.amount_cents ELSE -c.amount_cents END
 FROM claims c JOIN app_meta a ON a.id=1 WHERE a.schema_version<2 AND c.party_id IS NOT NULL AND c.amount_cents>0 AND NOT EXISTS(SELECT 1 FROM party_entries e WHERE e.migration_claim_id=c.id);
UPDATE app_meta SET schema_version=2 WHERE id=1 AND schema_version<2;
COMMIT;

SQL;
