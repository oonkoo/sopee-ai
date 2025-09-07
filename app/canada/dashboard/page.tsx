// app/canada/dashboard/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'
import { prisma } from '@/lib/prisma'
import DashboardNavbar from '@/components/DashboardNavbar'
import CountryDashboard from '@/components/CountryDashboard'

export default async function CanadaDashboardPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/api/auth/login')
  }

  // Redirect if user hasn't selected Canada or completed onboarding
  if (user.targetCountry !== 'CANADA') {
    redirect('/onboarding/country-select')
  }

  if (user.onboardingStatus !== 'COMPLETED') {
    redirect('/onboarding/profile/personal')
  }

  // Get user profile and recent letters
  const profile = await ProfileService.getUserProfile(user.id, 'CANADA')
  const recentLettersRaw = await prisma.generatedLetter.findMany({
    where: { 
      userId: user.id,
      country: 'CANADA'
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })
  
  // Transform letters to ensure wordCount is never null
  const recentLetters = recentLettersRaw.map(letter => ({
    id: letter.id,
    title: letter.title,
    letterType: letter.letterType,
    createdAt: letter.createdAt,
    wordCount: letter.wordCount ?? 0
  }))

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} country="CANADA" />
      <CountryDashboard 
        user={user}
        profile={profile}
        recentLetters={recentLetters}
        country="CANADA"
      />
    </div>
  )
}