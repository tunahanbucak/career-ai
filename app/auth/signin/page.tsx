"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("E-posta gönderiliyor...");

    const res = await signIn("email", {
      email,
      redirect: false,
    });

    if (res?.error) {
      setMessage("Bir hata oluştu: " + res.error);
    } else {
      setMessage("✅ Doğrulama e-postası gönderildi! Gelen kutunu kontrol et.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6 pt-20">
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center border-t-4 border-blue-600 transform hover:scale-[1.01] transition duration-300">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
          Hesabına Giriş Yap
        </h1>
        <p className="text-md text-gray-600 mb-8">
          CareerAI özelliklerine erişmek için tercih ettiğin yöntemle devam et.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 hover:bg-gray-100 transition duration-200 shadow-md font-semibold text-lg"
          >
            <Image src="/google-logo.png" alt="Google" height={24} width={24} />
            <span>Google ile Giriş Yap</span>
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition duration-200 shadow-md font-semibold text-lg"
          >
            <Image
              src="/github-logo.jpg"
              alt="GitHub"
              height={24}
              width={24}
              className="filter invert"
            />
            <span>GitHub ile Giriş Yap</span>
          </button>
        </div>

        <form onSubmit={handleEmailSignIn} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="E-posta adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Gönderiliyor..." : "Giriş Bağlantısı Gönder"}
          </button>
        </form>

        {message && <div className="mt-4 text-sm text-gray-600">{message}</div>}

        <div className="mt-10 text-xs text-gray-400">
          Oturum, NextAuth ve Neon DB tarafından güvenli bir şekilde
          yönetilecektir.
        </div>
      </div>
    </div>
  );
}
