const { expect } = require('@playwright/test');

class SuitabilityAnalysisPage {
  constructor(page) {
    this.page = page;

    this.objectiveOfInsurance =
      page.locator('#selObjectiveOfInsurance');

    this.riskAppetite =
      page.locator('#selRiskAppetite');

    this.submitButton =
      page.locator('#btnSuitabilitySubmit');
  }

  async waitForPopup() {
    await this.objectiveOfInsurance.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await this.riskAppetite.waitFor({
      state: 'visible',
      timeout: 60000
    });

    console.log(
      'Suitability Analysis popup loaded.'
    );
  }

  async selectObjectiveOfInsurance(excelValue) {
    const value = String(excelValue ?? '').trim();

    if (!value) {
      throw new Error(
        'Objective of Insurance is empty in Excel.'
      );
    }

    console.log(
      `Objective of Insurance from Excel: "${value}"`
    );

    await this.objectiveOfInsurance.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await expect(
      this.objectiveOfInsurance
    ).toBeEnabled({
      timeout: 30000
    });

    await this.objectiveOfInsurance.selectOption({
      label: value
    });

    await expect(
      this.objectiveOfInsurance.locator(
        'option:checked'
      )
    ).toHaveText(value, {
      timeout: 30000
    });

    console.log(
      `Selected Objective of Insurance: "${value}"`
    );
  }

  async selectRiskAppetite(excelValue) {
    const value = String(excelValue ?? '').trim();

    if (!value) {
      throw new Error(
        'Risk Appetite is empty in Excel.'
      );
    }

    console.log(
      `Risk Appetite from Excel: "${value}"`
    );

    await this.riskAppetite.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await expect(
      this.riskAppetite
    ).toBeEnabled({
      timeout: 30000
    });

    await this.riskAppetite.selectOption({
      label: value
    });

    await expect(
      this.riskAppetite.locator(
        'option:checked'
      )
    ).toHaveText(value, {
      timeout: 30000
    });

    console.log(
      `Selected Risk Appetite: "${value}"`
    );
  }

  async clickSubmit() {
    await this.submitButton.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await this.submitButton.scrollIntoViewIfNeeded();

    await expect(this.submitButton).toBeEnabled({
      timeout: 30000
    });

    await this.submitButton.click();

    console.log(
      'Suitability Analysis submitted successfully.'
    );
  }

  async completeSuitabilityAnalysis(data) {
  if (!data) {
    throw new Error(
      'Suitability Analysis data is undefined.'
    );
  }

  await this.waitForPopup();

  // Show popup before selecting
  await this.page.waitForTimeout(2000);

  await this.selectObjectiveOfInsurance(
    data['Objective of Insurance']
  );

  // Show selected Objective of Insurance
  await this.page.waitForTimeout(2000);

  await this.selectRiskAppetite(
    data['Risk Appetite']
  );

  // Show both selected values before Submit
  await this.page.waitForTimeout(3000);

  await this.clickSubmit();

  console.log(
    'Suitability Analysis completed successfully.'
  );
}
}

module.exports = SuitabilityAnalysisPage;