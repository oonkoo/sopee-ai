// app/dashboard/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/api/auth/login')
  }

  // Routing logic based on onboarding status
  
  // 1. If user hasn't selected a country, redirect to country selection
  if (!user.targetCountry || user.onboardingStatus === 'COUNTRY_SELECTION') {
    redirect('/onboarding/country-select')
  }

  // 2. If user is in profile creation, redirect to appropriate step
  if (user.onboardingStatus === 'PROFILE_CREATION') {
    const stepRoutes = [
      '/onboarding/profile/personal',     // step 0-1
      '/onboarding/profile/academic',     // step 2
      '/onboarding/profile/target-program', // step 3-4
      '/onboarding/profile/financial',    // step 5-6
      '/onboarding/profile/additional'    // step 7-8
    ]
    
    const stepIndex = Math.min(Math.floor(user.onboardingStep / 2), stepRoutes.length - 1)
    redirect(stepRoutes[stepIndex])
  }

  // 3. If onboarding is completed, redirect to country-specific dashboard
  if (user.onboardingStatus === 'COMPLETED') {
    const countryDashboard = user.targetCountry === 'CANADA' 
      ? '/canada/dashboard' 
      : '/australia/dashboard'
    
    redirect(countryDashboard)
  }

  // Fallback: redirect to country selection
  redirect('/onboarding/country-select')
}