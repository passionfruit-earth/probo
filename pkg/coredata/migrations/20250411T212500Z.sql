ALTER TABLE risks RENAME COLUMN probability TO likelihood;
ALTER TABLE risks ADD COLUMN residual_likelihood float;
ALTER TABLE risks ADD COLUMN residual_impact float;
ALTER TABLE risks ALTER COLUMN likelihood TYPE float;
ALTER TABLE risks ALTER COLUMN impact TYPE float;

ALTER TABLE risks_mitigations DROP COLUMN probability, DROP COLUMN impact;