import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { getHistory } from '@/lib/storage'
import type { AnalysisEntry } from '@/types/analysis'
import { History as HistoryIcon } from 'lucide-react'

export default function History() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<AnalysisEntry[]>([])
  const [corruptedCount, setCorruptedCount] = useState(0)

  useEffect(() => {
    const { entries: list, corruptedCount: count } = getHistory()
    setEntries(list)
    setCorruptedCount(count)
  }, [])

  function handleSelect(entry: AnalysisEntry) {
    navigate(`/dashboard/results?id=${entry.id}`, { state: { analysisId: entry.id } })
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">History</h2>
        <p className="text-gray-600">Your past job description analyses.</p>
      </div>

      {corruptedCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          One saved entry couldn&apos;t be loaded. Create a new analysis.
        </div>
      )}

      {entries.length === 0 && corruptedCount === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No analyses yet. Analyze a job description to get started.</p>
            <button
              onClick={() => navigate('/dashboard/resources')}
              className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Go to Resources
            </button>
          </CardContent>
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No valid analyses. Create a new analysis.</p>
            <button
              onClick={() => navigate('/dashboard/resources')}
              className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Go to Resources
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleSelect(entry)}
            >
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {entry.company || entry.role || 'Untitled'}
                    {entry.company && entry.role && ` — ${entry.role}`}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(entry.updatedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{entry.finalScore}</span>
                  <span className="text-sm text-gray-500">/ 100</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
