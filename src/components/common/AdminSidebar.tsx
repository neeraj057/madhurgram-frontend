"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Store,
  LogOut,
  Sparkles,
  Clock,
  MessageSquare,
  ClipboardList,
  Undo2,
  Percent,
} from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Analytics", href: "/admin/analytics", icon: LayoutDashboard },
    { name: "Live Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Tax Settings", href: "/admin/tax-settings", icon: Percent },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Feedbacks", href: "/admin/feedback", icon: MessageSquare },
    { name: "Procurement", href: "/admin/procurement", icon: ClipboardList },
    { name: "Returns Portal", href: "/admin/returns", icon: Undo2 },
    { name: "Marketing", href: "/admin/marketing", icon: Sparkles },
    { name: "Recover Sales", href: "/admin/abandoned-carts", icon: Clock },
  ];

  return (
    <aside className="w-64 bg-[#161616] border-r border-gray-800 flex flex-col h-screen hidden md:flex shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-[#D4AF37]/10 flex items-center justify-center rounded-lg border border-[#D4AF37]/30">
            <Store className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <span className="font-serif text-lg font-bold text-[#FDFBF7] tracking-wide">MadhurGram</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Admin Console</p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                  : "text-gray-400 hover:text-[#FDFBF7] hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#D4AF37]" : "text-gray-500"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-all border border-transparent hover:border-red-900/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
};
