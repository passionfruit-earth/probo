ALTER TABLE frameworks DROP CONSTRAINT IF EXISTS frameworks_organization_id_fkey;
ALTER TABLE controls DROP CONSTRAINT IF EXISTS controls_framework_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_control_id_fkey;

ALTER TABLE organizations DROP CONSTRAINT organizations_pkey;
ALTER TABLE organizations ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE organizations ADD PRIMARY KEY (id);

ALTER TABLE frameworks DROP CONSTRAINT frameworks_pkey;
ALTER TABLE frameworks ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE frameworks ADD PRIMARY KEY (id);
ALTER TABLE frameworks ALTER COLUMN organization_id TYPE TEXT USING organization_id::text;

ALTER TABLE controls DROP CONSTRAINT controls_pkey;
ALTER TABLE controls ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE controls ADD PRIMARY KEY (id);
ALTER TABLE controls ALTER COLUMN framework_id TYPE TEXT USING framework_id::text;

ALTER TABLE tasks DROP CONSTRAINT tasks_pkey;
ALTER TABLE tasks ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE tasks ADD PRIMARY KEY (id);
ALTER TABLE tasks ALTER COLUMN control_id TYPE TEXT USING control_id::text;

ALTER TABLE frameworks ADD CONSTRAINT frameworks_organization_id_fkey
   FOREIGN KEY (organization_id) REFERENCES organizations(id);

ALTER TABLE controls ADD CONSTRAINT controls_framework_id_fkey
   FOREIGN KEY (framework_id) REFERENCES frameworks(id);

ALTER TABLE tasks ADD CONSTRAINT tasks_control_id_fkey
   FOREIGN KEY (control_id) REFERENCES controls(id);
