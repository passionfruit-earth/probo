ALTER TABLE evidences DROP CONSTRAINT evidences_task_id_fkey;

ALTER TABLE evidences
  ADD CONSTRAINT evidences_task_id_fkey
  FOREIGN KEY (task_id)
  REFERENCES tasks(id)
  ON DELETE CASCADE;
