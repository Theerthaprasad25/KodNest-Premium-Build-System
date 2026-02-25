import OverallReadiness from '@/components/dashboard/OverallReadiness'
import SkillBreakdown from '@/components/dashboard/SkillBreakdown'
import ContinuePractice from '@/components/dashboard/ContinuePractice'
import WeeklyGoals from '@/components/dashboard/WeeklyGoals'
import UpcomingAssessments from '@/components/dashboard/UpcomingAssessments'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Welcome to your placement preparation dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallReadiness />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
        <UpcomingAssessments />
      </div>
    </div>
  )
}
