CREATE TABLE usrmgr_user_organizations (
    user_id TEXT REFERENCES usrmgr_users(id) NOT NULL,
    organization_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, organization_id)
);

INSERT INTO usrmgr_user_organizations (user_id, organization_id, created_at)
SELECT id, organization_id, NOW()
FROM usrmgr_users
WHERE organization_id IS NOT NULL; 