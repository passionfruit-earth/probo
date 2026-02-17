ALTER TABLE organizations ADD COLUMN logo_url TEXT;

UPDATE organizations SET logo_url = 'https://fastly.picsum.photos/id/411/100/100.jpg?grayscale&hmac=lGH1KqiTvm1TFkjJ6kimsgMJIL0S7zVS7EHFi0qOgCk';

ALTER TABLE organizations ALTER COLUMN logo_url SET NOT NULL;
