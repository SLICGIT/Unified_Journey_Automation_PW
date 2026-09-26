const { expect } = require('@playwright/test');

class AdditionalDetailsSection {
  constructor(page) {
    this.page = page;

    this.height =
      page.locator(
        '#ddlkycheights'
      );

    this.weight =
      page.locator(
        '#txtbxkycweight'
      );

    this.maritalStatus =
      page.locator(
        '#ddlkycmartialsts'
      );

    this.education =
      page.locator(
        '#ddlkyceducation'
      );

    this.occupation =
      page.locator(
        '#ddlkycoccupdation'
      );

    this.subOccupation =
      page.locator(
        '#ddlkycsuboccupdation'
      );

    this.annualIncome =
      page.locator(
        '#txtbxkycincome'
      );

    this.loadingOverlay =
      page.locator(
        '#loading2'
      );
  }

  normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  normalizeNumber(value) {
    return String(value || '')
      .replace(/[₹,\s]/g, '')
      .replace(/\.0$/, '')
      .trim();
  }

  findColumnKey(
    row,
    columnName
  ) {
    const expectedColumn =
      this.normalizeText(
        columnName
      );

    return Object.keys(row || {})
      .find(key => {
        return (
          this.normalizeText(key) ===
          expectedColumn
        );
      });
  }

  getRequiredValue(
    row,
    columnName,
    sheetName
  ) {
    const matchingKey =
      this.findColumnKey(
        row,
        columnName
      );

    const value =
      String(
        matchingKey
          ? row[matchingKey] ?? ''
          : ''
      ).trim();

    if (!value) {
      throw new Error(
        `${columnName} is missing in ` +
        `the ${sheetName} sheet.`
      );
    }

    return value;
  }

  getOptionalValue(
    row,
    columnName
  ) {
    const matchingKey =
      this.findColumnKey(
        row,
        columnName
      );

    if (!matchingKey) {
      return '';
    }

    return String(
      row[matchingKey] ?? ''
    ).trim();
  }

  async waitForLoadingToComplete() {
    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(() => false);

    if (overlayVisible) {
      console.log(
        'Waiting for loading overlay...'
      );

      await this.loadingOverlay.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }
  }

  async waitForSection() {
    console.log(
      'Waiting for Additional Details section...'
    );

    await expect(
      this.height
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.weight
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.maritalStatus
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.education
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.occupation
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.annualIncome
    ).toBeVisible({
      timeout: 60000
    });

    await this.waitForLoadingToComplete();

    console.log(
      'Additional Details section loaded.'
    );
  }

  async getDropdownOptions(locator) {
    return locator
      .locator('option')
      .allTextContents()
      .then(options => {
        return options.map(option => {
          return String(option || '')
            .replace(/\s+/g, ' ')
            .trim();
        });
      })
      .catch(() => []);
  }

  async selectHeight(height) {
    const expectedValue =
      String(height || '')
        .trim();

    if (!expectedValue) {
      throw new Error(
        'Height is missing in ' +
        'the AdditionalDetails sheet.'
      );
    }

    await expect(
      this.height
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.height
    ).toBeEnabled({
      timeout: 60000
    });

    const options =
      await this.getDropdownOptions(
        this.height
      );

    console.log(
      'Height available options:',
      options
    );

    const matchingOption =
      options.find(option => {
        return (
          this.normalizeText(option) ===
          this.normalizeText(
            expectedValue
          )
        );
      });

    if (!matchingOption) {
      throw new Error(
        `Height "${expectedValue}" was not found. ` +
        'Available options: ' +
        options.join(', ')
      );
    }

    await this.height.selectOption({
      label: matchingOption
    });

    await expect.poll(
      async () => {
        return String(
          await this.height
            .locator('option:checked')
            .textContent()
            .catch(() => '')
        )
          .replace(/\s+/g, ' ')
          .trim();
      },
      {
        timeout: 30000
      }
    ).toBe(
      matchingOption
    );

    console.log(
      `Height selected: ${matchingOption}`
    );

    await this.waitForLoadingToComplete();
  }

  async enterWeight(weight) {
    const value =
      String(weight || '')
        .replace(/\.0$/, '')
        .trim();

    if (!value) {
      throw new Error(
        'Weight is missing in ' +
        'the AdditionalDetails sheet.'
      );
    }

    if (!/^\d{1,3}$/.test(value)) {
      throw new Error(
        `Invalid Weight: "${value}".`
      );
    }

    await expect(
      this.weight
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.weight
    ).toBeEditable({
      timeout: 60000
    });

    await this.weight.fill(
      value
    );

    await this.weight.press(
      'Tab'
    );

    await expect(
      this.weight
    ).toHaveValue(
      value,
      {
        timeout: 30000
      }
    );

    console.log(
      `Weight entered: ${value}`
    );

    await this.waitForLoadingToComplete();
  }

  async getSelectedOptionText(locator) {
    return String(
      await locator
        .locator('option:checked')
        .textContent()
        .catch(() => '')
    )
      .replace(/\s+/g, ' ')
      .trim();
  }

