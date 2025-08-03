// app/dashboard/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { TargetProgram } from '@/types/profile'

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    redirect('/api/auth/login')
  }

  // Get user data with profile and recent letters
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profiles: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      },
      letters: {
        take: 3,
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  const profile = userData?.profiles[0]
  const hasProfile = !!profile
  const recentLetters = userData?.letters || []
  
  // Type cast JSON data safely
  const targetProgram = profile?.targetProgram as TargetProgram | null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">SOP AI Generator</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm">
                {hasProfile ? 'Edit Profile' : 'Create Profile'}
              </Button>
            </Link>
            <Link href="/dashboard/letters">
              <Button variant="outline" size="sm">
                My Letters
              </Button>
            </Link>
            <span>Welcome, {user.given_name || user.email}</span>
            <LogoutLink>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </LogoutLink>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
          
          {!hasProfile && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-yellow-800">Complete Your Profile</h3>
                  <p className="text-sm text-yellow-700">Create your student profile to start generating SOP letters</p>
                </div>
                <Link href="/dashboard/profile">
                  <Button>Create Profile</Button>
                </Link>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Letters Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {userData?.lettersGenerated || 0} / {userData?.lettersLimit || 3}
                </p>
                <p className="text-sm text-gray-600">
                  {userData?.subscriptionType || 'Free'} plan limit
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                {hasProfile ? (
                  <div>
                    <p className="text-sm text-green-600 font-medium">✓ Profile Complete</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Target: {targetProgram?.university || 'Not specified'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-orange-600">Profile Incomplete</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 capitalize">
                  {userData?.subscriptionType || 'Free'} Plan
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {userData?.lettersLimit || 3} letters per month
                </p>
              </CardContent>
            </Card>
          </div>

          {hasProfile && (
            <>
              {/* Generate Letters Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Generate New Letter</h3>
                  <Link href="/dashboard/generate">
                    <Button>View All Options</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/dashboard/generate">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-2">📝</div>
                        <h4 className="font-medium mb-2">Letter of Explanation</h4>
                        <p className="text-sm text-gray-600 mb-4">Address gaps and demonstrate intent</p>
                        <Button className="w-full" size="sm">Generate</Button>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/dashboard/generate">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-2">📚</div>
                        <h4 className="font-medium mb-2">Study Plan</h4>
                        <p className="text-sm text-gray-600 mb-4">Academic timeline and goals</p>
                        <Button className="w-full" size="sm">Generate</Button>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/dashboard/generate">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-2">💰</div>
                        <h4 className="font-medium mb-2">Financial Statement</h4>
                        <p className="text-sm text-gray-600 mb-4">Funding breakdown</p>
                        <Button className="w-full" size="sm">Generate</Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>

              {/* Recent Letters */}
              {recentLetters.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Recent Letters</h3>
                    <Link href="/dashboard/letters">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentLetters.map((letter) => (
                      <Card key={letter.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{letter.title}</h4>
                              <p className="text-sm text-gray-600">
                                Created {new Date(letter.createdAt).toLocaleDateString()} • 
                                {letter.wordCount} words
                              </p>
                            </div>
                            <Link href={`/dashboard/letters/${letter.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}