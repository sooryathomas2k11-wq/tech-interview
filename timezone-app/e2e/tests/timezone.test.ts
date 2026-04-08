import { test } from '@playwright/test';
import { TimezonePage } from '../pages/timezone.page';
import { TimezoneVerifications } from '../verifications/timezone.verifications';

test.describe('Timezone App Architectural Suite', () => {
    let tp: TimezonePage;
    let verify: TimezoneVerifications;

    test.beforeEach(async ({ page }) => {
        tp = new TimezonePage(page);
        verify = new TimezoneVerifications(tp.tableRows);
        await tp.goto();
    });

    test('should sort timezones earliest first', async () => {
        await tp.addTimezone('Mountain HQ', 'America/Denver');
        await tp.addTimezone('Pacific HQ', 'America/Los_Angeles');
        // This is much cleaner than putting the sort logic inside the test!
        await verify.assertTableIsSortedByTime();
    });

    test('should handle duplicate labels correctly', async ({ page }) => {
        const label = 'Duplicate Label';
        await tp.addTimezone(label, 'America/New_York');
        await tp.addTimezone(label, 'America/Juneau');

        await verify.assertRowCount(label, 2);

        // Custom method in your Page Object to delete only the first occurrence
        await tp.deleteTimezone(label);
        await verify.assertRowCount(label, 1);
    });
});