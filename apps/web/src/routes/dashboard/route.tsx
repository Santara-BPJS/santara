import { authClient } from "@/shared/lib/auth-client";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  SearchIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { Input } from "../../shared/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../../shared/components/ui/sidebar";
import UserMenu from "../../shared/components/user-menu";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }

    // Redirect to /dashboard/home if accessing /dashboard exactly
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      redirect({
        to: "/dashboard/home",
        throw: true,
      });
    }

    return { session };
  },
});

function RouteComponent() {
  const {
    location: { pathname },
  } = useRouterState();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-16 justify-center border-b">
          <Link className="flex items-center gap-2 font-bold text-xl" to="/">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span>Santara</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {[
                {
                  label: "Home",
                  to: "/dashboard/home",
                  icon: HomeIcon,
                },
                {
                  label: "Chat",
                  to: "/dashboard/chat",
                  icon: MessageCircleIcon,
                },
                {
                  label: "Sumber Pengetahuan",
                  to: "/dashboard/knowledge-sources",
                  icon: FileTextIcon,
                },
                {
                  label: "Whatsapp Bot",
                  to: "/dashboard/whatsapp-bot",
                  icon: MessageSquareIcon,
                },
                {
                  label: "Manajemen Pengguna",
                  to: "/dashboard/user-management",
                  icon: UsersIcon,
                },
                {
                  label: "AI Agent",
                  to: "/dashboard/ai-agent",
                  icon: ZapIcon,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.to)}
                      size="lg"
                    >
                      <Link preload="render" to={item.to}>
                        <Icon /> {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        navigate({
                          to: "/",
                        });
                      },
                    },
                  });
                }}
                size="lg"
              >
                <LogOutIcon /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="[--header-height:4rem]">
        <header className="sticky top-0 flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="relative w-sm">
            <Input
              className="peer ps-9"
              placeholder="Tekan '/' untuk mencari"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <SearchIcon aria-hidden="true" size={16} />
            </div>
          </div>
          <UserMenu />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
