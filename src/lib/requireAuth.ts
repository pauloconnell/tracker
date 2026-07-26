import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

export async function requireAuth() {
   try {
      const session = await auth0.getSession();
      if (!session) redirect('/auth/login');
      return session;
   } catch {
      redirect('/api/auth/login');
   }
}