  async verifyAutoPopulatedDropdown(
    locator,
    expectedValue,
    fieldName
  ) {
    const expected =
      String(expectedValue || '')
        .replace(/\s+/g, ' ')
        .trim();

    if (!expected) {
      throw new Error(
        `${fieldName} expected value ` +
        'is missing in PrePlanPersonalDetails.'
      );
    }

    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });

    await expect.poll(
      async () => {
        const selectedText =
          await this.getSelectedOptionText(
            locator
          );

        return this.normalizeText(
          selectedText
        );
      },
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          `${fieldName} was not auto-populated ` +
          `as "${expected}".`
      }
    ).toBe(
      this.normalizeText(
        expected
      )
    );

    console.log(
      `${fieldName} auto-populated and verified: ` +
      `${expected}`
    );
  }

  async verifyAutoPopulatedIncome(
    expectedAnnualIncome
  ) {
    const expectedValue =
      this.normalizeNumber(
        expectedAnnualIncome
      );

    if (!expectedValue) {
      throw new Error(
        'AnnualIncome is missing in ' +
        'PrePlanPersonalDetails.'
      );
    }

    await expect(
      this.annualIncome
    ).toBeVisible({
      timeout: 60000
    });

    await expect.poll(
      async () => {
        const displayedValue =
          await this.annualIncome
            .inputValue();

        return this.normalizeNumber(
          displayedValue
        );
      },
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          'Annual Income was not auto-populated ' +
          `as "${expectedAnnualIncome}".`
      }
    ).toBe(
      expectedValue
    );

    console.log(
      'Annual Income auto-populated and verified: ' +
      `${await this.annualIncome.inputValue()}`
    );
  }

  async verifySubOccupation(
    expectedSubOccupation
  ) {
    const expected =
      String(expectedSubOccupation || '')
        .trim();

    if (!expected) {
      console.log(
        'Sub Occupation is empty in Pre-Plan data. ' +
        'Skipping verification.'
      );

      return;
    }

    const displayed =
      await this.subOccupation
        .isVisible()
        .catch(() => false);

    if (!displayed) {
      throw new Error(
        `Expected Sub Occupation "${expected}", ` +
        'but the field is not displayed.'
      );
    }

    await this.verifyAutoPopulatedDropdown(
      this.subOccupation,
      expected,
      'Sub Occupation'
    );
  }

  async fill(
    additionalDetailsData,
    prePlanPersonalDetailsData
  ) {
    console.log(
      '===== Completing SP Additional Details ====='
    );

    if (!additionalDetailsData) {
      throw new Error(
        'AdditionalDetails Excel data is undefined.'
      );
    }

    if (!prePlanPersonalDetailsData) {
      throw new Error(
        'PrePlanPersonalDetails Excel data ' +
        'is undefined.'
      );
    }

    const height =
      this.getRequiredValue(
        additionalDetailsData,
        'Height',
        'AdditionalDetails'
      );

    const weight =
      this.getRequiredValue(
        additionalDetailsData,
        'Weight',
        'AdditionalDetails'
      );

    const maritalStatus =
      this.getRequiredValue(
        prePlanPersonalDetailsData,
        'MaritalStatus',
        'PrePlanPersonalDetails'
      );

    const education =
      this.getRequiredValue(
        prePlanPersonalDetailsData,
        'EducationalQualification',
        'PrePlanPersonalDetails'
      );

    const occupation =
      this.getRequiredValue(
        prePlanPersonalDetailsData,
        'CurrentOccupation',
        'PrePlanPersonalDetails'
      );

    const subOccupation =
      this.getOptionalValue(
        prePlanPersonalDetailsData,
        'SubOccupation'
      );

    const annualIncome =
      this.getRequiredValue(
        prePlanPersonalDetailsData,
        'AnnualIncome',
        'PrePlanPersonalDetails'
      );

    console.log(
      'Additional Details expected data:',
      {
        height,
        weight,
        maritalStatus,
        education,
        occupation,
        subOccupation,
        annualIncome
      }
    );

    await this.waitForSection();

    /*
     * Only Height and Weight are entered here.
     */
    await this.selectHeight(
      height
    );

    await this.enterWeight(
      weight
    );

    /*
     * Remaining fields must already contain
     * values entered in Pre-Plan Personal Details.
     */
    await this.verifyAutoPopulatedDropdown(
      this.maritalStatus,
      maritalStatus,
      'Marital Status'
    );

    await this.verifyAutoPopulatedDropdown(
      this.education,
      education,
      'Education'
    );

    await this.verifyAutoPopulatedDropdown(
      this.occupation,
      occupation,
      'Occupation'
    );

    await this.verifySubOccupation(
      subOccupation
    );

    await this.verifyAutoPopulatedIncome(
      annualIncome
    );

    console.log(
      'SP Additional Details completed successfully.'
    );
  }
}

module.exports = AdditionalDetailsSection;