'use client'

import { useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-900 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-white">
          Something went wrong!
        </h2>
        <p className="mt-2 text-gray-300">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
} 