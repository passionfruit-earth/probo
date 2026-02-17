ALTER TABLE evidences ADD COLUMN reference_id TEXT;

UPDATE evidences SET reference_id = 'custom-evidence-' || gen_random_uuid()::text WHERE reference_id IS NULL;

ALTER TABLE evidences ALTER COLUMN reference_id SET NOT NULL;

ALTER TABLE evidences ADD CONSTRAINT evidences_reference_id_key UNIQUE (task_id, reference_id);