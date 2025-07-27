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
        <Sidebar className="bg-sidebar-primary text-sidebar-foreground border-r shadow-xl min-h-screen">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold text-sidebar-accent-foreground mb-2 tracking-wide">
                CMS Admin
              </SidebarGroupLabel>
              <SidebarMenu>
                {menu.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={active === item.key}
                      onClick={() => setActive(item.key)}
                      className={`w-full justify-start rounded-lg transition-colors px-3 py-2 my-1 font-medium ${
                        active === item.key
                          ? "bg-forest text-white shadow-md"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {active === item.key && (
                        <span className="ml-auto bg-white/80 text-forest text-xs px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
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
