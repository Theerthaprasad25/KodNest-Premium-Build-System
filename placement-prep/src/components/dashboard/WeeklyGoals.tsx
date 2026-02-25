import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const activityByDay = [true, true, false, true, true, false, false]

export default function WeeklyGoals() {
  const solved = 12
  const goal = 20
  const progress = (solved / goal) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Problems Solved</span>
            <span className="font-medium text-gray-900">{solved}/{goal} this week</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between gap-1">
          {days.map((day, i) => (
            <div key={day} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  activityByDay[i]
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                title={activityByDay[i] ? `${day}: activity` : `${day}: no activity`}
              >
                {activityByDay[i] ? '✓' : ''}
              </div>
              <span className="text-xs text-gray-500 mt-1">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
