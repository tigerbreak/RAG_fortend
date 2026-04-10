import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Image, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  X,
  Eye,
  FileType,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockDocuments } from '@/data/mockData'

export function DocumentViewer({ activeCitation, onOcrToggle, ocrMode = 'ai' }) {
  const [activeDocument, setActiveDocument] = useState(mockDocuments[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [showCompare, setShowCompare] = useState(false)
  const [showMetadata, setShowMetadata] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const contentRef = useRef(null)

  const handleCitationClick = (citation) => {
    if (citation.documentId) {
      const doc = mockDocuments.find(d => d.id === citation.documentId)
      if (doc) {
        setActiveDocument(doc)
        setCurrentPage(citation.page)
      }
    }
  }

  const highlightParagraph = (paragraph) => {
    if (activeCitation && paragraph.id === `p${activeCitation.paragraph}` && currentPage === activeCitation.page) {
      return true
    }
    return paragraph.highlight
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {activeDocument?.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={cn(
              'p-1.5 rounded transition-colors',
              showMetadata ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
            )}
            title="元数据"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCompare(!showCompare)}
            className={cn(
              'p-1.5 rounded transition-colors',
              showCompare ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
            )}
            title="多文档对比"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
            title={isCollapsed ? "展开" : "折叠"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Document Preview */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-auto p-4 bg-secondary/20"
            >
              <motion.div
                animate={{ scale: zoom / 100 }}
                className="bg-white shadow-lg rounded-lg min-h-[600px] p-6"
                style={{ transformOrigin: 'top center' }}
              >
                {/* Simulated PDF Content */}
                {activeDocument?.content?.map((page) => (
                  <div key={page.page} className="mb-8">
                    {page.page === currentPage && (
                      <>
                        <div className="text-center mb-4">
                          <span className="text-sm text-muted-foreground">第 {page.page} 页</span>
                        </div>
                        {page.paragraphs.map((para) => (
                          <motion.p
                            key={para.id}
                            className={cn(
                              'mb-3 text-sm leading-relaxed text-gray-800',
                              highlightParagraph(para) && 'bg-yellow-100 px-2 py-1 rounded'
                            )}
                            animate={highlightParagraph(para) ? { backgroundColor: ['rgba(253, 224, 71, 0)', 'rgba(253, 224, 71, 0.4)', 'rgba(253, 224, 71, 0.3)'] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {para.text}
                          </motion.p>
                        ))}
                      </>
                    )}
                  </div>
                ))}

                {(!activeDocument?.content || activeDocument.content.length === 0) && (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <FileType className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>文档内容加载中...</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background/50">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground px-2">
                  {currentPage} / {activeDocument?.pages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, activeDocument?.pages || 1))}
                  disabled={currentPage >= (activeDocument?.pages || 1)}
                  className="p-1.5 rounded hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-secondary">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground px-2 w-12 text-center">
                  {zoom}%
                </span>
                <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-secondary">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OCR Toggle */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/10">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">OCR 模式</span>
              </div>
              <button
                onClick={() => onOcrToggle?.(ocrMode === 'ai' ? 'raw' : 'ai')}
                className={cn(
                  'relative w-10 h-5 rounded-full transition-colors',
                  ocrMode === 'ai' ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              >
                <motion.div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
                  animate={{ left: ocrMode === 'ai' ? '50%' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <div className="flex items-center gap-1 text-xs">
                {ocrMode === 'ai' ? (
                  <>
                    <Eye className="w-3 h-3 text-primary" />
                    <span className="text-primary font-medium">AI 识别</span>
                  </>
                ) : (
                  <>
                    <FileType className="w-3 h-3" />
                    <span>原始影像</span>
                  </>
                )}
              </div>
            </div>

            {/* Metadata Panel */}
            <AnimatePresence>
              {showMetadata && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-border overflow-hidden"
                >
                  <div className="p-4 bg-secondary/20">
                    <h4 className="text-sm font-medium mb-3">文档元数据</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(activeDocument?.properties || {}).slice(0, 8).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="truncate max-w-[120px]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
