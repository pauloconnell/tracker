import { auth0 } from '@/lib/auth0';
import HeaderClient from './HeaderClient';

export default async function HeaderServer() {
   const session = await auth0.getSession();
   const user = session?.user ? {
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      picture: session.user.picture ?? null,
      sub: session.user.sub ?? null,
   } : null;

   return <HeaderClient session={user ? { user } : null} />;
}
