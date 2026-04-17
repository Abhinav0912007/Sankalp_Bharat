// ============================================================
// CarbonLens — File Parser Service (Sameera, Phase 1)
// ============================================================
// Extracts activity data from uploaded files.
// OUTPUT CONTRACT (→ Sahiti's EmissionEngine.processBatch()):
//   [ { activityType: string, value: number, unit: string } ]
//
// Supports: CSV, XLSX, PDF (text extraction)
// ============================================================

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

export interface ParsedActivityItem {
  activityType: string;
  value: number;
  unit: string;
}

// ── CSV Parser ──────────────────────────────────────────────
function parseCSV(filePath: string): ParsedActivityItem[] {
  const content = fs.readFileSync(filePath, 'utf-8');

  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  return rows
    .map((row): ParsedActivityItem | null => {
      // Flexible column matching (handles different header names)
      const activityType =
        row['activityType'] ?? row['activity_type'] ?? row['source'] ?? row['type'] ?? '';
      const rawValue =
        row['value'] ?? row['amount'] ?? row['quantity'] ?? row['activityValue'] ?? '';
      const unit =
        row['unit'] ?? row['units'] ?? row['activityUnit'] ?? '';

      const value = parseFloat(rawValue);

      if (!activityType || isNaN(value) || !unit) return null;
      return { activityType: activityType.trim(), value, unit: unit.trim() };
    })
    .filter((item): item is ParsedActivityItem => item !== null);
}

// ── XLSX Parser ─────────────────────────────────────────────
function parseXLSX(filePath: string): ParsedActivityItem[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  return rows
    .map((row): ParsedActivityItem | null => {
      const activityType = String(
        row['activityType'] ?? row['activity_type'] ?? row['source'] ?? row['type'] ?? ''
      );
      const rawValue = row['value'] ?? row['amount'] ?? row['quantity'] ?? row['activityValue'] ?? '';
      const unit = String(row['unit'] ?? row['units'] ?? row['activityUnit'] ?? '');

      const value = parseFloat(String(rawValue));
      if (!activityType || isNaN(value) || !unit) return null;
      return { activityType: activityType.trim(), value, unit: unit.trim() };
    })
    .filter((item): item is ParsedActivityItem => item !== null);
}

// ── PDF Parser ──────────────────────────────────────────────
// Simple heuristic extraction — finds numeric values near units.
// For real OCR quality, a dedicated Tesseract service is recommended.
async function parsePDF(filePath: string): Promise<ParsedActivityItem[]> {
  try {
    // Dynamic import to handle optional pdf-parse
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
    const buffer = fs.readFileSync(filePath);
    const { text } = await pdfParse(buffer);

    // Heuristic: match patterns like "1500 kWh" or "340 liters"
    const UNIT_KEYWORDS = [
      'kWh', 'MWh', 'liters', 'litres', 'gallons', 'kg', 'tonnes',
      'km', 'tonne-km', 'GJ', 'MJ', 'm3', 'kL',
    ];

    const results: ParsedActivityItem[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      for (const unit of UNIT_KEYWORDS) {
        const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${unit}\\b`, 'gi');
        const matches = [...line.matchAll(regex)];
        for (const match of matches) {
          results.push({
            activityType: 'extracted_from_pdf',
            value: parseFloat(match[1]),
            unit,
          });
        }
      }
    }

    return results;
  } catch {
    // If pdf-parse fails, return empty — don't crash the upload
    return [];
  }
}

// ── Main Entry Point ─────────────────────────────────────────
export async function parseUploadedFile(filePath: string): Promise<ParsedActivityItem[]> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.csv':
      return parseCSV(filePath);
    case '.xlsx':
    case '.xls':
      return parseXLSX(filePath);
    case '.pdf':
      return parsePDF(filePath);
    case '.png':
    case '.jpg':
    case '.jpeg':
      // Image OCR — returns empty for now, hook Tesseract.js here
      console.log('[FileParser] Image OCR not yet implemented, returning empty array');
      return [];
    default:
      return [];
  }
}
