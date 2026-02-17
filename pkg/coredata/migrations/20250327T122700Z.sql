-- Create a new table for controls with string IDs
CREATE TABLE controls (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    framework_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE controls_mitigations (
    control_id TEXT NOT NULL,
    mitigation_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (control_id, mitigation_id)
);
