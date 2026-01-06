import { getSession } from "@auth0/nextjs-auth0/edge";
import Header from "./Header";

export default async function HeaderServer() {
  const session = await getSession();
  return <Header session={session} />;
}
