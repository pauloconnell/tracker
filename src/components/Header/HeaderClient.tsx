"use client";

import type { Session } from "@auth0/nextjs-auth0";
import LoginButton from "../auth/LoginButton";
import LogoutButton from "../auth/LogoutButton";

interface HeaderClientProps {
  session: Session | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-semibold">mainTracker</h1>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm opacity-80">{session.user.name}</span>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}
