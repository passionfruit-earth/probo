CREATE TABLE peoples (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id) NOT NULL,
  full_name TEXT NOT NULL,
  primary_email_address TEXT NOT NULL,
  additional_email_addresses TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
