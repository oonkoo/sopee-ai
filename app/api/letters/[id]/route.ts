// app/api/letters/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { getCurrentUser } from '@/lib/kinde'
import { prisma } from '@/lib/prisma'

export async function DELETE(
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

    await prisma.generatedLetter.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Letter deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting letter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    return NextResponse.json({ 
      success: true,
      letter
    })

  } catch (error) {
    console.error('Error fetching letter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const body = await req.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const resolvedParams = await params

    // Verify the letter belongs to the user
    const letter = await prisma.generatedLetter.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id
      }
    })

    if (!letter) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
    }

    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length

    // Update the letter
    const updatedLetter = await prisma.generatedLetter.update({
      where: { id: resolvedParams.id },
      data: {
        content,
        wordCount
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Letter updated successfully',
      letter: updatedLetter
    })

  } catch (error) {
    console.error('Error updating letter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}