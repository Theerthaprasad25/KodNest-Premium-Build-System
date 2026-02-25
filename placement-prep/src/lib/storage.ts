import type { AnalysisResult } from '@/types/analysis'

const STORAGE_KEY = 'placement-prep-analysis-history'

export function saveAnalysis(result: AnalysisResult): void {
  const existing = getHistory()
  const updated = [result, ...existing]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AnalysisResult[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const history = getHistory()
  return history.find((r) => r.id === id) ?? null
}

export function getLatestAnalysis(): AnalysisResult | null {
  const history = getHistory()
  return history[0] ?? null
}
