ALTER TABLE evidences DROP CONSTRAINT evidences_task_id_fkey;

ALTER TABLE evidences
  ADD CONSTRAINT evidences_task_id_fkey
  FOREIGN KEY (task_id)
  REFERENCES tasks(id)
  ON DELETE SET NULL;

ALTER TABLE evidences ALTER COLUMN task_id DROP NOT NULL; 