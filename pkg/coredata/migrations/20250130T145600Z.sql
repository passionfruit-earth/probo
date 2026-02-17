CREATE TYPE task_state AS ENUM (
    'TODO',
    'DONE'
);

ALTER TABLE tasks ADD COLUMN state task_state NOT NULL;
