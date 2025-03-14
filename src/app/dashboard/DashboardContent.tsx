'use client'

import { useClientSession } from '@/hooks/useClientSession'

export default function DashboardContent() {
  const { data: session } = useClientSession()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session?.user?.name}!
      </h1>
      {/* Add your dashboard content here */}
    </div>
  )
}
