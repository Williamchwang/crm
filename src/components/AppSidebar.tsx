import { Users, Contact, Home, UserPlus, Ticket } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const menuItems = [{
  title: "仪表板",
  url: "/",
  icon: Home
}, {
  title: "客户",
  url: "/customers",
  icon: Users
}, {
  title: "联系人",
  url: "/contacts",
  icon: Contact
}, {
  title: "线索",
  url: "/leads",
  icon: UserPlus
}, {
  title: "工单",
  url: "/tickets",
  icon: Ticket
}];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-card to-card/95 border-r border-border/50 backdrop-blur-sm">
        {/* Logo */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg ring-1 ring-primary/20">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  CRM
                </h1>
                <p className="text-xs text-muted-foreground/80 font-medium">
                  客户关系管理平台
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground/70 tracking-wider uppercase mb-2">
              主要功能
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          end 
                          className={`
                            group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${active 
                              ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/30" 
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:shadow-sm"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                          `}
                        >
                          <item.icon className={`
                            h-5 w-5 transition-all duration-200
                            ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}
                            ${isCollapsed ? "" : "flex-shrink-0"}
                          `} />
                          {!isCollapsed && (
                            <span className={`
                              font-medium text-sm transition-colors duration-200 min-w-0 truncate
                              ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}
                            `}>
                              {item.title}
                            </span>
                          )}
                          {active && !isCollapsed && (
                            <div className="absolute right-2 w-1.5 h-1.5 bg-primary-foreground/80 rounded-full" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}