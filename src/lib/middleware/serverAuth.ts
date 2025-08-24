import { fetchUser } from '@/lib/supabaseClient';

export async function authenticate(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) throw new Error("Missing Authorization header");
    const user = await fetchUser(authHeader);
    if (!user) throw new Error('Unauthorized');
    return user;
  } catch (error) {
    throw error
  }
  
}