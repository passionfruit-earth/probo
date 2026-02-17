CREATE TYPE people_kind AS ENUM (
  'EMPLOYEE',
  'CONTRACTOR'
);

ALTER TABLE peoples ADD COLUMN kind people_kind;

UPDATE peoples SET kind = 'EMPLOYEE';

ALTER TABLE peoples ALTER COLUMN kind SET NOT NULL;
