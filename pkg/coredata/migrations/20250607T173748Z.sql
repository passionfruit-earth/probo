ALTER TABLE controls ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('simple',
        COALESCE(section_title, '') || ' ' ||
        COALESCE(name, '') || ' ' ||
        COALESCE(description, '')
    )
) STORED;

CREATE INDEX controls_search_idx ON controls USING gin(search_vector);
