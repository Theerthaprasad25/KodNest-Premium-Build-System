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

export interface AnalysisResult {
  id: string
  createdAt: string
  company: string
  role: string
  jdText: string
  extractedSkills: ExtractedSkills
  checklist: RoundChecklist[]
  plan: DayPlan[]
  questions: string[]
  readinessScore: number
}
