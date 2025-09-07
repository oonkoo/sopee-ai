// app/canada/letters/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'
import CanadaLettersClient from '@/components/letters/CanadaLettersClient'

export default async function CanadaLettersPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user || user.targetCountry !== 'CANADA') {
    redirect('/onboarding/country-select')
  }

  // Fetch user's letters for Canada
  const letters = await prisma.generatedLetter.findMany({
    where: {
      userId: user.id,
      country: 'CANADA'
    },
    orderBy: { createdAt: 'desc' }
  })

  return <CanadaLettersClient initialLetters={letters} user={user} />
}