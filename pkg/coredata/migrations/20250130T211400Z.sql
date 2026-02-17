CREATE TYPE evidence_state AS ENUM (
    'VALID',
    'INVALID',
    'EXPIRED'
);

CREATE TABLE evidence_state_transitions (
  id TEXT PRIMARY KEY,
  from_state evidence_state,
  to_state evidence_state NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
