CREATE TYPE control_state AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'NOT_APPLICABLE',
    'IMPLEMENTED'
);

CREATE TABLE control_state_transitions (
  id TEXT PRIMARY KEY,
  control_id TEXT REFERENCES controls(id) NOT NULL,
  from_state control_state,
  to_state control_state NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
