// app/api/onboarding/complete/route.ts
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update user's onboarding status to completed
    await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: 8
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Onboarding completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}