ALTER TABLE controls DROP CONSTRAINT IF EXISTS controls_framework_id_fkey;
ALTER TABLE controls_mesures DROP CONSTRAINT IF EXISTS controls_mesures_control_id_fkey;
ALTER TABLE controls_policies DROP CONSTRAINT IF EXISTS controls_policies_control_id_fkey;

ALTER TABLE controls_mesures
    ADD CONSTRAINT controls_mesures_control_id_fkey
    FOREIGN KEY (control_id)
    REFERENCES controls(id)
    ON DELETE CASCADE;

ALTER TABLE controls_policies
    ADD CONSTRAINT controls_policies_control_id_fkey
    FOREIGN KEY (control_id)
    REFERENCES controls(id)
    ON DELETE CASCADE;

ALTER TABLE controls
    ADD CONSTRAINT controls_framework_id_fkey
    FOREIGN KEY (framework_id)
    REFERENCES frameworks(id)
    ON DELETE CASCADE;

DELETE FROM controls WHERE framework_id NOT IN (SELECT id FROM frameworks);
