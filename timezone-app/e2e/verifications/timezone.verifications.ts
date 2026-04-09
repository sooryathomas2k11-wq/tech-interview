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
    // 1. Using :nth-child(3) to get the 'Current Time' column from all rows
    const timeStrings = await this.tableRows.locator('td:nth-child(3)').allInnerTexts();
   
    // 2. Convert the array of strings into timestamps for comparison
    const actualTimes = timeStrings.map(t => Date.parse(`2026-04-08 ${t}`));

    // 3. Create a copy and sort it numerically to determine the correct order
    const expectedSorted = [...actualTimes].sort((a, b) => a - b);

    // 4. Assert that the UI matches the sorted data
    // This will fail with a clear diff if the table isn't sorted
    await expect(actualTimes, 'Table rows are not sorted by time').toEqual(expectedSorted);
}
}

