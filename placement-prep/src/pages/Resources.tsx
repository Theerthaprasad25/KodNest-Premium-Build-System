import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  extractSkills,
  generateChecklist,
  generate7DayPlan,
  generateQuestions,
  computeBaseScore,
  computeFinalScore,
} from '@/lib/analysis'
import { generateCompanyIntel, generateRoundMapping } from '@/lib/companyIntel'
import { saveAnalysis } from '@/lib/storage'
import type { AnalysisEntry } from '@/types/analysis'

function generateId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getAllSkills(extractedSkills: AnalysisEntry['extractedSkills']): string[] {
  return [
    ...extractedSkills.coreCS,
    ...extractedSkills.languages,
    ...extractedSkills.web,
    ...extractedSkills.data,
    ...extractedSkills.cloud,
    ...extractedSkills.testing,
    ...extractedSkills.other,
  ]
}

export default function Resources() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const jdTrimmed = jdText.trim()
  const jdTooShort = jdTrimmed.length > 0 && jdTrimmed.length < 200

  function handleAnalyze() {
    if (!jdTrimmed) return
    setIsAnalyzing(true)

    const extractedSkills = extractSkills(jdTrimmed)
    const checklist = generateChecklist(jdTrimmed, extractedSkills)
    const plan7Days = generate7DayPlan(jdTrimmed, extractedSkills)
    const questions = generateQuestions(jdTrimmed, extractedSkills)
    const baseScore = computeBaseScore(company.trim(), role.trim(), jdTrimmed, extractedSkills)

    const allSkills = getAllSkills(extractedSkills)
    const skillConfidenceMap: Record<string, 'know' | 'practice'> = {}
    for (const s of allSkills) {
      skillConfidenceMap[s] = 'practice'
    }
    const finalScore = computeFinalScore(baseScore, skillConfidenceMap, allSkills)

    const companyIntel = generateCompanyIntel(company.trim(), jdTrimmed)
    const roundMapping = generateRoundMapping(company.trim(), extractedSkills)

    const now = new Date().toISOString()
    const result: AnalysisEntry = {
      id: generateId(),
      createdAt: now,
      company: company.trim(),
      role: role.trim(),
      jdText: jdTrimmed,
      extractedSkills,
      roundMapping,
      checklist,
      plan7Days,
      questions,
      baseScore,
      skillConfidenceMap,
      finalScore,
      updatedAt: now,
      companyIntel: companyIntel ?? undefined,
    }

    saveAnalysis(result)
    setIsAnalyzing(false)
    navigate(`/dashboard/results?id=${result.id}`, { state: { analysisId: result.id } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Resources</h2>
        <p className="text-gray-600">Analyze a job description to get a personalized preparation plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role (optional)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SDE, Full Stack Developer"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            />
            {jdTooShort && (
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                This JD is too short to analyze deeply. Paste full JD for better output.
              </p>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!jdTrimmed || isAnalyzing}
            className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
