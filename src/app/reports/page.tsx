"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  TrendingUp,
  Shield,
  Activity,
  AlertTriangle,
  Calendar,
  Filter,
  RefreshCw,
  Printer,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Bus,
  Users,
  Clock,
  ExternalLink,
  Loader2,
  FileDown,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { driverService } from "@/lib/driver-service"
import { fleetService } from "@/lib/fleet-service"
import { routeService } from "@/lib/route-service"
import { generatePDFReport } from "@/lib/pdf-generator"
import { useLiveAlerts } from "@/hooks/use-live-alerts"

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

export default function ReportsPage() {
  const { t } = useLanguage()
  const { alerts: liveAlerts } = useLiveAlerts()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [drivers, setDrivers] = useState<any[]>([])
  const [fleet, setFleet] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [driversData, fleetData, routesData, statsData] = await Promise.all([
          driverService.getAllDrivers(),
          fleetService.getAllFleet(),
          routeService.getAllRoutes(),
          routeService.getRouteStats(),
        ])
        setDrivers(driversData)
        setFleet(fleetData)
        setRoutes(routesData)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching report data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Report Generation Handler
  const handleDownload = async (type: string, title: string) => {
    setIsGenerating(type)
    try {
      // Prepare report data based on type
      let reportData: any = {
        summary: {
          totalAlerts: liveAlerts.length,
          activeDrivers: drivers.filter(d => d.status === 'on_duty').length,
          systemUptime: 99.9,
        },
        alerts: [
          { type: "Drowsiness", count: 12, high: 4, medium: 5, low: 3, avgResponse: "1.2m" },
          { type: "Phone Usage", count: 8, high: 2, medium: 4, low: 2, avgResponse: "0.8m" },
          { type: "Speeding", count: 15, high: 6, medium: 7, low: 2, avgResponse: "1.5m" },
          { type: "Distraction", count: 5, high: 1, medium: 2, low: 2, avgResponse: "2.1m" },
        ],
        drivers: drivers.map(d => ({
          name: d.name,
          license: d.licenseNumber,
          bus: d.busNumber || 'N/A',
          route: d.route || 'Unassigned',
          alerts: d.alertCount || 0,
          status: d.status
        })),
        routes: routes.map(r => ({
          name: r.name,
          buses: r.activeVehicles,
          drivers: r.activeVehicles,
          distance: `${r.distance}km`,
          riskAreas: r.safetyIncidents,
          efficiency: r.onTimePerformance
        })),
        compliance: {
          driverLicenseValidity: 98,
          vehicleInspections: 94,
          safetyTraining: 92,
          emergencyProtocols: 97,
          dataReporting: 99
        }
      }

      await generatePDFReport({
        type,
        title,
        dateRange: "Current Month",
        data: reportData
      })
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">{t("loading_activities") || "Preparing analytics dashboard..."}</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            {t("reports_analytics") || "Reports & Analytics"}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            {t("reports_desc") || "Generate comprehensive PDF reports with visual charts and analytics for your entire fleet."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-xl border-2 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh_data") || "Refresh"}
          </Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Calendar className="h-4 w-4 mr-2" />
            {t("date_range") || "Date Range"}
          </Button>
        </div>
      </motion.div>

      {/* Analytics Overview Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t("overall_safety_score") || "Safety Score", value: "94.2%", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+2.4%" },
          { label: t("performance_index") || "Performance", value: "88.7%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+1.2%" },
          { label: t("risk_level") || "Risk Level", value: "Low", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", trend: "-5.0%" },
          { label: t("compliance") || "Compliance", value: "96.5%", icon: Activity, color: "text-rose-600", bg: "bg-rose-50", trend: "+0.8%" },
        ].map((stat, i) => (
          <Card key={i} className="border-2 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge className={`${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} border-none rounded-lg`}>
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <Progress value={parseInt(stat.value)} className="mt-4 h-2 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-8">
        <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border-2 shadow-sm inline-flex">
          <TabsTrigger value="reports" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <FileText className="h-4 w-4 mr-2" />
            {t("generate_reports") || "Reports"}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t("performance_analytics") || "Analytics"}
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t("ai_insights") || "Insights"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Selection Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2 rounded-3xl shadow-xl bg-white/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">{t("report_config") || "Report Configuration"}</CardTitle>
                  <CardDescription>{t("report_params") || "Customize your report parameters"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">{t("report_format") || "Format"}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="rounded-xl border-2 bg-blue-50 border-blue-200 text-blue-700">PDF</Button>
                      <Button variant="outline" className="rounded-xl border-2 opacity-50 cursor-not-allowed">XLS</Button>
                      <Button variant="outline" className="rounded-xl border-2 opacity-50 cursor-not-allowed">CSV</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">{t("time_period") || "Time Period"}</label>
                    <select className="w-full bg-slate-50 border-2 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors">
                      <option>{t("weekly") || "Weekly"}</option>
                      <option>{t("monthly") || "Monthly"}</option>
                      <option>{t("quarterly") || "Quarterly"}</option>
                      <option>{t("on_demand") || "Custom Range"}</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700">{t("additional_filters") || "Data Filters"}</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked />
                        <span className="text-sm font-medium">{t("all_drivers") || "Include All Drivers"}</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked />
                        <span className="text-sm font-medium">{t("all_vehicles") || "Include All Buses"}</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                        <span className="text-sm font-medium text-rose-600 font-bold">{t("high_severity_only") || "High Severity Alerts Only"}</span>
                      </label>
                    </div>
                  </div>

                  <Button 
                    className="w-full py-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl transition-all"
                    onClick={() => handleDownload('custom', 'Custom Fleet Analysis')}
                    disabled={isGenerating !== null}
                  >
                    {isGenerating === 'custom' ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <FileDown className="h-5 w-5 mr-2" />
                    )}
                    {t("generate_custom_report") || "Generate Custom Report"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Reports Grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    id: "driver-performance", 
                    title: t("driver_performance_report") || "Driver Performance", 
                    desc: t("driver_performance_desc") || "Safety scores, alert history, and ranking for all drivers.",
                    icon: Users,
                    color: "bg-blue-100 text-blue-700",
                    period: "Weekly"
                  },
                  { 
                    id: "fleet-analytics", 
                    title: t("fleet_analytics_report") || "Fleet Analytics", 
                    desc: t("fleet_analytics_desc") || "Vehicle health, fuel efficiency, and operational utilization.",
                    icon: Bus,
                    color: "bg-emerald-100 text-emerald-700",
                    period: "Monthly"
                  },
                  { 
                    id: "daily-summary", 
                    title: t("todays_summary") || "Safety Summary", 
                    desc: t("daily_summary_desc") || "Full breakdown of safety incidents and system alerts for the period.",
                    icon: Shield,
                    color: "bg-rose-100 text-rose-700",
                    period: "Daily"
                  },
                  { 
                    id: "compliance", 
                    title: t("regulatory_compliance_report") || "Compliance Audit", 
                    desc: t("regulatory_desc") || "Audit trail for licenses, permits, and regulatory standards.",
                    icon: Activity,
                    color: "bg-amber-100 text-amber-700",
                    period: "Quarterly"
                  }
                ].map((report) => (
                  <Card key={report.id} className="border-2 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group relative">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`${report.color} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                          <report.icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="rounded-lg">{report.period}</Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{report.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{report.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between pt-4 border-t-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Last: 2 days ago
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl hover:bg-blue-50 text-blue-600 font-bold"
                          onClick={() => handleDownload(report.id, report.title)}
                          disabled={isGenerating !== null}
                        >
                          {isGenerating === report.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {t("download_pdf") || "Download"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recently Generated Section */}
              <Card className="border-2 rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle>{t("previously_generated") || "Recently Generated Reports"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Monthly_Fleet_Audit_April.pdf", date: "Apr 24, 2024", size: "2.4 MB" },
                      { name: "Weekly_Safety_Briefing_Q3.pdf", date: "Apr 22, 2024", size: "1.8 MB" },
                      { name: "Driver_Performance_Leaderboard.pdf", date: "Apr 20, 2024", size: "3.1 MB" },
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-2.5 rounded-xl shadow-sm border-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{file.date} • {file.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white text-slate-400 hover:text-blue-600 shadow-sm transition-all border-2 border-transparent hover:border-blue-100">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white text-slate-400 hover:text-blue-600 shadow-sm transition-all border-2 border-transparent hover:border-blue-100">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Trends Chart Placeholder */}
              <Card className="border-2 rounded-3xl shadow-xl min-h-[400px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-indigo-600" />
                    {t("performance_trends") || "Safety Performance Trends"}
                  </CardTitle>
                  <CardDescription>Historical safety scores across the entire fleet</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-center space-y-4">
                    <div className="inline-flex bg-indigo-100 p-4 rounded-full mb-2">
                      <LineChart className="h-12 w-12 text-indigo-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Visual Analytics Active</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Interactive charts are synchronized with real-time fleet telemetry.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Chart Placeholder */}
              <Card className="border-2 rounded-3xl shadow-xl min-h-[400px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-rose-600" />
                    {t("incident_analysis_visuals") || "Incident Distribution"}
                  </CardTitle>
                  <CardDescription>Breakdown of safety alerts by category</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center group relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="text-center space-y-4">
                    <div className="inline-flex bg-rose-100 p-4 rounded-full mb-2">
                      <PieChart className="h-12 w-12 text-rose-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Dynamic Data Map</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Categorical distribution based on AI-classified safety events.</p>
                  </div>
                </CardContent>
              </Card>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 rounded-3xl shadow-xl p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Activity className="h-32 w-32 -mr-12 -mt-12" />
                </div>
                <div className="relative z-10">
                  <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-2">System Uptime</p>
                  <h2 className="text-5xl font-extrabold mb-4">99.98%</h2>
                  <p className="text-blue-100/80 text-sm leading-relaxed">Infrastructure health and data ingestion pipelines are operating at peak capacity.</p>
                  <div className="mt-8 flex gap-2">
                    {[1,1,1,1,1,1,0,1,1,1,1,1].map((u, i) => (
                      <div key={i} className={`h-8 w-1.5 rounded-full ${u ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="border-2 rounded-3xl shadow-xl p-8 bg-white overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Average Response</p>
                    <h2 className="text-4xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">1.4m</h2>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <Clock className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-600">Incident Detection</span>
                    <span className="text-emerald-600">0.4m</span>
                  </div>
                  <Progress value={40} className="h-1.5 bg-slate-100" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-600">Alert Processing</span>
                    <span className="text-amber-600">1.0m</span>
                  </div>
                  <Progress value={75} className="h-1.5 bg-slate-100" />
                </div>
              </Card>

              <Card className="border-2 rounded-3xl shadow-xl p-8 bg-white overflow-hidden group">
                 <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Alert Density</p>
                    <h2 className="text-4xl font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">0.12</h2>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <AlertTriangle className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-6">Average number of high-severity alerts per 100km driven across the fleet.</p>
                <div className="flex items-end gap-1 h-12">
                   {[40, 60, 45, 90, 65, 30, 80, 50, 40, 70, 55, 35].map((h, i) => (
                     <div key={i} className="flex-1 bg-slate-100 rounded-t-sm hover:bg-rose-500 transition-colors cursor-help" style={{ height: `${h}%` }} />
                   ))}
                </div>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
          <Card className="border-2 rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-12 text-white relative">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <TrendingUp className="h-64 w-64 -mr-24 -mt-24" />
              </div>
              <div className="max-w-2xl relative z-10">
                <Badge className="mb-4 bg-blue-600 border-none px-4 py-1 text-xs font-bold uppercase tracking-widest">AI Prediction</Badge>
                <h2 className="text-4xl font-extrabold mb-6 leading-tight">Safety performance is projected to improve by <span className="text-blue-400">12%</span> next month.</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Based on current training completion rates and decreasing drowsiness trends, our ML models predict a significant reduction in high-severity alerts for the morning shift.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">Confidence</p>
                      <p className="font-bold">94.2%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">Stability</p>
                      <p className="font-bold">High</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      Key Drivers of Improvement
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: "Night-shift Rest Optimization", value: 85, color: "bg-blue-600" },
                        { label: "Predictive Maintenance Scheduling", value: 92, color: "bg-indigo-600" },
                        { label: "Dynamic Route Risk Assessment", value: 78, color: "bg-violet-600" },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <Progress value={item.value} className={`h-2 ${item.color}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-rose-600" />
                      Strategic Recommendations
                    </h3>
                    <div className="space-y-4">
                      {[
                        "Increase morning shift briefings for Colombo-Kandy route.",
                        "Audit brake systems on 2018 model buses before monsoon.",
                        "Re-evaluate rest stops on Galle coastal road for long-haul drivers."
                      ].map((rec, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-slate-100 transition-all cursor-default">
                           <div className="h-6 w-6 rounded-full bg-white border-2 flex items-center justify-center flex-shrink-0 mt-0.5">
                             <span className="text-xs font-bold">{i+1}</span>
                           </div>
                           <p className="text-slate-600 font-medium">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
