import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Wand2, Sparkles, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { processTextAsync, getDiacriticsStats, estimateProcessingTime } from '../utils/kashmiriDiacritics';
import type { DataRow } from '../utils/xlsxExporter';

interface TextConverterProps {
    onConvert: (data: DataRow[]) => void;
}

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function TextConverter({ onConvert }: TextConverterProps) {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processedLines, setProcessedLines] = useState(0);
    const [totalLines, setTotalLines] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef(false);

    const handleProgress = useCallback((prog: number, processed: number, total: number) => {
        setProgress(prog);
        setProcessedLines(processed);
        setTotalLines(total);
    }, []);

    const handleConvert = async () => {
        if (!inputText.trim()) {
            toast.error('Please enter some Kashmiri text first');
            return;
        }

        // Check file size estimate
        const estimate = estimateProcessingTime(inputText);
        if (estimate.recommendation) {
            toast(estimate.recommendation, { icon: '⏳', duration: 3000 });
        }

        setIsProcessing(true);
        setProgress(0);
        abortRef.current = false;

        try {
            const stats = getDiacriticsStats(inputText);

            // Use async processing for all sizes (handles chunking internally)
            const results = await processTextAsync(inputText, handleProgress);

            if (abortRef.current) {
                toast('Processing cancelled', { icon: '❌' });
                return;
            }

            if (results.length === 0) {
                toast.error('No valid text lines found');
                return;
            }

            const data: DataRow[] = results.map(r => ({
                diacritical: r.original,
                nonDiacritical: r.cleaned
            }));

            onConvert(data);
            toast.success(
                `✨ Converted ${results.length.toLocaleString()} lines! Found ${stats.diacriticsCount.toLocaleString()} diacritics`,
                { duration: 4000, icon: '🎉' }
            );
        } catch (error) {
            toast.error('Error processing text');
            console.error(error);
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const handleCancel = () => {
        abortRef.current = true;
        setIsProcessing(false);
        setProgress(0);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file extension
        if (!file.name.endsWith('.txt')) {
            toast.error('Please upload a .txt file');
            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 10MB`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setInputText(content);
            const lines = content.split('\n').filter(l => l.trim()).length;
            toast.success(`📄 Loaded ${file.name} (${lines.toLocaleString()} lines)`, { icon: '✅' });
        };
        reader.onerror = () => {
            toast.error('Error reading file');
        };
        reader.readAsText(file, 'utf-8');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputText(prev => prev + (prev ? '\n' : '') + text);
            toast.success('📋 Pasted from clipboard');
        } catch {
            toast.error('Unable to access clipboard');
        }
    };

    const handleClear = () => {
        setInputText('');
        onConvert([]);
        toast('Cleared', { icon: '🗑️' });
    };

    // Calculate stats for display
    const lineCount = inputText ? inputText.split('\n').filter(l => l.trim()).length : 0;
    const charCount = inputText.length;
    const estimate = inputText ? estimateProcessingTime(inputText) : null;

    return (
        <div className="converter-section">
            <div className="input-header">
                <h2>
                    <FileText size={20} />
                    Input Kashmiri Text
                </h2>
                <div className="input-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                    >
                        <Upload size={16} />
                        Upload
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        className="btn btn-secondary"
                        onClick={handlePaste}
                        disabled={isProcessing}
                    >
                        📋 Paste
                    </button>
                    {inputText && !isProcessing && (
                        <button className="btn btn-secondary" onClick={handleClear}>
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <textarea
                className="text-input rtl"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="کٲشُر زَبان یہاں لکھیں یا چِپکائیں...

Enter Kashmiri text with diacritical marks here.
Each line becomes a row in the output dataset.

Supports large files up to 5MB with progress tracking."
                dir="rtl"
                lang="ks"
                disabled={isProcessing}
            />

            {/* Progress Bar */}
            {isProcessing && (
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="progress-text">
                        Processing: {processedLines.toLocaleString()} / {totalLines.toLocaleString()} lines ({progress}%)
                    </div>
                </div>
            )}

            <div className="convert-section">
                {isProcessing ? (
                    <button
                        className="btn btn-secondary btn-large"
                        onClick={handleCancel}
                    >
                        <X size={20} />
                        Cancel
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-large"
                        onClick={handleConvert}
                        disabled={!inputText.trim()}
                    >
                        <Sparkles size={20} />
                        Convert to Non-Diacritical
                        <Wand2 size={18} />
                    </button>
                )}

                {inputText && !isProcessing && (
                    <span className="text-stats">
                        📊 {lineCount.toLocaleString()} lines · {charCount.toLocaleString()} chars
                        {estimate?.isLargeFile && (
                            <span className="large-file-warning">
                                <AlertCircle size={14} />
                                Large file
                            </span>
                        )}
                    </span>
                )}
            </div>

            <style>{`
        .progress-container {
          margin-top: 1rem;
          padding: 1rem;
          background: var(--bg-glass);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }
        .progress-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          transition: width 0.2s ease-out;
        }
        .progress-text {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-align: center;
        }
        .large-file-warning {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          padding: 2px 8px;
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent-warning);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
        }
        .text-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
