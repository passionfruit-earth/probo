ALTER TABLE risk_assessments RENAME TO vendor_risk_assessments;

ALTER TABLE vendor_risk_assessments ADD COLUMN assessed_at TIMESTAMP WITH TIME ZONE NOT NULL;