import type { CompanyIntel, CompanySize, RoundMappingItem } from '@/types/analysis'
import type { ExtractedSkillsSchema } from '@/types/analysis'
import { hasAnySkills } from './analysis'

const ENTERPRISE_COMPANIES = [
  'amazon', 'google', 'microsoft', 'meta', 'apple', 'infosys', 'tcs', 'wipro',
  'hcl', 'tech mahindra', 'cognizant', 'accenture', 'capgemini', 'deloitte',
  'ibm', 'oracle', 'sap', 'salesforce', 'adobe', 'netflix', 'uber',
]

const MID_SIZE_COMPANIES = [
  'freshworks', 'zoho', 'postman', 'chargebee', 'thoughtworks', 'atlassian',
]

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'Fintech': ['fintech', 'banking', 'payment', 'finance', 'insurance'],
  'E-commerce': ['ecommerce', 'e-commerce', 'retail', 'marketplace'],
  'Healthcare': ['healthcare', 'health', 'medical', 'pharma'],
  'EdTech': ['edtech', 'education', 'learning'],
  'SaaS': ['saas', 'software as a service', 'subscription'],
}

export function getCompanySize(company: string): CompanySize {
  const normalized = company.toLowerCase().trim()
  if (!normalized) return 'Startup'

  const isEnterprise = ENTERPRISE_COMPANIES.some((c) => normalized.includes(c))
  if (isEnterprise) return 'Enterprise'

  const isMidSize = MID_SIZE_COMPANIES.some((c) => normalized.includes(c))
  if (isMidSize) return 'Mid-size'

  return 'Startup'
}

export function inferIndustry(jdText: string, company: string): string {
  const text = (jdText + ' ' + company).toLowerCase()
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return industry
  }
  return 'Technology Services'
}

export function getTypicalHiringFocus(size: CompanySize): string {
  if (size === 'Enterprise') {
    return 'Structured DSA rounds, core CS fundamentals, and standardized aptitude tests. Strong emphasis on algorithms, system design basics, and behavioral fit.'
  }
  if (size === 'Mid-size') {
    return 'Balanced mix of practical coding, system discussion, and culture fit. Expect both algorithmic problem-solving and hands-on project discussions.'
  }
  return 'Practical problem-solving, stack depth, and quick adaptability. Focus on what you can build and how you ship.'
}

export function generateCompanyIntel(
  company: string,
  jdText: string
): CompanyIntel | null {
  const name = company.trim()
  if (!name) return null

  const size = getCompanySize(name)
  const industry = inferIndustry(jdText, name)
  const typicalHiringFocus = getTypicalHiringFocus(size)

  return {
    companyName: name,
    industry,
    sizeCategory: size,
    typicalHiringFocus,
  }
}

export function generateRoundMapping(
  company: string,
  extractedSkills: ExtractedSkillsSchema
): RoundMappingItem[] {
  const size = getCompanySize(company)
  const hasDSA = extractedSkills.coreCS.includes('DSA') || !hasAnySkills(extractedSkills)
  const hasWeb = extractedSkills.web.length > 0
  const hasReact = extractedSkills.web.includes('React')
  const hasNode = extractedSkills.web.includes('Node.js')

  if (size === 'Enterprise' && hasDSA) {
    return [
      {
        roundTitle: 'Round 1: Online Test (DSA + Aptitude)',
        focusAreas: ['DSA', 'Aptitude'],
        whyItMatters: 'Screens candidates at scale. Strong DSA and time management are critical.',
      },
      {
        roundTitle: 'Round 2: Technical (DSA + Core CS)',
        focusAreas: ['DSA', 'Core CS'],
        whyItMatters: 'Deep dive into problem-solving and fundamentals. Expect medium-level questions.',
      },
      {
        roundTitle: 'Round 3: Tech + Projects',
        focusAreas: ['Projects', 'System Design'],
        whyItMatters: 'System design basics and project discussions. Show your end-to-end thinking.',
      },
      {
        roundTitle: 'Round 4: HR',
        focusAreas: ['Behavioral'],
        whyItMatters: 'Culture fit and behavioral alignment. Prepare STAR stories.',
      },
    ]
  }

  if (size === 'Enterprise' && hasWeb) {
    return [
      {
        roundTitle: 'Round 1: Online Test (Coding + Aptitude)',
        focusAreas: ['Coding', 'Aptitude'],
        whyItMatters: 'Tests coding speed and logical reasoning. Often includes web-based questions.',
      },
      {
        roundTitle: 'Round 2: Technical (DSA + Web)',
        focusAreas: ['DSA', 'Web'],
        whyItMatters: 'Algorithm and framework questions. Be ready for React/Node concepts.',
      },
      {
        roundTitle: 'Round 3: System Design / Projects',
        focusAreas: ['Projects', 'Architecture'],
        whyItMatters: 'Discuss your projects and architecture. Show scalability thinking.',
      },
      {
        roundTitle: 'Round 4: HR',
        focusAreas: ['Behavioral'],
        whyItMatters: 'Final behavioral and culture fit.',
      },
    ]
  }

  if ((size === 'Startup' || size === 'Mid-size') && (hasReact || hasNode)) {
    return [
      {
        roundTitle: 'Round 1: Practical Coding',
        focusAreas: ['Coding', 'Stack'],
        whyItMatters: 'Hands-on coding or take-home. They want to see how you build.',
      },
      {
        roundTitle: 'Round 2: System Discussion',
        focusAreas: ['Architecture', 'Tech Stack'],
        whyItMatters: 'Architecture and tech choices. Be ready to explain your stack.',
      },
      {
        roundTitle: 'Round 3: Culture Fit',
        focusAreas: ['Behavioral', 'Values'],
        whyItMatters: 'Team fit and values. Show enthusiasm and adaptability.',
      },
    ]
  }

  if (size === 'Startup' || size === 'Mid-size') {
    return [
      {
        roundTitle: 'Round 1: Technical (DSA + Basics)',
        focusAreas: ['DSA', 'Basics'],
        whyItMatters: 'Core problem-solving. Often shorter than enterprise rounds.',
      },
      {
        roundTitle: 'Round 2: Projects + Discussion',
        focusAreas: ['Projects', 'Experience'],
        whyItMatters: 'What you have built. Practical experience matters.',
      },
      {
        roundTitle: 'Round 3: Culture Fit',
        focusAreas: ['Behavioral', 'Values'],
        whyItMatters: 'Team fit and values. Show enthusiasm and adaptability.',
      },
    ]
  }

  return [
    {
      roundTitle: 'Round 1: Technical (DSA + Core CS)',
      focusAreas: ['DSA', 'Core CS'],
      whyItMatters: 'Screens for fundamentals and problem-solving ability.',
    },
    {
      roundTitle: 'Round 2: Tech + Projects',
      focusAreas: ['Projects', 'Technical'],
      whyItMatters: 'Deeper technical and project discussion.',
    },
    {
      roundTitle: 'Round 3: HR',
      focusAreas: ['Behavioral'],
      whyItMatters: 'Behavioral and culture fit.',
    },
  ]
}
