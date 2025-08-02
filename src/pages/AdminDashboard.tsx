import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  Gift,
  Image as ImageIcon,
  List,
  Youtube,
  Target,
  FileText,
  Leaf,
  Shield,
} from "lucide-react";
import DonasiTable from "./admin/DonasiTable";
import UsersTable from "./admin/UsersTable";
import EventsTable from "./admin/EventsTable";
import GalleryTable from "./admin/GalleryTable";
import VideosTable from "./admin/VideosTable";
import ProgramsTable from "./admin/ProgramsTable";
import BlogPostsTable from "./admin/BlogPostsTable";

const menu = [
  { key: "donasi", label: "Donasi", icon: <Gift className="w-4 h-4" /> },
  { key: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  { key: "events", label: "Events", icon: <List className="w-4 h-4" /> },
  { key: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
  { key: "videos", label: "Videos", icon: <Youtube className="w-4 h-4" /> },
  { key: "programs", label: "Programs", icon: <Target className="w-4 h-4" /> },
  { key: "blog", label: "Blog", icon: <FileText className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("donasi");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-background to-secondary/30">
        <Sidebar className="border-0 shadow-2xl shadow-green-900/10 min-h-screen">
          <div className="h-full bg-gradient-to-b from-green-800 via-emerald-700 to-green-900 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 -left-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-1/4 -right-8 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl animate-pulse"></div>
            </div>

            <SidebarContent className="relative z-10">
              <SidebarGroup className="p-6">
                {/* Header dengan logo */}
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <SidebarGroupLabel className="text-xl font-bold text-white mb-1 tracking-wide block">
                    CMS Admin
                  </SidebarGroupLabel>
                  <p className="text-green-100/80 text-sm font-medium">
                    Dashboard Colo Sagu
                  </p>
                </div>

                <SidebarMenu className="space-y-2">
                  {menu.map((item, index) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={active === item.key}
                        onClick={() => setActive(item.key)}
                        className={`w-full justify-start rounded-xl transition-all duration-300 px-4 py-3 my-1 font-medium group relative overflow-hidden ${
                          active === item.key
                            ? "bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30"
                            : "hover:bg-white/10 hover:backdrop-blur-sm text-green-100 hover:text-white hover:shadow-md"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Icon dengan efek glow */}
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                            active === item.key
                              ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30"
                              : "group-hover:bg-white/20"
                          }`}
                        >
                          {item.icon}
                        </div>

                        <span className="ml-3 font-semibold">{item.label}</span>

                        {/* Active indicator - SAMA SEPERTI ASLI */}
                        {active === item.key && (
                          <span className="ml-auto bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                            Aktif
                          </span>
                        )}

                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                {/* Footer dengan info */}
                <div className="mt-auto pt-6 border-t border-white/20">
                  <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Admin Panel
                      </p>
                      <p className="text-green-100/70 text-xs">
                        Sistem Terpadu
                      </p>
                    </div>
                  </div>
                </div>
              </SidebarGroup>
            </SidebarContent>
          </div>
        </Sidebar>
        <SidebarInset>
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-8 min-h-screen">
            {active === "donasi" && <DonasiTable />}
            {active === "users" && <UsersTable />}
            {active === "events" && <EventsTable />}
            {active === "gallery" && <GalleryTable />}
            {active === "videos" && <VideosTable />}
            {active === "programs" && <ProgramsTable />}
            {active === "blog" && <BlogPostsTable />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
