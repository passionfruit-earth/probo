ALTER TABLE frameworks 
  ALTER COLUMN reference_id SET NOT NULL,
  DROP CONSTRAINT IF EXISTS frameworks_reference_id_unique,
  ADD CONSTRAINT frameworks_org_ref_unique UNIQUE (organization_id, reference_id);

ALTER TABLE controls 
  ALTER COLUMN reference_id DROP DEFAULT,
  DROP CONSTRAINT IF EXISTS controls_reference_id_unique,
  ADD CONSTRAINT controls_framework_ref_unique UNIQUE (framework_id, reference_id);