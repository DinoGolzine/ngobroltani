import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export const configured = Boolean(env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(
  env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);
