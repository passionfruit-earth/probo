CREATE TABLE controls_audits (
    control_id TEXT NOT NULL REFERENCES controls(id),
    audit_id TEXT NOT NULL REFERENCES audits(id),
    tenant_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (control_id, audit_id)
);
