## 🧪 Quality Engineering & Testing (Hiive Assignment)

I have implemented a production-grade testing infrastructure that combines automated E2E testing with rigorous manual QA.

### 🏗️ Automation Architecture (Playwright)
The suite utilizes a scalable **Page Object Model (POM)** and **Data-Driven** design:

* **[Page Class](https://github.com/sooryathomas2k11-wq/tech-interview/blob/main/timezone-app/e2e/pages/timezone.page.ts):** Encapsulates all UI locators (e.g., `tableRows`) and core actions like adding or deleting timezones.
* **[Test Class](https://github.com/sooryathomas2k11-wq/tech-interview/blob/main/timezone-app/e2e/tests/timezone.test.ts):** Executes clean, readable scenarios by orchestrating calls between Page and Verification classes.
* **[Verification Class](https://github.com/sooryathomas2k11-wq/tech-interview/blob/main/timezone-app/e2e/verifications/timezone.verifications.ts):** Manages complex assertions by reusing the Page Class instance, ensuring a **single source of truth** for all UI elements.
* **CSV Data-Driven Testing:** Integrated external CSV files to dynamically load test data, enabling validation of multiple labels and offsets without code duplication.

### ⚙️ CI/CD: GitHub Actions
A custom [GitHub Actions pipeline](https://github.com/sooryathomas2k11-wq/tech-interview/actions) automates the testing lifecycle:
* **Combined Workflow:** Handles application builds, Playwright setup, and parallelized execution.
* **Automated Diagnostics:** Captures and uploads **Playwright HTML Reports** as artifacts.

### 🛠️ Application Logic Enhancements
To align with product specifications, I directly modified the application code:
* **UI Hardening:** The **Delete button is programmatically disabled** for the "You" record to maintain data integrity.

### 🐞 Manual QA & Defect Tracking
A deep-dive manual audit resulted in **[8 Formal Defects/Enhancements](https://github.com/sooryathomas2k11-wq/tech-interview/issues)**. Each issue includes reproduction steps, severity levels, and "Expected vs. Actual" analysis.
