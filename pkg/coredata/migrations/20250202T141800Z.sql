CREATE EXTENSION citext;

ALTER TABLE usrmgr_users
  ADD COLUMN email_address CITEXT NOT NULL,
  ADD COLUMN hashed_password BYTEA NOT NULL;
