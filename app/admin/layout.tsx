import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";



export const metadata: Metadata = {
  title: "Admin Dashboard | TG Marketplace",
  description: "Manage users, ads, and settings.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This logic persists the sidebar's open/closed state in a cookie
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <div className="flex bg-background min-h-screen">
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
      > 
        <SidebarProvider defaultOpen={defaultOpen}> 
            <AdminSidebar /> 
            <main className="w-full">
              <AdminNavbar />
              <div className="p-4 md:p-8">
                {children}
                     

              </div>
            </main>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}