"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  FileText,
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Bus,
  Users,
  Loader2,
  FileDown,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { generatePDFReport } from "@/lib/pdf-generator"
import { useLiveAlerts, isToday, isWithinLast24Hours, isWithinLast30Days } from "@/hooks/use-live-alerts"
import { calculateSafetyScore, getRiskLevelDetails } from "@/lib/safety-score"

export default function ReportsPage() {
  const { t } = useLanguage()
  const { alerts: liveAlerts, historyAlerts, isLoading: isLoadingAlerts } = useLiveAlerts()

  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [drivers, setDrivers] = useState<any[]>([])
  const [fleet, setFleet] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])

  const [reportEntity, setReportEntity] = useState<"fleet" | "driver" | "bus">("fleet")
  const [selectedEntityId, setSelectedEntityId] = useState<string>("all")
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly" | "lifetime">("daily")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [driversRes, fleetRes, routesRes, feedbacksRes] = await Promise.all([
          fetch("/api/drivers", { cache: "no-store" }),
          fetch("/api/fleet", { cache: "no-store" }),
          fetch("/api/routes", { cache: "no-store" }),
          fetch("/api/feedback", { cache: "no-store" })
        ])
        if (driversRes.ok) setDrivers(await driversRes.json())
        if (fleetRes.ok) setFleet(await fleetRes.json())
        if (routesRes.ok) setRoutes(await routesRes.json())
        if (feedbacksRes.ok) setFeedbacks(await feedbacksRes.json())
      } catch (error) {
        console.error("Error fetching report data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const data = useMemo(() => {
    const combinedAlerts = [...liveAlerts, ...historyAlerts]
    const uniqueAlerts = combinedAlerts.filter((alert, index, self) =>
      index === self.findIndex((a) => a.id === alert.id)
    )
    const todayAlertsList = uniqueAlerts.filter(
      (alert) => isToday(alert.timestamp) || isWithinLast24Hours(alert.timestamp)
    )
    const alertsLast24Hours = uniqueAlerts.filter((alert) => isWithinLast24Hours(alert.timestamp))
    const safetyScore = calculateSafetyScore(alertsLast24Hours)
    const riskDetails = getRiskLevelDetails(safetyScore)
    const activeVehicles = fleet.filter(v => v.status === "active").length
    const alertTypesCounts: Record<string, number> = {}
    todayAlertsList.forEach(a => {
      alertTypesCounts[a.type] = (alertTypesCounts[a.type] || 0) + 1
    })
    const alertSummary = Object.entries(alertTypesCounts).map(([type, count]) => ({
      type, count, high: Math.round(count * 0.4), medium: Math.round(count * 0.4), low: Math.round(count * 0.2), avgResponse: "1m"
    }))
    const alertDensity = fleet.length > 0 ? (todayAlertsList.length / fleet.length).toFixed(2) : "0"
    const totalDrivers = drivers.length || 1
    const activeDrivers = drivers.filter(d => d.status === "on_duty").length
    return {
      uniqueTodayAlerts: todayAlertsList,
      safetyScore,
      riskLevel: riskDetails.level,
      alertSummary,
      alertDensity,
      activeDrivers,
      totalDrivers,
      activeVehicles,
      totalVehicles: fleet.length,
    }
  }, [liveAlerts, historyAlerts, fleet, drivers])

  const handleDownload = async (type: string, title: string) => {
    setIsGenerating(type)
    try {
      const now = Date.now()
      const timeMs = timePeriod === "daily" ? 24*60*60*1000 : timePeriod === "weekly" ? 7*24*60*60*1000 : timePeriod === "monthly" ? 30*24*60*60*1000 : Infinity
      const combinedAlerts = [...liveAlerts, ...historyAlerts].filter((alert, index, self) => index === self.findIndex((a) => a.id === alert.id))
      let filteredAlerts = combinedAlerts.filter(a => {
        const alertTime = new Date(a.timestamp || Date.now()).getTime()
        return (now - alertTime) <= timeMs
      })
      let entityName = "Entire Fleet"
      if (reportEntity === "driver" && selectedEntityId !== "all") {
        const driver = drivers.find(d => d.id === selectedEntityId || d.licenseNumber === selectedEntityId)
        filteredAlerts = filteredAlerts.filter(a => a.driverId === selectedEntityId || a.driverName === driver?.name)
        entityName = `Driver: ${driver?.name || selectedEntityId}`
      } else if (reportEntity === "bus" && selectedEntityId !== "all") {
        filteredAlerts = filteredAlerts.filter(a => a.busNumber === selectedEntityId || a.deviceId === selectedEntityId || a.number_plate === selectedEntityId)
        entityName = `Bus: ${selectedEntityId}`
      }
      const drowsinessCount = filteredAlerts.filter(a => a.type.toLowerCase().includes('drowsi')).length
      const yawnCount = filteredAlerts.filter(a => a.tag?.toLowerCase().includes('yawn')).length
      const phoneCount = filteredAlerts.filter(a => a.type.toLowerCase().includes('phone')).length
      const distractionCount = filteredAlerts.filter(a => a.type.toLowerCase().includes('distraction')).length
      const alertTypesCounts: Record<string, number> = {}
      filteredAlerts.forEach(a => { alertTypesCounts[a.type] = (alertTypesCounts[a.type] || 0) + 1 })
      const dynamicAlertSummary = Object.entries(alertTypesCounts).map(([type, count]) => ({
        type, count, high: Math.round(count * 0.4), medium: Math.round(count * 0.4), low: Math.round(count * 0.2), avgResponse: "1m"
      }))
      const safetyScore = calculateSafetyScore(filteredAlerts)
      let filteredFeedbacks = feedbacks.filter(f => {
        if (!f.timestamp && !f.createdAt) return false
        const feedbackTime = new Date((f.timestamp || f.createdAt) as string).getTime()
        return (now - feedbackTime) <= timeMs
      })
      if (reportEntity === "driver" && selectedEntityId !== "all") {
        const driver = drivers.find(d => d.id === selectedEntityId || d.licenseNumber === selectedEntityId)
        filteredFeedbacks = filteredFeedbacks.filter(f => f.driverId === selectedEntityId || f.driverName === driver?.name)
      } else if (reportEntity === "bus" && selectedEntityId !== "all") {
        filteredFeedbacks = filteredFeedbacks.filter(f => f.busNumber === selectedEntityId || f.vehicleId === selectedEntityId)
      }
      const getRatingValue = (f: any) => typeof f.rating === 'object' ? (f.rating?.overall || 5) : (Number(f.rating) || 5)
      const avgFeedbackRating = filteredFeedbacks.length > 0 ? (filteredFeedbacks.reduce((sum, f) => sum + getRatingValue(f), 0) / filteredFeedbacks.length).toFixed(1) : "N/A"
      const reportData: any = {
        entityName, timePeriod: timePeriod.toUpperCase(), safetyScore,
        counts: { total: filteredAlerts.length, drowsiness: drowsinessCount, yawn: yawnCount, phone: phoneCount, distraction: distractionCount },
        feedbacks: {
          total: filteredFeedbacks.length, averageRating: avgFeedbackRating,
          recent: filteredFeedbacks.slice(0, 10).map(f => ({
            rating: typeof f.rating === 'object' ? (f.rating?.overall || 5) : (f.rating || 5),
            comment: f.description || f.comment || f.message || "No comment",
            title: f.title || "Untitled Feedback",
            userName: f.isAnonymous ? "Anonymous" : (f.userName || "Unknown Passenger"),
            busNumber: f.busNumber || "Unknown Bus",
            date: (f.createdAt || f.timestamp) ? new Date(f.createdAt || f.timestamp).toLocaleDateString() : "Recent"
          }))
        },
        summary: { totalAlerts: filteredAlerts.length, activeDrivers: data.activeDrivers, systemUptime: 100 },
        alerts: dynamicAlertSummary.length > 0 ? dynamicAlertSummary : [{ type: "No Data", count: 0, high: 0, medium: 0, low: 0, avgResponse: "0m" }],
        alertDetails: filteredAlerts.map(a => ({
          type: a.type || "Unknown",
          driverName: a.driverName || "Unknown Driver",
          busNumber: a.busNumber || a.number_plate || "N/A",
          timestamp: a.timestamp ? new Date(a.timestamp).toLocaleString() : "N/A",
          severity: a.severity || "medium",
          description: a.description || a.tag || "",
          evidence: a.evidence || null,
        })),
        drivers: (Array.isArray(drivers) ? drivers : []).map(d => ({ name: d.name, license: d.licenseNumber, bus: d.busNumber || 'N/A', route: d.route || 'Unassigned', alerts: d.alertCount || 0, status: d.status })),
        routes: (Array.isArray(routes) ? routes : []).map(r => ({ name: r.name, buses: r.activeVehicles, drivers: r.activeVehicles, distance: `${r.distance}km`, riskAreas: r.safetyIncidents, efficiency: r.onTimePerformance })),
        compliance: { driverLicenseValidity: 100, vehicleInspections: 100, safetyTraining: Math.round(data.safetyScore), emergencyProtocols: 100, dataReporting: 100 }
      }
      await generatePDFReport({
        type: type === 'custom' ? 'custom-dynamic' : type,
        title: type === 'custom' ? `${entityName} - ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Report` : title,
        dateRange: timePeriod === 'lifetime' ? 'All Time' : `Last ${timePeriod === 'daily' ? '24 Hours' : timePeriod === 'weekly' ? '7 Days' : '30 Days'}`,
        data: reportData
      })
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(null)
    }
  }

  if (isLoading || isLoadingAlerts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">{t("loading_activities") || "Preparing analytics dashboard..."}</p>
      </div>
    )
  }

  const quickReports = [
    {
      id: "driver-performance",
      title: t("driver_performance_report") || "Driver Performance Report",
      desc: t("driver_performance_desc") || "Individual driver safety scores and incident history with performance charts",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      id: "fleet-analytics",
      title: t("fleet_analytics_report") || "Fleet Analytics Report",
      desc: t("fleet_analytics_desc") || "Vehicle-wise safety metrics and maintenance alerts with route analysis charts",
      icon: Bus,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      id: "daily-summary",
      title: t("todays_summary") || "Safety Summary Report",
      desc: t("daily_summary_desc") || "Full breakdown of safety incidents and system alerts for the selected period",
      icon: Shield,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports &amp; Analytics</h1>
          <p className="text-muted-foreground">Generate comprehensive reports with live fleet analytics.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.safetyScore.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{data.riskLevel}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Alerts</CardTitle>
            <Activity className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">{data.uniqueTodayAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Density</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{data.alertDensity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Report Configuration + Quick Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Config Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("report_config") || "Report Configuration"}</CardTitle>
            <CardDescription>{t("report_params") || "Customize your report parameters"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("report_format") || "Report Format"}</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="bg-primary/10 border-primary text-primary text-xs">PDF</Button>
                <Button variant="outline" className="opacity-40 cursor-not-allowed text-xs" disabled>XLS</Button>
                <Button variant="outline" className="opacity-40 cursor-not-allowed text-xs" disabled>CSV</Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Entity</label>
              <Select value={reportEntity} onValueChange={(val) => { setReportEntity(val as any); setSelectedEntityId("all") }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target entity..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fleet">Entire Fleet</SelectItem>
                  <SelectItem value="driver">Specific Driver</SelectItem>
                  <SelectItem value="bus">Specific Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportEntity === "driver" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Driver</label>
                <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select a driver..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drivers</SelectItem>
                    {(Array.isArray(drivers) ? drivers : []).map(d => (
                      <SelectItem key={d.id || d.licenseNumber} value={d.id || d.licenseNumber}>
                        {d.name} ({d.licenseNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {reportEntity === "bus" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Bus</label>
                <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select a bus..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Buses</SelectItem>
                    {(Array.isArray(fleet) ? fleet : []).map(f => (
                      <SelectItem key={f.id || f.busNumber} value={f.id || f.busNumber}>
                        {f.busNumberPlate || f.busNumber || f.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("time_period") || "Time Period"}</label>
              <Select value={timePeriod} onValueChange={(val) => setTimePeriod(val as any)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select time period..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (Last 24 Hours)</SelectItem>
                  <SelectItem value="weekly">Weekly (Last 7 Days)</SelectItem>
                  <SelectItem value="monthly">Monthly (Last 30 Days)</SelectItem>
                  <SelectItem value="lifetime">Lifetime (All Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={() => handleDownload('custom', 'Custom Fleet Analysis')}
              disabled={isGenerating !== null}
            >
              {isGenerating === 'custom' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              {t("generate_custom_report") || "Generate Custom Report"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Reports Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className={`${report.bg} p-3 rounded-lg`}>
                    <report.icon className={`h-5 w-5 ${report.color}`} />
                  </div>
                  <Badge variant="secondary">Dynamic</Badge>
                </div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription className="text-sm">{report.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    LIVE STATUS
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/10 text-xs font-medium"
                    onClick={() => handleDownload(report.id, report.title)}
                    disabled={isGenerating !== null}
                  >
                    {isGenerating === report.id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Download className="h-3 w-3 mr-1" />
                    )}
                    {t("download_pdf") || "download_pdf"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fleet Analytics Overview</CardTitle>
          <CardDescription>Live metrics from the active fleet and driver data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Drivers */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Active Duty Drivers
                </span>
                <span className="text-sm font-bold text-green-500">{data.activeDrivers} / {data.totalDrivers}</span>
              </div>
              <Progress value={(data.activeDrivers / data.totalDrivers) * 100} className="h-2" />
            </div>

            {/* Active Vehicles */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Bus className="h-4 w-4" /> Active Vehicles
                </span>
                <span className="text-sm font-bold text-primary">{data.activeVehicles} / {data.totalVehicles}</span>
              </div>
              <Progress value={data.totalVehicles > 0 ? (data.activeVehicles / data.totalVehicles) * 100 : 0} className="h-2" />
            </div>

            {/* Safety Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Safety Score
                </span>
                <span className="text-sm font-bold text-amber-500">{data.safetyScore.toFixed(1)}%</span>
              </div>
              <Progress value={data.safetyScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
