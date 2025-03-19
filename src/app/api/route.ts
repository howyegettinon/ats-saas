import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
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
  Array.from(requestCounts.entries()).forEach(([key, value]) => {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  });
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
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return getRateLimitResponse();
  }

  try {
    const history = await prisma.history.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
