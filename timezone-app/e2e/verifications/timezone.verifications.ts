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
        const timezoneCells = this.tableRows.locator('td:nth-child(2)');
        const allTimezones = await timezoneCells.allInnerTexts();

        const actualTimestamps = allTimezones.map((zone) => {
            const formatted = new Intl.DateTimeFormat('sv-SE', {
                timeZone: zone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).format(new Date());

            return new Date(formatted).getTime();
        });

        expect(actualTimestamps).toEqual([...actualTimestamps].sort((a, b) => a - b));
    }
}