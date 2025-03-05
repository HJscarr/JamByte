import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-900 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          Course Not Found
        </h2>
        <p className="mt-2 text-gray-300">
          The course you're looking for doesn't exist.
        </p>
        <div className="mt-8">
          <Link
            href="/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </div>
  )
} 