"use client"

import { LayoutDashboard, Users, Newspaper, Settings, ChevronLeft, User2, ChevronUp, LogOut, ChevronDown } from 'lucide-react'
import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, SidebarGroupLabel } from '@/components/ui/sidebar'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'


export default function AdminSidebar() {
  const { data: session } = useSession();

  // We'll separate the links into groups for better organization
  const mainLinks = [
      { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  ];

  const managementLinks = [
      { title: 'Manage Users', href: '/admin/users', icon: Users },
      { title: 'Manage Ads', href: '/admin/ads', icon: Newspaper },
  ];

  return (
    <Sidebar collapsible='icon'>
        <SidebarHeader className='py-4'>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/admin/dashboard">
                            <span className="font-bold text-lg">TG Admin</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator/>

        <SidebarContent>
            {/* Main Links (not collapsible) */}
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {mainLinks.map(item => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            {/* Collapsible Management Section */}
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                {/* The clickable trigger for the collapsible section */}
                <SidebarGroupLabel asChild> 
                  <CollapsibleTrigger className="w-full">
                    Management
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>    
                </SidebarGroupLabel>
                
                {/* The content that will be shown or hidden */}
                <CollapsibleContent> 
                  <SidebarGroupContent>
                      <SidebarMenu>
                          {managementLinks.map(item => (
                              <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton asChild>
                                      <Link href={item.href}>
                                          <item.icon className="h-4 w-4" />
                                          <span>{item.title}</span>
                                      </Link>
                                  </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                      </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>


    {/* Collapsible Management Section */}
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                {/* The clickable trigger for the collapsible section */}
                <SidebarGroupLabel asChild> 
                  <CollapsibleTrigger className="w-full">
                    Management
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>    
                </SidebarGroupLabel>
                
                {/* The content that will be shown or hidden */}
                <CollapsibleContent> 
                  <SidebarGroupContent>
                      <SidebarMenu>
                          {managementLinks.map(item => (
                              <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton asChild>
                                      <Link href={item.href}>
                                          <item.icon className="h-4 w-4" />
                                          <span>{item.title}</span>
                                      </Link>
                                  </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                      </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>



            {/* Settings Link */}
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/settings">
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/ads">
                            <ChevronLeft className="h-4 w-4" />
                            <span>Back to Site</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                                <User2 className="h-4 w-4"/> 
                                <span>{session?.user?.name}</span>
                                <ChevronUp className='ml-auto'/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="top" sideOffset={10}>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings">
                                    <Settings className='h-4 w-4 mr-2'/>Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                <LogOut className='h-4 w-4 mr-2'/>Signout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>   
    </Sidebar>
  )
}