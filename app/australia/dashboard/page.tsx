// app/australia/dashboard/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'
import { prisma } from '@/lib/prisma'
import DashboardNavbar from '@/components/DashboardNavbar'
import CountryDashboard from '@/components/CountryDashboard'

export default async function AustraliaDashboardPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/api/auth/login')
  }

  // Redirect if user hasn't selected Australia or completed onboarding
  if (user.targetCountry !== 'AUSTRALIA') {
    redirect('/onboarding/country-select')
  }

  if (user.onboardingStatus !== 'COMPLETED') {
    redirect('/onboarding/profile/personal')
  }

  // Get user profile and recent letters
  const profile = await ProfileService.getUserProfile(user.id, 'AUSTRALIA')
  const recentLettersRaw = await prisma.generatedLetter.findMany({
    where: { 
      userId: user.id,
      country: 'AUSTRALIA'
    },
    select: {
      id: true,
      title: true,
      letterType: true,
      createdAt: true,
      wordCount: true
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  // Transform to match expected type (handle null wordCount)
  const recentLetters = recentLettersRaw.map(letter => ({
    ...letter,
    wordCount: letter.wordCount ?? 0
  }))

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} country="AUSTRALIA" />
      <CountryDashboard 
        user={user}
        profile={profile}
        recentLetters={recentLetters}
        country="AUSTRALIA"
      />
    </div>
  )
}