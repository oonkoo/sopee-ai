// app/australia/letters/[id]/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LetterDetailClient from '@/components/letters/LetterDetailClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AustraliaLetterPage({ params }: PageProps) {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user || user.targetCountry !== 'AUSTRALIA') {
    redirect('/onboarding/country-select')
  }

  // Await params to fix NextJS 15 compatibility
  const { id } = await params

  // Fetch the specific letter
  const letter = await prisma.generatedLetter.findFirst({
    where: { 
      id: id,
      userId: user.id,
      country: 'AUSTRALIA'
    }
  })

  if (!letter) {
    notFound()
  }

  // Fetch related letters (same type or recent)
  const relatedLetters = await prisma.generatedLetter.findMany({
    where: {
      userId: user.id,
      country: 'AUSTRALIA',
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
              <Link href="/australia/letters">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Letters
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 p-3">
                  <Image 
                    src="/countries/australia.png" 
                    alt="Australia flag" 
                    width={48} 
                    height={36} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Australia Letter</h1>
                  <p className="text-muted-foreground">
                    Statement of Purpose for Australian Student Visa
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/australia/letters/generate">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <FileText className="h-4 w-4" />
                  Generate New
                </Button>
              </Link>
            </div>
          </div>

          <LetterDetailClient
            letter={letter}
            country="AUSTRALIA"
            relatedLetters={relatedLetters}
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
            onContentUpdate={async (letterId) => {
              'use server'
              // Content is already updated via API call in LetterViewer
              // This callback can be used for additional actions like refreshing data
              // For now, we'll just log that the update happened
              console.log('Letter content updated:', letterId)
            }}
          />
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
    title: letter ? `${letter.title} - Australia SOP` : 'Letter Not Found',
    description: letter ? `View your ${letter.letterType} for Australian student visa application` : 'Letter not found'
  }
}