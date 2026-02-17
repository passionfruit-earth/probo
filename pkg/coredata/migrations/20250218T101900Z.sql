CREATE TYPE service_criticality AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE risk_tier AS ENUM ('CRITICAL', 'SIGNIFICANT', 'GENERAL');

ALTER TABLE vendors
    ADD COLUMN service_start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ADD COLUMN service_termination_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN service_criticality service_criticality NOT NULL DEFAULT 'LOW',
    ADD COLUMN risk_tier risk_tier NOT NULL DEFAULT 'GENERAL',
    ADD COLUMN status_page_url TEXT;

UPDATE vendors SET service_start_date = created_at;

ALTER TABLE vendors ALTER COLUMN service_start_date DROP DEFAULT;
ALTER TABLE vendors ALTER COLUMN service_criticality DROP DEFAULT;
ALTER TABLE vendors ALTER COLUMN risk_tier DROP DEFAULT;