ALTER TABLE controls DROP CONSTRAINT IF EXISTS controls_framework_id_fkey;

DELETE FROM controls
WHERE framework_id NOT IN (SELECT id FROM frameworks);

ALTER TABLE controls
ADD CONSTRAINT controls_framework_id_fkey
    FOREIGN KEY (framework_id)
    REFERENCES frameworks(id)
    ON DELETE CASCADE;
