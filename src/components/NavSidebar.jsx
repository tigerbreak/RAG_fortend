import { Home, Library, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/data/mockData'

const iconMap = {
  Home,
  Library,
  BarChart3,
  Settings,
}

export function NavSidebar({ activeNav = 'home', onNavChange }) {
  return (
    <div className="w-16 h-full border-r border-border bg-background/50 backdrop-blur-sm flex flex-col items-center py-4">
      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = activeNav === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavChange?.(item.id)}
              className={cn(
                'relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
              )}
            </button>
          )
        })}
      </div>

      <button
        className="w-12 h-12 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        title="设置"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}