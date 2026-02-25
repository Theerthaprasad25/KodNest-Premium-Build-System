import type { AnalysisEntry, ExtractedSkillsSchema, SkillConfidence } from '@/types/analysis'

const STORAGE_KEY = 'placement-prep-analysis-history'

const EMPTY_SKILLS: ExtractedSkillsSchema = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: [],
}

export interface HistoryResult {
  entries: AnalysisEntry[]
  corruptedCount: number
}

function isLegacyEntry(raw: unknown): raw is Record<string, unknown> {
  return typeof raw === 'object' && raw !== null && typeof (raw as Record<string, unknown>).id === 'string'
}

function migrateLegacyToEntry(raw: Record<string, unknown>): AnalysisEntry | null {
  try {
    const id = String(raw.id ?? '')
    const createdAt = String(raw.createdAt ?? new Date().toISOString())
    const company = typeof raw.company === 'string' ? raw.company : ''
    const role = typeof raw.role === 'string' ? raw.role : ''
    const jdText = String(raw.jdText ?? '')
    if (!id || !jdText) return null

    let extractedSkills: ExtractedSkillsSchema = { ...EMPTY_SKILLS }
    if (raw.extractedSkills && typeof raw.extractedSkills === 'object') {
      const old = raw.extractedSkills as Record<string, unknown>
      extractedSkills = {
        coreCS: Array.isArray(old['Core CS']) ? old['Core CS'] as string[] : (Array.isArray(old.coreCS) ? old.coreCS as string[] : []),
        languages: Array.isArray(old.Languages) ? old.Languages as string[] : (Array.isArray(old.languages) ? old.languages as string[] : []),
        web: Array.isArray(old.Web) ? old.Web as string[] : (Array.isArray(old.web) ? old.web as string[] : []),
        data: Array.isArray(old.Data) ? old.Data as string[] : (Array.isArray(old.data) ? old.data as string[] : []),
        cloud: Array.isArray(old['Cloud/DevOps']) ? old['Cloud/DevOps'] as string[] : (Array.isArray(old.cloud) ? old.cloud as string[] : []),
        testing: Array.isArray(old.Testing) ? old.Testing as string[] : (Array.isArray(old.testing) ? old.testing as string[] : []),
        other: Array.isArray(old.General) ? old.General as string[] : (Array.isArray(old.other) ? old.other as string[] : []),
      }
    }

    let roundMapping: AnalysisEntry['roundMapping'] = []
    if (Array.isArray(raw.roundMapping)) {
      for (const r of raw.roundMapping) {
        if (r && typeof r === 'object') {
          const obj = r as Record<string, unknown>
          roundMapping.push({
            roundTitle: String(obj.roundTitle ?? obj.round ?? '') + (obj.title ? ': ' + obj.title : ''),
            focusAreas: Array.isArray(obj.focusAreas) ? obj.focusAreas as string[] : [],
            whyItMatters: String(obj.whyItMatters ?? obj.whyThisMatters ?? ''),
          })
        }
      }
    }

    let checklist: AnalysisEntry['checklist'] = []
    if (Array.isArray(raw.checklist)) {
      for (const c of raw.checklist) {
        if (c && typeof c === 'object') {
          const obj = c as Record<string, unknown>
          checklist.push({
            roundTitle: String(obj.roundTitle ?? obj.round ?? ''),
            items: Array.isArray(obj.items) ? obj.items as string[] : [],
          })
        }
      }
    }

    let plan7Days: AnalysisEntry['plan7Days'] = []
    if (Array.isArray(raw.plan7Days)) {
      plan7Days = raw.plan7Days.map((p) => {
        const obj = (p && typeof p === 'object') ? p as Record<string, unknown> : {}
        return {
          day: String(obj.day ?? obj.days ?? ''),
          focus: String(obj.focus ?? ''),
          tasks: Array.isArray(obj.tasks) ? obj.tasks as string[] : [],
        }
      })
    } else if (Array.isArray(raw.plan)) {
      plan7Days = raw.plan.map((p) => {
        const obj = (p && typeof p === 'object') ? p as Record<string, unknown> : {}
        return {
          day: String(obj.days ?? obj.day ?? ''),
          focus: String(obj.focus ?? ''),
          tasks: Array.isArray(obj.tasks) ? obj.tasks as string[] : [],
        }
      })
    }

    const questions = Array.isArray(raw.questions) ? raw.questions as string[] : []
    const baseScore = typeof raw.baseScore === 'number' ? raw.baseScore : (typeof raw.readinessScore === 'number' ? raw.readinessScore : 35)
    const skillConfidenceMap = (raw.skillConfidenceMap && typeof raw.skillConfidenceMap === 'object') ? raw.skillConfidenceMap as Record<string, SkillConfidence> : {}

    const allSkills: string[] = []
    for (const arr of Object.values(extractedSkills)) {
      if (Array.isArray(arr)) allSkills.push(...arr)
    }
    for (const s of allSkills) {
      if (!(s in skillConfidenceMap)) skillConfidenceMap[s] = 'practice'
    }

    let finalScore = baseScore
    for (const s of allSkills) {
      finalScore += skillConfidenceMap[s] === 'know' ? 2 : -2
    }
    finalScore = Math.max(0, Math.min(100, finalScore))

    const updatedAt = String(raw.updatedAt ?? createdAt)

    return {
      id,
      createdAt,
      company,
      role,
      jdText,
      extractedSkills,
      roundMapping,
      checklist,
      plan7Days,
      questions,
      baseScore,
      skillConfidenceMap,
      finalScore,
      updatedAt,
      companyIntel: (raw.companyIntel && typeof raw.companyIntel === 'object') ? raw.companyIntel as AnalysisEntry['companyIntel'] : undefined,
    }
  } catch {
    return null
  }
}

function validateEntry(entry: unknown): AnalysisEntry | null {
  if (!isLegacyEntry(entry)) return null
  return migrateLegacyToEntry(entry)
}

export function getHistory(): HistoryResult {
  let corruptedCount = 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], corruptedCount: 0 }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { entries: [], corruptedCount: 1 }

    const entries: AnalysisEntry[] = []
    for (const item of parsed) {
      const validated = validateEntry(item)
      if (validated) {
        entries.push(validated)
      } else {
        corruptedCount++
      }
    }
    return { entries, corruptedCount }
  } catch {
    return { entries: [], corruptedCount: 1 }
  }
}

export function saveAnalysis(result: AnalysisEntry): void {
  const { entries } = getHistory()
  const updated = [result, ...entries.filter((e) => e.id !== result.id)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getAnalysisById(id: string): AnalysisEntry | null {
  const { entries } = getHistory()
  return entries.find((r) => r.id === id) ?? null
}

export function getLatestAnalysis(): AnalysisEntry | null {
  const { entries } = getHistory()
  return entries[0] ?? null
}

export function updateAnalysis(updated: AnalysisEntry): void {
  const { entries } = getHistory()
  const index = entries.findIndex((r) => r.id === updated.id)
  if (index === -1) return
  entries[index] = updated
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}
