import { Moon, Sun, Github, Sparkles } from 'lucide-react';

interface HeaderProps {
    isDark: boolean;
    onToggleTheme: () => void;
}

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
    return (
        <header className="app-header">
            <div className="header-content">
                <div className="logo-section">
                    <h1>
                        <span className="logo-icon">کٲ</span>
                        <span className="logo-text">
                            Kash<span className="logo-highlight">Critics</span>
                        </span>
                    </h1>
                    <p className="tagline">
                        <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', opacity: 0.8 }} />
                        Kashmiri Diacritics Converter for ML Dataset Creation
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="btn btn-icon-only"
                        onClick={onToggleTheme}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-icon-only"
                        title="View on GitHub"
                    >
                        <Github size={20} />
                    </a>
                </div>
            </div>

            <div className="header-description">
                <p>
                    Transform Kashmiri text <strong>with diacritical marks</strong> (اعراب) into text
                    <strong> without diacritics</strong> (بے اعراب). Export as parallel dataset for training
                    diacritics restoration models.
                </p>
            </div>

            <style>{`
        .logo-text {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .logo-highlight {
          background: linear-gradient(135deg, #c4b5fd, #f0abfc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
        </header>
    );
}
