import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { areAllTestsPassed } from '@/lib/testChecklistStorage'
import { Lock, Package } from 'lucide-react'

export default function Ship() {
  const [unlocked, setUnlocked] = useState(false)

  function recheck() {
    setUnlocked(areAllTestsPassed())
  }

  useEffect(() => {
    recheck()
  }, [])

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Ship</h2>
          <p className="text-gray-600">Complete all tests to unlock.</p>
        </div>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship locked</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Complete all 10 tests in the Test Checklist before shipping.
            </p>
            <div className="flex gap-3">
              <Link
                to="/prp/07-test"
                className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Go to Test Checklist
              </Link>
              <button
                onClick={recheck}
                className="px-6 py-2 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Check again
              </button>
            </div>
          </CardContent>
        </Card>

        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ship</h2>
        <p className="text-gray-600">All tests passed. Ready to ship.</p>
      </div>

      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to ship</h3>
          <p className="text-gray-600">
            All 10 tests passed. The Placement Readiness Platform is ready for deployment.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          ← Back to Dashboard
        </Link>
        <Link to="/prp/07-test" className="text-sm text-primary hover:underline">
          Test Checklist
        </Link>
      </div>
    </div>
    </div>
  )
}
