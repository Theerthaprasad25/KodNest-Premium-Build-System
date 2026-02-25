import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContinuePractice() {
  const completed = 3
  const total = 10
  const progress = (completed / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-3">Dynamic Programming</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>{completed}/{total} completed</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors">
          Continue
        </button>
      </CardFooter>
    </Card>
  )
}
