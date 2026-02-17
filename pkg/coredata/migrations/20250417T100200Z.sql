ALTER TABLE risks_mesures DROP CONSTRAINT IF EXISTS risks_mesures_mesure_id_fkey;

ALTER TABLE risks_mesures
    ADD CONSTRAINT risks_mesures_mesure_id_fkey
    FOREIGN KEY (mesure_id)
    REFERENCES mesures(id)
    ON DELETE CASCADE;
