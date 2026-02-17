ALTER TABLE controls_mitigations RENAME TO controls_mesures;
ALTER TABLE controls_mesures RENAME COLUMN mitigation_id TO mesure_id;
