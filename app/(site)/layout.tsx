import LandingNavbar from "@/app/components/LandingNavbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <LandingNavbar />
      <main className="flex-1 pt-24 px-6 md:px-0">
        {children}
      </main>
    </div>
  );
}
