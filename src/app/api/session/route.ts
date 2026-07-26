import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
   try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      console.log('[session] cookies present:', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) })));
      const session = await auth0.getSession();
      console.log('[session] result:', session ? 'HAS SESSION' : 'NULL');
      if (!session?.user) return NextResponse.json(null);
      return NextResponse.json({
         user: {
            name: session.user.name ?? null,
            email: session.user.email ?? null,
            picture: session.user.picture ?? null,
            sub: session.user.sub ?? null,
         },
      });
   } catch (e) {
      console.log('[session] error:', e);
      return NextResponse.json(null);
   }
}