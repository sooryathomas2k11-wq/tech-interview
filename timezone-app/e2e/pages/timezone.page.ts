import { Page, Locator } from '@playwright/test';

export class TimezonePage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly labelInput: Locator;
  readonly locationSelect: Locator;
  readonly saveButton: Locator;
  readonly tableRows: Locator;
  readonly timezoneCells: Locator;
  readonly rowTimeCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add timezone' });
    this.labelInput = page.locator('input[name="label"]');
    this.locationSelect = page.locator('input#timezone');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.tableRows = page.locator('tbody tr');
    this.timezoneCells = this.tableRows.locator('td:nth-child(2)');
    this.rowTimeCells = this.tableRows.locator('td:nth-child(3)');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async addTimezone(label: string, locationValue: string) {
    await this.addButton.click();
    if (label) await this.labelInput.fill(label);
    if (locationValue) await this.locationSelect.fill(locationValue);
    await this.saveButton.click();
  }

  getRowByLabel(label: string) {
    return this.tableRows.filter({ hasText: label }).first();
  }

  getDeleteButtonByLabel(label: string) {
    return this.getRowByLabel(label).getByRole('button', { name: 'Delete' });
  }

  async deleteRowByLabel(label: string) {
    await this.getDeleteButtonByLabel(label).click();
  }

  getDisplayedTimezoneByLabel(label: string) {
    return this.getRowByLabel(label).locator('td').nth(1);
  }

  async getAllTimezones() {
    return await this.timezoneCells.allInnerTexts();
  }

  async getAllRowTimes() {
    return await this.rowTimeCells.allInnerTexts();
  }

  // Helper to get row data for verification
  async getRowTexts() {
    return await this.tableRows.allInnerTexts();
  }
}