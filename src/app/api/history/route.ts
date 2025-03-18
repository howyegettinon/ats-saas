import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const rateLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    try {
      await rateLimiter.check(req, 10, 'CACHE_TOKEN');
    } catch {
      return new Response('Too Many Requests', { status: 429 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user with their analyses and cover letters
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
          }
        },
      },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Process the analyses results
    const processedAnalyses = user.analyses.map(analysis => ({
      ...analysis,
      resume: analysis.resume.substring(0, 100) + '...',
      result: JSON.parse(analysis.result),
      createdAt: analysis.createdAt.toISOString(),
    }));

    // Process the cover letter results
    const processedCoverLetters = user.coverLetters.map(letter => ({
      ...letter,
      jobDescription: letter.jobDescription.substring(0, 100) + '...',
      resume: letter.resume.substring(0, 100) + '...',
      result: letter.result,
      createdAt: letter.createdAt.toISOString(),
    }));

    // Error handling for malformed results
    const sanitizedAnalyses = processedAnalyses.map(analysis => {
      try {
        return {
          ...analysis,
          result: typeof analysis.result === 'string' 
            ? JSON.parse(analysis.result) 
            : analysis.result
        };
      } catch (e) {
        console.error('Error parsing analysis result:', e);
        return {
          ...analysis,
          result: { error: 'Could not parse result' }
        };
      }
    });

    const sanitizedCoverLetters = processedCoverLetters.map(letter => {
      try {
        return {
          ...letter,
          result: typeof letter.result === 'string' 
            ? letter.result 
            : JSON.stringify(letter.result)
        };
      } catch (e) {
        console.error('Error processing cover letter result:', e);
        return {
          ...letter,
          result: 'Error processing result'
        };
      }
    });

    return new Response(JSON.stringify({
      analyses: sanitizedAnalyses,
      coverLetters: sanitizedCoverLetters,
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
