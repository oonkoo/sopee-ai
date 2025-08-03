// app/dashboard/profile/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { ProfileService } from '@/lib/services/profileService'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()

  if (!kindeUser) {
    redirect('/api/auth/login')
  }

  let existingProfile = null
  try {
    existingProfile = await ProfileService.getUserProfile(kindeUser.id)
  } catch (error) {
    console.error('Error fetching profile:', error)
    // Continue with null profile to show creation form
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {existingProfile ? 'Update Profile' : 'Create Student Profile'}
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to generate personalized SOP letters
          </p>
        </div>

        <ProfileForm 
          initialData={existingProfile}
          isUpdate={!!existingProfile}
        />
      </div>
    </div>
  )
}