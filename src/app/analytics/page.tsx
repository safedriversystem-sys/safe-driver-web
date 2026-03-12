"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function AnalyticsPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("analytics") || "Analytics"}</h1>
        <p className="text-gray-600 mt-2">{t("analytics_desc") || "View detailed analytics and system performance."}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("performance_metrics") || "Performance Metrics"}</CardTitle>
          <CardDescription>{t("detailed_breakdown") || "A detailed breakdown of key metrics"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500 bg-gray-50/50">
            Empty Screen - Content to be added
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
