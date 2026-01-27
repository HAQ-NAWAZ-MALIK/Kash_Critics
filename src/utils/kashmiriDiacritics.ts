/**
 * Kashmiri Diacritics Processing Module
 * 
 * This module handles the removal of diacritical marks from Kashmiri text
 * while preserving the base characters. Kashmiri uses Perso-Arabic script
 * with extensive diacritics for vowel representation.
 * 
 * Features:
 * - Chunked processing for large files (prevents UI freeze)
 * - Progress callback for loading indicators
 * - Optimized regex for fast processing
 */

// Unicode ranges for Arabic/Kashmiri diacritical marks
const DIACRITICS_PATTERNS = [
  // ===== Standard Arabic diacritics (Harakat) =====
  '\u064B', // Fathatan (ً)
  '\u064C', // Dammatan (ٌ)
  '\u064D', // Kasratan (ٍ)
  '\u064E', // Fatha (َ)
  '\u064F', // Damma (ُ)
  '\u0650', // Kasra (ِ)
  '\u0651', // Shadda (ّ)
  '\u0652', // Sukun (ْ)
  '\u0653', // Maddah Above (ٓ)

  // ===== Kashmiri-specific diacritics =====
  '\u0654', // Hamza Above (ٔ)
  '\u0655', // Hamza Below (ٕ)
  '\u0656', // Subscript Alef (ٖ)
  '\u0657', // Inverted Damma (ٗ)
  '\u0658', // Mark Noon Ghunna (٘)
  '\u0659', // Zwarakay (ٙ)
  '\u065A', // Vowel Sign Small V Above (ٚ)
  '\u065B', // Vowel Sign Inverted Small V Above (ٛ)
  '\u065C', // Vowel Sign Dot Below (ٜ)
  '\u065D', // Reversed Damma (ٝ)
  '\u065E', // Fatha with Two Dots (ٞ)
  '\u065F', // Wavy Hamza Below (ٟ)

  // ===== Additional combining marks =====
  '\u0670', // Superscript Alef (ٰ)

  // ===== Extended Arabic marks used in Kashmiri =====
  '\u06D6', '\u06D7', '\u06D8', '\u06D9', '\u06DA', '\u06DB', '\u06DC',
  '\u06DD', '\u06DE', '\u06DF', '\u06E0', '\u06E1', '\u06E2', '\u06E3',
  '\u06E4', '\u06E5', '\u06E6', '\u06E7', '\u06E8',
  '\u06EA', // Empty Centre Low Stop (۪)
  '\u06EB', // Empty Centre High Stop (۫)
  '\u06EC', // Rounded High Stop with Filled Centre (۬)
  '\u06ED', // Small High Seen (ۭ)

  // ===== Other combining marks =====
  '\u0610', '\u0611', '\u0612', '\u0613', '\u0614', '\u0615',
  '\u0616', '\u0617', '\u0618', '\u0619', '\u061A',

  // ===== Tatweel (kashida) =====
  '\u0640',
];

// Pre-compiled regex for maximum performance
const diacriticsRegex = new RegExp(`[${DIACRITICS_PATTERNS.join('')}]`, 'g');

// Character replacements: composite characters → base letters
// These are full characters with built-in hamza that should become plain letters
const CHARACTER_REPLACEMENTS: Record<string, string> = {
  // Alef variants with hamza → plain Alef (ا)
  '\u0672': '\u0627', // ٲ (Alef Wasla) → ا
  '\u0623': '\u0627', // أ (Alef with Hamza Above) → ا
  '\u0625': '\u0627', // إ (Alef with Hamza Below) → ا
  '\u0671': '\u0627', // ٱ (Alef Wasla) → ا
  '\u0622': '\u0627', // آ (Alef with Madda) → ا

  // Waw variants with hamza → plain Waw (و)
  '\u0624': '\u0648', // ؤ (Waw with Hamza Above) → و

  // Yeh variants with hamza → plain Yeh (ی)
  '\u0626': '\u06CC', // ئ (Yeh with Hamza Above) → ی
};

// Create replacement regex
const replacementRegex = new RegExp(`[${Object.keys(CHARACTER_REPLACEMENTS).join('')}]`, 'g');

// Chunk size for processing large texts (lines per chunk)
const CHUNK_SIZE = 500;

/**
 * Remove all diacritical marks and normalize hamza variants from Kashmiri text
 */
export function removeDiacritics(text: string): string {
  // First, replace composite characters with their base forms
  let result = text.replace(replacementRegex, (char) => CHARACTER_REPLACEMENTS[char] || char);
  // Then remove all diacritical marks
  return result.replace(diacriticsRegex, '');
}

/**
 * Process text synchronously (for small texts)
 */
