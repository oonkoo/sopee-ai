// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/kinde'
import { ProfileService } from '@/lib/services/profileService'
import { completeProfileSchema, personalInfoSchema, academicBackgroundSchema, targetProgramSchema, financialInfoSchema } from '@/lib/validations/profile'

interface ValidationError {
  field: string
  message: string
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await ProfileService.getUserProfile(user.id)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate the complete profile data
    const validationResult = completeProfileSchema.safeParse(data)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: errors,
          message: 'Please fill in all required fields correctly'
        },
        { status: 400 }
      )
    }

    // Extract country from target program for profile creation
    const profileData = {
      ...validationResult.data,
      country: validationResult.data.targetProgram.country as 'CANADA' | 'AUSTRALIA'
    }
    
    const profile = await ProfileService.createProfile(user.id, profileData)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate individual sections that are being updated
    const validationErrors: ValidationError[] = []
    
    if (data.personalInfo) {
      const result = personalInfoSchema.safeParse(data.personalInfo)
      if (!result.success) {
        validationErrors.push(...result.error.errors.map(err => ({
          field: `personalInfo.${err.path.join('.')}`,
          message: err.message
        })))
      }
    }
    
    if (data.academicBackground) {
      const result = academicBackgroundSchema.safeParse(data.academicBackground)
      if (!result.success) {
        validationErrors.push(...result.error.errors.map(err => ({
          field: `academicBackground.${err.path.join('.')}`,
          message: err.message
        })))
      }
    }
    
    if (data.targetProgram) {
      const result = targetProgramSchema.safeParse(data.targetProgram)
      if (!result.success) {
        validationErrors.push(...result.error.errors.map(err => ({
          field: `targetProgram.${err.path.join('.')}`,
          message: err.message
        })))
      }
    }
    
    if (data.financialInfo) {
      const result = financialInfoSchema.safeParse(data.financialInfo)
      if (!result.success) {
        validationErrors.push(...result.error.errors.map(err => ({
          field: `financialInfo.${err.path.join('.')}`,
          message: err.message
        })))
      }
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors,
          message: 'Please correct the errors before saving'
        },
        { status: 400 }
      )
    }

    // Determine country from existing profile or from targetProgram if provided
    let country: 'CANADA' | 'AUSTRALIA' = 'AUSTRALIA' // default
    
    if (data.targetProgram?.country) {
      country = data.targetProgram.country as 'CANADA' | 'AUSTRALIA'
    } else {
      // Get country from existing profile
      const existingProfile = await ProfileService.getUserProfile(user.id)
      if (existingProfile) {
        country = existingProfile.country
      }
    }

    const profile = await ProfileService.updateProfile(user.id, country, data)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}