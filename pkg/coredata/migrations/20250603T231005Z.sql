ALTER INDEX policy_versions_pkey RENAME TO document_versions_pkey;

ALTER TABLE document_versions
    RENAME CONSTRAINT policy_versions_policy_id_version_number_key
    TO document_versions_document_id_version_number_key;

ALTER TABLE document_versions
    RENAME CONSTRAINT policy_versions_published_by_fkey
    TO document_versions_published_by_fkey;

ALTER TABLE document_versions
    ADD CONSTRAINT document_versions_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES peoples(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE document_versions
    ADD COLUMN title TEXT,
    ADD COLUMN owner_id TEXT;

UPDATE document_versions dv
SET title = d.title,
    owner_id = d.owner_id
FROM documents d
WHERE dv.document_id = d.id;

ALTER TABLE document_versions
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN owner_id SET NOT NULL;

ALTER TABLE document_versions
    ADD CONSTRAINT document_versions_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES peoples(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
