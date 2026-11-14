const fs = require('fs');
const path = require('path');

let file1 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20261114000001_init_mic_smart_campus.sql'), 'utf8');
const file2 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20261114000002_storage_and_audit.sql'), 'utf8');
const file3 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20261114000003_registrations_and_super_admin.sql'), 'utf8');
const file4 = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'seed.sql'), 'utf8');

let sql = `
-- ==============================================================================
-- MIC SMART CAMPUS — COMPLETE IDEMPOTENT SUPABASE SETUP
-- Project URL: https://epctmfazlaganiecnobh.supabase.co
-- ==============================================================================

-- Safely remove any foreign key constraint on profiles that might block seeding
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

${file1}

-- Ensure constraint is removed even if table already existed
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

${file2}

${file3}

${file4}
`;

// Remove REFERENCES auth.users(id) in table definition
sql = sql.replace(/id UUID PRIMARY KEY REFERENCES auth\.users\(id\) ON DELETE CASCADE,/g, 'id UUID PRIMARY KEY,');

// Drop policy if exists before CREATE POLICY "name" ON table
sql = sql.replace(/CREATE POLICY\s+"([^"]+)"\s*\n?\s*ON\s+([a-zA-Z0-9_.]+)/g, (match, policyName, tableName) => {
  return `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};\nCREATE POLICY "${policyName}" ON ${tableName}`;
});

// Drop trigger if exists before CREATE TRIGGER name AFTER/BEFORE
sql = sql.replace(/CREATE TRIGGER\s+([a-zA-Z0-9_]+)\s*\n?\s+(AFTER|BEFORE)\s+([A-Z\s]+)\s+ON\s+([a-zA-Z0-9_.]+)/g, (match, triggerName, timing, events, tableName) => {
  return `DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};\nCREATE TRIGGER ${triggerName} ${timing} ${events} ON ${tableName}`;
});

// Ensure auth.users entry exists for Super Admin
const authUserSeed = `
-- Provision auth.users record for Super Admin Mysha Ibnat Chowdhury
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000099',
    'authenticated',
    'authenticated',
    'myshaibnatchowdhury@gmail.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Mysha Ibnat Chowdhury","is_super_admin":true}'::jsonb,
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING;
`;

sql = sql.replace(/-- 2\. Configure Super Admin Profile: Mysha Ibnat Chowdhury/g, `${authUserSeed}\n-- 2. Configure Super Admin Profile: Mysha Ibnat Chowdhury`);

const outputPath = path.join(__dirname, '..', 'supabase', 'COMPLETE_MIC_CAMPUS_SETUP.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Regenerated COMPLETE_MIC_CAMPUS_SETUP.sql with profiles_id_fkey fix and auth.users seeding!');
