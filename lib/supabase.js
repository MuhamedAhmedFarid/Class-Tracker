import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjlprdxsmrbkkrpdepyp.supabase.co';
// WARNING: The API key is hardcoded here for immediate functionality as requested.
// For a production app, always use environment variables for security.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbHByZHhzbXJia2tycGRlcHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzA3NzEsImV4cCI6MjA3OTIwNjc3MX0.O1ZqwtZAn11b87j91Y00auuPLKt-nZwidelHTckVD1g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);