CREATE TABLE controls_policies (
    control_id TEXT NOT NULL REFERENCES controls(id),
    policy_id TEXT NOT NULL REFERENCES policies(id),
    tenant_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (control_id, policy_id)
);