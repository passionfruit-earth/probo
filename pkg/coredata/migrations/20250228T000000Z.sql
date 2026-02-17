CREATE TYPE policy_status AS ENUM ('DRAFT', 'ACTIVE');

CREATE TABLE policies (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    status policy_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    version INTEGER NOT NULL
); 