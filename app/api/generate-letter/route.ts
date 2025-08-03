// app/api/generate-letter/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/kinde'
import { LetterService } from '@/lib/services/letterService'
import { ProfileService } from '@/lib/services/profileService'
import { prisma } from '@/lib/prisma'
import type { LetterType } from '@/types/letter'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check usage limits
    if (user.lettersGenerated >= user.lettersLimit) {
      return NextResponse.json(
        { error: 'Letter generation limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    const { letterType, profileId }: { letterType: LetterType; profileId: string } = await request.json()

    if (!letterType || !profileId) {
      return NextResponse.json(
        { error: 'Letter type and profile ID are required' },
        { status: 400 }
      )
    }

    console.log('Generating letter:', { letterType, profileId, userId: user.id })

    // Verify profile exists and belongs to user
    const rawProfile = await prisma.studentProfile.findFirst({
      where: { 
        id: profileId,
        userId: user.id 
      }
    })

    if (!rawProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get properly typed profile using ProfileService
    const profile = await ProfileService.getUserProfile(user.id)
    
    if (!profile || profile.id !== profileId) {
      return NextResponse.json(
        { error: 'Profile not found or invalid' },
        { status: 404 }
      )
    }

    console.log('Profile found, generating content...')

    const startTime = Date.now()
    
    // Generate letter using AI
    const generatedContent = await LetterService.generateLetter(letterType, profile)
    
    const generationTime = Date.now() - startTime
    const wordCount = generatedContent.split(' ').length

    console.log('Content generated, saving to database...')

    // Save generated letter
    const letter = await prisma.generatedLetter.create({
      data: {
        userId: user.id,
        profileId,
        letterType,
        title: LetterService.getLetterTitle(letterType),
        content: generatedContent,
        modelUsed: 'gemini-1.5-flash',
        generationTime,
        wordCount
      }
    })

    // Update user letter count
    await prisma.user.update({
      where: { id: user.id },
      data: { lettersGenerated: { increment: 1 } }
    })

    console.log('Letter saved successfully:', letter.id)

    return NextResponse.json({ 
      letter,
      remainingGenerations: user.lettersLimit - user.lettersGenerated - 1
    })

  } catch (error) {
    console.error('Letter generation error:', error)
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to generate letter',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}