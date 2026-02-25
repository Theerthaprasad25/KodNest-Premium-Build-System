export type SkillCategory =
  | 'Core CS'
  | 'Languages'
  | 'Web'
  | 'Data'
  | 'Cloud/DevOps'
  | 'Testing'
  | 'General'

export interface ExtractedSkills {
  categories: Record<SkillCategory, string[]>
  hasAny: boolean
}

export interface RoundChecklist {
  round: string
  items: string[]
}

export interface DayPlan {
  days: string
  focus: string
  tasks: string[]
}

export type SkillConfidence = 'know' | 'practice'

export type CompanySize = 'Startup' | 'Mid-size' | 'Enterprise'

export interface CompanyIntel {
  companyName: string
  industry: string
  sizeCategory: CompanySize
  typicalHiringFocus: string
}

export interface MappedRound {
  round: string
  title: string
  whyThisMatters: string
}

export interface AnalysisResult {
  id: string
  createdAt: string
  company: string
  role: string
  jdText: string
  extractedSkills: ExtractedSkills
  skillConfidenceMap?: Record<string, SkillConfidence>
  companyIntel?: CompanyIntel
  roundMapping?: MappedRound[]
  checklist: RoundChecklist[]
  plan: DayPlan[]
  questions: string[]
  readinessScore: number
}
