import React from 'react';
import { StackView } from './components/StackView';
import { FocusView } from './components/FocusView';
import { useStore } from './store';

function App() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto bg-gray-800 min-h-screen shadow-xl">
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 px-4 py-3 text-center font-medium ${
              activeTab === 'stack'
                ? 'border-b-2 border-gray-400 text-gray-200'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('stack')}
          >
            Stack
          </button>
          <button
            className={`flex-1 px-4 py-3 text-center font-medium ${
              activeTab === 'focus'
                ? 'border-b-2 border-gray-400 text-gray-200'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('focus')}
          >
            Focus
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-49px)]">
          {activeTab === 'stack' ? <StackView /> : <FocusView />}
        </div>
      </div>
    </div>
  );
}

export default App;