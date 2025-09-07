// app/api/onboarding/profile-step/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, updateOnboardingProgress } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.targetCountry) {
      return NextResponse.json(
        { error: 'Country selection required' },
        { status: 400 }
      )
    }

    const { step, data } = await request.json()

    // Check if profile already exists
    let existingProfile = null
    try {
      existingProfile = await ProfileService.getUserProfile(user.id, user.targetCountry)
    } catch {
      // Profile doesn't exist yet
    }

    // Extract nested values from whyThisCountry for direct profile fields
    if (data.whyThisCountry) {
      if (data.whyThisCountry.whyThisUniversity) {
        data.whyThisUniversity = { text: data.whyThisCountry.whyThisUniversity }
      }
      if (data.whyThisCountry.whyThisCountry) {
        data.countryAdvantages = { text: data.whyThisCountry.whyThisCountry }
      }
    }

    if (existingProfile) {
      // Update existing profile
      await ProfileService.updateProfile(user.id, user.targetCountry, data)
    } else {
      // Create initial profile only on personal info step
      if (step === 'personal' && data.personalInfo) {
        await ProfileService.createInitialProfile(user.id, user.targetCountry, data.personalInfo)
        
        // If there are additional fields in this step, update them
        const additionalData = { ...data }
        delete additionalData.personalInfo // Remove personalInfo since it's already saved
        
        if (Object.keys(additionalData).length > 0) {
          await ProfileService.updateProfile(user.id, user.targetCountry, additionalData)
        }
      } else {
        return NextResponse.json(
          { error: 'Profile must be started with personal information' },
          { status: 400 }
        )
      }
    }

    // Update onboarding progress
    const stepNumber = getStepNumber(step)
    await updateOnboardingProgress(user.id, stepNumber)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Profile step error:', error)
    return NextResponse.json(
      { error: 'Failed to save profile data' },
      { status: 500 }
    )
  }
}

function getStepNumber(step: string): number {
  const stepMap: Record<string, number> = {
    personal: 1,
    'family-background': 2,
    academic: 3,
    'work-experience': 4,
    'target-program': 5,
    'future-plans': 6,
    financial: 7,
    additional: 8
  }
  return stepMap[step] || 1
}