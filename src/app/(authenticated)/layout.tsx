import SidebarNav from "~/components/ui/SidebarNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarNav/>
      <main className="w-full">{children}</main>
      </div>
  );
}
