UPDATE risks SET residual_impact = impact WHERE residual_impact IS NULL;
UPDATE risks SET residual_likelihood = likelihood WHERE residual_likelihood IS NULL;

ALTER TABLE risks ALTER COLUMN residual_impact SET NOT NULL;
ALTER TABLE risks ALTER COLUMN residual_likelihood SET NOT NULL;
