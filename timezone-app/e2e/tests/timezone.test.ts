import { test, expect } from '@playwright/test';
import { TimezonePage } from '../pages/timezone.page';
import { TimezoneVerifications } from '../verifications/timezone.verifications';
import { loadCsvTestData } from '../utils/csv-loader';

test.describe('Timezone App', () => {
    let tzPage: TimezonePage;
    let verify: TimezoneVerifications;

 test.beforeEach(async ({ page }) => {
        tzPage = new TimezonePage(page);
        verify = new TimezoneVerifications(tzPage); 
        await tzPage.navigate();
    });

    test('renders the local timezone row marked as You and prevents deleting it', async () => {
        const localRow = await tzPage.getRowByLabel('Local');

        await expect(localRow).toBeVisible();
        await expect(localRow).toContainText('(You)');
        await expect(tzPage.getDeleteButtonByLabel('Local')).toBeDisabled();
    });

    // Parameterized tests using CSV data
    const timezoneTestCases = loadCsvTestData('../resources/timezones.csv');

timezoneTestCases.forEach(({ label, zone }) => {
    test(`adds a new timezone record: "${label}" - "${zone}"`, async () => {
        await tzPage.addTimezone(label, zone);

        // This assertion will now fail for "Central European Summer Time" because it can't be selected
        await verify.assertRowExists(label);
        
        const zoneCell = tzPage.getDisplayedTimezoneByLabel(label);
        await expect(zoneCell).toHaveText(zone);
    });
});

test('table remains sorted by time after each addition', async ({ page }) => {
    // Setup
    const MOCK_NOW = new Date('2026-04-08T12:00:00Z');
    await page.clock.setFixedTime(MOCK_NOW);

    // Load your CSV data
    const sortingTestCases = loadCsvTestData('../resources/sorting-test.csv');
    
    for (const item of sortingTestCases) {
        // Step 1: Action (Add the timezone)
        await tzPage.addTimezone(item.label, item.zone);             
    }
    // Step 2: Verification (Check the table is sorted by time)
     await verify.verifyTableIsSortedByTime();
});

    // Parameterized delete tests using CSV data
    const deleteTestCases = loadCsvTestData('../resources/delete-timezones.csv');
    
    deleteTestCases.forEach(({ label, zone }) => {
        test(`deletes a custom timezone record: "${label}" - "${zone}" and keeps the local row`, async () => {
            await tzPage.addTimezone(label, zone);
            await tzPage.deleteRowByLabel(label);

            await verify.assertRowCount(label, 0); // Deleted row should be gone
            await verify.assertRowExists('Local');  // Local row should still exist
            await expect(tzPage.getDeleteButtonByLabel('Local')).toBeDisabled(); // Local row cannot be deleted
        });
    });
});