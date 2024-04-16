/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_PUBLIC_API_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);