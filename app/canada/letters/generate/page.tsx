// app/canada/letters/generate/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'
import LetterGenerationForm from '@/components/letters/LetterGenerationForm'

export default async function CanadaGeneratePage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  const user = await getCurrentUser()
  
  if (!user || user.targetCountry !== 'CANADA') {
    redirect('/onboarding/country-select')
  }

  // Check if user has reached letter limit
  const remainingLetters = user.lettersLimit - user.lettersGenerated
  
  let profile = null
  try {
    profile = await ProfileService.getUserProfile(user.id, 'CANADA')
  } catch {
    redirect('/onboarding/profile/personal')
  }

  if (!profile) {
    redirect('/onboarding/profile/personal')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Generate Your Canadian Statement of Purpose</h1>
            <p className="text-muted-foreground">
              Create a professional SOP for your Canadian study permit application
            </p>
          </div>

          {/* Generation Form */}
          <LetterGenerationForm 
            user={user}
            profile={profile}
            country="CANADA"
            remainingLetters={remainingLetters}
          />
        </div>
      </div>
    </div>
  )
}