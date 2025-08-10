import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    
const supabaseWithAuth = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing token');
  }

  const token = authHeader.split(' ')[1];
  return createClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
} 

export const fetchUser = async (authHeader: string | null) => {
  const supabase = supabaseWithAuth(authHeader);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError)  throw new Error(userError.message);
  return user;
};