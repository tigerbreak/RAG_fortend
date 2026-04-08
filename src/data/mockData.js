// Mock data for FileNet RAG Dashboard

export const mockChatHistory = [
  {
    id: 'session-1',
    date: '2024-01-15',
    topic: '合同合规审查',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: '请审查2024年签订的采购合同是否存在合规风险',
        timestamp: '2024-01-15 10:30:00',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '根据对2024年合同库的检索分析，发现以下合规风险点：\n\n1. 违约金条款不明确[1]\n2. 付款条件与公司标准不符[2]\n3. 知识产权归属存在争议[3]\n\n建议在签署前与法务部门确认。',
        citations: [
          { id: 1, documentId: 'doc-1', text: '合同金额超过50万元需经法务部门审批', page: 3, paragraph: 2 },
          { id: 2, documentId: 'doc-2', text: '付款条件为货到付款，不符合公司90天账期要求', page: 5, paragraph: 1 },
          { id: 3, documentId: 'doc-1', text: '知识产权归属甲方的条款需要补充说明', page: 4, paragraph: 3 },
        ],
        timestamp: '2024-01-15 10:31:00',
      },
    ],
  },
  {
    id: 'session-2',
    date: '2024-01-10',
    topic: '档案检索',
    messages: [],
  },
  {
    id: 'session-3',
    date: '2024-01-05',
    topic: '供应商分析',
    messages: [],
  },
]

export const mockDocuments = [
  {
    id: 'doc-1',
    name: '采购合同_供应商A_2024.pdf',
    type: 'PDF',
    class: 'Contract',
    size: '2.3 MB',
    createdDate: '2024-01-10',
    modifiedDate: '2024-01-12',
    pages: 8,
    properties: {
      'Document Class': 'Contract',
      'Contract Type': 'Procurement',
      'Party A': 'ABC公司',
      'Party B': '供应商A',
      'Contract Amount': '¥500,000',
      'Sign Date': '2024-01-08',
      'Expiry Date': '2025-01-08',
      'Status': 'Active',
    },
    content: [
      {
        page: 1,
        paragraphs: [
          { id: 'p1', text: '采购合同', highlight: false },
          { id: 'p2', text: '本合同由甲方ABC公司与乙方供应商A签订', highlight: false },
        ],
      },
      {
        page: 2,
        paragraphs: [
          { id: 'p3', text: '一、合同标的\n乙方向甲方提供以下产品：', highlight: false },
          { id: 'p4', text: '1. 电子元器件一批\n2. 配套设备若干', highlight: false },
        ],
      },
      {
        page: 3,
        paragraphs: [
          { id: 'p5', text: '二、合同金额\n合同总金额为人民币伍拾万元整（¥500,000）', highlight: false },
          { id: 'p6', text: '合同金额超过50万元需经法务部门审批', highlight: true },
        ],
      },
      {
        page: 4,
        paragraphs: [
          { id: 'p7', text: '三、知识产权\n本合同项下产生的知识产权归甲方所有', highlight: true },
          { id: 'p8', text: '乙方需确保所提供产品不侵犯任何第三方知识产权', highlight: false },
        ],
      },
      {
        page: 5,
        paragraphs: [
          { id: 'p9', text: '四、付款条件\n付款方式为货到付款', highlight: true },
          { id: 'p10', text: '甲方在收到货物并验收合格后30日内支付货款', highlight: false },
        ],
      },
    ],
  },
  {
    id: 'doc-2',
    name: '采购合同_供应商B_2024.pdf',
    type: 'PDF',
    class: 'Contract',
    size: '1.8 MB',
    createdDate: '2024-01-12',
    modifiedDate: '2024-01-14',
    pages: 6,
    properties: {
      'Document Class': 'Contract',
      'Contract Type': 'Procurement',
      'Party A': 'ABC公司',
      'Party B': '供应商B',
      'Contract Amount': '¥280,000',
      'Sign Date': '2024-01-10',
      'Expiry Date': '2025-01-10',
      'Status': 'Active',
    },
    content: [],
  },
]

export const mockInsightData = {
  contractAmountDistribution: [
    { name: '0-10万', count: 15, amount: 85 },
    { name: '10-50万', count: 28, amount: 680 },
    { name: '50-100万', count: 12, amount: 890 },
    { name: '100万+', count: 5, amount: 620 },
  ],
  documentTypeDistribution: [
    { name: '采购合同', value: 45 },
    { name: '销售合同', value: 25 },
    { name: '服务协议', value: 15 },
    { name: '保密协议', value: 10 },
    { name: '其他', value: 5 },
  ],
  topKDocuments: [
    { id: 'doc-1', title: '采购合同_供应商A_2024', score: 0.92 },
    { id: 'doc-2', title: '采购合同_供应商B_2024', score: 0.87 },
    { id: 'doc-3', title: '供应商资质审查报告', score: 0.81 },
    { id: 'doc-4', title: '合规审查清单', score: 0.78 },
    { id: 'doc-5', title: '合同审批流转单', score: 0.75 },
  ],
  qualityScore: 85,
}

export const mockAIResponse = {
  thinkingTrace: [
    '1. 正在检索2024年合同库...',
    '2. 找到相关文档45份',
    '3. 应用语义相似度过滤...',
    '4. 筛选出Top-5相关文档',
    '5. 提取关键合规条款...',
    '6. 生成分析报告',
  ],
  answer: `根据对2024年合同库的全面检索和分析，发现以下合规风险点：

**1. 违约金条款问题**[1]
部分合同未明确约定违约金计算方式，存在法律风险。

**2. 付款条件不符**[2]
个别供应商合同采用货到付款方式，与公司财务制度要求的90天账期不符。

**3. 知识产权归属**[3]
部分合同中知识产权归属条款不清晰，需要法务部门确认。

建议：
- 统一合同模板
- 加强签署前法务审核
- 建立合同合规检查清单`,
  citations: [
    { id: 1, documentId: 'doc-1', text: '合同金额超过50万元需经法务部门审批', page: 3, paragraph: 2, highlight: true },
    { id: 2, documentId: 'doc-2', text: '付款条件为货到付款，不符合公司90天账期要求', page: 5, paragraph: 1, highlight: true },
    { id: 3, documentId: 'doc-1', text: '知识产权归属甲方的条款需要补充说明', page: 4, paragraph: 3, highlight: true },
  ],
}

export const navItems = [
  { id: 'home', icon: 'Home', label: '首页' },
  { id: 'library', icon: 'Library', label: '文档库' },
  { id: 'analysis', icon: 'BarChart3', label: '分析' },
  { id: 'settings', icon: 'Settings', label: '设置' },
]