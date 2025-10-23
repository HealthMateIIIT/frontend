import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import ChatInterface from './components/ChatInterface';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                HealthMate AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Privacy-Preserving Health Assistant
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="btn-icon"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ⚠️ For informational purposes only. Always consult a healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
