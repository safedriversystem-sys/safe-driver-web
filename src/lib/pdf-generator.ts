import jsPDF from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"
import {
  generateAlertDistributionChart,
  generateAlertTrendChart,
  generateRouteSafetyRadarChart,
  generateComplianceChart,
} from "./chart-generator"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface ReportData {
  type: string
  title: string
  dateRange: string
  data: any
  format?: string
}

export const generatePDFReport = async (reportData: ReportData) => {
  const { type, title, dateRange, data } = reportData

  // Create new PDF document
  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Add header with logo and title
  addHeader(doc, title, dateRange, yPosition)
  yPosition += 40

  // Add executive summary
  yPosition = addExecutiveSummary(doc, data.summary, yPosition)
  yPosition += 10

  // Add content based on report type
  switch (type) {
    case "daily-summary":
      yPosition = await addDailySummaryContent(doc, data, yPosition)
      break
    case "driver-performance":
      yPosition = await addDriverPerformanceContent(doc, data, yPosition)
      break
    case "fleet-analytics":
      yPosition = await addFleetAnalyticsContent(doc, data, yPosition)
      break
    case "route-safety":
      yPosition = await addRouteSafetyContent(doc, data, yPosition)
      break
    case "compliance":
      yPosition = await addComplianceContent(doc, data, yPosition)
      break
    case "incident-detailed":
      yPosition = await addIncidentDetailedContent(doc, data, yPosition)
      break
    default:
      yPosition = await addDefaultContent(doc, data, yPosition)
  }

  // Add recommendations
  yPosition = addRecommendations(doc, yPosition)

  // Add footer
  addFooter(doc)

  // Save the PDF
  const fileName = `SafeDriver-${type}-Report-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`
  doc.save(fileName)
}

