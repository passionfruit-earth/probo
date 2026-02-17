DELETE FROM connectors;

ALTER TABLE connectors DROP COLUMN connection;
ALTER TABLE connectors ADD COLUMN encrypted_connection BYTEA NOT NULL;