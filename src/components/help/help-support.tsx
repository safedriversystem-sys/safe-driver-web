"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Users,
  Clock,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Zap,
  Shield,
  Settings,
  BarChart3,
  Smartphone,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  ThumbsUp,
  MessageSquare,
} from "lucide-react"

export function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const supportOptions = [
    {
      id: "live-chat",
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "Available 24/7",
      responseTime: "Immediate",
      status: "online",
      action: "Start Chat",
    },
    {
      id: "phone",
      title: "Phone Support",
      description: "Speak directly with our experts",
      icon: Phone,
      availability: "Mon-Fri 8AM-8PM EST",
      responseTime: "Immediate",
      status: "available",
      action: "Call Now",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "email",
      title: "Email Support",
      description: "Send us detailed questions or feedback",
      icon: Mail,
      availability: "Always available",
      responseTime: "Within 4 hours",
      status: "available",
      action: "Send Email",
      email: "support@safedriver.com",
    },
    {
      id: "ticket",
      title: "Support Ticket",
      description: "Create a ticket for complex issues",
      icon: FileText,
      availability: "Always available",
      responseTime: "Within 24 hours",
      status: "available",
      action: "Create Ticket",
    },
  ]

  const quickHelp = [
    {
      category: "Getting Started",
      icon: Zap,
      color: "bg-blue-500",
      articles: [
        { title: "Setting up your first vehicle", views: "12.5k", rating: 4.8 },
        { title: "Creating driver profiles", views: "8.2k", rating: 4.9 },
        { title: "Understanding the dashboard", views: "15.3k", rating: 4.7 },
        { title: "Mobile app installation guide", views: "6.8k", rating: 4.6 },
      ],
    },
    {
      category: "Fleet Management",
      icon: Settings,
      color: "bg-green-500",
      articles: [
        { title: "Adding and managing vehicles", views: "9.1k", rating: 4.8 },
        { title: "Setting up maintenance schedules", views: "5.4k", rating: 4.7 },
        { title: "Driver assignment and rotation", views: "7.2k", rating: 4.9 },
        { title: "Vehicle tracking and monitoring", views: "11.6k", rating: 4.8 },
      ],
    },
    {
      category: "Safety & Alerts",
      icon: Shield,
      color: "bg-red-500",
      articles: [
        { title: "Configuring safety alerts", views: "13.7k", rating: 4.9 },
        { title: "Emergency response protocols", views: "8.9k", rating: 4.8 },
        { title: "Geofencing setup and management", views: "6.3k", rating: 4.7 },
        { title: "Incident reporting and analysis", views: "4.8k", rating: 4.6 },
      ],
    },
    {
      category: "Analytics & Reports",
      icon: BarChart3,
      color: "bg-purple-500",
      articles: [
        { title: "Understanding analytics dashboard", views: "10.2k", rating: 4.8 },
        { title: "Generating custom reports", views: "7.5k", rating: 4.7 },
        { title: "Driver performance metrics", views: "9.8k", rating: 4.9 },
        { title: "Exporting data and reports", views: "5.1k", rating: 4.6 },
      ],
    },
  ]

  const videoTutorials = [
    {
      title: "SafeDriver Platform Overview",
      duration: "12:34",
      views: "25.3k",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Platform+Overview",
      category: "Getting Started",
    },
    {
      title: "Setting Up Your First Fleet",
      duration: "8:45",
      views: "18.7k",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Fleet+Setup",
      category: "Fleet Management",
    },
    {
      title: "Advanced Analytics Features",
      duration: "15:22",
      views: "12.1k",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Analytics+Features",
      category: "Analytics",
    },
    {
      title: "Mobile App Complete Guide",
      duration: "10:18",
      views: "22.8k",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Mobile+App+Guide",
      category: "Mobile",
    },
  ]

  const faqCategories = [
    {
      name: "General",
      count: 24,
      questions: [
        {
          question: "How do I get started with SafeDriver?",
          answer:
            "Getting started is easy! First, create your account and verify your email. Then, add your first vehicle by entering its details and installing the tracking device. Finally, create driver profiles and you're ready to start monitoring your fleet.",
          helpful: 156,
          category: "Getting Started",
        },
        {
          question: "What devices are compatible with SafeDriver?",
          answer:
            "SafeDriver is compatible with a wide range of OBD-II devices, GPS trackers, and smartphones. Our mobile app works on iOS 12+ and Android 8+. For a complete compatibility list, check our device compatibility guide.",
          helpful: 89,
          category: "Technical",
        },
        {
          question: "How accurate is the GPS tracking?",
          answer:
            "Our GPS tracking is accurate to within 3-5 meters under normal conditions. Accuracy may vary in areas with poor satellite coverage such as underground parking or dense urban areas with tall buildings.",
          helpful: 203,
          category: "Technical",
        },
      ],
    },
    {
      name: "Billing",
      count: 18,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All payments are processed securely through our encrypted payment system.",
          helpful: 67,
          category: "Billing",
        },
        {
          question: "Can I change my subscription plan?",
          answer:
            "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades. No cancellation fees apply.",
          helpful: 124,
          category: "Billing",
        },
      ],
    },
    {
      name: "Technical",
      count: 32,
      questions: [
        {
          question: "What should I do if my device goes offline?",
          answer:
            "First, check the device's power connection and ensure it's properly plugged into the OBD-II port. If the issue persists, try restarting your vehicle. For continued problems, contact our technical support team.",
          helpful: 178,
          category: "Technical",
        },
      ],
    },
  ]

  const communityStats = {
    totalUsers: "50,000+",
    activeDiscussions: "1,200+",
    resolvedQuestions: "25,000+",
    averageResponseTime: "2.3 hours",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "available":
        return "bg-blue-500"
      case "busy":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredFAQs = faqCategories.filter(
    (category) => selectedCategory === "all" || category.name.toLowerCase() === selectedCategory,
  )

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="support" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Support
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Docs
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Downloads
          </TabsTrigger>
        </TabsList>

        {/* Support Options */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option) => (
              <Card
                key={option.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100">
                    <option.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(option.status)}`} />
                      <span className="text-sm text-gray-600">{option.availability}</span>
                    </div>
                    <p className="text-sm text-gray-500">Response: {option.responseTime}</p>
                  </div>
                  <Button className="w-full" variant={option.status === "online" ? "default" : "outline"}>
                    {option.action}
                  </Button>
                  {option.phone && <p className="text-sm font-mono text-gray-600">{option.phone}</p>}
                  {option.email && <p className="text-sm font-mono text-gray-600">{option.email}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Help Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Help Topics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quickHelp.map((category) => (
                <Card key={category.category} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">{article.views} views</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-500">{article.rating}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Documentation */}
        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickHelp.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>{category.category}</CardTitle>
                      <CardDescription>{category.articles.length} articles</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Documentation
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Video Tutorials */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoTutorials.map((video, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-white rounded-full p-3">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black bg-opacity-70 text-white">{video.duration}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.views} views</span>
                    <Badge variant="outline">{video.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
            >
              All Categories
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name.toLowerCase() ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name.toLowerCase())}
                size="sm"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredFAQs.map((category) => (
              <Card key={category.name} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <Badge variant="secondary">{category.count} questions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-gray-600 mb-3">{faq.answer}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({faq.helpful})
                          </Button>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{communityStats.totalUsers}</div>
                <div className="text-sm text-gray-600">Community Members</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{communityStats.activeDiscussions}</div>
                <div className="text-sm text-gray-600">Active Discussions</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{communityStats.resolvedQuestions}</div>
                <div className="text-sm text-gray-600">Questions Resolved</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{communityStats.averageResponseTime}</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Connect with other SafeDriver users, share experiences, ask questions, and get help from our community of
              experts and fellow users.
            </p>
            <Button size="lg" className="mr-4">
              Join Community Forum
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Browse Discussions
            </Button>
          </div>
        </TabsContent>

        {/* Downloads */}
        <TabsContent value="downloads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>Mobile Apps</CardTitle>
                    <CardDescription>iOS and Android applications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download for iOS
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Android
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>User guides and manuals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  User Manual (PDF)
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Quick Start Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-8 w-8 text-purple-600" />
                  <div>
                    <CardTitle>Tools & Utilities</CardTitle>
                    <CardDescription>Helper tools and utilities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Device Setup Tool
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Data Export Utility
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
