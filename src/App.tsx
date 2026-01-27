import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TextConverter from './components/TextConverter';
import ResultsTable from './components/ResultsTable';
import ExportPanel from './components/ExportPanel';
import HelpSection from './components/HelpSection';
import type { DataRow } from './utils/xlsxExporter';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [data, setData] = useState<DataRow[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleConvert = (newData: DataRow[]) => {
    setData(newData);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: isDark ? '#1e293b' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#1e293b' : '#ffffff',
            },
          },
        }}
      />

      <div className="app">
        <Header isDark={isDark} onToggleTheme={toggleTheme} />

        <main className="main-content">
          <div className="converter-container">
            <TextConverter onConvert={handleConvert} />

            <div className="results-container">
              <ResultsTable data={data} />
              <ExportPanel data={data} />
            </div>
          </div>
        </main>

        <HelpSection />

        <footer className="app-footer">
          <p>
            Built for Kashmiri NLP research •
            <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer">
              Deploy on Hugging Face Spaces
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
