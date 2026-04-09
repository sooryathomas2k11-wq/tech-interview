import { expect } from '@playwright/test';
import { TimezonePage } from '../pages/timezone.page';

export class TimezoneVerifications {
    // We pass the page object here to reuse its locators
    constructor(private readonly tzPage: TimezonePage) {}

    async assertRowExists(label: string) {
        await expect(this.tzPage.getRowByLabel(label)).toBeVisible();
    }

    async assertRowCount(label: string, count: number) {
        await expect(this.tzPage.tableRows.filter({ hasText: label })).toHaveCount(count);
    }

    async assertDeleteDisabled(label: string) {
        const deleteBtn = this.tzPage.getDeleteButtonByLabel(label);
        await expect(deleteBtn).toBeDisabled();
    }

   async verifyTableIsSortedByTime() {
    const timeStrings = await this.tzPage.getAllTimeStrings();
    console.log('--- DEBUG: Raw Time Strings ---');
    console.log(timeStrings);
    
    // 2. Process the data
    const actualTimes = timeStrings.map(t => Date.parse(`2026-04-08 ${t}`));
    const expectedSorted = [...actualTimes].sort((a, b) => a - b);

    // 3. Assert
    await expect(actualTimes, 'Table rows are not sorted by time').toEqual(expectedSorted);
}
}