"use client";
import logo from "@/../public/logo.png";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ToggleMode } from "@/components/ui/toggleMode";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import UserDropDown from "./UserDropDown";

// Navigation links array to be used in both desktop and mobile menus
interface NavigationProps {
  href: string;
  label: string;
  active?: boolean;
}
const navigationLinks: NavigationProps[] = [
  { href: "/", label: "Home", active: true },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { data: session } = authClient.useSession();
  return (
    <header className="border-b px-4 md:px-6 sticky">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-primary hover:text-primary/90 flex gap-3 items-center font-semibold text-xl"
            >
              <Image src={logo} alt="logo" className="size-9" />
              LMS
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={link.active}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <ToggleMode />
          {session ? (
            <UserDropDown
              email={session?.user.email}
              name={session?.user.name}
              image={session?.user.image  || ''}
            />
          ) : (
            <>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href="/login"
              >
                Sign In
              </Link>
              <Link className={buttonVariants({ size: "lg" })} href="/courses">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
