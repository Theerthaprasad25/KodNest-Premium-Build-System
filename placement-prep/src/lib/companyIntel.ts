import type { CompanyIntel, CompanySize, MappedRound } from '@/types/analysis'
import type { ExtractedSkills } from '@/types/analysis'

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
  extractedSkills: ExtractedSkills
): MappedRound[] {
  const size = getCompanySize(company)
  const skills = extractedSkills.categories
  const hasDSA = skills['Core CS'].includes('DSA') || !extractedSkills.hasAny
  const hasWeb = skills.Web.length > 0
  const hasReact = skills.Web.includes('React')
  const hasNode = skills.Web.includes('Node.js')

  if (size === 'Enterprise' && hasDSA) {
    return [
      {
        round: 'Round 1',
        title: 'Online Test (DSA + Aptitude)',
        whyThisMatters: 'Screens candidates at scale. Strong DSA and time management are critical.'
      },
      {
        round: 'Round 2',
        title: 'Technical (DSA + Core CS)',
        whyThisMatters: 'Deep dive into problem-solving and fundamentals. Expect medium-level questions.'
      },
      {
        round: 'Round 3',
        title: 'Tech + Projects',
        whyThisMatters: 'System design basics and project discussions. Show your end-to-end thinking.'
      },
      {
        round: 'Round 4',
        title: 'HR',
        whyThisMatters: 'Culture fit and behavioral alignment. Prepare STAR stories.'
      },
    ]
  }

  if (size === 'Enterprise' && hasWeb) {
    return [
      {
        round: 'Round 1',
        title: 'Online Test (Coding + Aptitude)',
        whyThisMatters: 'Tests coding speed and logical reasoning. Often includes web-based questions.'
      },
      {
        round: 'Round 2',
        title: 'Technical (DSA + Web)',
        whyThisMatters: 'Algorithm and framework questions. Be ready for React/Node concepts.'
      },
      {
        round: 'Round 3',
        title: 'System Design / Projects',
        whyThisMatters: 'Discuss your projects and architecture. Show scalability thinking.'
      },
      {
        round: 'Round 4',
        title: 'HR',
        whyThisMatters: 'Final behavioral and culture fit.'
      },
    ]
  }

  if ((size === 'Startup' || size === 'Mid-size') && (hasReact || hasNode)) {
    return [
      {
        round: 'Round 1',
        title: 'Practical Coding',
        whyThisMatters: 'Hands-on coding or take-home. They want to see how you build.'
      },
      {
        round: 'Round 2',
        title: 'System Discussion',
        whyThisMatters: 'Architecture and tech choices. Be ready to explain your stack.'
      },
      {
        round: 'Round 3',
        title: 'Culture Fit',
        whyThisMatters: 'Team fit and values. Show enthusiasm and adaptability.'
      },
    ]
  }

  if (size === 'Startup' || size === 'Mid-size') {
    return [
      {
        round: 'Round 1',
        title: 'Technical (DSA + Basics)',
        whyThisMatters: 'Core problem-solving. Often shorter than enterprise rounds.'
      },
      {
        round: 'Round 2',
        title: 'Projects + Discussion',
        whyThisMatters: 'What you have built. Practical experience matters.'
      },
      {
        round: 'Round 3',
        title: 'Culture Fit',
        whyThisMatters: 'Team fit and values. Show enthusiasm and adaptability.'
      },
    ]
  }

  return [
    {
      round: 'Round 1',
      title: 'Technical (DSA + Core CS)',
      whyThisMatters: 'Screens for fundamentals and problem-solving ability.'
    },
    {
      round: 'Round 2',
      title: 'Tech + Projects',
      whyThisMatters: 'Deeper technical and project discussion.'
    },
    {
      round: 'Round 3',
      title: 'HR',
      whyThisMatters: 'Behavioral and culture fit.'
    },
  ]
}
