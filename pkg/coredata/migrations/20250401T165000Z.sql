ALTER TABLE mitigations RENAME COLUMN content_ref TO reference_id;
ALTER TABLE mitigations ADD CONSTRAINT mitigations_org_ref_unique UNIQUE (organization_id, reference_id);
ALTER TABLE mitigations DROP COLUMN standards;
