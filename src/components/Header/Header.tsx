"use client"
import type { Session } from "@auth0/nextjs-auth0";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import Link from 'next/link';

interface HeaderClientProps { session: Session | null; }

export default function Header({ session }: HeaderClientProps) {


  

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-semibold">
        <Link href="/protectedPages/dashboard" className=" text-white px-4 py-2 rounded-lg hover:bg-blue-700" >
        mainTracker
        </Link>
        </h1>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm opacity-80">
              {session.user.name}
            </span>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}
