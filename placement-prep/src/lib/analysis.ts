import type { ExtractedSkills, RoundChecklist, DayPlan, SkillCategory } from '@/types/analysis'
import { SKILL_KEYWORDS } from './skillKeywords'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = escapeRegex(keyword)
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:[^a-zA-Z0-9]|$)`, 'i')
  return regex.test(text)
}

export function extractSkills(jdText: string): ExtractedSkills {
  const text = jdText
  const categories: Record<SkillCategory, string[]> = {
    'Core CS': [],
    Languages: [],
    Web: [],
    Data: [],
    'Cloud/DevOps': [],
    Testing: [],
    General: [],
  }

  let hasAny = false

  for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
    const found: string[] = []
    for (const kw of keywords) {
      if (matchesKeyword(text, kw)) {
        found.push(kw)
        hasAny = true
      }
    }
    categories[category as SkillCategory] = found
  }

  if (!hasAny) {
    categories.General = ['General fresher stack']
  }

  return { categories, hasAny }
}

export function generateChecklist(_jdText: string, extractedSkills: ExtractedSkills): RoundChecklist[] {
  const skills = extractedSkills.categories
  const hasDSA = skills['Core CS'].includes('DSA') || !extractedSkills.hasAny
  const hasCoreCS = extractedSkills.hasAny
  const hasWeb = skills.Web.length > 0
  const hasData = skills.Data.length > 0
  const hasCloud = skills['Cloud/DevOps'].length > 0
  const hasTesting = skills.Testing.length > 0

  const round1Items = [
    'Practice quantitative aptitude (time, speed, percentages)',
    'Review logical reasoning and puzzles',
    'Brush up basics (arrays, strings, numbers)',
    'Practice mental math shortcuts',
    'Review probability and statistics basics',
  ]

  if (hasDSA) {
    round1Items.push('Warm up with DSA basics (arrays, linked lists)')
  }
  if (hasCoreCS) {
    round1Items.push('Review OOP concepts (encapsulation, inheritance, polymorphism)')
  }
  round1Items.push('Practice time management for mock tests')

  const round2Items = [
    ...(hasDSA ? ['Practice arrays, strings, linked lists'] : []),
    ...(hasDSA ? ['Solve 2–3 medium DSA problems daily'] : []),
    ...(hasDSA ? ['Review tree and graph traversals'] : []),
    ...(hasCoreCS ? ['Revise DBMS: normalization, ACID, indexing'] : []),
    ...(hasCoreCS ? ['Revise OS: processes, threads, scheduling'] : []),
    ...(hasCoreCS ? ['Revise Networks: TCP/IP, HTTP, REST'] : []),
    'Practice coding on whiteboard or shared editor',
    'Time yourself on problem-solving',
  ].filter(Boolean)

  if (round2Items.length < 5) {
    round2Items.push('Review core CS fundamentals')
  }

  const round3Items = [
    ...(hasWeb ? ['Prepare project demo: React/Node stack'] : []),
    ...(hasData ? ['Explain database design and queries'] : []),
    ...(hasCloud ? ['Discuss deployment and CI/CD experience'] : []),
    ...(hasTesting ? ['Explain testing approach and tools'] : []),
    'Prepare 2–3 project deep-dives with STAR format',
    'Align resume with JD keywords',
    'Practice explaining system design basics',
    'Review language-specific concepts (OOP, design patterns)',
  ].filter(Boolean)

  if (round3Items.length < 5) {
    round3Items.push('Prepare project stories and technical details')
  }

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
    { round: 'Round 1: Aptitude / Basics', items: round1Items.slice(0, 8) },
    { round: 'Round 2: DSA + Core CS', items: round2Items.slice(0, 8) },
    { round: 'Round 3: Tech interview (projects + stack)', items: round3Items.slice(0, 8) },
    { round: 'Round 4: Managerial / HR', items: round4Items.slice(0, 8) },
  ]
}

export function generate7DayPlan(_jdText: string, extractedSkills: ExtractedSkills): DayPlan[] {
  const skills = extractedSkills.categories
  const hasDSA = skills['Core CS'].includes('DSA') || !extractedSkills.hasAny
  const hasWeb = skills.Web.length > 0
  const hasData = skills.Data.length > 0
  const hasCloud = skills['Cloud/DevOps'].length > 0

  const day1_2Tasks = [
    'Revise OOP, DBMS, OS, Networks basics',
    'Review arrays, strings, linked lists',
    'Practice 5 aptitude questions',
  ]
  if (hasWeb) day1_2Tasks.push('Skim React/Node fundamentals')
  if (hasData) day1_2Tasks.push('Review SQL basics and joins')

  const day3_4Tasks = [
    'Solve 3–5 DSA problems (medium)',
    'Practice tree and graph problems',
    'Time yourself on coding problems',
  ]
  if (hasDSA) day3_4Tasks.push('Review sorting and searching algorithms')

  const day5Tasks = [
    'Prepare project deep-dive (STAR)',
    'Align resume with JD keywords',
    'Update portfolio/LinkedIn',
  ]
  if (hasWeb) day5Tasks.push('Prepare frontend project demo')
  if (hasCloud) day5Tasks.push('Prepare deployment story')

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
    { days: 'Day 1–2', focus: 'Basics + core CS', tasks: day1_2Tasks },
    { days: 'Day 3–4', focus: 'DSA + coding practice', tasks: day3_4Tasks },
    { days: 'Day 5', focus: 'Project + resume alignment', tasks: day5Tasks },
    { days: 'Day 6', focus: 'Mock interview questions', tasks: day6Tasks },
    { days: 'Day 7', focus: 'Revision + weak areas', tasks: day7Tasks },
  ]
}

export function generateQuestions(_jdText: string, extractedSkills: ExtractedSkills): string[] {
  const skills = extractedSkills.categories
  const questions: string[] = []

  if (skills.Data.includes('SQL') || skills.Data.includes('MySQL') || skills.Data.includes('PostgreSQL')) {
    questions.push('Explain indexing and when it helps. What are B-tree vs hash indexes?')
  }
  if (skills.Web.includes('React')) {
    questions.push('Explain state management options in React (useState, Context, Redux).')
  }
  if (skills['Core CS'].includes('DSA') || !extractedSkills.hasAny) {
    questions.push('How would you optimize search in sorted data? What is binary search complexity?')
  }
  if (skills['Core CS'].includes('OOP')) {
    questions.push('Explain polymorphism and give a real-world example.')
  }
  if (skills['Core CS'].includes('DBMS')) {
    questions.push('What is ACID? Explain with a transaction example.')
  }
  if (skills.Web.includes('Node.js') || skills.Web.includes('Express')) {
    questions.push('How does Node.js handle async I/O? Explain event loop.')
  }
  if (skills['Cloud/DevOps'].includes('Docker')) {
    questions.push('Explain Docker vs VMs. When would you use each?')
  }
  if (skills['Cloud/DevOps'].includes('Kubernetes')) {
    questions.push('What is a pod? How does Kubernetes orchestrate containers?')
  }
  if (skills.Languages.includes('Java') || skills.Languages.includes('Python')) {
    questions.push('Explain garbage collection and memory management.')
  }
  if (skills.Web.includes('REST') || skills.Web.includes('GraphQL')) {
    questions.push('REST vs GraphQL: when would you choose one over the other?')
  }
  if (skills['Core CS'].includes('Networks')) {
    questions.push('Explain HTTP vs HTTPS. What is TLS handshake?')
  }
  if (skills.Web.includes('Next.js')) {
    questions.push('Explain SSR vs CSR in Next.js. When to use each?')
  }
  if (skills['Cloud/DevOps'].includes('AWS')) {
    questions.push('Explain S3, EC2, Lambda. When would you use serverless?')
  }
  if (skills.Testing.length > 0) {
    questions.push('How do you approach unit testing? What is your testing strategy?')
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

export function computeReadinessScore(
  company: string,
  role: string,
  jdText: string,
  extractedSkills: ExtractedSkills
): number {
  let score = 35

  const categoryCount = Object.entries(extractedSkills.categories).filter(
    ([cat, skills]) => cat !== 'General' && skills.length > 0
  ).length
  score += Math.min(categoryCount * 5, 30)

  if (company.trim().length > 0) score += 10
  if (role.trim().length > 0) score += 10
  if (jdText.length > 800) score += 10

  return Math.min(score, 100)
}
