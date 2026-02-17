ALTER TABLE controls_mitigations
    ADD CONSTRAINT fk_controls_mitigations_control_id
    FOREIGN KEY (control_id)
    REFERENCES controls(id)
    ON DELETE CASCADE;

ALTER TABLE controls_mitigations
    ADD CONSTRAINT fk_controls_mitigations_mitigation_id
    FOREIGN KEY (mitigation_id)
    REFERENCES mitigations(id)
    ON DELETE CASCADE;
