import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, ClipboardCheck, BookOpen, User, History } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/practice', icon: Code2, label: 'Practice' },
  { to: '/dashboard/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { to: '/dashboard/resources', icon: BookOpen, label: 'Resources' },
  { to: '/dashboard/history', icon: History, label: 'History' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
          <h1 className="text-lg font-semibold text-gray-900">Placement Prep</h1>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
