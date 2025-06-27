"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Shield,
  Activity,
  AlertTriangle,
  Brain,
  Target,
  Users,
  Clock,
  RefreshCw,
  Download,
  Settings,
  CheckCircle,
  Bell,
} from "lucide-react"

export default function AnalyticsPage() {
  // Simple static data - no undefined values possible
  const metrics = {
    safetyScore: 94,
    totalAlerts: 23,
    riskLevel: "medium",
    performanceIndex: 87,
    complianceRate: 96,
    efficiency: 87,
    quality: 94,
    reliability: 91,
  }

  const insights = [
    {
      id: "1",
      title: "Safety Training Effectiveness",
      description: "Driver safety training completion rates have improved significantly",
      type: "success",
      confidence: 92,
      category: "safety",
      recommendation: "Continue current training programs and expand to include advanced scenarios",
    },
    {
      id: "2",
      title: "Incident Response Time",
      description: "Average response time to safety incidents has increased",
      type: "warning",
      confidence: 87,
      category: "operations",
      recommendation: "Review response protocols and consider additional training",
    },
    {
      id: "3",
      title: "Compliance Score Improvement",
      description: "Overall compliance scores show steady improvement",
      type: "success",
      confidence: 95,
      category: "compliance",
      recommendation: "Maintain current compliance monitoring practices",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into compliance status, performance metrics, and safety analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.safetyScore}%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
            <Progress value={metrics.safetyScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAlerts}</div>
            <p className="text-xs text-muted-foreground">-12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{metrics.riskLevel}</div>
            <Badge variant="secondary" className="mt-2">
              {metrics.riskLevel}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Index</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.performanceIndex}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            <Progress value={metrics.performanceIndex} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Compliance Overview
                </CardTitle>
                <CardDescription>Current compliance status across all areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Regulatory Compliance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={96} className="w-20" />
                      <span className="text-sm font-medium">96%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Safety Standards</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Environmental</span>
                    <div className="flex items-center gap-2">
                      <Progress value={98} className="w-20" />
                      <span className="text-sm font-medium">98%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Operational</span>
                    <div className="flex items-center gap-2">
                      <Progress value={91} className="w-20" />
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Efficiency</span>
                    <span className="font-bold">{metrics.efficiency}%</span>
                  </div>
                  <Progress value={metrics.efficiency} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quality</span>
                    <span className="font-bold">{metrics.quality}%</span>
                  </div>
                  <Progress value={metrics.quality} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reliability</span>
                    <span className="font-bold">{metrics.reliability}%</span>
                  </div>
                  <Progress value={metrics.reliability} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Safety</span>
                    <span className="font-bold">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Safety training completed</div>
                    <div className="text-sm text-gray-600">Driver certification program finished successfully</div>
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <div className="font-medium">Maintenance alert</div>
                    <div className="text-sm text-gray-600">Vehicle NB-1234 requires scheduled maintenance</div>
                  </div>
                  <div className="text-xs text-gray-500">4 hours ago</div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">Compliance check passed</div>
                    <div className="text-sm text-gray-600">Monthly regulatory compliance audit completed</div>
                  </div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics.safetyScore}%</div>
                <Progress value={metrics.safetyScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalAlerts}</div>
                <div className="text-xs text-muted-foreground mt-1">-12.5% vs last period</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{metrics.riskLevel}</div>
                <Badge variant="secondary" className="mt-2">
                  {metrics.riskLevel}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">+2.3%</div>
                <div className="text-xs text-muted-foreground mt-1">Safety improvement</div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Details */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
              <CardDescription>Detailed breakdown of compliance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Regulatory Compliance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">DOT Regulations</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safety Standards</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Environmental</span>
                      <span className="font-medium">97%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Operational Compliance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Driver Training</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vehicle Maintenance</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Documentation</span>
                      <span className="font-medium">99%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Efficiency</span>
                    <span className="font-bold">{metrics.efficiency}%</span>
                  </div>
                  <Progress value={metrics.efficiency} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality</span>
                    <span className="font-bold">{metrics.quality}%</span>
                  </div>
                  <Progress value={metrics.quality} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reliability</span>
                    <span className="font-bold">{metrics.reliability}%</span>
                  </div>
                  <Progress value={metrics.reliability} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Completion</span>
                    <span className="font-bold text-green-600">98%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Certification Rate</span>
                    <span className="font-bold text-blue-600">95%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Score</span>
                    <span className="font-bold text-purple-600">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Incident Response</span>
                    <span className="font-bold">4.2 min</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alert Processing</span>
                    <span className="font-bold">1.8 min</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution Time</span>
                    <span className="font-bold">24.5 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Machine learning analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={insight.type === "warning" ? "secondary" : "default"}>{insight.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Confidence: {insight.confidence}%</Badge>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
