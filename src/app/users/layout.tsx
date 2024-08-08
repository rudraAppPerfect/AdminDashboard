import Sidebar from "../ui/dashboard/Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-900">
      <Sidebar />
      {children}
    </div>
  );
}
