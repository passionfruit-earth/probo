ALTER TABLE tasks ADD COLUMN organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE;

UPDATE tasks
SET organization_id = m.organization_id::text
FROM measures m
WHERE tasks.measure_id = m.id;

ALTER TABLE tasks ALTER COLUMN organization_id SET NOT NULL;