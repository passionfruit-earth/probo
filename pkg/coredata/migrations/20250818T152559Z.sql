CREATE TABLE vendor_services (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT vendor_services_vendor_id_fkey
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
