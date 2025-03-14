import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        coverLetters: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    return NextResponse.json({
      analyses: user?.analyses || [],
      coverLetters: user?.coverLetters || [],
    })

  } catch (error: any) {
    console.error('History error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
