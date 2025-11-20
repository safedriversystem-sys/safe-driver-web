"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, Shield, RefreshCw, Search, Mic, AlertTriangle, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { OfflineStatusBadge } from "@/components/offline-indicator"

export function AdminHeader() {
  const [notifications, setNotifications] = useState(3)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-7 w-7 text-primary-600" />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">SafeDriver</h1>
              <p className="text-xs text-gray-500 hidden md:block">Transport Safety Management</p>
            </div>
          </div>
        </div>

        {/* Desktop Search - hidden on mobile */}
        <div className="hidden md:flex ml-8 relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-10 bg-gray-50" />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Emergency Button - Prominent */}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            asChild
          >
            <Link href="/emergency">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Emergency</span>
            </Link>
          </Button>

          {/* Communication Button */}
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            asChild
          >
            <Link href="/communication">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Chat</span>
            </Link>
          </Button>

          {/* Refresh Button - hidden on small mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hidden sm:flex"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>

          {/* Offline Status Badge */}
          <div className="hidden sm:block">
            <OfflineStatusBadge />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@safedriver.com</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 border-b">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@safedriver.com</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/voice-settings" className="cursor-pointer flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/communication" className="cursor-pointer flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Communication
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/emergency" className="cursor-pointer flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Response
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search - Expandable */}
      {isSearchOpen && (
        <div className="mt-3 pb-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-50 w-full"
              autoFocus
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 100)}
            />
          </div>
        </div>
      )}
    </header>
  )
}
