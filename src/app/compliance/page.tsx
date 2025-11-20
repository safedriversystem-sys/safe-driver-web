"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Search,
  Filter,
  User,
  Bus,
  Calendar,
  ThumbsUp,
} from "lucide-react"
import type { Feedback } from "@/lib/feedback-service"

export default function CompliancePage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")

  // Fetch feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== "all") params.append("status", statusFilter)
        if (typeFilter !== "all") params.append("type", typeFilter)
        if (priorityFilter !== "all") params.append("priority", priorityFilter)
        if (searchTerm) params.append("search", searchTerm)
        params.append("limit", "100")

        const response = await fetch(`/api/feedback?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setFeedback(data)
          setFilteredFeedback(data)
        }
      } catch (error) {
        console.error("Error fetching feedback:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
    // Refresh every 30 seconds
    const interval = setInterval(fetchFeedback, 30000)
    return () => clearInterval(interval)
  }, [statusFilter, typeFilter, priorityFilter, searchTerm])

  // Calculate stats
  const stats = {
    total: feedback.length,
    submitted: feedback.filter((f) => f.status === "submitted").length,
    resolved: feedback.filter((f) => f.status === "resolved").length,
    positive: feedback.filter((f) => f.type === "positive").length,
    negative: feedback.filter((f) => f.type === "negative" || f.type === "complaint").length,
    averageRating:
      feedback.length > 0
        ? Math.round(
            (feedback.reduce((sum, f) => sum + (f.rating?.overall || 0), 0) / feedback.length) * 10,
          ) / 10
        : 0,
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "acknowledged":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
      case "complaint":
        return "bg-red-100 text-red-800"
      case "suggestion":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const handleStatusUpdate = async (id: string, status: Feedback["status"]) => {
    try {
      const docId = id
      const response = await fetch(`/api/feedback/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        const updated = await response.json()
        setFeedback((prev) =>
          prev.map((f) => {
            const fId = f.id || f.documentId
            return fId === id ? { ...f, ...updated } : f
          }),
        )
        setFilteredFeedback((prev) =>
          prev.map((f) => {
            const fId = f.id || f.documentId
            return fId === id ? { ...f, ...updated } : f
          }),
        )
      }
    } catch (error) {
      console.error("Error updating feedback status:", error)
    }
  }

  const handleAddResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) return

    try {
      const id = selectedFeedback.id || selectedFeedback.documentId
      if (!id) return

      const response = await fetch(`/api/feedback/${id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: responseText,
          respondedBy: "Admin User",
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setFeedback((prev) =>
          prev.map((f) => {
            const fId = f.id || f.documentId
            return fId === id ? { ...f, ...updated } : f
          }),
        )
        setFilteredFeedback((prev) =>
          prev.map((f) => {
            const fId = f.id || f.documentId
            return fId === id ? { ...f, ...updated } : f
          }),
        )
        setIsDialogOpen(false)
        setResponseText("")
        setSelectedFeedback(null)
      }
    } catch (error) {
      console.error("Error adding response:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 pt-20 space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-sm text-gray-600">View and manage customer feedback and complaints</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All feedback items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Completed feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search feedback..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Items</CardTitle>
          <CardDescription>Manage and respond to customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">Loading feedback...</div>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">No feedback found</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedback.map((item) => (
                <div
                  key={item.id || item.documentId}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.title || "Untitled Feedback"}</h3>
                        <Badge className={getStatusColor(item.status)}>{item.status || "submitted"}</Badge>
                        <Badge className={getTypeColor(item.type)}>{item.type || "general"}</Badge>
                        {item.priority && (
                          <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description || item.comment || "No description"}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        {item.userName && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.isAnonymous ? "Anonymous" : item.userName}</span>
                          </div>
                        )}
                        {item.busNumber && (
                          <div className="flex items-center gap-1">
                            <Bus className="h-3 w-3" />
                            <span>{item.busNumber}</span>
                          </div>
                        )}
                        {item.timestamp && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                        )}
                        {item.rating?.overall && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating.overall}/5</span>
                          </div>
                        )}
                        {item.helpfulCount !== undefined && item.helpfulCount > 0 && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{item.helpfulCount}</span>
                          </div>
                        )}
                      </div>
                      {item.response && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-medium text-blue-900 mb-1">Response:</p>
                          <p className="text-sm text-blue-800">{item.response}</p>
                          {item.respondedBy && (
                            <p className="text-xs text-blue-600 mt-1">By {item.respondedBy}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {item.status !== "resolved" && (
                        <Dialog
                          open={
                            isDialogOpen &&
                            (selectedFeedback?.id === item.id ||
                              selectedFeedback?.documentId === item.documentId ||
                              selectedFeedback?.id === item.documentId ||
                              selectedFeedback?.documentId === item.id)
                          }
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedFeedback(item)
                                setIsDialogOpen(true)
                              }}
                            >
                              Respond
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Respond to Feedback</DialogTitle>
                              <DialogDescription>
                                Add a response to this feedback item. This will mark it as resolved.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Feedback:</p>
                                <p className="text-sm text-gray-600">{item.description || item.comment}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Your Response:</label>
                                <Textarea
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  placeholder="Enter your response..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddResponse}>Send Response</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {item.status === "submitted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(item.id || item.documentId || "", "acknowledged")}
                        >
                          Acknowledge
                        </Button>
                      )}
                      {item.status === "acknowledged" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(item.id || item.documentId || "", "resolved")}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

