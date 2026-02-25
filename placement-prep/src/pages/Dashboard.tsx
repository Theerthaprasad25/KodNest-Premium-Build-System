import { Link } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import OverallReadiness from '@/components/dashboard/OverallReadiness'
import SkillBreakdown from '@/components/dashboard/SkillBreakdown'
import ContinuePractice from '@/components/dashboard/ContinuePractice'
import WeeklyGoals from '@/components/dashboard/WeeklyGoals'
import UpcomingAssessments from '@/components/dashboard/UpcomingAssessments'
import { Card, CardContent } from '@/components/ui/card'
import { FileSearch, ClipboardCheck } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Welcome to your placement preparation dashboard.</p>
      </div>

      <Link to="/dashboard/resources">
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Analyze Job Description</p>
              <p className="text-sm text-gray-500">Get a personalized preparation plan from any JD</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/prp/07-test">
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Test Checklist</p>
              <p className="text-sm text-gray-500">Verify all tests pass before shipping</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <OverallReadiness />
        </ErrorBoundary>
        <ErrorBoundary>
          <SkillBreakdown />
        </ErrorBoundary>
        <ErrorBoundary>
          <ContinuePractice />
        </ErrorBoundary>
        <ErrorBoundary>
          <WeeklyGoals />
        </ErrorBoundary>
        <ErrorBoundary>
          <UpcomingAssessments />
        </ErrorBoundary>
      </div>
    </div>
  )
}
