"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
      <Link
        href="/"
        className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition"
      >
        CareerAI
      </Link>

      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition hidden sm:inline font-medium"
            >
              Kontrol Paneli
            </Link>
            <span className="text-gray-700 hidden sm:inline">
              Merhaba,{" "}
              {session.user?.name || session.user?.email || "Kullanıcı"}!
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition font-medium"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium shadow-md"
          >
            Giriş Yap
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
