import Navbar from "@/app/components/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-6">
        {children}
      </main>
    </div>
  );
}
