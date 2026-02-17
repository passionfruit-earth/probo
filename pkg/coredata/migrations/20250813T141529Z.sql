CREATE TABLE vendor_data_privacy_agreements (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    valid_from DATE,
    valid_until DATE,
    file_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT vendor_data_privacy_agreements_organization_vendor_unique
        UNIQUE (organization_id, vendor_id),

    CONSTRAINT vendor_data_privacy_agreements_file_id_unique
        UNIQUE (file_id),

    CONSTRAINT vendor_data_privacy_agreements_organization_id_fkey
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT vendor_data_privacy_agreements_file_id_fkey
        FOREIGN KEY (file_id)
        REFERENCES files(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
