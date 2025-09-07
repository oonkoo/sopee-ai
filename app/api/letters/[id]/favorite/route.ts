// app/api/letters/[id]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession()
    const kindeUser = await getUser()

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { isFavorite } = await req.json()
    const resolvedParams = await params

    const letter = await prisma.generatedLetter.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id
      }
    })

    if (!letter) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
    }

    const updatedLetter = await prisma.generatedLetter.update({
      where: { id: resolvedParams.id },
      data: { isFavorite }
    })

    return NextResponse.json({ 
      success: true, 
      letter: updatedLetter 
    })

  } catch (error) {
    console.error('Error updating favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}