import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
   signInReturnToPath: '/', //  FUTURE: add logged in landing page - for now just roots to homepage
});
