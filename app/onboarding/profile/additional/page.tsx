// app/onboarding/profile/additional/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'
import AdditionalInformationForm from '@/components/onboarding/AdditionalInformationForm'

export default async function AdditionalInformationPage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user || !user.targetCountry) {
    redirect('/onboarding/country-select')
  }

  let existingProfile = null
  try {
    existingProfile = await ProfileService.getUserProfile(user.id, user.targetCountry)
  } catch {
    redirect('/onboarding/profile/personal')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AdditionalInformationForm 
            user={user}
            existingProfile={existingProfile}
          />
        </div>
      </div>
    </div>
  )
}