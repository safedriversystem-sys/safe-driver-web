"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, BarChart3, Users, AlertTriangle, CalendarIcon, Printer, PieChart } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { generatePDFReport } from "@/lib/pdf-generator"

const reportTemplates = [
  {
    id: "daily-summary",
    name: "Daily Safety Summary",
    description: "Comprehensive daily report of all safety incidents and metrics with visual charts",
    category: "Safety",
    frequency: "Daily",
    icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "driver-performance",
    name: "Driver Performance Report",
    description: "Individual driver safety scores and incident history with performance charts",
    category: "Performance",
    frequency: "Weekly",
    icon: <Users className="h-5 w-5 text-green-500" />,
  },
  {
    id: "fleet-analytics",
    name: "Fleet Analytics Report",
    description: "Vehicle-wise safety metrics and maintenance alerts with route analysis charts",
    category: "Fleet",
    frequency: "Monthly",
    icon: <PieChart className="h-5 w-5 text-orange-500" />,
  },
  {
    id: "route-safety",
    name: "Route Safety Analysis",
    description: "Route-specific incident patterns and risk assessment with radar charts",
    category: "Analytics",
    frequency: "Monthly",
    icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
  },
  {
    id: "compliance",
    name: "Regulatory Compliance Report",
    description: "Compliance status with transport authority regulations and visual metrics",
    category: "Compliance",
    frequency: "Quarterly",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "incident-detailed",
    name: "Detailed Incident Report",
    description: "In-depth analysis of specific safety incidents with distribution charts",
    category: "Incidents",
    frequency: "On-demand",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
  },
]

