ALTER TABLE vendors ADD COLUMN business_owner_id TEXT REFERENCES peoples(id) ON DELETE SET NULL;
ALTER TABLE vendors ADD COLUMN security_owner_id TEXT REFERENCES peoples(id) ON DELETE SET NULL;
