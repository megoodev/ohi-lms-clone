"use client";

import { IconCirclePlusFilled } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

export function NavMain({ items }: { items: { title: string; url: string; icon?: React.ElementType }[] }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center ">
            <SidebarMenuButton
              asChild
              tooltip="Quick Create"
              className="min-w-8 duration-200 ease-linear"
            >
              {pathname.startsWith("/admin") && (
                <Link
                  href={`/admin/courses/create`}
                  className={cn(
                    pathname === "/admin/courses/create" && "text-primary",
                    "flex items-center gap-3 text-sm tracking-tight"
                  )}
                >
                  <IconCirclePlusFilled
                    className={cn(
                      pathname === "/admin/courses/create" &&
                      "text-destructive",
                      "size-10"
                    )}
                  />

                  <span>Quick Create</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className={cn(
                    pathname === item.url && "text-primary",
                    "flex items-center gap-3 text-sm tracking-tight"
                  )}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        pathname === item.url && "text-destructive"
                      )}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
