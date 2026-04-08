import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Sparkles, Bot, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThinkingTrace } from './ThinkingTrace'
import { mockAIResponse } from '@/data/mockData'

export function ChatArea({ onCitationClick }) {
  const [inputValue, setInputValue] = useState('')
  const [showThinking, setShowThinking] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  const handleSend = () => {
    if (!inputValue.trim()) return
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  const renderContentWithCitations = (content, citations) => {
    if (!citations || citations.length === 0) return content

    const parts = []
    let lastIndex = 0

    const sortedCitations = [...citations].sort((a, b) => {
      const aIndex = content.indexOf(`[${a.id}]`)
      const bIndex = content.indexOf(`[${b.id}]`)
      return aIndex - bIndex
    })

    sortedCitations.forEach((citation) => {
      const pattern = `[${citation.id}]`
      const index = content.indexOf(pattern, lastIndex)

      if (index !== -1) {
        if (index > lastIndex) {
          parts.push(content.slice(lastIndex, index))
        }

        parts.push(
          <motion.button
            key={citation.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onCitationClick?.(citation)}
            className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
          >
            {citation.id}
          </motion.button>
        )

        lastIndex = index + pattern.length
      }
    })

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex))
    }

    return parts
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">智能问答</h2>
          <p className="text-sm text-muted-foreground">
            检索范围：2024年合同库
          </p>
        </div>
        <button
          onClick={() => setShowThinking(!showThinking)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
            showThinking
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-muted-foreground'
          )}
        >
          <Sparkles className="w-4 h-4" />
          思考路径
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* User Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="bg-secondary/50 rounded-lg p-4 max-w-[80%]">
              <p className="text-sm">请审查2024年签订的采购合同是否存在合规风险</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">10:30:00</p>
          </div>
        </motion.div>

        {/* Thinking Trace */}
        {showThinking && (
          <ThinkingTrace
            trace={mockAIResponse.thinkingTrace}
            isComplete={!isTyping}
          />
        )}

        {/* AI Response */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="bg-primary/5 rounded-lg p-4 max-w-[85%]">
              <div className="prose prose-sm max-w-none">
                {mockAIResponse.answer.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={i} className="font-semibold mt-2">
                        {renderContentWithCitations(
                          line.replace(/\*\*/g, ''),
                          mockAIResponse.citations
                        )}
                      </p>
                    )
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-4">
                        {renderContentWithCitations(
                          line.replace('- ', ''),
                          mockAIResponse.citations
                        )}
                      </li>
                    )
                  }
                  if (line.match(/^\d+\./)) {
                    return (
                      <p key={i} className="mt-2">
                        {renderContentWithCitations(line, mockAIResponse.citations)}
                      </p>
                    )
                  }
                  return (
                    <p key={i}>
                      {renderContentWithCitations(line, mockAIResponse.citations)}
                    </p>
                  )
                })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">10:31:00</p>
          </div>
        </motion.div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-3 bg-secondary/30 rounded-lg p-3">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="输入您的问题..."
            rows={1}
            className="flex-1 bg-transparent resize-none focus:outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'p-2 rounded-lg transition-colors',
              inputValue.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}