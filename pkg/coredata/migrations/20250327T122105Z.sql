-- Add organization_id column to mitigations table
ALTER TABLE mitigations ADD COLUMN organization_id TEXT;

-- Update mitigations to set organization_id based on framework's organization_id
UPDATE mitigations m
SET organization_id = f.organization_id
FROM frameworks f
WHERE m.framework_id = f.id;

-- Make organization_id NOT NULL after update
ALTER TABLE mitigations ALTER COLUMN organization_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE mitigations ADD CONSTRAINT fk_mitigations_organization_id
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX idx_mitigations_organization_id ON mitigations(organization_id); 