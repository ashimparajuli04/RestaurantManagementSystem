import { History, LayoutDashboard, PanelLeft, Search, Settings, Utensils, X } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Menu",
    url: "/menu",
    icon: Utensils,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
          {open && (
          <SidebarMenuItem>
            <div className="flex justify-between w-full">
              <div className="flex-3/4">
                <SidebarGroupLabel>NJ'S Cafe and Restaurant</SidebarGroupLabel>
                
              </div>
              <button
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 "
                >
                <X/>
              </button>
            </div>
            </SidebarMenuItem>
          )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={`transition-all ${open ? "px-5" : ""}`}>
              {!open && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => setOpen(true)}
                      className="flex items-center gap-2 w-full"
                    >
                      <PanelLeft />
                      <span>Toggle Sidebar</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}