// supabase_config.js
// =========================================================================
// SECURITY NOTE: The SUPABASE_ANON_KEY is designed for public client exposure
// ONLY when Row Level Security (RLS) policies are active on your tables.
// 
// WARNING: The SUPABASE_SERVICE_ROLE_KEY (service-role key) bypasses all RLS 
// controls and allows absolute write/delete permission. NEVER expose the 
// service-role key anywhere in your frontend files.
// =========================================================================

// 1. Replace these with your actual Project URL and Anon Key from your Supabase Dashboard
const SUPABASE_URL = 'https://zmxbhgzdgviktkdsgbau.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpteGJoZ3pkZ3Zpa3RrZHNnYmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjMyNTMsImV4cCI6MjA5NDY5OTI1M30.YAMBtJaPwAxhzUiFbsi4O5C8v0pCmoKP4AGGOdb6wZM';

// 2. Initialize the Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to check if Supabase is properly configured
async function checkSupabaseConnection() {
    if (SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
        console.warn("Supabase is not configured yet. Please update supabase_config.js with your keys.");
        return false;
    }
    return true;
}

// Hash a password using SHA-256 (via browser Web Crypto API)
async function hashPassword(password) {
    if (!password) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if a password is a valid 64-character SHA-256 hash
function isHashed(password) {
    if (!password) return false;
    return /^[0-9a-f]{64}$/i.test(password);
}
