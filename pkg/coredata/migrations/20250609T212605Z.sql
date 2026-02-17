ALTER TABLE documents ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('simple',
        COALESCE(title, '')
    )
) STORED;

CREATE INDEX documents_search_idx ON documents USING gin(search_vector);

ALTER TABLE measures ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('simple',
        COALESCE(name, '')
    )
) STORED;

CREATE INDEX measures_search_idx ON measures USING gin(search_vector);

ALTER TABLE risks ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('simple',
        COALESCE(name, '')
    )
) STORED;

CREATE INDEX risks_search_idx ON risks USING gin(search_vector);
