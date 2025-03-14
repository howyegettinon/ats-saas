'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useClientSession } from '@/hooks/useClientSession'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useClientSession()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button
          onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
