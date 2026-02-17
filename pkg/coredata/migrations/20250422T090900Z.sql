ALTER TABLE vendor_risk_assessments
    ADD FOREIGN KEY (assessed_by) REFERENCES peoples(id);
