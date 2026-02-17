ALTER TABLE tasks
  DROP CONSTRAINT tasks_control_id_fkey,
  DROP COLUMN control_id;

CREATE TABLE controls_tasks (
  task_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (task_id, control_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (control_id) REFERENCES controls(id)
);
