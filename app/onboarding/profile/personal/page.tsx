// app/onboarding/profile/personal/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'
import PersonalInfoForm from '@/components/onboarding/PersonalInfoForm'

export default async function PersonalInfoPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/api/auth/login')
  }

  // If user hasn't selected country, redirect to country selection
  if (!user.targetCountry) {
    redirect('/onboarding/country-select')
  }

  // Check if user already has a profile for this country
  let existingProfile = null
  try {
    existingProfile = await ProfileService.getUserProfile(user.id, user.targetCountry)
  } catch {
    // Profile doesn't exist yet, continue with creation
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PersonalInfoForm 
            user={user}
            existingProfile={existingProfile}
          />
        </div>
      </div>
    </div>
  )
}