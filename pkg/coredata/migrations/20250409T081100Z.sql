CREATE TABLE vendor_compliance_reports (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL REFERENCES vendors(id),
    report_date DATE NOT NULL,
    valid_until DATE,
    report_name TEXT NOT NULL,
    file_key TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
