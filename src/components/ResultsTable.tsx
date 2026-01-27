import { useState, useMemo, useRef, useEffect } from 'react';
import { Copy, Check, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import type { DataRow } from '../utils/xlsxExporter';

interface ResultsTableProps {
    data: DataRow[];
}

// Number of rows to render at a time for virtualization
const VISIBLE_ROWS = 50;
const ROW_HEIGHT = 60; // Approximate row height in pixels

export default function ResultsTable({ data }: ResultsTableProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [visibleStart, setVisibleStart] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const term = searchTerm.toLowerCase();
        return data.filter(row =>
            row.diacritical.toLowerCase().includes(term) ||
            row.nonDiacritical.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    // Calculate visible rows for virtualization
    const visibleData = useMemo(() => {
        const endIndex = Math.min(visibleStart + VISIBLE_ROWS, filteredData.length);
        return filteredData.slice(visibleStart, endIndex).map((row, idx) => ({
            ...row,
            originalIndex: visibleStart + idx
        }));
    }, [filteredData, visibleStart]);

    // Handle scroll for virtualization
    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const newStart = Math.floor(scrollTop / ROW_HEIGHT);
        if (Math.abs(newStart - visibleStart) >= 10) {
            setVisibleStart(Math.max(0, newStart - 5));
        }
    };

    // Reset scroll position when data changes
    useEffect(() => {
        setVisibleStart(0);
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="results-section">
                <div className="results-empty">
                    <div className="empty-icon">✨</div>
                    <p>Converted text will appear here</p>
                    <p className="hint">Enter Kashmiri text and click "Convert"</p>
                </div>
            </div>
        );
    }

    const copyRow = async (row: DataRow, index: number) => {
        const text = `${row.diacritical}\t${row.nonDiacritical}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            toast.success('Row copied!', { icon: '📋' });
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    const copyAll = async () => {
        // Show progress for large datasets
        if (data.length > 1000) {
            toast('Copying large dataset...', { icon: '⏳' });
        }

        const text = data.map(r => `${r.diacritical}\t${r.nonDiacritical}`).join('\n');
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`All ${data.length.toLocaleString()} rows copied!`, { icon: '📋' });
        } catch {
            toast.error('Failed to copy');
        }
    };

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            setVisibleStart(0);
        }
    };

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            setVisibleStart(Math.max(0, filteredData.length - VISIBLE_ROWS));
        }
    };

    const isLargeDataset = data.length > 500;

    return (
        <div className="results-section">
            <div className="results-header">
                <h2>
                    <Sparkles size={18} style={{ marginRight: '8px' }} />
                    Parallel Dataset Preview
                </h2>
                <div className="results-actions">
                    {isLargeDataset && (
                        <div className="scroll-buttons">
                            <button className="btn-icon" onClick={scrollToTop} title="Scroll to top">
                                <ChevronUp size={16} />
                            </button>
                            <button className="btn-icon" onClick={scrollToBottom} title="Scroll to bottom">
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    )}
                    <button className="btn btn-secondary" onClick={copyAll}>
                        <Copy size={16} />
                        Copy All
                    </button>
                </div>
            </div>

            {/* Search for large datasets */}
            {isLargeDataset && (
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input rtl"
                        placeholder="🔍 Search in results..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <span className="search-results-count">
                            {filteredData.length.toLocaleString()} of {data.length.toLocaleString()} rows
                        </span>
                    )}
                </div>
            )}

            <div
                className="table-container"
                ref={containerRef}
                onScroll={handleScroll}
                style={{
                    maxHeight: isLargeDataset ? '500px' : '400px',
                    position: 'relative'
                }}
            >
                {/* Spacer for virtualization */}
                {isLargeDataset && visibleStart > 0 && (
                    <div style={{ height: visibleStart * ROW_HEIGHT }} />
                )}

                <table className="results-table">
                    <thead>
                        <tr>
                            <th className="row-number">#</th>
                            <th className="rtl">با اعراب</th>
                            <th className="rtl">بے اعراب</th>
                            <th className="actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleData.map((row) => (
                            <tr key={row.originalIndex}>
                                <td className="row-number">{row.originalIndex + 1}</td>
                                <td className="rtl diacritical">{row.diacritical}</td>
                                <td className="rtl non-diacritical">{row.nonDiacritical}</td>
                                <td className="actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => copyRow(row, row.originalIndex)}
                                        title="Copy row"
                                    >
                                        {copiedIndex === row.originalIndex ? (
                                            <Check size={16} className="success" />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Bottom spacer for virtualization */}
                {isLargeDataset && visibleStart + VISIBLE_ROWS < filteredData.length && (
                    <div style={{ height: (filteredData.length - visibleStart - VISIBLE_ROWS) * ROW_HEIGHT }} />
                )}
            </div>

            <div className="results-footer">
                <span className="row-count">
                    ✓ {filteredData.length.toLocaleString()} rows
                    {isLargeDataset && ` (showing ${visibleStart + 1}-${Math.min(visibleStart + VISIBLE_ROWS, filteredData.length)})`}
                </span>
            </div>

            <style>{`
        .results-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .scroll-buttons {
          display: flex;
          gap: 0.25rem;
        }
        .search-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          font-family: var(--font-arabic), var(--font-sans);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .search-results-count {
          font-size: 0.85rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
      `}</style>
        </div>
    );
}
