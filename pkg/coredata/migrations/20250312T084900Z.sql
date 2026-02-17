ALTER TABLE emails ADD COLUMN recipient_name TEXT NOT NULL;
ALTER TABLE emails RENAME COLUMN email_address_to TO recipient_email;

ALTER TABLE emails ALTER COLUMN created_at DROP DEFAULT;
ALTER TABLE emails ALTER COLUMN updated_at DROP DEFAULT;

ALTER TABLE emails ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE emails ALTER COLUMN updated_at SET NOT NULL;
