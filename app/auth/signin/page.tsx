"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// Components
import Logo from "@/components/shared/Logo";
import LoadingScreen from "@/components/shared/LoadingScreen";
import Testimonials from "./components/Testimonials";
import SocialLogins from "./components/SocialLogins";
import SignInForm from "./components/SignInForm";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <LoadingScreen
        text={
          status === "authenticated"
            ? "Yönlendiriliyor..."
            : "Oturum açılıyor..."
        }
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
      {/* Left Panel: Testimonials */}
      <Testimonials />

      {/* Right Panel: Sign In Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-flex mb-6">
              <Logo textSize="2xl" />
            </Link>
          </div>

          <SocialLogins />
          <SignInForm />

          {/* Footer Links */}
          <p className="mt-8 text-center text-[11px] text-slate-500 px-4">
            Giriş yaparak{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Kullanım Koşulları
            </a>{" "}
            ve{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Gizlilik Politikası
            </a>
            &apos;nı kabul etmiş olursun.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
