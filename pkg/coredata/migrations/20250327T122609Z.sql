-- Drop the foreign key constraint first
ALTER TABLE mitigations DROP CONSTRAINT IF EXISTS fk_mitigations_framework_id;

-- Drop any indices on framework_id
DROP INDEX IF EXISTS idx_mitigations_framework_id;

-- Remove the framework_id column
ALTER TABLE mitigations DROP COLUMN framework_id; 