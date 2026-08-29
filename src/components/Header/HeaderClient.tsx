"use client";

import LoginButton from "../auth/LoginButton";
import LogoutButton from "../auth/LogoutButton";
import Link from "next/link";
import { useCompanyStore } from "@/store/useCompanyStore";

interface SafeSession {
   user: {
      name: string | null;
      email: string | null;
      picture: string | null;
      sub: string | null;
   };
}

interface HeaderClientProps {
   session: SafeSession | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const activeCompanyId = useCompanyStore((s) => s.activeCompanyId);
  const homeHref = activeCompanyId ? `/protectedPages/${activeCompanyId}/dashboard` : "/";
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-semibold">
       <Link href={homeHref} className=" text-white px-4 py-2 rounded-lg hover:bg-blue-700" >
        MainTracker
        </Link>
        </h1>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="hidden md:inline-flex text-sm opacity-80">{session.user.name}</span>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}
