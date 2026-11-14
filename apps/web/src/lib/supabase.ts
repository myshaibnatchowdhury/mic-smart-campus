import { createClient } from '@supabase/supabase-js';

function getCredentials() {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('mic_supabase_url');
    const savedKey = localStorage.getItem('mic_supabase_anon_key');
    if (savedUrl && savedKey) {
      return { url: savedUrl, key: savedKey };
    }
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-mic-smart-campus.supabase.co',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-mic-smart-campus'
  };
}

export const isSupabaseConfigured = () => {
  const { url, key } = getCredentials();
  return (
    Boolean(url && key) &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('placeholder')
  );
};

const creds = getCredentials();

export const supabase = createClient(creds.url, creds.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
