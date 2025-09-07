// app/canada/letters/[id]/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LetterViewer from '@/components/letters/LetterViewer'
import LetterActions from '@/components/letters/LetterActions'
import { getModelDisplayName } from '@/lib/config/modelDisplay'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CanadaLetterPage({ params }: PageProps) {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user || user.targetCountry !== 'CANADA') {
    redirect('/onboarding/country-select')
  }

  // Await params to fix NextJS 15 compatibility
  const { id } = await params

  // Fetch the specific letter
  const letter = await prisma.generatedLetter.findFirst({
    where: { 
      id: id,
      userId: user.id,
      country: 'CANADA'
    }
  })

  if (!letter) {
    notFound()
  }

  // Fetch related letters (same type or recent)
  const relatedLetters = await prisma.generatedLetter.findMany({
    where: {
      userId: user.id,
      country: 'CANADA',
      id: {
        not: letter.id
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      letterType: true,
      createdAt: true,
      wordCount: true
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/canada/letters">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Letters
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                  <Image 
                    src="/countries/canada.png" 
                    alt="Canada flag" 
                    width={48} 
                    height={36} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Canada Letter</h1>
                  <p className="text-muted-foreground">
                    Statement of Purpose for Canadian Study Permit
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/canada/letters/generate">
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <FileText className="h-4 w-4" />
                  Generate New
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <LetterViewer 
                letter={letter}
                country="CANADA"
                onFavoriteToggle={async (letterId, isFavorite) => {
                  'use server'
                  await prisma.generatedLetter.update({
                    where: { id: letterId },
                    data: { isFavorite }
                  })
                }}
                onRatingSubmit={async (letterId, rating) => {
                  'use server'
                  await prisma.generatedLetter.update({
                    where: { id: letterId },
                    data: { feedbackRating: rating }
                  })
                }}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
                <h3 className="font-medium mb-4">Quick Actions</h3>
                <LetterActions 
                  letter={letter}
                  country="CANADA"
                  showAll={true}
                  onFavoriteToggle={async (letterId, isFavorite) => {
                    'use server'
                    await prisma.generatedLetter.update({
                      where: { id: letterId },
                      data: { isFavorite }
                    })
                  }}
                  onDelete={async (letterId) => {
                    'use server'
                    await prisma.generatedLetter.delete({
                      where: { id: letterId }
                    })
                  }}
                  onRatingSubmit={async (letterId, rating) => {
                    'use server'
                    await prisma.generatedLetter.update({
                      where: { id: letterId },
                      data: { feedbackRating: rating }
                    })
                  }}
                />
              </div>

              {/* Letter Statistics */}
              <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
                <h3 className="font-medium mb-4">Letter Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Word Count:</span>
                    <span className="font-medium">{letter.wordCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generation Time:</span>
                    <span className="font-medium">{Math.round((letter.generationTime || 0) / 1000)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model Used:</span>
                    <span className="font-medium">{getModelDisplayName(letter.modelUsed || 'AI')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{new Date(letter.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{letter.letterType.toUpperCase()}</span>
                  </div>
                  {letter.feedbackRating && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium">
                        {'★'.repeat(letter.feedbackRating)} ({letter.feedbackRating}/5)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Letters */}
              {relatedLetters.length > 0 && (
                <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
                  <h3 className="font-medium mb-4">Other Letters</h3>
                  <div className="space-y-3">
                    {relatedLetters.map((relatedLetter) => (
                      <Link 
                        key={relatedLetter.id} 
                        href={`/canada/letters/${relatedLetter.id}`}
                        className="block p-3 rounded-lg bg-card/30 border border-border/30 hover:bg-card/50 transition-colors"
                      >
                        <h4 className="font-medium text-sm truncate">{relatedLetter.title}</h4>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{relatedLetter.letterType.toUpperCase()}</span>
                          <span>{relatedLetter.wordCount || 0} words</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(relatedLetter.createdAt).toLocaleDateString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <Link href="/canada/letters">
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      View All Letters
                    </Button>
                  </Link>
                </div>
              )}

              {/* Tips */}
              <div className="bg-red-500/5 backdrop-blur rounded-lg border border-red-500/20 p-4">
                <h3 className="font-medium mb-2 text-red-600">💡 Pro Tips</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Review and personalize the generated content</p>
                  <p>• Check for specific program requirements</p>
                  <p>• Ensure all dates and details are accurate</p>
                  <p>• Consider having it reviewed by an expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  
  const letter = await prisma.generatedLetter.findUnique({
    where: { id: id },
    select: { title: true, letterType: true }
  })

  return {
    title: letter ? `${letter.title} - Canada SOP` : 'Letter Not Found',
    description: letter ? `View your ${letter.letterType} for Canadian study permit application` : 'Letter not found'
  }
}