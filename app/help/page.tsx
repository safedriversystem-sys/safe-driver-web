export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the help you need to make the most of your SafeDriver experience. Find answers, contact support, or
            explore our comprehensive documentation.
          </p>
        </div>

        <HelpSupport />
      </div>
    </div>
  )
}

import { HelpSupport } from "@/components/help/help-support"
