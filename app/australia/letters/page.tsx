// app/australia/letters/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'
import AustraliaLettersClient from '@/components/letters/AustraliaLettersClient'

export default async function AustraliaLettersPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user || user.targetCountry !== 'AUSTRALIA') {
    redirect('/onboarding/country-select')
  }

  // Fetch user's letters for Australia
  const letters = await prisma.generatedLetter.findMany({
    where: {
      userId: user.id,
      country: 'AUSTRALIA'
    },
    orderBy: { createdAt: 'desc' }
  })

  return <AustraliaLettersClient initialLetters={letters} user={user} />
}