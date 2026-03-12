"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function CreateReportPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("create_report") || "Create Report"}</h1>
        <p className="text-gray-600 mt-2">{t("create_report_desc") || "Create a new custom report."}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("report_details") || "Report Details"}</CardTitle>
          <CardDescription>{t("configure_new_report") || "Configure your new report"}</CardDescription>
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
