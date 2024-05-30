import SidebarNav from "~/components/ui/SidebarNav";
import Header from "~/components/ui/Header";
import Footer from "~/components/ui/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarNav/>
      <div className="flex flex-col w-full bg-brand_light_grey/50">
        <Header />
        <main className="w-full min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
      </div>
  );
}
