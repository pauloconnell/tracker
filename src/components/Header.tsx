import { getSession } from "@auth0/nextjs-auth0/edge";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-semibold">mainTracker</h1>

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
