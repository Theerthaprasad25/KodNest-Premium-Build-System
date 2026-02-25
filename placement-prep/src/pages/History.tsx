import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { getHistory } from '@/lib/storage'
import type { AnalysisResult } from '@/types/analysis'

function getLiveScore(result: AnalysisResult): number {
  const map = result.skillConfidenceMap ?? {}
  const skills: string[] = []
  for (const arr of Object.values(result.extractedSkills.categories)) {
    skills.push(...arr)
  }
  let score = result.readinessScore
  for (const s of skills) {
    score += (map[s] ?? 'practice') === 'know' ? 2 : -2
  }
  return Math.max(0, Math.min(100, score))
}

import { History as HistoryIcon } from 'lucide-react'

export default function History() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<AnalysisResult[]>([])

  useEffect(() => {
    setEntries(getHistory())
  }, [])

  function handleSelect(entry: AnalysisResult) {
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

      {entries.length === 0 ? (
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
                  <p className="text-sm text-gray-500">{formatDate(entry.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{getLiveScore(entry)}</span>
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
