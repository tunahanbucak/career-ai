import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewPromoCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-2xl">
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold">Mülakat Simülasyonu</h3>
        <p className="mt-2 text-sm text-indigo-100/90">
          Gerçek bir İK uzmanı gibi davranan yapay zeka ile mülakat pratiği yap.
        </p>
        <Button
          asChild
          className="mt-6 w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 font-semibold"
        >
          <Link href="/interview">Simülasyonu Başlat</Link>
        </Button>
      </div>
    </div>
  );
}
