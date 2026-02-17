CREATE TYPE data_classification_type AS ENUM (
    'PUBLIC',
    'INTERNAL',
    'CONFIDENTIAL',
    'SECRET'
);

ALTER TABLE data
ADD COLUMN data_classification data_classification_type;

UPDATE data
SET data_classification = CASE
    WHEN data_sensitivity = 'NONE' THEN 'PUBLIC'::data_classification_type
    WHEN data_sensitivity = 'LOW' THEN 'INTERNAL'::data_classification_type
    WHEN data_sensitivity = 'MEDIUM' THEN 'INTERNAL'::data_classification_type
    WHEN data_sensitivity = 'HIGH' THEN 'CONFIDENTIAL'::data_classification_type
    WHEN data_sensitivity = 'CRITICAL' THEN 'SECRET'::data_classification_type
END;

ALTER TABLE data
ALTER COLUMN data_classification SET NOT NULL;

ALTER TABLE data
DROP COLUMN data_sensitivity;
