'use client';

export default function LoginButton() {
  return (
    <a
      href="/api/auth/login?screen_hint=signup"
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Log In
    </a>
  );
}
