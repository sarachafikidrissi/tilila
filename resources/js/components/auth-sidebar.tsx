import { Link } from '@inertiajs/react';
import { Home, LogIn, UserPlus } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home, login } from '@/routes';
import type { NavItem } from '@/types';

const authNavItems: NavItem[] = [
    {
        title: 'Home',
        href: home.url(),
        icon: Home,
    },
    {
        title: 'Log in',
        href: login.url(),
        icon: LogIn,
    },
    {
        title: 'Request account',
        href: '/register',
        icon: UserPlus,
    },
];

export function AuthSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarMenu>
                        {authNavItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {Icon && <Icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 text-xs text-sidebar-foreground/70">
                <p className="leading-snug">
                    Secure access to your Tilila account.
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
