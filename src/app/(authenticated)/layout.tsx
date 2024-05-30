import SidebarNav from "~/components/ui/SidebarNav";
import Header from "~/components/ui/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarNav/>
      <div className="flex flex-col w-full bg-brand_light_grey/50">
        <Header />
        <main className="w-full">
          {children}
        </main>
      </div>
      </div>
  );
}
