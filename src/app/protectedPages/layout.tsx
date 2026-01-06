import { requireAuth } from "@/lib/requireAuth";

export default async function ProtectedLayout({ children }) {
  await requireAuth(); // 🔐 protect everything inside this group
  return <>{children}</>;
}
