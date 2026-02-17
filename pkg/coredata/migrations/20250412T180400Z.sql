ALTER TABLE risks_mitigations RENAME TO risks_mesures;
ALTER TABLE risks_mesures RENAME COLUMN mitigation_id TO mesure_id;
