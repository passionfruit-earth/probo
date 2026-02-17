CREATE TYPE policy_version_signature_state AS ENUM ('REQUESTED', 'SIGNED');

CREATE TABLE policy_version_signatures (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    policy_version_id TEXT NOT NULL REFERENCES policy_versions(id) ON DELETE CASCADE,
    state policy_version_signature_state NOT NULL,
    signed_by TEXT NOT NULL REFERENCES peoples(id),
    signed_at TIMESTAMP WITH TIME ZONE,
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL,
    requested_by TEXT NOT NULL REFERENCES peoples(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE (policy_version_id, signed_by)
);
