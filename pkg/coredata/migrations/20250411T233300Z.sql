CREATE TABLE risks_policies (
    risk_id TEXT NOT NULL REFERENCES risks(id),
    policy_id TEXT NOT NULL REFERENCES policies(id),
    tenant_id TEXT NOT NULL,
    created_at timestamp NOT NULL,
    PRIMARY KEY (risk_id, policy_id)
);