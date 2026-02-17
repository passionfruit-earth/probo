CREATE TABLE task_state_transitions (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) NOT NULL,
  from_state task_state,
  to_state task_state NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE tasks DROP COLUMN state;
