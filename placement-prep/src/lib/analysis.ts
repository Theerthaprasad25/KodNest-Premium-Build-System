import type { ExtractedSkillsSchema, ChecklistItem, PlanDayItem, SkillConfidence } from '@/types/analysis'
import { SKILL_KEYWORDS, DEFAULT_OTHER_SKILLS } from './skillKeywords'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = escapeRegex(keyword)
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:[^a-zA-Z0-9]|$)`, 'i')
  return regex.test(text)
}

export function extractSkills(jdText: string): ExtractedSkillsSchema {
  const text = jdText
  const result: ExtractedSkillsSchema = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  }

  let hasAny = false

  for (const [key, keywords] of Object.entries(SKILL_KEYWORDS)) {
    const found: string[] = []
    for (const kw of keywords) {
      if (matchesKeyword(text, kw)) {
        found.push(kw)
        hasAny = true
      }
    }
    result[key as keyof ExtractedSkillsSchema] = found
  }

  if (!hasAny) {
    result.other = [...DEFAULT_OTHER_SKILLS]
  }

  return result
}

export function hasAnySkills(skills: ExtractedSkillsSchema): boolean {
  return (
    skills.coreCS.length > 0 ||
    skills.languages.length > 0 ||
    skills.web.length > 0 ||
    skills.data.length > 0 ||
    skills.cloud.length > 0 ||
    skills.testing.length > 0 ||
    skills.other.length > 0
  )
}

export function generateChecklist(_jdText: string, extractedSkills: ExtractedSkillsSchema): ChecklistItem[] {
  const hasDSA = extractedSkills.coreCS.includes('DSA') || !hasAnySkills(extractedSkills)
  const hasCoreCS = hasAnySkills(extractedSkills)
  const hasWeb = extractedSkills.web.length > 0
  const hasData = extractedSkills.data.length > 0
  const hasCloud = extractedSkills.cloud.length > 0
  const hasTesting = extractedSkills.testing.length > 0
  const hasOther = extractedSkills.other.length > 0

  const round1Items = [
    'Practice quantitative aptitude (time, speed, percentages)',
    'Review logical reasoning and puzzles',
    'Brush up basics (arrays, strings, numbers)',
    'Practice mental math shortcuts',
    'Review probability and statistics basics',
  ]
  if (hasDSA) round1Items.push('Warm up with DSA basics (arrays, linked lists)')
  if (hasCoreCS) round1Items.push('Review OOP concepts (encapsulation, inheritance, polymorphism)')
  if (hasOther) round1Items.push('Practice communication and problem-solving basics')
  round1Items.push('Practice time management for mock tests')

  const round2Items = [
    ...(hasDSA ? ['Practice arrays, strings, linked lists'] : []),
    ...(hasDSA ? ['Solve 2–3 medium DSA problems daily'] : []),
    ...(hasDSA ? ['Review tree and graph traversals'] : []),
    ...(hasCoreCS ? ['Revise DBMS: normalization, ACID, indexing'] : []),
    ...(hasCoreCS ? ['Revise OS: processes, threads, scheduling'] : []),
    ...(hasCoreCS ? ['Revise Networks: TCP/IP, HTTP, REST'] : []),
    ...(hasOther ? ['Practice basic coding problems'] : []),
    'Practice coding on whiteboard or shared editor',
    'Time yourself on problem-solving',
  ].filter(Boolean)
  if (round2Items.length < 5) round2Items.push('Review core CS fundamentals')

  const round3Items = [
    ...(hasWeb ? ['Prepare project demo: React/Node stack'] : []),
    ...(hasData ? ['Explain database design and queries'] : []),
    ...(hasCloud ? ['Discuss deployment and CI/CD experience'] : []),
    ...(hasTesting ? ['Explain testing approach and tools'] : []),
    ...(hasOther ? ['Prepare project stories and examples'] : []),
    'Prepare 2–3 project deep-dives with STAR format',
    'Align resume with JD keywords',
    'Practice explaining system design basics',
    'Review language-specific concepts (OOP, design patterns)',
  ].filter(Boolean)
  if (round3Items.length < 5) round3Items.push('Prepare project stories and technical details')

  const round4Items = [
    'Prepare "Tell me about yourself" (2 min)',
    'Prepare strengths and weaknesses examples',
    'Prepare 3–5 questions to ask interviewer',
    'Practice behavioral questions (STAR)',
    'Review company values and culture',
    'Prepare salary expectations (if applicable)',
    'Dress rehearsal: full mock interview',
  ]

  return [
    { roundTitle: 'Round 1: Aptitude / Basics', items: round1Items.slice(0, 8) },
    { roundTitle: 'Round 2: DSA + Core CS', items: round2Items.slice(0, 8) },
    { roundTitle: 'Round 3: Tech interview (projects + stack)', items: round3Items.slice(0, 8) },
    { roundTitle: 'Round 4: Managerial / HR', items: round4Items.slice(0, 8) },
  ]
}

export function generate7DayPlan(_jdText: string, extractedSkills: ExtractedSkillsSchema): PlanDayItem[] {
  const hasDSA = extractedSkills.coreCS.includes('DSA') || !hasAnySkills(extractedSkills)
  const hasWeb = extractedSkills.web.length > 0
  const hasData = extractedSkills.data.length > 0
  const hasCloud = extractedSkills.cloud.length > 0
  const hasOther = extractedSkills.other.length > 0

  const day1_2Tasks = [
    'Revise OOP, DBMS, OS, Networks basics',
    'Review arrays, strings, linked lists',
    'Practice 5 aptitude questions',
  ]
  if (hasWeb) day1_2Tasks.push('Skim React/Node fundamentals')
  if (hasData) day1_2Tasks.push('Review SQL basics and joins')
  if (hasOther) day1_2Tasks.push('Practice communication and problem-solving')

  const day3_4Tasks = [
    'Solve 3–5 DSA problems (medium)',
    'Practice tree and graph problems',
    'Time yourself on coding problems',
  ]
  if (hasDSA) day3_4Tasks.push('Review sorting and searching algorithms')
  if (hasOther) day3_4Tasks.push('Practice basic coding')

  const day5Tasks = [
    'Prepare project deep-dive (STAR)',
    'Align resume with JD keywords',
    'Update portfolio/LinkedIn',
  ]
  if (hasWeb) day5Tasks.push('Prepare frontend project demo')
  if (hasCloud) day5Tasks.push('Prepare deployment story')
  if (hasOther) day5Tasks.push('Prepare project examples')

  const day6Tasks = [
    'Practice mock interview questions',
    'Record yourself answering common questions',
    'Prepare 5 questions to ask interviewer',
  ]

  const day7Tasks = [
    'Revision: weak areas',
    'Quick DSA recap',
    'Review company and role',
  ]

  return [
    { day: 'Day 1–2', focus: 'Basics + core CS', tasks: day1_2Tasks },
    { day: 'Day 3–4', focus: 'DSA + coding practice', tasks: day3_4Tasks },
    { day: 'Day 5', focus: 'Project + resume alignment', tasks: day5Tasks },
    { day: 'Day 6', focus: 'Mock interview questions', tasks: day6Tasks },
    { day: 'Day 7', focus: 'Revision + weak areas', tasks: day7Tasks },
  ]
}

export function generateQuestions(_jdText: string, extractedSkills: ExtractedSkillsSchema): string[] {
  const questions: string[] = []

  if (extractedSkills.data.includes('SQL') || extractedSkills.data.includes('MySQL') || extractedSkills.data.includes('PostgreSQL')) {
    questions.push('Explain indexing and when it helps. What are B-tree vs hash indexes?')
  }
  if (extractedSkills.web.includes('React')) {
    questions.push('Explain state management options in React (useState, Context, Redux).')
  }
  if (extractedSkills.coreCS.includes('DSA') || !hasAnySkills(extractedSkills)) {
    questions.push('How would you optimize search in sorted data? What is binary search complexity?')
  }
  if (extractedSkills.coreCS.includes('OOP')) {
    questions.push('Explain polymorphism and give a real-world example.')
  }
  if (extractedSkills.coreCS.includes('DBMS')) {
    questions.push('What is ACID? Explain with a transaction example.')
  }
  if (extractedSkills.web.includes('Node.js') || extractedSkills.web.includes('Express')) {
    questions.push('How does Node.js handle async I/O? Explain event loop.')
  }
  if (extractedSkills.cloud.includes('Docker')) {
    questions.push('Explain Docker vs VMs. When would you use each?')
  }
  if (extractedSkills.cloud.includes('Kubernetes')) {
    questions.push('What is a pod? How does Kubernetes orchestrate containers?')
  }
  if (extractedSkills.languages.includes('Java') || extractedSkills.languages.includes('Python')) {
    questions.push('Explain garbage collection and memory management.')
  }
  if (extractedSkills.web.includes('REST') || extractedSkills.web.includes('GraphQL')) {
    questions.push('REST vs GraphQL: when would you choose one over the other?')
  }
  if (extractedSkills.coreCS.includes('Networks')) {
    questions.push('Explain HTTP vs HTTPS. What is TLS handshake?')
  }
  if (extractedSkills.web.includes('Next.js')) {
    questions.push('Explain SSR vs CSR in Next.js. When to use each?')
  }
  if (extractedSkills.cloud.includes('AWS')) {
    questions.push('Explain S3, EC2, Lambda. When would you use serverless?')
  }
  if (extractedSkills.testing.length > 0) {
    questions.push('How do you approach unit testing? What is your testing strategy?')
  }
  if (extractedSkills.other.length > 0) {
    questions.push('Tell me about a challenging project and how you solved it.')
    questions.push('Describe a time you worked in a team under pressure.')
  }

  const generic = [
    'Tell me about a challenging project and how you solved it.',
    'Describe a time you worked in a team under pressure.',
    'Where do you see yourself in 5 years?',
  ]

  while (questions.length < 10) {
    const pick = generic[questions.length % generic.length]
    if (!questions.includes(pick)) questions.push(pick)
    else break
  }

  return questions.slice(0, 10)
}

export function computeBaseScore(
  company: string,
  role: string,
  jdText: string,
  extractedSkills: ExtractedSkillsSchema
): number {
  let score = 35

  const categoryCount = [
    extractedSkills.coreCS,
    extractedSkills.languages,
    extractedSkills.web,
    extractedSkills.data,
    extractedSkills.cloud,
    extractedSkills.testing,
  ].filter((arr) => arr.length > 0).length
  score += Math.min(categoryCount * 5, 30)

  if (company.trim().length > 0) score += 10
  if (role.trim().length > 0) score += 10
  if (jdText.length > 800) score += 10

  return Math.min(score, 100)
}

export function computeFinalScore(
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
