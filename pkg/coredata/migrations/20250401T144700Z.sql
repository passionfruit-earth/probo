ALTER TABLE tasks ADD COLUMN reference_id TEXT DEFAULT '';
ALTER TABLE tasks ALTER COLUMN reference_id SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN reference_id DROP DEFAULT;

ALTER TABLE tasks ADD CONSTRAINT tasks_reference_id_unique UNIQUE (id, reference_id);
