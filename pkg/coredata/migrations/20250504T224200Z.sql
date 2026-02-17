ALTER TABLE evidences DROP CONSTRAINT evidences_measure_id_fkey;

ALTER TABLE evidences 
ADD CONSTRAINT evidences_measure_id_fkey
FOREIGN KEY (measure_id)
REFERENCES measures(id)
ON DELETE CASCADE;
