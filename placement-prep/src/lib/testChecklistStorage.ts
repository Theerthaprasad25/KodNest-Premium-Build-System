const STORAGE_KEY = 'placement-prep-test-checklist'

export const TEST_ITEMS = [
  { id: 'jd-required', label: 'JD required validation works', hint: 'Leave JD empty → Analyze button should be disabled.' },
  { id: 'short-jd', label: 'Short JD warning shows for <200 chars', hint: 'Paste JD with <200 chars → Warning message appears.' },
  { id: 'skills-extraction', label: 'Skills extraction groups correctly', hint: 'Analyze JD with DSA, React, SQL → Skills appear in correct categories.' },
  { id: 'round-mapping', label: 'Round mapping changes based on company + skills', hint: 'Try Amazon + DSA vs Acme + React → Different round flows.' },
  { id: 'score-deterministic', label: 'Score calculation is deterministic', hint: 'Same JD + company + role → Same baseScore every time.' },
  { id: 'skill-toggles', label: 'Skill toggles update score live', hint: 'Toggle "I know" on a skill → finalScore updates immediately.' },
  { id: 'persist-refresh', label: 'Changes persist after refresh', hint: 'Toggle skills, refresh page → Same toggles and score.' },
  { id: 'history-saves', label: 'History saves and loads correctly', hint: 'Analyze JD → Go to History → Entry appears. Click → Results load.' },
  { id: 'export-buttons', label: 'Export buttons copy the correct content', hint: 'Click Copy 7-day plan → Paste elsewhere → Content matches.' },
  { id: 'no-console-errors', label: 'No console errors on core pages', hint: 'Open Dashboard, Resources, Results, History → Check DevTools console.' },
] as const

export type TestChecklistState = Record<string, boolean>

export function getTestChecklist(): TestChecklistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as TestChecklistState
    return typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveTestChecklist(state: TestChecklistState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function setTestChecked(id: string, checked: boolean): TestChecklistState {
  const current = getTestChecklist()
  const next = { ...current, [id]: checked }
  saveTestChecklist(next)
  return next
}

export function resetTestChecklist(): TestChecklistState {
  saveTestChecklist({})
  return {}
}

export function getTestsPassedCount(): number {
  const state = getTestChecklist()
  return TEST_ITEMS.filter((t) => state[t.id] === true).length
}

export function areAllTestsPassed(): boolean {
  return getTestsPassedCount() === TEST_ITEMS.length
}
