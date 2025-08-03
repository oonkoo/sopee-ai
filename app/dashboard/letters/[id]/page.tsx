// app/dashboard/letters/[id]/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import LetterPreview from '@/components/letter/LetterPreview'

interface LetterPageProps {
  params: Promise<{ id: string }>
}

export default async function LetterPage({ params }: LetterPageProps) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const { id } = await params

  if (!user) {
    redirect('/api/auth/login')
  }

  const letter = await prisma.generatedLetter.findFirst({
    where: { 
      id,
      userId: user.id 
    }
  })

  if (!letter) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <LetterPreview letter={letter} />
      </div>
    </div>
  )
}