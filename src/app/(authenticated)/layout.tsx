
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <main className="w-full">{children}</main>
      </div>
  );
}
