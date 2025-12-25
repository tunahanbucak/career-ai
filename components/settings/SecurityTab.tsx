"use client";

export default function SecurityTab() {
  return (
    <div className="space-y-6 mt-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Güvenlik</h2>
        <p className="text-sm text-muted-foreground">
          Hesap güvenliği Google/Github hesabınız tarafından sağlanmaktadır.
        </p>
      </div>
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
        <p className="text-sm">
          Giriş yapmak için OAuth sağlayıcılarını (Google, Github)
          kullandığınızdan dolayı şifre değiştirme işlemi gerekmemektedir.
        </p>
      </div>
    </div>
  );
}
