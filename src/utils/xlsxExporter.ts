import * as XLSX from 'xlsx';

export interface DataRow {
    diacritical: string;
    nonDiacritical: string;
}

/**
 * Export data to XLSX file with two columns
 * @param data - Array of diacritical/non-diacritical pairs
 * @param filename - Name of the output file (without extension)
 */
export function exportToXlsx(data: DataRow[], filename: string = 'kashmiri_parallel_dataset'): void {
    // Create worksheet data with headers
    const wsData = [
        ['Diacritical (با اعراب)', 'Non-Diacritical (بے اعراب)'], // Headers in Urdu/Arabic script
        ...data.map(row => [row.diacritical, row.nonDiacritical])
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for better readability
    ws['!cols'] = [
        { wch: 60 }, // Diacritical column
        { wch: 60 }  // Non-Diacritical column
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Parallel Dataset');

    // Generate and download file
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export data to tab-separated text file
 * @param data - Array of diacritical/non-diacritical pairs
 * @param filename - Name of the output file (without extension)
 */
export function exportToTsv(data: DataRow[], filename: string = 'kashmiri_parallel_dataset'): void {
    const header = 'Diacritical\tNon-Diacritical\n';
    const content = data.map(row => `${row.diacritical}\t${row.nonDiacritical}`).join('\n');

    const blob = new Blob([header + content], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.tsv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export data to JSON Lines format
 * @param data - Array of diacritical/non-diacritical pairs
 * @param filename - Name of the output file (without extension)
 */
export function exportToJsonl(data: DataRow[], filename: string = 'kashmiri_parallel_dataset'): void {
    const content = data.map(row => JSON.stringify({
        diacritical: row.diacritical,
        non_diacritical: row.nonDiacritical
    })).join('\n');

    const blob = new Blob([content], { type: 'application/jsonl;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.jsonl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
