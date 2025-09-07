// lib/kinde.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser()
  
  if (!kindeUser) return null

  // Find or create user in database
  let user = await prisma.user.findUnique({
    where: { id: kindeUser.id }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: kindeUser.id,
        email: kindeUser.email!,
        firstName: kindeUser.given_name,
        lastName: kindeUser.family_name,
        // New users start with country selection
        onboardingStatus: 'COUNTRY_SELECTION',
        onboardingStep: 0
      }
    })
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function updateUserCountry(userId: string, country: 'CANADA' | 'AUSTRALIA') {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      targetCountry: country,
      onboardingStatus: 'PROFILE_CREATION',
      onboardingStep: 1
    }
  })
}

export async function updateOnboardingProgress(userId: string, step: number, status?: 'PROFILE_CREATION' | 'COMPLETED') {
  const updateData: { onboardingStep: number; onboardingStatus?: 'PROFILE_CREATION' | 'COMPLETED' } = {
    onboardingStep: step
  }
  
  if (status) {
    updateData.onboardingStatus = status
  }

  return await prisma.user.update({
    where: { id: userId },
    data: updateData
  })
}