"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path
        fill="#4285F4"
        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
      />
      <path
        fill="#34A853"
        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
      />
      <path
        fill="#FBBC05"
        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
      />
      <path
        fill="#EA4335"
        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
      />
    </g>
  </svg>
);

export default function SocialLogins() {
  return (
    <>
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-white mb-2">Hoş Geldin</h2>
        <p className="text-slate-400">
          Kariyer yolculuğuna devam etmek için giriş yap.
        </p>
      </div>
      <div className="space-y-4 mb-8">
        <button
          onClick={() => signIn("google")}
          aria-label="Google hesabınızla giriş yapın"
          className="group relative w-full flex items-center justify-center gap-3 rounded-xl bg-white text-slate-950 px-4 py-3.5 text-sm font-semibold transition-all hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5"
        >
          <GoogleIcon />
          Google ile Devam Et
        </button>
        <button
          onClick={() => signIn("github")}
          aria-label="GitHub hesabınızla giriş yapın"
          className="group w-full flex items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-700 hover:-translate-y-0.5"
        >
          <Github className="w-5 h-5 group-hover:text-white transition-colors" />
          GitHub ile Devam Et
        </button>
      </div>
    </>
  );
}
