import {
  RiBrainFill as BrainIcon,
  RiChatAiFill as ChatIcon,
  RiDashboardFill as DashboardIcon,
  RiExchange2Fill as GraphIcon,
  RiQuestionLine as HelpIcon,
  RiFundsBoxFill as MemoryUsageIcon,
  RiMenuSearchLine as SearchIcon,
  RiEqualizer2Line as SettingsIcon,
} from "@remixicon/react";

import type * as React from "react";

import { LayerSwitcher } from "@/components/dashboard/layer-switcher";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Puru Dahal",
    email: "puru@memorylayer.dev",
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
    },
    {
      title: "Memories",
      url: "/dashboard/memories",
      icon: BrainIcon,
    },
    {
      title: "Memory Lane",
      url: "/dashboard/memory-lane",
      icon: ChatIcon,
    },
    {
      title: "Memory Graph",
      url: "/dashboard/memory-graph",
      icon: GraphIcon,
    },
    {
      title: "Memory Usage",
      url: "/dashboard/memory-usage",
      icon: MemoryUsageIcon,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <LayerSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
