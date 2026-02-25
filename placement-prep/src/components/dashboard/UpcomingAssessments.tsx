import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

const assessments = [
  { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', time: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', time: 'Friday, 11:00 AM' },
]

export default function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {assessments.map((item) => (
            <li key={item.title} className="flex gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
