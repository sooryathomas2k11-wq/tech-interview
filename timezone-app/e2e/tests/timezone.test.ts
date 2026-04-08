import { test, expect } from '@playwright/test';
import { TimezonePage } from '../pages/timezone.page';
import { TimezoneVerifications } from '../verifications/timezone.verifications';
import { loadTimezoneTestData, loadDeleteTimezoneTestData } from '../utils/csv-loader';

test.describe('Timezone App', () => {
    let tzPage: TimezonePage;
    let verify: TimezoneVerifications;

    test.beforeEach(async ({ page }) => {
        tzPage = new TimezonePage(page);
        verify = new TimezoneVerifications(tzPage.tableRows);
        await tzPage.navigate();
    });

    test('renders the local timezone row marked as You and prevents deleting it', async () => {
        const localRow = await tzPage.getRowByLabel('Local');

        await expect(localRow).toBeVisible();
        await expect(localRow).toContainText('(You)');
        await expect(tzPage.getDeleteButtonByLabel('Local')).toBeDisabled();
    });

    // Parameterized tests using CSV data
    const timezoneTestCases = loadTimezoneTestData();
    
    timezoneTestCases.forEach(({ label, zone }) => {
        test(`adds a new timezone record: "${label}" - "${zone}"`, async () => {
            await tzPage.addTimezone(label, zone);

            await verify.assertRowExists(label);
            await expect(tzPage.getDisplayedTimezoneByLabel(label)).toHaveText(zone);
        });
    });

    test('sorts the table rows by current local time ascending', async () => {
        const timezones = await tzPage.getAllTimezones();
        const timestamps = timezones.map((zone) => {
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

        expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
    });

    // Parameterized delete tests using CSV data
    const deleteTestCases = loadDeleteTimezoneTestData();
    
    deleteTestCases.forEach(({ label, zone }) => {
        test(`deletes a custom timezone record: "${label}" - "${zone}" and keeps the local row`, async () => {
            await tzPage.addTimezone(label, zone);
            await tzPage.deleteRowByLabel(label);

            await verify.assertRowCount(label, 0);
            await verify.assertRowExists('Local');
            await expect(tzPage.getDeleteButtonByLabel('Local')).toBeDisabled();
        });
    });
});