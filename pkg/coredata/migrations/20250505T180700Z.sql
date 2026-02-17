ALTER TABLE risks_measures DROP CONSTRAINT risks_mitigations_mitigation_id_fkey;

ALTER TABLE risks_measures
  ADD CONSTRAINT risks_mitigations_mitigation_id_fkey
  FOREIGN KEY (measure_id) REFERENCES measures(id)
  ON DELETE CASCADE;
