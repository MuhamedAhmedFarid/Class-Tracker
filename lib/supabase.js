// lib/supabase.js
import { createClient } from '@supabase/supabase-js';
// import 'react-native-url-polyfill/auto'; // Ensure you have this installed or use standard polyfills if on Expo 50+

const supabaseUrl = 'https://ytknnqcaoamgrqgruykh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0a25ucWNhb2FtZ3JxZ3J1eWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTcxOTksImV4cCI6MjA3OTMzMzE5OX0.skr9Czydwqim_yJuDXuejL_zcV8mYq3vslBcy437zTI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);