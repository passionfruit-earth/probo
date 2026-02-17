CREATE TABLE files (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    bucket_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_key UUID NOT NULL UNIQUE,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE vendor_business_associate_agreements (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    valid_from DATE,
    valid_until DATE,
    file_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT vendor_business_associate_agreements_organization_vendor_unique
        UNIQUE (organization_id, vendor_id),

    CONSTRAINT vendor_business_associate_agreements_file_id_unique
        UNIQUE (file_id),

    CONSTRAINT vendor_business_associate_agreements_organization_id_fkey
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT vendor_business_associate_agreements_file_id_fkey
        FOREIGN KEY (file_id)
        REFERENCES files(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
