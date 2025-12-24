"use client";

import { useState } from "react";
import {
  User,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ApproveButton from "./ApproveButton";
import Image from "next/image";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  level: number;
  xp: number;
  approved: boolean;
  approvedAt: Date | null;
  approvedBy: string | null;
  _count: {
    cvs: number;
    interviews: number;
  };
}

export default function UsersTableWithModal({ data }: { data: UserData[] }) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">Henüz kullanıcı yok</div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-sm text-slate-400">
              <th className="text-left py-3 px-2">Kullanıcı</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-center py-3 px-2">Level</th>
              <th className="text-center py-3 px-2">CV</th>
              <th className="text-center py-3 px-2">Mülakat</th>
              <th className="text-center py-3 px-2">Durum</th>
              <th className="text-center py-3 px-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className="font-medium text-sm">
                      {user.name || "İsimsiz"}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-2">
                  <span className="text-sm text-slate-400">{user.email}</span>
                </td>

                <td className="py-3 px-2 text-center">
                  <span className="inline-block px-2 py-1 text-xs bg-indigo-950/50 text-indigo-300 rounded">
                    L{user.level}
                  </span>
                </td>

                <td className="py-3 px-2 text-center">
                  <span className="text-emerald-400 font-semibold">
                    {user._count.cvs}
                  </span>
                </td>

                <td className="py-3 px-2 text-center">
                  <span className="text-amber-400 font-semibold">
                    {user._count.interviews}
                  </span>
                </td>

                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-1">
                    {user.approved ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Onaylı</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-500">Bekliyor</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="py-3 px-2 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUser(user)}
                    className="text-xs"
                  >
                    Detay
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detay Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              {selectedUser?.image ? (
                <Image
                  src={selectedUser.image}
                  alt={selectedUser.name || "User"}
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="text-slate-100">{selectedUser?.name || "İsimsiz"}</div>
                <div className="text-sm font-normal text-slate-400">
                  {selectedUser?.email}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* ADMIN ONAY DURUMU */}
            <div className="flex items-center gap-2 p-4 rounded-lg bg-slate-800/50">
              {selectedUser?.approved ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-green-500">
                      Admin Onaylı ✅
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedUser.approvedAt
                        ? new Date(selectedUser.approvedAt).toLocaleDateString(
                            "tr-TR"
                          )
                        : "Onaylandı"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-amber-500">
                      Onay Bekliyor ⚠️
                    </p>
                    <p className="text-xs text-slate-400">
                      Kullanıcı admin onayı bekliyor
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-800/30">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-slate-400">Level</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-indigo-300">
                  {selectedUser?.level}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedUser?.xp} XP
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">CVler</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-emerald-300">
                  {selectedUser?._count.cvs}
                </p>
                <p className="text-xs text-slate-500 mt-1">Yüklenmiş</p>
              </div>

              <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800/30">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Mülakatlar</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-amber-300">
                  {selectedUser?._count.interviews}
                </p>
                <p className="text-xs text-slate-500 mt-1">Tamamlanmış</p>
              </div>
            </div>

            {/* Özet */}
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-200">
                <BarChart3 className="w-4 h-4" />
                Kullanıcı Özeti
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  • Toplam{" "}
                  <span className="text-emerald-400 font-semibold">
                    {selectedUser?._count.cvs}
                  </span>{" "}
                  adet CV yüklemiş
                </p>
                <p>
                  • Toplam{" "}
                  <span className="text-amber-400 font-semibold">
                    {selectedUser?._count.interviews}
                  </span>{" "}
                  adet mülakat yapmış
                </p>
                <p>
                  • Level{" "}
                  <span className="text-indigo-400 font-semibold">
                    {selectedUser?.level}
                  </span>{" "}
                  seviyesinde
                </p>
              </div>
            </div>

            {/* ONAYLAMA VE GEÇMİŞ BUTONLARI */}
            <div className="mt-6 p-4 border-t border-slate-700 flex flex-col gap-3">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => (window.location.href = `/admin/users/${selectedUser?.id}`)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Tüm Geçmişi Gör
              </Button>

              <ApproveButton
                userId={selectedUser?.id || ""}
                currentStatus={selectedUser?.approved || false}
                userName={selectedUser?.name || "Kullanıcı"}
                onClose={() => setSelectedUser(null)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
