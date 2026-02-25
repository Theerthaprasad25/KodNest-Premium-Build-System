import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalysisById, getLatestAnalysis } from '@/lib/storage'
import type { AnalysisResult } from '@/types/analysis'
import type { SkillCategory } from '@/types/analysis'

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  'Core CS': 'Core CS',
  Languages: 'Languages',
  Web: 'Web',
  Data: 'Data',
  'Cloud/DevOps': 'Cloud/DevOps',
  Testing: 'Testing',
  General: 'General',
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const idFromState = (location.state as { analysisId?: string } | null)?.analysisId
    const idFromUrl = searchParams.get('id')
    const id = idFromState ?? idFromUrl
    if (id) {
      const found = getAnalysisById(id)
      setResult(found)
    } else {
      setResult(getLatestAnalysis())
    }
  }, [location.state, searchParams])

  if (!result) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No analysis found. Analyze a job description first.</p>
            <button
              onClick={() => navigate('/dashboard/resources')}
              className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Go to Resources
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { company, role, extractedSkills, checklist, plan, questions, readinessScore } = result

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600">
            {company && role ? `${company} — ${role}` : company || role || 'Job Description Analysis'}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/history')}
          className="text-sm text-primary hover:underline"
        >
          View History
        </button>
      </div>

      {/* Readiness Score */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{readinessScore}</span>
            </div>
            <p className="text-gray-600">/ 100</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Skills Extracted */}
      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(
              Object.entries(extractedSkills.categories) as [SkillCategory, string[]][]
            ).map(([cat, skills]) => {
              if (skills.length === 0) return null
              return (
                <div key={cat}>
                  <p className="text-sm font-medium text-gray-500 mb-2">{CATEGORY_LABELS[cat]}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {checklist.map((round) => (
              <div key={round.round}>
                <h4 className="font-semibold text-gray-900 mb-2">{round.round}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {round.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.map((day) => (
              <div key={day.days} className="border-l-2 border-primary/30 pl-4">
                <p className="font-semibold text-gray-900">{day.days}: {day.focus}</p>
                <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                  {day.tasks.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 10 Likely Interview Questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
