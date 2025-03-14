'use client'

import { useClientSession } from '@/hooks/useClientSession'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

export default function DashboardContent() {
  const { data: session } = useClientSession()

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-white">ATS SaaS</h1>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                {session?.user?.image && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized // Add this to fix Google image loading issues
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {session?.user?.name}
                  </span>
                  <span className="text-xs text-blue-100">
                    {session?.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-150"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Welcome Section */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {session?.user?.name}!
            </h2>
            <p className="mt-1 text-blue-100">
              Your workspace is ready
            </p>
          </div>

          {/* Account Details */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.email}</dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.name}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  )
}
