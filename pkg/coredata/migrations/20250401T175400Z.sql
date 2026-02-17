ALTER TABLE controls
  DROP CONSTRAINT IF EXISTS controls_framework_ref_unique,
  ADD CONSTRAINT controls_framework_ref_unique UNIQUE (framework_id, reference_id);
