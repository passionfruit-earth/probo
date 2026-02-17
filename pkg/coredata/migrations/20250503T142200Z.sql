ALTER TABLE evidences ALTER COLUMN task_id DROP NOT NULL;
ALTER TABLE evidences ADD COLUMN measure_id TEXT REFERENCES measures(id);

UPDATE evidences e
SET measure_id = t.measure_id
FROM tasks t
WHERE e.task_id = t.id AND e.measure_id IS NULL;

ALTER TABLE evidences ALTER COLUMN measure_id SET NOT NULL;