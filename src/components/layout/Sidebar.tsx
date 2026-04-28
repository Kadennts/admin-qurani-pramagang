"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Bell,
  BookOpen,
  Building,
  ChevronRight,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  LayoutGrid,
  Map,
  MapPin,
  MessageSquare,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Settings,
  ShieldCheck,
  Tag,
  User,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

import { QuraniLogo } from "@/components/branding/qurani-logo";
import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { clearCurrentSessionProfileStorage } from "@/features/profile/account/model/profile-account.utils";

type MenuKey = "support" | "billing" | "admin" | "master" | null;

type NavLink = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export function Sidebar() {
  const pathname = usePathname();
  const { profile, t } = useAppPreferences();
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isMounted = true;
  const st = t;

  const avatarSrc = profile.avatar || "/img/profile admin.jpg";

  const derivedOpenMenu: MenuKey = pathname.includes("/master")
    ? "master"
    : pathname.includes("/support")
      ? "support"
      : pathname.includes("/billing")
        ? "billing"
        : pathname.includes("/admin")
          ? "admin"
          : null;

  const activeOpenMenu = isCollapsed ? openMenu : openMenu ?? derivedOpenMenu;

  const getSubLinkClass = (path: string) => {
    const isSectionMain = ["/dashboard/support", "/dashboard/billing", "/dashboard/admin", "/dashboard/master"].includes(path);
    const isActive = isSectionMain 
      ? pathname === path 
      : pathname === path || pathname.startsWith(`${path}/`);

    return [
      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
      isActive
        ? "bg-emerald-500/12 text-emerald-700 shadow-sm dark:bg-emerald-500/18 dark:text-emerald-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
    ].join(" ");
  };

  const mainDashboardClass = [
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all mb-4",
    pathname === "/dashboard"
      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white",
  ].join(" ");

  const supportLinks: NavLink[] = [
    { href: "/dashboard/support", label: st("sidebar.dashboard"), icon: LayoutGrid },
    { href: "/dashboard/support/tickets", label: st("sidebar.supportTickets"), icon: FileText },
    { href: "/dashboard/support/groups", label: st("sidebar.groups"), icon: Users },
    { href: "/dashboard/support/recitation", label: st("sidebar.recitation"), icon: BookOpen },
    { href: "/dashboard/support/kyc-member", label: st("sidebar.kycMember"), icon: UserCheck },
    { href: "/dashboard/support/kyc-organisasi", label: st("sidebar.kycOrganization"), icon: Building },
  ];

  const billingLinks: NavLink[] = [
    { href: "/dashboard/billing", label: st("sidebar.dashboard"), icon: LayoutGrid },
    { href: "/dashboard/billing/pesanan", label: st("sidebar.orders"), icon: DollarSign },
    { href: "/dashboard/billing/promo", label: st("sidebar.promo"), icon: Tag },
    { href: "/dashboard/billing/wallet", label: st("sidebar.wallet"), icon: Wallet },
  ];

  const adminLinks: NavLink[] = [
    { href: "/dashboard/admin", label: st("sidebar.dashboard"), icon: LayoutGrid },
    { href: "/dashboard/admin/users", label: st("sidebar.users"), icon: Users },
  ];

  const masterLinks: NavLink[] = [
    { href: "/dashboard/master", label: st("sidebar.dashboard"), icon: LayoutGrid },
    { href: "/dashboard/master/countries", label: st("sidebar.countries"), icon: Globe },
    { href: "/dashboard/master/states", label: st("sidebar.states"), icon: Map },
    { href: "/dashboard/master/cities", label: st("sidebar.cities"), icon: MapPin },
    { href: "/dashboard/master/currencies", label: st("sidebar.currencies"), icon: DollarSign },
    { href: "/dashboard/master/languages", label: st("sidebar.languages"), icon: Languages },
    { href: "/dashboard/master/taxes", label: st("sidebar.taxRates"), icon: Percent },
    { href: "/dashboard/master/pesanan", label: st("sidebar.orders"), icon: DollarSign },
    { href: "/dashboard/master/guru", label: st("sidebar.teacher"), icon: GraduationCap },
    { href: "/dashboard/master/paket", label: st("sidebar.package"), icon: Package },
    { href: "/dashboard/master/payout", label: st("sidebar.payout"), icon: Banknote },
  ];

  const navGroups: Array<{
    id: Exclude<MenuKey, null>;
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    links: NavLink[];
  }> = [
    { id: "support", icon: MessageSquare, label: st("sidebar.support"), links: supportLinks },
    { id: "billing", icon: CreditCard, label: st("sidebar.billing"), links: billingLinks },
    { id: "admin", icon: ShieldCheck, label: st("sidebar.administrator"), links: adminLinks },
    { id: "master", icon: Database, label: st("sidebar.masterData"), links: masterLinks },
  ];

  const toggleMenu = (menu: MenuKey) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const handleLogout = () => {
    document.cookie = "myqurani_access_token=; path=/; max-age=0";
    document.cookie = "myqurani_user=; path=/; max-age=0";
    clearCurrentSessionProfileStorage();
    window.location.href = "/login";
  };

  const NavGroup = ({
    id,
    icon: Icon,
    label,
    links,
  }: {
    id: Exclude<MenuKey, null>;
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    links: NavLink[];
  }) => {
    const isActive = pathname.includes(`/${id}`);
    const isOpen = activeOpenMenu === id;

    if (isCollapsed) {
      return (
        <div className="relative mb-2 flex justify-center">
          <button
            type="button"
            onClick={() => toggleMenu(id)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
              isActive || isOpen
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
            ].join(" ")}
          >
            <Icon size={18} />
          </button>

          {isOpen ? (
            <div className="absolute left-[60px] top-0 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-2 border-b border-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                {label}
              </div>
              <div className="space-y-1">
                {links.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} className={getSubLinkClass(link.href)}>
                      <LinkIcon size={16} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleMenu(id)}
          className={[
            "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
            isOpen
              ? "bg-slate-100 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className={isActive ? "text-emerald-600 dark:text-emerald-400" : ""} />
            <span>{label}</span>
          </div>
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
        </button>

        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="ml-3 space-y-1 border-l border-slate-200 py-1 pl-4 dark:border-slate-800">
              {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className={getSubLinkClass(link.href)}>
                    <LinkIcon size={16} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={[
        "z-30 flex h-screen flex-shrink-0 flex-col border-r border-slate-200 bg-white/95 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/95",
        isCollapsed ? "w-[84px]" : "w-[280px]",
      ].join(" ")}
    >
      <div
        className={[
          "sticky top-0 z-10 flex h-20 shrink-0 items-center border-b border-slate-100 bg-white/95 transition-all dark:border-slate-800 dark:bg-slate-950/95",
          isCollapsed ? "justify-center px-2" : "px-6",
        ].join(" ")}
      >
        <QuraniLogo href="/dashboard" collapsed={isCollapsed} priority />
      </div>

      <nav
        className={[
          "flex-1 pb-4",
          isCollapsed ? "overflow-visible px-2 pt-4" : "hide-scrollbar overflow-y-auto px-4 pt-4",
        ].join(" ")}
      >
        {isCollapsed ? (
          <div className="mb-2 flex justify-center">
            <Link
              href="/dashboard"
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                pathname === "/dashboard"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
              ].join(" ")}
            >
              <LayoutGrid size={18} />
            </Link>
          </div>
        ) : (
          <Link href="/dashboard" className={mainDashboardClass}>
            <LayoutGrid size={18} />
            <span>{st("sidebar.dashboard")}</span>
          </Link>
        )}

        {navGroups.map((group) => (
          <NavGroup
            key={group.id}
            id={group.id}
            icon={group.icon}
            label={group.label}
            links={group.links}
          />
        ))}

        {isCollapsed ? (
          <div className="mb-2 flex justify-center">
            <Link
              href="/dashboard/notifications"
              title={st("sidebar.notifications")}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                pathname.includes("/notifications")
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
              ].join(" ")}
            >
              <Bell size={18} />
            </Link>
          </div>
        ) : (
          <Link
            href="/dashboard/notifications"
            className={[
              "mb-4 flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname.includes("/notifications")
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <Bell size={18} />
              <span>{st("sidebar.notifications")}</span>
            </div>
          </Link>
        )}

        {isCollapsed ? (
          <div className="mb-2 flex justify-center">
            <Link
              href="/dashboard/settings"
              title={st("sidebar.settings")}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                pathname.includes("/settings")
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
              ].join(" ")}
            >
              <Settings size={18} />
            </Link>
          </div>
        ) : (
          <Link
            href="/dashboard/settings"
            className={[
              "mb-4 flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname.includes("/settings")
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span>{st("sidebar.settings")}</span>
            </div>
          </Link>
        )}
      </nav>

      <div
        className={[
          "border-t border-slate-200 bg-white/95 p-4 transition-all dark:border-slate-800 dark:bg-slate-950/95",
          isCollapsed ? "flex flex-col items-center" : "",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => {
            setIsCollapsed((current) => !current);
            setOpenMenu(null);
            setIsProfileOpen(false);
          }}
          className={[
            "mb-3 flex items-center justify-center transition-colors",
            isCollapsed
              ? "h-9 w-9 rounded-full text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              : "w-full gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
          ].join(" ")}
          title={isCollapsed ? st("sidebar.expandSidebar") : st("sidebar.closeSidebar")}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={16} />}
          {!isCollapsed ? <span>{st("sidebar.closeSidebar")}</span> : null}
        </button>

        <div className={`relative ${isCollapsed ? "flex w-full justify-center" : "w-full"}`}>
          {isProfileOpen ? (
            <div className="absolute bottom-[calc(100%+10px)] left-0 z-50 w-52 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400"
              >
                <User size={16} className="mr-3" />
                {st("sidebar.profile")}
              </Link>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <ChevronRight size={16} className="mr-3 rotate-180" />
                {st("sidebar.logout")}
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setIsProfileOpen((current) => !current)}
            className={[
              "flex w-full items-center gap-3 rounded-2xl transition-colors",
              isCollapsed
                ? "justify-center p-1"
                : "px-1 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900",
            ].join(" ")}
          >
            {!isMounted ? (
              <>
                <div className="h-11 w-11 rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
                {!isCollapsed ? (
                  <div className="min-w-0 flex-1 flex flex-col items-start gap-1 justify-center">
                    <div className="h-4 w-24 divide-y rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Image
                  src={avatarSrc}
                  alt={profile.name}
                  width={44}
                  height={44}
                  className={`${isCollapsed ? "h-9 w-9" : "h-11 w-11"} rounded-full border border-slate-200 object-cover shadow-sm dark:border-slate-700`}
                  unoptimized={avatarSrc.startsWith("data:")}
                />
                {!isCollapsed ? (
                  <>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {profile.name}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        @{profile.username}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-slate-400 transition-transform dark:text-slate-500 ${isProfileOpen ? "rotate-90" : ""}`}
                    />
                  </>
                ) : null}
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
