import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const session = await auth0.getSession();
      if (!session?.user) return NextResponse.json(null);
      return NextResponse.json({
         user: {
            name: session.user.name ?? null,
            email: session.user.email ?? null,
            picture: session.user.picture ?? null,
            sub: session.user.sub ?? null,
         },
      });
   } catch {
      return NextResponse.json(null);
   }
}