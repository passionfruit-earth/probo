CREATE TYPE compliance_registries_status AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'CLOSED'
);

CREATE TABLE compliance_registries (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    area TEXT,
    source TEXT,
    audit_id TEXT NOT NULL,
    requirement TEXT,
    actions_to_be_implemented TEXT,
    regulator TEXT,
    owner_id TEXT NOT NULL,
    last_review_date DATE,
    due_date DATE,
    status compliance_registries_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT compliance_registries_organization_id_fkey
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT compliance_registries_owner_id_fkey
        FOREIGN KEY (owner_id)
        REFERENCES peoples(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT compliance_registries_audit_id_fkey
        FOREIGN KEY (audit_id)
        REFERENCES audits(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
