import { useState } from 'react'
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Section: Chat + Document */}
        <div className="flex-1 flex min-h-0">
          {/* Chat Area */}
          <div className="w-[480px] border-r border-border flex-shrink-0">
            <ChatArea onCitationClick={handleCitationClick} />
          </div>

          {/* Document Viewer */}
          <div className="flex-1 min-w-0">
            <DocumentViewer 
              activeCitation={activeCitation} 
              onOcrToggle={handleOcrToggle}
              ocrMode={ocrMode}
            />
          </div>
        </div>

        {/* Bottom: Insight Dock */}
        <InsightDock />
      </div>
    </div>
  )
}

export default App