export function processText(input: string): Array<{ original: string; cleaned: string }> {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  return lines.map(line => ({
    original: line.trim(),
    cleaned: removeDiacritics(line.trim())
  }));
}

/**
 * Process text in chunks with progress callback (for large texts)
 * Uses requestAnimationFrame to prevent UI freeze
 */
export async function processTextAsync(
  input: string,
  onProgress?: (progress: number, processed: number, total: number) => void
): Promise<Array<{ original: string; cleaned: string }>> {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const totalLines = lines.length;

  // For small files, process synchronously
  if (totalLines <= CHUNK_SIZE) {
    onProgress?.(100, totalLines, totalLines);
    return processText(input);
  }

  const results: Array<{ original: string; cleaned: string }> = [];
  let processedLines = 0;

  // Process in chunks
  for (let i = 0; i < totalLines; i += CHUNK_SIZE) {
    const chunk = lines.slice(i, Math.min(i + CHUNK_SIZE, totalLines));

    // Process chunk
    const chunkResults = chunk.map(line => ({
      original: line.trim(),
      cleaned: removeDiacritics(line.trim())
    }));

    results.push(...chunkResults);
    processedLines += chunk.length;

    // Report progress
    const progress = Math.round((processedLines / totalLines) * 100);
    onProgress?.(progress, processedLines, totalLines);

    // Yield to UI using requestAnimationFrame for smoother updates
    if (i + CHUNK_SIZE < totalLines) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  }

  return results;
}

/**
 * Check if text contains any diacritical marks
 */
export function hasDiacritics(text: string): boolean {
  return diacriticsRegex.test(text);
}

/**
 * Get statistics about diacritics in text
 */
export function getDiacriticsStats(text: string): {
  totalCharacters: number;
  diacriticsCount: number;
  percentage: number;
  lineCount: number;
} {
  const totalCharacters = text.length;
  const matches = text.match(diacriticsRegex);
  const diacriticsCount = matches ? matches.length : 0;
  const percentage = totalCharacters > 0 ? (diacriticsCount / totalCharacters) * 100 : 0;
  const lineCount = text.split('\n').filter(line => line.trim() !== '').length;

  return {
    totalCharacters,
    diacriticsCount,
    percentage: Math.round(percentage * 100) / 100,
    lineCount
  };
}

/**
 * Estimate processing time based on text size
 */
export function estimateProcessingTime(text: string): {
  isLargeFile: boolean;
  estimatedSeconds: number;
  recommendation: string;
} {
  const lineCount = text.split('\n').filter(line => line.trim()).length;
  const charCount = text.length;

  // Rough estimates based on typical performance
  const linesPerSecond = 10000;
  const estimatedSeconds = Math.ceil(lineCount / linesPerSecond);

  const isLargeFile = lineCount > 1000 || charCount > 100000;

  let recommendation = '';
  if (lineCount > 50000) {
    recommendation = 'Very large file - processing may take a while';
  } else if (lineCount > 10000) {
    recommendation = 'Large file - please wait for processing';
  } else if (isLargeFile) {
    recommendation = 'Medium file - processing in background';
  }

  return { isLargeFile, estimatedSeconds, recommendation };
}

// Kashmiri-specific diacritics for display in UI
export const KASHMIRI_DIACRITICS_DISPLAY = [
  { char: 'َ', name: 'Fatha (زَبَر)', example: 'اَ' },
  { char: 'ُ', name: 'Damma (پیش)', example: 'اُ' },
  { char: 'ِ', name: 'Kasra (زیر)', example: 'اِ' },
  { char: 'ٖ', name: 'Subscript Alef', example: 'یٖ' },
  { char: 'ٗ', name: 'Inverted Damma', example: 'وٗ' },
  { char: 'ٔ', name: 'Hamza Above', example: 'أ' },
  { char: 'ٕ', name: 'Hamza Below', example: 'إ' },
  { char: 'ٚ', name: 'Small V Above', example: 'وٚ، مےٚ' },
  { char: '۪', name: 'Empty Centre Low Stop', example: 'دٮ۪د' },
  { char: 'ۭ', name: 'Small High Seen', example: 'سۭتۍ' },
  { char: 'ّ', name: 'Shadda (تشدید)', example: 'پَتّھر' },
  { char: 'ْ', name: 'Sukun (جزم)', example: 'سكْت' },
  { char: 'ٰ', name: 'Superscript Alef', example: 'رحمٰن' },
  { char: 'ً', name: 'Fathatan', example: 'شُكراً' },
  { char: 'ٟ', name: 'Wavy Hamza Below', example: 'کٟشِر' },
];

// List of diacritics for reference
export const DIACRITICS_LIST = DIACRITICS_PATTERNS.map((char, index) => ({
  character: char,
  unicode: `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
  index
}));
