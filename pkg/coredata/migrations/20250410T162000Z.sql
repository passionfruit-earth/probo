ALTER TABLE vendor_compliance_reports
DROP CONSTRAINT vendor_compliance_reports_vendor_id_fkey,
ADD CONSTRAINT vendor_compliance_reports_vendor_id_fkey
    FOREIGN KEY (vendor_id)
    REFERENCES vendors(id)
    ON DELETE CASCADE; 