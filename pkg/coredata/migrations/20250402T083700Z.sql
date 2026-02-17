CREATE TYPE evidence_state_new AS ENUM ('FULFILLED', 'REQUESTED');

ALTER TABLE evidences ALTER COLUMN state TYPE text;

UPDATE evidences SET state = 'FULFILLED';

ALTER TABLE evidences ALTER COLUMN state TYPE evidence_state_new USING state::evidence_state_new;

DROP TYPE evidence_state;
ALTER TYPE evidence_state_new RENAME TO evidence_state;