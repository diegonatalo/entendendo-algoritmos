import { Sidebar } from "@/components/sidebar";

/** Os capítulos moram em `/app`; a landing fica em `/`. */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-64">{children}</div>
    </>
  );
}
