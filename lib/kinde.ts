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