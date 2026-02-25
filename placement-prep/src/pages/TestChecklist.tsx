import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getTestChecklist,
  saveTestChecklist,
  resetTestChecklist,
  TEST_ITEMS,
  getTestsPassedCount,
} from '@/lib/testChecklistStorage'
import { CheckSquare, Square, RotateCcw } from 'lucide-react'

export default function TestChecklist() {
  const [state, setState] = useState(getTestChecklist())

  useEffect(() => {
    setState(getTestChecklist())
  }, [])

  const passed = getTestsPassedCount()
  const total = TEST_ITEMS.length
  const allPassed = passed === total

  function toggle(id: string) {
    const next = { ...state, [id]: !state[id] }
    setState(next)
    saveTestChecklist(next)
  }

  function reset() {
    const cleared = resetTestChecklist()
    setState(cleared)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Test Checklist</h2>
        <p className="text-gray-600">Verify all tests pass before shipping.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tests Passed: {passed} / {total}</CardTitle>
          {!allPassed && (
            <p className="text-amber-600 text-sm font-medium mt-2">
              Fix issues before shipping.
            </p>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Checklist</CardTitle>
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset checklist
          </button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {TEST_ITEMS.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <button
                  onClick={() => toggle(item.id)}
                  className="mt-0.5 shrink-0 text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  aria-label={state[item.id] ? 'Uncheck' : 'Check'}
                >
                  {state[item.id] ? (
                    <CheckSquare className="w-6 h-6 text-primary" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={state[item.id] ? 'line-through text-gray-500' : 'text-gray-900'}>
                      {item.label}
                    </span>
                  </div>
                  {item.hint && (
                    <p className="text-sm text-gray-500 mt-1">How to test: {item.hint}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link
          to="/dashboard"
          className="text-sm text-primary hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <Link
          to="/prp/08-ship"
          className="text-sm text-primary hover:underline"
        >
          Go to Ship →
        </Link>
      </div>
    </div>
    </div>
  )
}
