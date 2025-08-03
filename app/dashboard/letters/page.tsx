// app/dashboard/letters/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function LettersPage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    redirect('/api/auth/login')
  }

  const letters = await prisma.generatedLetter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  const getLetterIcon = (letterType: string) => {
    switch (letterType) {
      case 'explanation': return '📝'
      case 'study_plan': return '📚'
      case 'financial': return '💰'
      default: return '📄'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Letters</h1>
            <p className="text-gray-600">Manage your generated SOP letters</p>
          </div>
        </div>

        {letters.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">No letters generated yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first SOP letter to get started
              </p>
              <Link href="/dashboard/generate">
                <Button>Generate Your First Letter</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {letters.map((letter) => (
              <Card key={letter.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getLetterIcon(letter.letterType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{letter.title}</h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Created {new Date(letter.createdAt).toLocaleDateString()}</span>
                          <span>{letter.wordCount} words</span>
                          {letter.generationTime && (
                            <span>Generated in {letter.generationTime}ms</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/letters/${letter.id}`}>
                        <Button>View & Edit</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}