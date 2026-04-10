import { useState } from 'react'
import { motion } from 'framer-motion'
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
  Cell
} from 'recharts'
import { FileText, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockInsightData } from '@/data/mockData'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function InsightDock() {
  const [activeTab, setActiveTab] = useState('amount')
  const qualityScore = mockInsightData.qualityScore

  return (
    <div className="h-full flex flex-col bg-background/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">数据分析面板</span>
        </div>
      </div>

      {/* Charts Content */}
      <motion.div
        initial={false}
        className="flex flex-1 min-h-0"
      >
        {/* Left: Charts */}
        <div className="flex-1 flex flex-col gap-2 p-4 pt-2">
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
        <div className="w-[320px] p-4 pt-2 flex flex-col">
          <h4 className="text-xs font-medium mb-3">Top-K 检索结果</h4>
          <div className="flex-1 overflow-auto space-y-2">
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
        <div className="w-[140px] p-4 pt-2 flex flex-col items-center justify-center">
          <h4 className="text-xs font-medium mb-3">检索质量</h4>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={qualityScore >= 80 ? '#10b981' : qualityScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${qualityScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">{qualityScore}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground mt-2">评分</span>
        </div>
      </motion.div>
    </div>
  )
}