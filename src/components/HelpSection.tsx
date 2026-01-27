import { Info, BookOpen, Zap, Download, Cpu, Languages, AudioWaveform } from 'lucide-react';
import { KASHMIRI_DIACRITICS_DISPLAY } from '../utils/kashmiriDiacritics';

export default function HelpSection() {
    return (
        <section id="help-section" className="help-section">
            <h2>
                <Info size={22} />
                How It Works
            </h2>

            <div className="help-cards">
                <div className="help-card">
                    <div className="help-icon">
                        <BookOpen size={26} />
                    </div>
                    <h3>1. Input Text</h3>
                    <p>
                        Enter or paste Kashmiri text with diacritical marks (اعراب).
                        Upload a .txt file for batch processing. Each line becomes a parallel pair.
                    </p>
                </div>

                <div className="help-card">
                    <div className="help-icon">
                        <Zap size={26} />
                    </div>
                    <h3>2. Convert</h3>
                    <p>
                        Click convert to remove all diacritics while preserving base characters.
                        Supports all Kashmiri-specific marks used in modern writing.
                    </p>
                </div>

                <div className="help-card">
                    <div className="help-icon">
                        <Download size={26} />
                    </div>
                    <h3>3. Export</h3>
                    <p>
                        Download as XLSX, TSV, or JSONL. Ideal for training ML models
                        to restore diacritics to plain Kashmiri text.
                    </p>
                </div>
            </div>

            <div className="diacritics-info">
                <h3>🔤 Supported Kashmiri/Arabic Diacritics</h3>
                <div className="diacritics-table-container">
                    <table className="diacritics-table">
                        <thead>
                            <tr>
                                <th>Mark</th>
                                <th>Name</th>
                                <th className="rtl">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            {KASHMIRI_DIACRITICS_DISPLAY.map((item, index) => (
                                <tr key={index}>
                                    <td className="diacritic-char">{item.char}</td>
                                    <td className="diacritic-name">{item.name}</td>
                                    <td className="rtl diacritic-example">{item.example}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="use-case">
                <h3>🎯 Use Cases for Parallel Dataset</h3>
                <p>
                    This tool creates <strong>parallel datasets</strong> essential for training ML models
                    that can automatically add diacritics to plain Kashmiri text:
                </p>
                <ul>
                    <li>
                        <AudioWaveform size={16} style={{ marginRight: '4px' }} />
                        Text-to-Speech (TTS) systems for Kashmiri
                    </li>
                    <li>
                        <Languages size={16} style={{ marginRight: '4px' }} />
                        Language learning apps with pronunciation
                    </li>
                    <li>
                        <Cpu size={16} style={{ marginRight: '4px' }} />
                        NLP models for diacritics restoration
                    </li>
                    <li>
                        <BookOpen size={16} style={{ marginRight: '4px' }} />
                        Digital preservation of Kashmiri literature
                    </li>
                </ul>
            </div>

            <style>{`
        .diacritics-table-container {
          overflow-x: auto;
          margin-top: 1rem;
        }
        .diacritics-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .diacritics-table th,
        .diacritics-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        .diacritics-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }
        .diacritics-table tbody tr:hover {
          background: rgba(99, 102, 241, 0.05);
        }
        .diacritic-char {
          font-family: var(--font-arabic);
          font-size: 1.8rem;
          text-align: center;
          width: 60px;
          color: var(--accent-primary);
        }
        .diacritic-name {
          font-size: 0.9rem;
        }
        .diacritic-example {
          font-family: var(--font-arabic);
          font-size: 1.3rem;
          line-height: 2;
        }
      `}</style>
        </section>
    );
}
