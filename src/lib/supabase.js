import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wxxbqdqkpmhimqureaou.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4eGJxZHFrcG1oaW1xdXJlYW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MzA0ODAsImV4cCI6MjA5OTQwNjQ4MH0.VSXb-U_HhV_wBu8zyDaPYoK5qNBPUD3q6EWi9maxsiY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);