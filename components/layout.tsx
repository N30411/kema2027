"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  MapPin,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react"

interface SidebarLink {
  icon: React.ReactNode
  label: string
  href: string
}

const sidebarLinks: SidebarLink[] = [
  { icon: <BarChart3 size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <Users size={20} />, label: "Supporters", href: "/supporters" },
  { icon: <Users size={20} />, label: "Agents", href: "/agents" },
  { icon: <MapPin size={20} />, label: "Wards", href: "/wards" },
  { icon: <MapPin size={20} />, label: "LLGs", href: "/llgs" },
  { icon: <TrendingUp size={20} />, label: "Events", href: "/events" },
  { icon: <BarChart3 size={20} />, label: "Population & Stats", href: "/info/population" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => pathname.startsWith(href)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Prevent body scroll when sidebar is open (mobile)
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap for sidebar (mobile)
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded lg:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        ref={sidebarRef}
        tabIndex={-1}
        aria-modal={isOpen}
        role="dialog"
        className={`fixed left-0 top-0 h-screen w-64 transform bg-gradient-navy transition-transform duration-300 ease-in-out z-50 lg:static lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="border-b border-navy-600 p-6">
            <h1 className="text-lg font-bold text-gold-500">
              Honlly Isaac
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Morobe Regional Campaign
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 p-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 ${
                  isActive(link.href)
                    ? "bg-gold-500 text-navy-900 font-semibold"
                    : "text-gray-300 hover:bg-navy-600"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-navy-600 p-4 space-y-2">
            <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-navy-600 transition-colors duration-200">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-colors duration-200">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar overlay"
          tabIndex={0}
          role="button"
        />
      )}
    </>
  )
}

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function AppLayout({ children, title }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-navy-900">
      <Sidebar />
      <main className="flex-1 pt-4 px-2 sm:px-4 lg:pt-0">
        <div className="max-w-7xl mx-auto w-full">
          {title && (
            <div className="mb-6 pt-12 lg:pt-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
