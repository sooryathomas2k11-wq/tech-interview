import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface TimezoneTestCase {
  label: string;
  zone: string;
}

/**
 * Loads test data from a CSV file and returns an array of TimezoneTestCase
 * @param relativeCsvPath - relative path to the CSV file from this file
 */
export function loadCsvTestData(relativeCsvPath: string): TimezoneTestCase[] {
  const csvPath = resolve(__dirname, relativeCsvPath);
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');

  // Skip header and parse rows
  return lines.slice(1).map((line) => {
    const [label, zone] = line.split(',').map((s) => s.trim());
    return { label, zone };
  });
}
