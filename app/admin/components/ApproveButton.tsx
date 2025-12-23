"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ApproveButtonProps {
  userId: string;
  currentStatus: boolean;
  userName: string;
  onClose?: () => void; // Dialog kapatma
}

export default function ApproveButton({
  userId,
  currentStatus,
  onClose,
}: ApproveButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async (approve: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, approve }),
      });

      if (!res.ok) {
        throw new Error("API hatası");
      }

      // Dialog kapat
      if (onClose) {
        setTimeout(() => onClose(), 300);
      }

      router.refresh();
    } catch (error) {
      alert("İşlem başarısız!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {!currentStatus ? (
        <Button
          onClick={() => handleApprove(true)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span className="ml-2">ONAYLA</span>
        </Button>
      ) : (
        <Button
          onClick={() => handleApprove(false)}
          disabled={loading}
          variant="destructive"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span className="ml-2">ONAYI KALDIR</span>
        </Button>
      )}
    </div>
  );
}
