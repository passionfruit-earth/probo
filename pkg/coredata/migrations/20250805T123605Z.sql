UPDATE emails
SET created_at = sent_at,
    updated_at = sent_at
WHERE created_at < '2000-01-01';
