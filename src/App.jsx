import { useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { HistorySidebar } from './components/HistorySidebar'
import { NavSidebar } from './components/NavSidebar'
import { ChatArea } from './components/ChatArea'
import { DocumentViewer } from './components/DocumentViewer'
import { InsightDock } from './components/InsightDock'

function App() {
  const [activeNav, setActiveNav] = useState('home')
  const [activeCitation, setActiveCitation] = useState(null)
  const [ocrMode, setOcrMode] = useState('ai')

  const handleCitationClick = (citation) => {
    setActiveCitation(citation)
  }

  const handleOcrToggle = (mode) => {
    setOcrMode(mode)
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Hidden History Sidebar - expands on hover */}
      <div className="h-full">
        <HistorySidebar />
      </div>

      {/* Navigation Sidebar */}
      <NavSidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 flex flex-col min-w-0">
        <Group direction="horizontal" className="flex-1">
          {/* Chat Area - Left Panel */}
          <Panel defaultSize={35} minSize={20} maxSize={60} className="flex">
            <div className="w-full border-r border-border">
              <ChatArea onCitationClick={handleCitationClick} />
            </div>
          </Panel>

          <Separator className="w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* Right Panel - Document + Insight */}
          <Panel defaultSize={65} minSize={40} className="flex flex-col">
            <Group direction="vertical" className="flex-1">
              {/* Document Viewer - Top */}
              <Panel defaultSize={60} minSize={20}>
                <DocumentViewer 
                  activeCitation={activeCitation} 
                  onOcrToggle={handleOcrToggle}
                  ocrMode={ocrMode}
                />
              </Panel>

              <Separator className="h-1 bg-border hover:bg-primary/50 transition-colors cursor-row-resize" />

              {/* Insight Dock - Bottom */}
              <Panel defaultSize={40} minSize={15} className="flex">
                <div className="flex-1">
                  <InsightDock />
                </div>
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  )
}

export default App