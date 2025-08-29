"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { BarChart3, MessageSquare, RefreshCw, Download, Home } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Reviews",
      href: "/dashboard/reviews",
      icon: MessageSquare,
      current: pathname === "/dashboard/reviews",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      current: pathname === "/dashboard/analytics",
    },
  ]

  const handleRefresh = () => {
    window.location.reload()
  }

  const getPageTitle = () => {
    if (pathname === "/dashboard/reviews") return "Reviews"
    if (pathname === "/dashboard/analytics") return "Analytics"
    return "Dashboard"
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-white">
        <SidebarHeader className="border-b border-brand-sage">
          <div className="flex items-center space-x-2 px-2 py-1">
            <h1 className="text-lg font-bold text-brand-dark group-data-[collapsible=icon]:hidden">Flex Living</h1>
            <Badge variant="secondary" className="group-data-[collapsible=icon]:hidden bg-brand-sage text-brand-dark">
              Manager
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.current}
                        tooltip={item.name}
                        className="data-[active=true]:bg-brand-teal data-[active=true]:text-white hover:bg-brand-sage hover:text-brand-teal"
                      >
                        <Link href={item.href}>
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-brand-sage">
          <div className="flex items-center space-x-2 p-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:space-x-0 group-data-[collapsible=icon]:space-y-2 group-data-[collapsible=icon]:justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 bg-transparent border-brand-sage hover:bg-brand-sage hover:text-brand-teal"
            >
              <RefreshCw className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
              <span className="group-data-[collapsible=icon]:hidden">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 bg-transparent border-brand-sage hover:bg-brand-sage hover:text-brand-teal"
            >
              <Download className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
              <span className="group-data-[collapsible=icon]:hidden">Export</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <DashboardHeader title={getPageTitle()} />

        <div className="min-h-screen bg-white">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