const addHeader = (doc: jsPDF, title: string, dateRange: string, yPos: number) => {
  // Add company logo area (placeholder)
  doc.setFillColor(59, 130, 246) // Blue color
  doc.rect(20, yPos, 30, 20, "F")

  // Add logo text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("SafeDriver", 22, yPos + 8)
  doc.text("Authority", 22, yPos + 15)

  // Add title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(title, 60, yPos + 8)

  // Add generation info
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated on: ${format(new Date(), "PPP pp")}`, 60, yPos + 18)
  doc.text(`Report Period: ${dateRange}`, 60, yPos + 25)

  // Add horizontal line
  doc.setLineWidth(0.5)
  doc.line(20, yPos + 35, 190, yPos + 35)
}

const addExecutiveSummary = (doc: jsPDF, summary: any, yPos: number) => {
  // Check if we need a new page
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Executive Summary", 20, yPos)
  yPos += 10

  // Create summary cards in a grid
  const cardWidth = 40
  const cardHeight = 25
  const cardSpacing = 5
  const startX = 20
  let currentX = startX
  let currentY = yPos

  const summaryItems = [
    { label: "Total Alerts", value: summary.totalAlerts?.toString() || "0", color: [220, 38, 38] },
    { label: "Active Drivers", value: summary.activeDrivers?.toString() || "0", color: [37, 99, 235] },
    { label: "System Uptime", value: `${summary.systemUptime || 0}%`, color: [22, 163, 74] },
  ]

  summaryItems.forEach((item, index) => {
    if (index > 0 && index % 4 === 0) {
      currentY += cardHeight + cardSpacing
      currentX = startX
    }

    // Draw card background
    doc.setFillColor(248, 250, 252)
    doc.rect(currentX, currentY, cardWidth, cardHeight, "F")

    // Draw card border
    doc.setDrawColor(226, 232, 240)
    doc.rect(currentX, currentY, cardWidth, cardHeight)

    // Add label
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 116, 139)
    doc.text(item.label, currentX + 2, currentY + 6)

    // Add value
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(item.color[0], item.color[1], item.color[2])
    doc.text(item.value, currentX + 2, currentY + 15)

    currentX += cardWidth + cardSpacing
  })

  return currentY + cardHeight + 10
}

const addDailySummaryContent = async (doc: jsPDF, data: any, yPos: number) => {
  // Add alert distribution chart
  yPos = await addSectionTitle(doc, "Alert Distribution", yPos)

  try {
    // Generate alert distribution chart
    const alertChartImage = await generateAlertDistributionChart(data.alerts)

    // Add chart to PDF
    doc.addImage(alertChartImage, "PNG", 30, yPos, 150, 90)
    yPos += 100
  } catch (error) {
    console.error("Error adding alert chart:", error)
    yPos += 10
  }

  // Alert Analysis Table
  yPos = addSectionTitle(doc, "Alert Analysis", yPos)

  const alertHeaders = ["Alert Type", "Count", "High", "Medium", "Low", "Avg Response"]
  const alertData =
    data.alerts?.map((alert: any) => [
      alert.type,
      alert.count.toString(),
      alert.high.toString(),
      alert.medium.toString(),
      alert.low.toString(),
      alert.avgResponse,
    ]) || []

  doc.autoTable({
    head: [alertHeaders],
    body: alertData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Add alert trend chart
  doc.addPage()
  yPos = 20
  yPos = await addSectionTitle(doc, "Alert Trends Over Time", yPos)

  try {
    // Generate alert trend chart
    const trendChartImage = await generateAlertTrendChart(data)

    // Add chart to PDF
    doc.addImage(trendChartImage, "PNG", 20, yPos, 170, 100)
    yPos += 110
  } catch (error) {
    console.error("Error adding trend chart:", error)
    yPos += 10
  }

  // Driver Performance Table
  yPos = addSectionTitle(doc, "Driver Performance Summary", yPos)

  const driverHeaders = ["Driver Name", "License", "Bus", "Route", "Alerts"]
  const driverData =
    data.drivers
      ?.slice(0, 5)
      .map((driver: any) => [
        driver.name,
        driver.license,
        driver.bus,
        driver.route,
        driver.alerts.toString(),
      ]) || []

  doc.autoTable({
    head: [driverHeaders],
    body: driverData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

const addDriverPerformanceContent = async (doc: jsPDF, data: any, yPos: number) => {
  // Driver performance table
  yPos = addSectionTitle(doc, "Detailed Driver Performance", yPos)

  const headers = ["Driver Name", "License", "Bus", "Route", "Total Alerts", "Status"]
  const tableData =
    data.drivers?.map((driver: any) => [
      driver.name,
      driver.license,
      driver.bus,
      driver.route,
      driver.alerts.toString(),
      driver.status,
    ]) || []

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
    columnStyles: {
      4: { halign: "center" }, // Total Alerts
      5: { halign: "center" }, // Status
    },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

const addFleetAnalyticsContent = async (doc: jsPDF, data: any, yPos: number) => {
  // Add route safety radar chart
  yPos = await addSectionTitle(doc, "Route Safety Analysis", yPos)

  try {
    // Generate route safety radar chart
    const radarChartImage = await generateRouteSafetyRadarChart(data.routes)

    // Add chart to PDF
    doc.addImage(radarChartImage, "PNG", 30, yPos, 150, 120)
    yPos += 130
  } catch (error) {
    console.error("Error adding radar chart:", error)
    yPos += 10
  }

  // Fleet analytics table
  yPos = addSectionTitle(doc, "Fleet Analytics Overview", yPos)

  const headers = ["Route", "Buses", "Drivers", "Distance", "Risk Areas"]
  const tableData =
    data.routes?.map((route: any) => [
      route.name,
      route.buses.toString(),
      route.drivers.toString(),
      route.distance,
      route.riskAreas,
    ]) || []

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

const addRouteSafetyContent = async (doc: jsPDF, data: any, yPos: number) => {
  // Add route safety radar chart
  yPos = await addSectionTitle(doc, "Route Safety Analysis", yPos)

  try {
    // Generate route safety radar chart
    const radarChartImage = await generateRouteSafetyRadarChart(data.routes)

    // Add chart to PDF
    doc.addImage(radarChartImage, "PNG", 30, yPos, 150, 120)
    yPos += 130
  } catch (error) {
    console.error("Error adding radar chart:", error)
    yPos += 10
  }

  // Route safety table
  yPos = addSectionTitle(doc, "Route Safety Details", yPos)

  const headers = ["Route Category", "Total Buses", "Active Drivers", "High Risk Areas"]
  const tableData =
    data.routes?.map((route: any) => [
      route.name,
      route.buses.toString(),
      route.drivers.toString(),
      route.riskAreas,
    ]) || []

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

const addComplianceContent = async (doc: jsPDF, data: any, yPos: number) => {
  // Add compliance chart
  yPos = await addSectionTitle(doc, "Compliance Overview", yPos)

  try {
    // Generate compliance chart
    const complianceChartImage = await generateComplianceChart(data.compliance)

    // Add chart to PDF
    doc.addImage(complianceChartImage, "PNG", 30, yPos, 150, 150)
    yPos += 160
  } catch (error) {
    console.error("Error adding compliance chart:", error)
    yPos += 10
  }

  // Compliance table
  yPos = addSectionTitle(doc, "Regulatory Compliance Status", yPos)

  const compliance = data.compliance || {}
  const headers = ["Compliance Area", "Status (%)", "Rating"]
  const tableData = [
    [
      "Driver License Validity",
      `${compliance.driverLicenseValidity || 0}%`,
      getComplianceRating(compliance.driverLicenseValidity),
    ],
    [
      "Vehicle Inspections",
      `${compliance.vehicleInspections || 0}%`,
      getComplianceRating(compliance.vehicleInspections),
    ],
    ["Safety Training", `${compliance.safetyTraining || 0}%`, getComplianceRating(compliance.safetyTraining)],
    [
      "Emergency Protocols",
      `${compliance.emergencyProtocols || 0}%`,
      getComplianceRating(compliance.emergencyProtocols),
    ],
    ["Data Reporting", `${compliance.dataReporting || 0}%`, getComplianceRating(compliance.dataReporting)],
  ]

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

const addIncidentDetailedContent = async (doc: jsPDF, data: any, yPos: number) => {
  // Add alert distribution chart
  yPos = await addSectionTitle(doc, "Incident Type Distribution", yPos)

  try {
    // Generate alert distribution chart
    const alertChartImage = await generateAlertDistributionChart(data.alerts)

    // Add chart to PDF
    doc.addImage(alertChartImage, "PNG", 30, yPos, 150, 90)
    yPos += 100
  } catch (error) {
    console.error("Error adding alert chart:", error)
    yPos += 10
  }

  // Incident table
  yPos = addSectionTitle(doc, "Detailed Incident Analysis", yPos)

  const headers = ["Incident ID", "Date", "Time", "Driver", "Type", "Severity", "Location", "Status"]
  const tableData =
    data.incidents?.map((incident: any) => [
      incident.id,
      incident.date,
      incident.time,
      incident.driver,
      incident.type,
      incident.severity,
      incident.location,
      incident.resolved ? "Resolved" : "Pending",
    ]) || []

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: yPos,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 8 },
    margin: { left: 20, right: 20 },
  })

  return (doc as any).lastAutoTable.finalY + 10
}

const addDefaultContent = async (doc: jsPDF, data: any, yPos: number) => {
  return await addDailySummaryContent(doc, data, yPos)
}

const addSectionTitle = (doc: jsPDF, title: string, yPos: number) => {
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text(title, 20, yPos)

  return yPos + 10
}

const addRecommendations = (doc: jsPDF, yPos: number) => {
  // Check if we need a new page
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  yPos = addSectionTitle(doc, "Recommendations", yPos)

  const recommendations = [
    "Implement additional drowsiness awareness training for drivers with high alert counts",
    "Consider additional rest stops on high-risk routes at identified danger areas",
    "Deploy additional monitoring units on buses with frequent safety alerts",
    "Update phone usage policies and enforcement procedures for better compliance",
    "Schedule regular safety briefings and performance review sessions",
    "Implement route optimization based on incident distribution analysis",
  ]

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  recommendations.forEach((rec, index) => {
    const bulletPoint = `• ${rec}`
    const lines = doc.splitTextToSize(bulletPoint, 150)

    lines.forEach((line: string, lineIndex: number) => {
      doc.text(line, 25, yPos)
      yPos += 5
    })
    yPos += 2
  })

  return yPos
}

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    // Add footer line
    doc.setLineWidth(0.5)
    doc.line(20, 280, 190, 280)

    // Add footer text
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 116, 139)

    doc.text("SafeDriver Authority Panel - Transport Safety Management System", 20, 285)
    doc.text("For technical support: support@safedriver.lk | +94 11 123 4567", 20, 290)
    doc.text(`Page ${i} of ${pageCount}`, 170, 285)
    doc.text(`© 2025 SafeDriver System. All rights reserved.`, 20, 295)
  }
}

const getComplianceRating = (score: number): string => {
  if (score >= 95) return "Excellent"
  if (score >= 85) return "Good"
  if (score >= 75) return "Fair"
  return "Needs Improvement"
}
