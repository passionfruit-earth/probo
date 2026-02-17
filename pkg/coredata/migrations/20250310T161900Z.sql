DROP TABLE control_state_transitions;
DROP TABLE evidence_state_transitions;
DROP TABLE task_state_transitions;

ALTER TABLE tasks ADD COLUMN control_id TEXT;

UPDATE tasks
SET control_id = controls_tasks.control_id
FROM controls_tasks
WHERE tasks.id = controls_tasks.task_id;

ALTER TABLE tasks ALTER COLUMN control_id SET NOT NULL;

ALTER TABLE tasks ADD CONSTRAINT fk_tasks_control_id
    FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE;

DROP TABLE controls_tasks;
