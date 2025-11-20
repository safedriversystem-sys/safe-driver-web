"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, Shield, Search, Mic, AlertTriangle, MessageSquare, Users, Bus, MapPin, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchResult {
  type: "driver" | "fleet" | "route" | "alert"
  id: string
  title: string
  subtitle: string
  href: string
}

export function AdminHeader() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(3)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      try {
        const query = searchQuery.toLowerCase().trim()
        const results: SearchResult[] = []

        // Search drivers
        try {
          const driversResponse = await fetch(`/api/drivers?search=${encodeURIComponent(query)}&limit=5`)
          if (driversResponse.ok) {
            const drivers = await driversResponse.json()
            drivers.forEach((driver: any) => {
              results.push({
                type: "driver",
                id: driver.id || driver.documentId,
                title: driver.name,
                subtitle: `License: ${driver.licenseNumber}${driver.busNumber ? ` • Bus: ${driver.busNumber}` : ""}`,
                href: `/drivers`,
              })
            })
          }
        } catch (error) {
          console.error("Error searching drivers:", error)
        }

        // Search fleet
        try {
          const fleetResponse = await fetch(`/api/fleet?search=${encodeURIComponent(query)}&limit=5`)
          if (fleetResponse.ok) {
            const vehicles = await fleetResponse.json()
            vehicles.forEach((vehicle: any) => {
              results.push({
                type: "fleet",
                id: vehicle.id || vehicle.documentId,
                title: vehicle.busNumberPlate || vehicle.busNumber || vehicle.documentId,
                subtitle: `${vehicle.model || "Vehicle"}${vehicle.route ? ` • Route: ${vehicle.route}` : ""}`,
                href: `/fleet`,
              })
            })
          }
        } catch (error) {
          console.error("Error searching fleet:", error)
        }

        // Search routes
        try {
          const routesResponse = await fetch(`/api/routes?search=${encodeURIComponent(query)}&limit=5`)
          if (routesResponse.ok) {
            const routes = await routesResponse.json()
            routes.forEach((route: any) => {
              results.push({
                type: "route",
                id: route.id || route.documentId,
                title: route.name,
                subtitle: `${route.startPoint} → ${route.endPoint}`,
                href: `/routes`,
              })
            })
          }
        } catch (error) {
          console.error("Error searching routes:", error)
        }

        setSearchResults(results.slice(0, 8)) // Limit to 8 results
        setShowResults(results.length > 0)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
        setShowResults(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && searchResults.length > 0) {
      router.push(searchResults[0].href)
      setSearchQuery("")
      setShowResults(false)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "driver":
        return <Users className="h-4 w-4" />
      case "fleet":
        return <Bus className="h-4 w-4" />
      case "route":
        return <MapPin className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
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
        <div className="hidden md:flex ml-8 flex-1 max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search drivers, vehicles, routes, alerts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowResults(true)
                  }
                }}
                className="pl-10 pr-4 bg-gray-50 w-full"
              />
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.id}-${index}`}
                    href={result.href}
                    onClick={() => {
                      setSearchQuery("")
                      setShowResults(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                      <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showResults && searchQuery.trim() && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <p className="text-sm text-gray-500 text-center">No results found</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5 text-gray-600" />
          </Button>

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
        <div className="mt-3 pb-2 md:hidden" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search drivers, vehicles, routes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowResults(true)
                  }
                }}
                className="pl-10 pr-4 bg-gray-50 w-full"
                autoFocus
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            </div>
          </form>

          {/* Mobile Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.id}-${index}`}
                    href={result.href}
                    onClick={() => {
                      setSearchQuery("")
                      setShowResults(false)
                      setIsSearchOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                      <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
