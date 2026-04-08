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

    async assertTableIsSortedByTime() {
        const allTexts = await this.tableRows.allInnerTexts();
        const todayDate = new Date().toLocaleDateString();

        const actualTimes = allTexts.map(row => row.split('\t')[2]);

        const expectedSorted = [...actualTimes].sort((a, b) => {
            return Date.parse(`${todayDate} ${a}`) - Date.parse(`${todayDate} ${b}`);
        });

        expect(actualTimes).toEqual(expectedSorted);
    }
}