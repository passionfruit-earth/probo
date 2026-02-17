ALTER TABLE evidence_state_transitions ADD COLUMN evidence_id TEXT REFERENCES evidences(id) NOT NULL;
ALTER TABLE evidences ALTER COLUMN size TYPE BIGINT USING size::BIGINT;
