-- Create enum types
CREATE TYPE criticity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE asset_type AS ENUM ('PHYSICAL', 'VIRTUAL');

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    owner_id TEXT NOT NULL REFERENCES peoples(id) ON UPDATE CASCADE ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE,
    criticity criticity_level DEFAULT 'MEDIUM',
    asset_type asset_type NOT NULL DEFAULT 'VIRTUAL',
    data_types_stored TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create junction table for many-to-many relationship with vendors
CREATE TABLE IF NOT EXISTS asset_vendors (
    asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
    vendor_id TEXT REFERENCES vendors(id) ON DELETE CASCADE,
    tenant_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (asset_id, vendor_id)
);
