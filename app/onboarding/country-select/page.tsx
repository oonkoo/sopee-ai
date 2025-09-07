// app/onboarding/country-select/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import CountrySelector from '@/components/onboarding/CountrySelector'

export default async function CountrySelectPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/api/auth/login')
  }

  // If user already selected country, redirect to appropriate dashboard
  if (user.targetCountry && user.onboardingStatus === 'COMPLETED') {
    redirect(`/${user.targetCountry.toLowerCase()}/dashboard`)
  }

  // If user is in profile creation, redirect to profile steps
  if (user.targetCountry && user.onboardingStatus === 'PROFILE_CREATION') {
    redirect(`/onboarding/profile/personal`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your Study Destination
            </h1>
            <p className="text-xl text-muted-foreground">
              Select the country where you plan to study to get personalized SOP assistance
            </p>
          </div>

          <CountrySelector user={user} />
        </div>
      </div>
    </div>
  )
}