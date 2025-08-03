// app/page.tsx
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered SOP Letter Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create professional Statement of Purpose letters for your visa application in minutes
          </p>
          
          <div className="flex gap-4 justify-center">
            <LoginLink>
              <Button size="lg" className="px-8">
                Login
              </Button>
            </LoginLink>
            <RegisterLink>
              <Button variant="outline" size="lg" className="px-8">
                Sign Up Free
              </Button>
            </RegisterLink>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Letter of Explanation</h3>
              <p className="text-gray-600">Address gaps and demonstrate genuine intent</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Study Plan</h3>
              <p className="text-gray-600">Detailed academic timeline and career goals</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Financial Statement</h3>
              <p className="text-gray-600">Comprehensive funding and expense breakdown</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}