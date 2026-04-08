import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MessageSquare, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockChatHistory } from '@/data/mockData'

export function HistorySidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSession, setActiveSession] = useState(null)

  const filteredHistory = mockChatHistory.filter(
    (session) =>
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.date.includes(searchQuery)
  )

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 280 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative h-full border-r border-border bg-background/50 backdrop-blur-sm overflow-hidden"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="w-[280px] h-full flex flex-col p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">历史记录</span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索历史对话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/50 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredHistory.map((session) => (
            <motion.div
              key={session.id}
              className={cn(
                'p-3 rounded-lg cursor-pointer transition-colors',
                activeSession === session.id
                  ? 'bg-primary/10'
                  : 'hover:bg-secondary/50'
              )}
              onClick={() => setActiveSession(session.id)}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">{session.date}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}