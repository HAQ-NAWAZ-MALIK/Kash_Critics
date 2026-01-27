import { FileSpreadsheet, FileText, FileJson, Check, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import type { DataRow } from '../utils/xlsxExporter';
import { exportToXlsx, exportToTsv, exportToJsonl } from '../utils/xlsxExporter';

interface ExportPanelProps {
    data: DataRow[];
}

export default function ExportPanel({ data }: ExportPanelProps) {
    const handleExportXlsx = () => {
        if (data.length === 0) {
            toast.error('No data to export');
            return;
        }
        try {
            exportToXlsx(data);
            toast.success(`📊 Exported ${data.length} rows to XLSX`, { icon: '✅' });
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    const handleExportTsv = () => {
        if (data.length === 0) {
            toast.error('No data to export');
            return;
        }
        try {
            exportToTsv(data);
            toast.success(`📄 Exported ${data.length} rows to TSV`, { icon: '✅' });
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    const handleExportJsonl = () => {
        if (data.length === 0) {
            toast.error('No data to export');
            return;
        }
        try {
            exportToJsonl(data);
            toast.success(`📋 Exported ${data.length} rows to JSONL`, { icon: '✅' });
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    const isDisabled = data.length === 0;

    return (
        <div className="export-panel">
            <h3>
                <Package size={20} />
                Export Dataset
            </h3>

            <div className="export-buttons">
                <button
                    className="btn btn-export xlsx"
                    onClick={handleExportXlsx}
                    disabled={isDisabled}
                >
                    <FileSpreadsheet size={24} />
                    <span className="export-label">
                        <strong>XLSX</strong>
                        <small>Excel / Sheets</small>
                    </span>
                </button>

                <button
                    className="btn btn-export tsv"
                    onClick={handleExportTsv}
                    disabled={isDisabled}
                >
                    <FileText size={24} />
                    <span className="export-label">
                        <strong>TSV</strong>
                        <small>Tab-Separated</small>
                    </span>
                </button>

                <button
                    className="btn btn-export jsonl"
                    onClick={handleExportJsonl}
                    disabled={isDisabled}
                >
                    <FileJson size={24} />
                    <span className="export-label">
                        <strong>JSONL</strong>
                        <small>JSON Lines</small>
                    </span>
                </button>
            </div>

            {data.length > 0 && (
                <p className="export-info">
                    <Check size={16} style={{ display: 'inline', marginRight: '6px', color: '#10b981' }} />
                    Ready to export <strong>{data.length}</strong> parallel text pairs
                </p>
            )}
        </div>
    );
}
