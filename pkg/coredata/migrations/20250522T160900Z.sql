ALTER TABLE risks ADD COLUMN inherent_risk_score INTEGER GENERATED ALWAYS AS (inherent_impact * inherent_likelihood) STORED;
ALTER TABLE risks ADD COLUMN residual_risk_score INTEGER GENERATED ALWAYS AS (residual_impact * residual_likelihood) STORED;
