'use client';

export default function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="px-4 py-2 bg-gray-600 text-white rounded"
    >
      Log Out
    </a>
  );
}
