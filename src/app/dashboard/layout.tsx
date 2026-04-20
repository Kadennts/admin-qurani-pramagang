import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans transition-colors dark:bg-slate-950">
      <Sidebar />
      <main className="relative flex-1 w-full overflow-x-hidden overflow-y-auto bg-slate-50 p-4 transition-colors dark:bg-slate-950 md:p-8">
        {children}
      </main>
    </div>
  );
}
