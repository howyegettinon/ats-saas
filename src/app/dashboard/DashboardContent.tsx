'use client'

import { useClientSession } from '@/hooks/useClientSession'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

export default function DashboardContent() {
  const { data: session } = useClientSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ATS SaaS</h1>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                {session?.user?.image && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="ml-4 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {/* Welcome Section */}
            <div className="px-6 py-5">
              <h2 className="text-lg font-medium text-gray-900">
                Welcome back, {session?.user?.name}!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your last login was with Google Authentication
              </p>
            </div>

            {/* Account Details */}
            <div className="px-6 py-5">
              <h3 className="text-md font-medium text-gray-900">Account Details</h3>
              <dl className="mt-3 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session?.user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session?.user?.name}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
