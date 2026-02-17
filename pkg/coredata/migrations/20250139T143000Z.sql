ALTER TABLE vendors ADD COLUMN organization_id TEXT REFERENCES organizations(id) NOT NULL;
