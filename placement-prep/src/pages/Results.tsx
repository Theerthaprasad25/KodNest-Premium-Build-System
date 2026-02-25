import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalysisById, getLatestAnalysis, updateAnalysis } from '@/lib/storage'
import type { AnalysisResult, SkillCategory, SkillConfidence } from '@/types/analysis'
import { Copy, Download, CheckCircle } from 'lucide-react'

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  'Core CS': 'Core CS',
  Languages: 'Languages',
  Web: 'Web',
  Data: 'Data',
  'Cloud/DevOps': 'Cloud/DevOps',
  Testing: 'Testing',
  General: 'General',
}

function getAllSkills(extractedSkills: AnalysisResult['extractedSkills']): string[] {
  const skills: string[] = []
  for (const arr of Object.values(extractedSkills.categories)) {
    skills.push(...arr)
  }
  return skills
}

function computeLiveScore(
  baseScore: number,
  skillConfidenceMap: Record<string, SkillConfidence>,
  allSkills: string[]
): number {
  let score = baseScore
  for (const skill of allSkills) {
    const conf = skillConfidenceMap[skill] ?? 'practice'
    score += conf === 'know' ? 2 : -2
  }
  return Math.max(0, Math.min(100, score))
}

function formatPlanForExport(plan: AnalysisResult['plan']): string {
  return plan
    .map(
      (d) =>
        `${d.days}: ${d.focus}\n${d.tasks.map((t) => `  • ${t}`).join('\n')}`
    )
    .join('\n\n')
}

function formatChecklistForExport(checklist: AnalysisResult['checklist']): string {
  return checklist
    .map(
      (r) =>
        `${r.round}\n${r.items.map((i) => `  • ${i}`).join('\n')}`
    )
    .join('\n\n')
}

function formatQuestionsForExport(questions: string[]): string {
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const idFromState = (location.state as { analysisId?: string } | null)?.analysisId
    const idFromUrl = searchParams.get('id')
    const id = idFromState ?? idFromUrl
    if (id) {
      const found = getAnalysisById(id)
      if (found) {
        if (!found.skillConfidenceMap) {
          const allSkills = getAllSkills(found.extractedSkills)
          const map: Record<string, SkillConfidence> = {}
          for (const s of allSkills) map[s] = 'practice'
          found.skillConfidenceMap = map
          updateAnalysis(found)
        }
        setResult(found)
      } else {
        setResult(null)
      }
    } else {
      const latest = getLatestAnalysis()
      if (latest && !latest.skillConfidenceMap) {
        const allSkills = getAllSkills(latest.extractedSkills)
        const map: Record<string, SkillConfidence> = {}
        for (const s of allSkills) map[s] = 'practice'
        latest.skillConfidenceMap = map
        updateAnalysis(latest)
      }
      setResult(latest)
    }
  }, [location.state, searchParams])

  const toggleSkill = useCallback(
    (skill: string) => {
      if (!result) return
      const map = { ...(result.skillConfidenceMap ?? {}) }
      map[skill] = map[skill] === 'know' ? 'practice' : 'know'
      const updated = { ...result, skillConfidenceMap: map }
      setResult(updated)
      updateAnalysis(updated)
    },
    [result]
  )

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const downloadTxt = useCallback(
    (content: string, filename: string) => {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    []
  )

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

  const { company, role, extractedSkills, checklist, plan, questions } = result
  const skillConfidenceMap = result.skillConfidenceMap ?? {}
  const allSkills = getAllSkills(extractedSkills)
  const liveScore = computeLiveScore(result.readinessScore, skillConfidenceMap, allSkills)
  const weakSkills = allSkills.filter((s) => (skillConfidenceMap[s] ?? 'practice') === 'practice').slice(0, 3)

  const fullExportText = [
    `Placement Prep — Analysis Results`,
    company || role ? `${company || ''} ${role ? `— ${role}` : ''}` : '',
    '',
    '=== READINESS SCORE ===',
    `${liveScore} / 100`,
    '',
    '=== KEY SKILLS ===',
    ...(
      Object.entries(extractedSkills.categories) as [SkillCategory, string[]][]
    ).flatMap(([cat, skills]) =>
      skills.length > 0 ? [`${cat}: ${skills.join(', ')}`] : []
    ),
    '',
    '=== ROUND-WISE CHECKLIST ===',
    formatChecklistForExport(checklist),
    '',
    '=== 7-DAY PLAN ===',
    formatPlanForExport(plan),
    '',
    '=== 10 LIKELY INTERVIEW QUESTIONS ===',
    formatQuestionsForExport(questions),
  ]
    .filter(Boolean)
    .join('\n')

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

      {/* Readiness Score (live) */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{liveScore}</span>
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
                    {skills.map((s) => {
                      const conf = skillConfidenceMap[s] ?? 'practice'
                      return (
                        <div
                          key={s}
                          className="flex items-center gap-1 rounded-full overflow-hidden border border-gray-200"
                        >
                          <span
                            className={`px-3 py-1 text-sm font-medium ${
                              conf === 'know' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {s}
                          </span>
                          <button
                            onClick={() => toggleSkill(s)}
                            className={`px-2 py-1 text-xs font-medium transition-colors ${
                              conf === 'know'
                                ? 'bg-primary text-white hover:bg-primary-hover'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {conf === 'know' ? 'I know' : 'Need practice'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
          <button
            onClick={() => copyToClipboard(formatChecklistForExport(checklist), 'checklist')}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {copied === 'checklist' ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy round checklist
          </button>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>7-Day Plan</CardTitle>
          <button
            onClick={() => copyToClipboard(formatPlanForExport(plan), 'plan')}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {copied === 'plan' ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy 7-day plan
          </button>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>10 Likely Interview Questions</CardTitle>
          <button
            onClick={() => copyToClipboard(formatQuestionsForExport(questions), 'questions')}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {copied === 'questions' ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy 10 questions
          </button>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Export all */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={() =>
              downloadTxt(
                fullExportText,
                `placement-prep-${company || 'analysis'}-${new Date().toISOString().slice(0, 10)}.txt`
              )
            }
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download as TXT
          </button>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Top weak skills to focus on:</p>
              <div className="flex flex-wrap gap-2">
                {weakSkills.map((s) => (
                  <span key={s} className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-gray-600">Start Day 1 plan now.</p>
        </CardContent>
      </Card>
    </div>
  )
}
