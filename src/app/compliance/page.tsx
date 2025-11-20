import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegulatoryMonitoring } from "@/components/compliance/regulatory-monitoring"

export default function CompliancePage() {
  return (
    <Tabs defaultValue="privacy" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="terms">Terms</TabsTrigger>
        <TabsTrigger value="regulatory">Regulatory Monitoring</TabsTrigger>
      </TabsList>
      <TabsContent value="privacy">Make changes to your privacy policy here.</TabsContent>
      <TabsContent value="terms">Update your terms and conditions here.</TabsContent>
      <TabsContent value="regulatory">
        <RegulatoryMonitoring />
      </TabsContent>
    </Tabs>
  )
}
