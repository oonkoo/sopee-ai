// app/dashboard/generate/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileService } from '@/lib/services/profileService'
import LetterGenerator from '@/components/letter/LetterGenerator'

export default async function GenerateLetterPage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    redirect('/api/auth/login')
  }

  // Get user data
  const userData = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!userData) {
    redirect('/api/auth/login')
  }

  // Get properly typed profile using ProfileService
  const profile = await ProfileService.getUserProfile(user.id)

  if (!profile) {
    redirect('/dashboard/profile')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Generate SOP Letter</h1>
          <p className="text-gray-600 mt-2">
            Create professional letters for your visa application
          </p>
        </div>

        <LetterGenerator 
          profile={profile}
          user={userData}
        />
      </div>
    </div>
  )
}