// app/api/onboarding/country-select/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, updateUserCountry } from '@/lib/kinde'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { country } = await request.json()

    if (!country || !['CANADA', 'AUSTRALIA'].includes(country)) {
      return NextResponse.json(
        { error: 'Valid country selection required' },
        { status: 400 }
      )
    }

    // Update user's target country and onboarding status
    const updatedUser = await updateUserCountry(user.id, country)

    return NextResponse.json({ 
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('Country selection error:', error)
    return NextResponse.json(
      { error: 'Failed to save country selection' },
      { status: 500 }
    )
  }
}