import { getSession } from "@auth0/nextjs-auth0/edge";
import HeaderClient from "./HeaderClient";


export default async function HeaderServer() {
  const session = (await getSession()) ?? null;
  return <HeaderClient session={session} />;
}
