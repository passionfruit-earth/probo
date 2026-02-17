ALTER TABLE controls ADD COLUMN category TEXT;

UPDATE controls SET category = 'security';

ALTER TABLE controls ALTER COLUMN category SET NOT NULL;