import { expect, Locator } from '@playwright/test';

export class TimezoneVerifications {
    constructor(private readonly tableRows: Locator) {}

    async assertRowExists(label: string) {
        await expect(this.tableRows.filter({ hasText: label })).toBeVisible();
    }

    async assertRowCount(label: string, count: number) {
        await expect(this.tableRows.filter({ hasText: label })).toHaveCount(count);
    }

    async assertDeleteDisabled(label: string) {
        const row = this.tableRows.filter({ hasText: label });
        await expect(row.getByRole('button', { name: 'Delete' })).toBeDisabled();
    }

async verifyTableIsSortedByTime() {
    // 1. Get the raw time strings using your existing row logic
    // nth(2) corresponds to the 3rd column (Current Time)
    const timeStrings = await this.tableRows.locator('td').nth(2).allInnerTexts();

    // 2. Convert "10:00 AM" strings into comparable numbers
    // We use a dummy date so JS can calculate the difference correctly
    const actualTimes = timeStrings.map(t => Date.parse(`2026-04-08 ${t}`));

    // 3. Create the expected order by sorting the actual data
    const expectedSorted = [...actualTimes].sort((a, b) => a - b);

    // 4. Assert
    return expect(actualTimes, 'Table should be sorted from earliest to latest time')
           .toEqual(expectedSorted);
}
}

