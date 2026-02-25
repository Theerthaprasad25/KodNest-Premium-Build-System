import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  extractSkills,
  generateChecklist,
  generate7DayPlan,
  generateQuestions,
  computeReadinessScore,
} from '@/lib/analysis'
import { generateCompanyIntel, generateRoundMapping } from '@/lib/companyIntel'
import { saveAnalysis } from '@/lib/storage'
import type { AnalysisResult } from '@/types/analysis'

function generateId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function Resources() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  function handleAnalyze() {
    if (!jdText.trim()) return
    setIsAnalyzing(true)

    const extractedSkills = extractSkills(jdText)
    const checklist = generateChecklist(jdText, extractedSkills)
    const plan = generate7DayPlan(jdText, extractedSkills)
    const questions = generateQuestions(jdText, extractedSkills)
    const readinessScore = computeReadinessScore(company, role, jdText, extractedSkills)

    const allSkills: string[] = []
    for (const skills of Object.values(extractedSkills.categories)) {
      allSkills.push(...skills)
    }
    const skillConfidenceMap: Record<string, 'know' | 'practice'> = {}
    for (const s of allSkills) {
      skillConfidenceMap[s] = 'practice'
    }

    const companyIntel = generateCompanyIntel(company.trim(), jdText)
    const roundMapping = generateRoundMapping(company.trim(), extractedSkills)

    const result: AnalysisResult = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      company: company.trim(),
      role: role.trim(),
      jdText: jdText.trim(),
      extractedSkills,
      skillConfidenceMap,
      companyIntel: companyIntel ?? undefined,
      roundMapping,
      checklist,
      plan,
      questions,
      readinessScore,
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
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || isAnalyzing}
            className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
