'use client'

import { useState } from 'react'
import { useClientSession } from '@/hooks/useClientSession'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'CV Analyzer', href: '/dashboard/cv-analyzer' },
  { name: 'Cover Letter', href: '/dashboard/cover-letter' },
]

export default function DashboardContent() {
  const { data: session } = useClientSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                CVGenius
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {session?.user?.image && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {session?.user?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {session?.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Sign out
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 border-b border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-3 border-t border-gray-100 mt-2">
                {session?.user?.image && (
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {session?.user?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Sign out
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Welcome Section */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {session?.user?.name}!
            </h2>
            <p className="mt-1 text-blue-100">
              Your workspace is ready
            </p>
          </div>

          {/* Account Details */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Account Details
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.email}</dd>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
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
