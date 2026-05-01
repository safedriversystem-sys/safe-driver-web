"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
  TrendingUp,
  Shield,
  Activity,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Clock,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Brain,
  ChevronRight,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { routeService } from "@/lib/route-service"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing performance data...</p>
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            {t("analytics_dashboard") || "Performance Analytics"}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            {t("analytics_desc") || "Deep-dive into fleet performance, safety metrics, and operational efficiency with AI-driven insights."}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-2 hover:bg-slate-50 shadow-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh_data") || "Live Refresh"}
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            <Zap className="h-4 w-4 mr-2" />
            {t("ai_insights") || "Run AI Analysis"}
          </Button>
        </div>
      </motion.div>

      {/* Real-time Health Monitor */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Network Health", value: "Optimal", sub: "99.9% S.L.A", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Data Latency", value: "42ms", sub: "Real-time stream", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Sync Status", value: "Active", sub: "124 Nodes active", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((item, i) => (
          <Card key={i} className="border-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-6">
              <div className={`${item.bg} p-4 rounded-2xl`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{item.value}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Analytics View */}
      <Tabs defaultValue="performance" className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-2xl border-2">
          <TabsTrigger value="performance" className="rounded-xl px-10 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-bold">
            <BarChart3 className="h-4 w-4 mr-2 text-indigo-600" />
            {t("performance_metrics") || "Performance"}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-xl px-10 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-bold">
            <Shield className="h-4 w-4 mr-2 text-emerald-600" />
            {t("compliance_overview") || "Compliance"}
          </TabsTrigger>
          <TabsTrigger value="risk" className="rounded-xl px-10 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-bold">
            <AlertTriangle className="h-4 w-4 mr-2 text-rose-600" />
            {t("risk_level") || "Risk Analysis"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <Card className="lg:col-span-2 border-2 rounded-3xl shadow-xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b-2 p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Operational Efficiency</CardTitle>
                    <CardDescription>Fleet-wide performance index over the last 30 days</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1 rounded-lg">High Efficiency</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[400px] flex items-center justify-center relative bg-gradient-to-b from-white to-slate-50">
                 <div className="text-center space-y-4 group-hover:scale-105 transition-transform duration-500">
                    <div className="inline-flex bg-indigo-100 p-6 rounded-3xl shadow-inner">
                      <LineChart className="h-16 w-16 text-indigo-600" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Interactive Visualizer Ready</p>
                 </div>
                 {/* Visual decoration */}
                 <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-indigo-500/5 to-transparent" />
              </CardContent>
            </Card>

            {/* KPIs */}
            <div className="space-y-6">
              {[
                { label: "Fuel Efficiency", value: 92, color: "bg-emerald-500", icon: Zap },
                { label: "On-Time Performance", value: 87, color: "bg-blue-500", icon: Target },
                { label: "Maintenance Score", value: 95, color: "bg-indigo-500", icon: Activity },
              ].map((kpi, i) => (
                <Card key={i} className="border-2 rounded-3xl shadow-lg hover:translate-x-2 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <kpi.icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="font-bold text-slate-700">{kpi.label}</span>
                      </div>
                      <span className="text-xl font-black text-slate-900">{kpi.value}%</span>
                    </div>
                    <Progress value={kpi.value} className={`h-3 ${kpi.color} rounded-full`} />
                    <div className="mt-3 flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-400">vs Last Month</span>
                       <span className="text-xs font-bold text-emerald-600 flex items-center">
                         <ArrowUpRight className="h-3 w-3 mr-1" />
                         +4.2%
                       </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-8">
           <Card className="border-2 rounded-[2rem] shadow-2xl overflow-hidden">
             <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 space-y-8">
                   <div>
                     <Badge className="bg-emerald-600 mb-4 px-4 py-1">Fully Compliant</Badge>
                     <h2 className="text-4xl font-black text-slate-900 leading-tight">Regulatory Standards & Safety Audits</h2>
                     <p className="text-slate-500 text-lg mt-4 leading-relaxed">
                       Our automated compliance monitoring system ensures 100% adherence to national transport safety regulations.
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-3xl font-black text-indigo-600">99.8%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Score</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-emerald-600">Zero</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Violations</p>
                      </div>
                   </div>

                   <Button className="w-full py-7 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl group">
                     View Compliance Log
                     <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
                
                <div className="bg-slate-50 p-12 flex items-center justify-center relative group">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="text-center space-y-6">
                      <div className="inline-flex bg-white p-8 rounded-[2.5rem] shadow-xl border-2">
                        <PieChart className="h-24 w-24 text-emerald-600 animate-spin-slow" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-slate-800">Dynamic Compliance Map</h4>
                        <p className="text-sm text-slate-400 font-medium max-w-xs">Visualizing regulatory adherence across all operational sectors.</p>
                      </div>
                   </div>
                </div>
             </div>
           </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 rounded-3xl shadow-xl p-10 bg-slate-900 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Brain className="h-64 w-64 -mr-20 -mt-20" />
                </div>
                <div className="relative z-10">
                  <Badge className="bg-rose-500 border-none mb-6 px-4 py-1 text-xs font-bold tracking-widest uppercase">Risk Forecast</Badge>
                  <h3 className="text-3xl font-extrabold mb-4 leading-tight">Predictive Fatigue Analysis</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    AI models indicate a 15% risk increase in driver fatigue during late-night shifts on the Coastal Road route.
                  </p>
                  <div className="flex gap-4">
                    <Button className="rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold px-8">Mitigate Risk</Button>
                    <Button variant="ghost" className="rounded-xl text-white hover:bg-white/10 font-bold border-2 border-white/20">View Data</Button>
                  </div>
                </div>
              </Card>

              <Card className="border-2 rounded-3xl shadow-xl p-10 bg-white overflow-hidden group">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <div className="h-2 w-2 rounded-full bg-rose-600" />
                  High-Risk Zones Detected
                </h3>
                <div className="space-y-6">
                  {[
                    { zone: "Kandy Road Sector 4", risk: "Medium", trend: "up", alerts: 12 },
                    { zone: "Galle Expressway Entry", risk: "Low", trend: "down", alerts: 3 },
                    { zone: "Negombo Town Center", risk: "High", trend: "up", alerts: 24 },
                  ].map((zone, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${zone.risk === 'High' ? 'bg-rose-100 text-rose-600' : zone.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{zone.zone}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{zone.alerts} Alerts logged</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <Badge className={`${zone.risk === 'High' ? 'bg-rose-500' : zone.risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'} text-white border-none`}>
                           {zone.risk} Risk
                         </Badge>
                         <p className={`text-[10px] font-black uppercase mt-1 flex items-center justify-end ${zone.trend === 'up' ? 'text-rose-600' : 'text-emerald-600'}`}>
                           {zone.trend === 'up' ? <ArrowUpRight className="h-2 w-2 mr-0.5" /> : <ArrowDownRight className="h-2 w-2 mr-0.5" />}
                           Trending {zone.trend}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
