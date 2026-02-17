CREATE TABLE risks_mitigations (
    risk_id TEXT NOT NULL REFERENCES risks(id),
    mitigation_id TEXT NOT NULL REFERENCES mitigations(id),
    probability float NOT NULL,
    impact float NOT NULL,
    PRIMARY KEY (risk_id, mitigation_id)
);