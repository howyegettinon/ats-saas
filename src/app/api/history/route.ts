import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple in-memory rate limiting
const REQUESTS_PER_MINUTE = 60;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitResponse() {
  return new Response('Too Many Requests', {
    status: 429,
    headers: {
      'Retry-After': '60',
    },
  });
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  cleanupOldEntries();

  const userRequests = requestCounts.get(ip);
  if (!userRequests) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + 60000, // 1 minute from now
    });
    return true;
  }

  if (now > userRequests.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + 60000,
    });
    return true;
  }

  if (userRequests.count >= REQUESTS_PER_MINUTE) {
    return false;
  }

  userRequests.count += 1;
  return true;
}

export async function GET(req: NextRequest) {
  try {
    // Get client IP
    const headersList = headers();
    const ip = (headersList.get('x-forwarded-for') || '').split(',')[0] || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return getRateLimitResponse();
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      },
      include: {
        analyses: {
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            resume: true,
            result: true,
            createdAt: true,
            user: {
              select: {
                email: true,
                name: true
              }
            }
          }
        },
        coverLetters: {
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            jobDescription: true,
            resume: true,
            result: true,
            createdAt: true,
            user: {
              select: {
                email: true,
                name: true
              }
            }
          }
        },
      },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Process the analyses results with sanitization
    const processedAnalyses = user.analyses.map(analysis => {
      try {
        return {
          id: analysis.id,
          resume: analysis.resume.length > 100 ? analysis.resume.substring(0, 100) + '...' : analysis.resume,
          result: typeof analysis.result === 'string' ? JSON.parse(analysis.result) : analysis.result,
          createdAt: analysis.createdAt.toISOString(),
          user: analysis.user
        };
      } catch (e) {
        console.error(`Error processing analysis ${analysis.id}:`, e);
        return {
          id: analysis.id,
          resume: 'Error processing resume',
          result: { error: 'Could not parse result' },
          createdAt: analysis.createdAt.toISOString(),
          user: analysis.user
        };
      }
    });

    // Process the cover letter results with sanitization
    const processedCoverLetters = user.coverLetters.map(letter => {
      try {
        return {
          id: letter.id,
          jobDescription: letter.jobDescription.length > 100 ? letter.jobDescription.substring(0, 100) + '...' : letter.jobDescription,
          resume: letter.resume.length > 100 ? letter.resume.substring(0, 100) + '...' : letter.resume,
          result: letter.result,
          createdAt: letter.createdAt.toISOString(),
          user: letter.user
        };
      } catch (e) {
        console.error(`Error processing cover letter ${letter.id}:`, e);
        return {
          id: letter.id,
          jobDescription: 'Error processing job description',
          resume: 'Error processing resume',
          result: 'Error processing result',
          createdAt: letter.createdAt.toISOString(),
          user: letter.user
        };
      }
    });

    return new Response(JSON.stringify({
      analyses: processedAnalyses,
      coverLetters: processedCoverLetters,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('History fetch error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
