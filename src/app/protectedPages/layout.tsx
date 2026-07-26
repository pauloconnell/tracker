import { requireAuth } from "@/lib/requireAuth";
import { userHasCompany } from "@/lib/companyContext";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login");

  const hasCompany = await userHasCompany(session!.user.sub);
  if (!hasCompany) redirect("/setup-company");

  return <>{children}</>;
}
