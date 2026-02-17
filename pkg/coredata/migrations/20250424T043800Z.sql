INSERT INTO peoples (
    id,
    organization_id,
    full_name,
    primary_email_address,
    additional_email_addresses,
    user_id,
    kind,
    created_at,
    updated_at
)
SELECT 
    generate_gid(decode_base64_unpadded(o.tenant_id), 8),
    o.id,
    u.fullname,
    u.email_address,
    ARRAY[]::TEXT[],
    u.id,
    'CONTRACTOR',
    NOW(),
    NOW()
FROM users u
JOIN users_organizations uo ON u.id = uo.user_id
JOIN organizations o ON uo.organization_id = o.id
LEFT JOIN peoples p ON u.id = p.user_id
WHERE p.id IS NULL;

UPDATE peoples p
SET user_id = u.id
FROM users u
WHERE p.user_id IS NULL
AND p.primary_email_address = u.email_address;
