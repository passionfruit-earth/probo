ALTER TABLE tasks DROP CONSTRAINT tasks_reference_id_unique;
ALTER TABLE tasks ADD CONSTRAINT tasks_reference_id_unique UNIQUE (mitigation_id, reference_id);
