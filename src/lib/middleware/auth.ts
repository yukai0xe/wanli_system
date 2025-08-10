import { fetchUser } from '@/lib/supabaseClient';

export async function authenticate(request: Request) {
  const authHeader = request.headers.get('authorization');
  const user = await fetchUser(authHeader);

  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}