const recentReports = [
  {
    id: "RPT001",
    name: "Daily Safety Summary - Jan 9, 2025",
    type: "daily-summary",
    generatedAt: "2025-01-09 23:59:59",
    size: "2.4 MB",
    status: "completed",
  },
  {
    id: "RPT002",
    name: "Driver Performance - Week 1, Jan 2025",
    type: "driver-performance",
    generatedAt: "2025-01-08 18:30:00",
    size: "1.8 MB",
    status: "completed",
  },
  {
    id: "RPT003",
    name: "Fleet Analytics - December 2024",
    type: "fleet-analytics",
    generatedAt: "2025-01-01 09:00:00",
    size: "3.2 MB",
    status: "completed",
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async (reportType: string, customData?: any) => {
    setIsGenerating(true)

    try {
      // Get report data based on type
      const reportData = getReportData(reportType)

      // Generate PDF using the new PDF generator
      await generatePDFReport({
        type: reportType,
        title: reportTemplates.find((t) => t.id === reportType)?.name || "SafeDriver Report",
        dateRange: dateFrom && dateTo ? `${format(dateFrom, "PPP")} - ${format(dateTo, "PPP")}` : "All Time",
        data: reportData,
        format: reportFormat,
      })
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getReportData = (reportType: string) => {
    // Mock data - in real implementation, this would fetch from API
    const baseData = {
      summary: {
        totalAlerts: 156,
        activeDrivers: 24,
        safetyScore: 92,
        systemUptime: 99.8,
        totalBuses: 19,
        activeRoutes: 8,
      },
      alerts: [
        { type: "Drowsiness Detection", count: 89, high: 23, medium: 45, low: 21, avgResponse: "1.8 min" },
        { type: "Phone Usage", count: 45, high: 8, medium: 25, low: 12, avgResponse: "2.1 min" },
        { type: "Driver Distraction", count: 22, high: 3, medium: 12, low: 7, avgResponse: "1.5 min" },
        { type: "Speeding", count: 18, high: 5, medium: 8, low: 5, avgResponse: "1.2 min" },
        { type: "Harsh Braking", count: 12, high: 2, medium: 6, low: 4, avgResponse: "2.0 min" },
      ],
      drivers: [
        {
          name: "Kamal Perera",
          license: "B1234567",
          bus: "NB-1234",
          route: "Colombo - Kandy",
          score: 75,
          alerts: 8,
          status: "Active",
        },
        {
          name: "Sunil Silva",
          license: "B2345678",
          bus: "WP-5678",
          route: "Galle - Matara",
          score: 92,
          alerts: 3,
          status: "Active",
        },
        {
          name: "Nimal Fernando",
          license: "B3456789",
          bus: "CP-9012",
          route: "Negombo - Colombo",
          score: 98,
          alerts: 1,
          status: "Active",
        },
        {
          name: "Ravi Kumara",
          license: "B4567890",
          bus: "SP-3456",
          route: "Kandy - Nuwara Eliya",
          score: 88,
          alerts: 4,
          status: "Active",
        },
        {
          name: "Saman Jayasinghe",
          license: "B5678901",
          bus: "UP-7890",
          route: "Anuradhapura - Polonnaruwa",
          score: 85,
          alerts: 6,
          status: "On Break",
        },
      ],
      routes: [
        {
          name: "Colombo - Kandy",
          buses: 8,
          drivers: 8,
          score: 75,
          riskAreas: "Kadawatha Junction, Kegalle",
          distance: "115 km",
        },
        { name: "Galle - Matara", buses: 6, drivers: 6, score: 92, riskAreas: "Hikkaduwa Curve", distance: "45 km" },
        { name: "Negombo - Colombo", buses: 5, drivers: 5, score: 98, riskAreas: "None identified", distance: "37 km" },
        {
          name: "Kandy - Nuwara Eliya",
          buses: 4,
          drivers: 4,
          score: 88,
          riskAreas: "Gampola Hills",
          distance: "78 km",
        },
        {
          name: "Anuradhapura - Polonnaruwa",
          buses: 3,
          drivers: 3,
          score: 85,
          riskAreas: "Habarana Junction",
          distance: "104 km",
        },
      ],
      incidents: [
        {
          id: "INC001",
          date: "2025-01-09",
          time: "14:30",
          driver: "Kamal Perera",
          type: "Drowsiness",
          severity: "High",
          location: "Kadawatha",
          resolved: true,
        },
        {
          id: "INC002",
          date: "2025-01-09",
          time: "16:45",
          driver: "Sunil Silva",
          type: "Phone Usage",
          severity: "Medium",
          location: "Hikkaduwa",
          resolved: true,
        },
        {
          id: "INC003",
          date: "2025-01-08",
          time: "09:15",
          driver: "Ravi Kumara",
          type: "Speeding",
          severity: "High",
          location: "Gampola",
          resolved: true,
        },
        {
          id: "INC004",
          date: "2025-01-08",
          time: "11:20",
          driver: "Saman Jayasinghe",
          type: "Harsh Braking",
          severity: "Medium",
          location: "Habarana",
          resolved: false,
        },
      ],
      compliance: {
        driverLicenseValidity: 95,
        vehicleInspections: 88,
        safetyTraining: 92,
        emergencyProtocols: 96,
        dataReporting: 99,
      },
    }

    // Customize data based on report type
    switch (reportType) {
      case "driver-performance":
        return { ...baseData, focus: "drivers" }
      case "fleet-analytics":
        return { ...baseData, focus: "fleet" }
      case "route-safety":
        return { ...baseData, focus: "routes" }
      case "compliance":
        return { ...baseData, focus: "compliance" }
      case "incident-detailed":
        return { ...baseData, focus: "incidents" }
      default:
        return baseData
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive PDF reports with visual charts and analytics</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Templates */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Report Templates with Charts</CardTitle>
                  <CardDescription>Choose from pre-configured report templates with visual analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {reportTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {template.icon}
                            <h3 className="font-semibold">{template.name}</h3>
                          </div>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Frequency: {template.frequency}</span>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleGenerateReport(template.id)
                            }}
                            disabled={isGenerating}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {isGenerating ? "Generating..." : "Generate PDF"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Configuration */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>Customize your report parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="format">Report Format</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date Range</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal",
                              !dateFrom && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP") : "From date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal",
                              !dateTo && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP") : "To date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="filters">Additional Filters</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select filters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-severity">High Severity Only</SelectItem>
                        <SelectItem value="specific-route">Specific Route</SelectItem>
                        <SelectItem value="driver-performance">Driver Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="charts">Chart Options</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Charts</SelectItem>
                        <SelectItem value="bar">Bar Charts Only</SelectItem>
                        <SelectItem value="pie">Pie Charts Only</SelectItem>
                        <SelectItem value="line">Line Charts Only</SelectItem>
                        <SelectItem value="none">No Charts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => selectedTemplate && handleGenerateReport(selectedTemplate)}
                    disabled={!selectedTemplate || isGenerating}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating Report..." : "Generate Custom Report"}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Reports */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Reports</CardTitle>
                  <CardDescription>Generate common reports instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGenerateReport("daily-summary")}
                    disabled={isGenerating}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Today's Summary with Charts
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGenerateReport("driver-performance")}
                    disabled={isGenerating}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Driver Performance Charts
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGenerateReport("incident-detailed")}
                    disabled={isGenerating}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Incident Analysis Visuals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-gray-500">
                          Generated: {format(new Date(report.generatedAt), "PPP pp")} • Size: {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">{report.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Daily Safety Summary</h3>
                    <p className="text-sm text-gray-500">Generated daily at 11:59 PM</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Weekly Driver Performance</h3>
                    <p className="text-sm text-gray-500">Generated every Sunday at 6:00 PM</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Monthly Fleet Analytics</h3>
                    <p className="text-sm text-gray-500">Generated on 1st of each month</p>
                  </div>
                  <Badge variant="secondary">Paused</Badge>
                </div>
              </div>
              <Button className="w-full mt-4">
                <FileText className="h-4 w-4 mr-2" />
                Configure Scheduled Reports
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
