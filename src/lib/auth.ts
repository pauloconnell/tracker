import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export interface SessionContext {
   userId: string;
   email?: string;
}

export interface AuthContext {
   session: SessionContext;
   companyId: string;
}

export async function getAuthSession(): Promise<SessionContext | null> {
   try {
      const session = await auth0.getSession();
      if (!session?.user) return null;
      return {
         userId: session.user.sub || session.user.email || '',
         email: session.user.email,
      };
   } catch (error) {
      console.error('Failed to get session:', error);
      return null;
   }
}

export function unauthorizedResponse(message = 'Unauthorized') {
   return NextResponse.json({ error: message }, { status: 403 });
}

export function unauthenticatedResponse(message = 'Authentication required') {
   return NextResponse.json({ error: message }, { status: 401 });
}

export function validationErrorResponse(message = 'Validation failed') {
   return NextResponse.json({ error: message }, { status: 400 });
}
