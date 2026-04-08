import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts'
import { ChevronUp, ChevronDown, FileText, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockInsightData } from '@/data/mockData'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function InsightDock() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState('amount')

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 280 : 48 }}
      className="border-t border-border bg-background/80 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">数据分析面板</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-[calc(100%-48px)]"
          >
            {/* Left: Charts */}
            <div className="flex-1 flex gap-4 p-4 pt-0">
              {/* Tab Switcher */}
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => setActiveTab('amount')}
                  className={cn(
                    'px-3 py-1 text-xs rounded-lg transition-colors',
                    activeTab === 'amount'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/70'
                  )}
                >
                  金额分布
                </button>
                <button
                  onClick={() => setActiveTab('type')}
                  className={cn(
                    'px-3 py-1 text-xs rounded-lg transition-colors',
                    activeTab === 'type'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/70'
                  )}
                >
                  文档类型
                </button>
              </div>

              {/* Bar Chart */}
              {activeTab === 'amount' && (
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockInsightData.contractAmountDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }} 
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }} 
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={(value) => `${value}万`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          fontSize: 12, 
                          borderRadius: 8,
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Pie Chart */}
              {activeTab === 'type' && (
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockInsightData.documentTypeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {mockInsightData.documentTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px bg-border" />

            {/* Right: Top-K Documents */}
            <div className="w-[320px] p-4 pt-0">
              <h4 className="text-xs font-medium mb-3">Top-K 检索结果</h4>
              <div className="space-y-2">
                {mockInsightData.topKDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    <span className={cn(
                      'w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium',
                      index < 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    )}>
                      {index + 1}
                    </span>
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-xs truncate">{doc.title}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${doc.score * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {(doc.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-border" />

            {/* Quality Score */}
            <div className="w-[140px] p-4 pt-0 flex flex-col items-center justify-center">
              <h4 className="text-xs font-medium mb-3">检索质量</h4>
              <div className="relative">
                <ResponsiveContainer width={100} height={100}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    data={[{ name: 'score', value: mockInsightData.qualityScore }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar 
                      background 
                      dataKey="value" 
                      cornerRadius={10}
                      fill="#3b82f6"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-end justify-center pb-3">
                  <span className="text-lg font-semibold">
                    {mockInsightData.qualityScore}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-2">评分</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}