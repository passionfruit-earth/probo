CREATE TYPE policy_status_new AS ENUM ('DRAFT', 'PUBLISHED');

ALTER TABLE policy_versions ADD COLUMN temp_status TEXT;

UPDATE policy_versions SET temp_status = 
  CASE WHEN status::TEXT = 'ACTIVE' THEN 'PUBLISHED' 
       ELSE status::TEXT 
  END;

ALTER TABLE policy_versions DROP COLUMN status;

ALTER TABLE policy_versions ADD COLUMN status policy_status_new;

UPDATE policy_versions SET status = temp_status::policy_status_new;

ALTER TABLE policy_versions DROP COLUMN temp_status;

DROP TYPE policy_status;
ALTER TYPE policy_status_new RENAME TO policy_status;

CREATE UNIQUE INDEX policy_one_draft_version_idx ON policy_versions (policy_id, status) 
WHERE status = 'DRAFT';
