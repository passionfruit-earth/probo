-- Add evidence type enum
CREATE TYPE evidence_type AS ENUM (
    'FILE',
    'LINK'
);

ALTER TABLE evidences 
    ADD COLUMN type evidence_type NOT NULL DEFAULT 'FILE',
    ADD COLUMN url TEXT NOT NULL DEFAULT '',
    ADD COLUMN description TEXT NOT NULL DEFAULT '';

ALTER TABLE evidences 
    ALTER COLUMN type DROP DEFAULT,
    ALTER COLUMN url DROP DEFAULT,
    ALTER COLUMN description DROP DEFAULT; 