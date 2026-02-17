ALTER TABLE usrmgr_users ADD COLUMN organization_id TEXT;

CREATE INDEX usrmgr_users_organization_id_idx ON usrmgr_users(organization_id); 