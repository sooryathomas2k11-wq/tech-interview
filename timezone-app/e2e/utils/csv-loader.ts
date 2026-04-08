import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface TimezoneTestCase {
  label: string;
  zone: string;
}

export function loadTimezoneTestData(): TimezoneTestCase[] {
  const csvPath = resolve(__dirname, '../resources/timezones.csv');
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  
  // Skip header and parse rows
  return lines.slice(1).map((line) => {
    const [label, zone] = line.split(',').map(s => s.trim());
    return { label, zone };
  });
}

export function loadDeleteTimezoneTestData(): TimezoneTestCase[] {
  const csvPath = resolve(__dirname, '../resources/delete-timezones.csv');
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  
  // Skip header and parse rows
  return lines.slice(1).map((line) => {
    const [label, zone] = line.split(',').map(s => s.trim());
    return { label, zone };
  });
}
