-- Fix missing accounts for OAuth users
-- This migration creates accounts for users who signed up via OAuth but don't have an account record

INSERT INTO public.accounts (id, name, email, picture_url)
SELECT
    u.id,
    COALESCE(
        u.raw_user_meta_data->>'name',
        u.raw_user_meta_data->>'full_name',
        split_part(u.email, '@', 1)
    ) as name,
    u.email,
    u.raw_user_meta_data->>'avatar_url' as picture_url
FROM auth.users u
LEFT JOIN public.accounts a ON u.id = a.id
WHERE a.id IS NULL  -- Only insert for users without accounts
ON CONFLICT (id) DO NOTHING;
