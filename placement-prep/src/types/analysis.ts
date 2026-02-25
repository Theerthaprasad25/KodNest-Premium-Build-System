export type SkillConfidence = 'know' | 'practice'

export type CompanySize = 'Startup' | 'Mid-size' | 'Enterprise'

export interface ExtractedSkillsSchema {
  coreCS: string[]
  languages: string[]
  web: string[]
  data: string[]
  cloud: string[]
  testing: string[]
  other: string[]
}

export interface RoundMappingItem {
  roundTitle: string
  focusAreas: string[]
  whyItMatters: string
}

export interface ChecklistItem {
  roundTitle: string
  items: string[]
}

export interface PlanDayItem {
  day: string
  focus: string
  tasks: string[]
}

export interface CompanyIntel {
  companyName: string
  industry: string
  sizeCategory: CompanySize
  typicalHiringFocus: string
}

export interface AnalysisEntry {
  id: string
  createdAt: string
  company: string
  role: string
  jdText: string
  extractedSkills: ExtractedSkillsSchema
  roundMapping: RoundMappingItem[]
  checklist: ChecklistItem[]
  plan7Days: PlanDayItem[]
  questions: string[]
  baseScore: number
  skillConfidenceMap: Record<string, SkillConfidence>
  finalScore: number
  updatedAt: string
  companyIntel?: CompanyIntel
}

export type { AnalysisEntry as AnalysisResult }
