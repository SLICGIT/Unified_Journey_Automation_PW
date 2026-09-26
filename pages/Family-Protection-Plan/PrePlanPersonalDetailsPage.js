const { expect } = require('@playwright/test');

class PrePlanPersonalDetailsPage {
  constructor(page) {
    this.page = page;

    this.educationalQualification = page.locator(
      '#selEduQual'
    );

    this.annualIncome = page.locator(
      '#txtbxkycincome'
    );

    this.annualIncomeRange = page.locator(
      '#incomerange2'
    );

    this.annualIncomeError = page.locator(
      '#lblerrkycincome'
    );

    this.currentOccupation = page.locator(
      '#selOccupation'
    );

    this.subOccupation = page.locator(
      '#selSubOccupation'
    );

    this.currentAddressPincode = page.locator(
      '#txtbxPincode'
    );

    this.pincodeError = page.locator(
      '#lblerrBDPin'
    );

    this.maritalStatus = page.locator(
      '#selMaritalStatus'
    );

    this.existingCustomerCheckbox = page.locator(
      '#chkbxExtCus'
    );

    this.continueButton = page.locator(
      '#btnContinue'
    );

    this.questionnairePageMarker = page.locator(
      '#chkbxGoodHealth'
    );

    this.loadingOverlay = page.locator(
      '#loading2'
    );

    this.fetchingDetailsText = page.getByText(
      'Fetching Details',
      {
        exact: true
      }
    );
  }

  normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  findColumnKey(row, columnName) {
    const requiredName = this.normalizeText(
      columnName
    );

    return Object.keys(row || {}).find(key => {
      return this.normalizeText(key) === requiredName;
    });
  }

  getRequiredValue(row, columnName) {
    const matchingKey = this.findColumnKey(
      row,
      columnName
    );

    const value = String(
      matchingKey ? row[matchingKey] ?? '' : ''
    ).trim();

    if (!value) {
      throw new Error(
        `${columnName} is missing in the ` +
        'PrePlanPersonalDetails sheet.'
      );
    }

    return value;
  }

  getOptionalValue(row, columnName) {
    const matchingKey = this.findColumnKey(
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
    const overlayVisible = await this.loadingOverlay
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

    const fetchingVisible = await this.fetchingDetailsText
      .isVisible()
      .catch(() => false);

    if (fetchingVisible) {
      console.log(
        'Waiting for Fetching Details...'
      );

      await this.fetchingDetailsText.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }
  }

  async waitForPage() {
    console.log(
      'Waiting for SP Pre-Plan Personal Details page...'
    );

    await expect(
      this.educationalQualification
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.annualIncome
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.currentOccupation
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.currentAddressPincode
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.maritalStatus
    ).toBeVisible({
      timeout: 120000
    });

    await this.waitForLoadingToComplete();

    console.log(
      'SP Pre-Plan Personal Details page loaded.'
    );
  }

  async getDropdownOptions(locator) {
    return locator
      .locator('option')
      .evaluateAll(options => {
        return options.map(option => ({
          label: String(option.textContent || '')
            .replace(/\s+/g, ' ')
            .trim(),

          value: String(option.value || '')
            .trim()
        }));
      })
      .catch(() => []);
  }

  async waitForDropdownOption(
    locator,
    expectedValue,
    fieldName
  ) {
    const expected = this.normalizeText(
      expectedValue
    );

    console.log(
      `Waiting for ${fieldName} option: ` +
      `"${expectedValue}"`
    );

    await expect.poll(
      async () => {
        const options = await this.getDropdownOptions(
          locator
        );

        return options.some(option => {
          return (
            this.normalizeText(option.label) === expected ||
            this.normalizeText(option.value) === expected
          );
        });
      },
      {
        timeout: 120000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          `${fieldName} option ` +
          `"${expectedValue}" was not loaded.`
      }
    ).toBeTruthy();
  }

  async selectDropdownByLabel(
    locator,
    expectedValue,
    fieldName
  ) {
    const value = String(
      expectedValue || ''
    ).trim();

    if (!value) {
      throw new Error(
        `${fieldName} is missing in Excel.`
      );
    }

    await expect(locator).toBeVisible({
      timeout: 60000
    });

    await expect(locator).toBeEnabled({
      timeout: 60000
    });

    await this.waitForDropdownOption(
      locator,
      value,
      fieldName
    );

    const availableOptions = await this.getDropdownOptions(
      locator
    );

    console.log(
      `${fieldName} available options:`,
      availableOptions.map(option => option.label)
    );

    const expectedNormalized = this.normalizeText(
      value
    );

    const matchingOption = availableOptions.find(option => {
      return (
        this.normalizeText(option.label) === expectedNormalized ||
        this.normalizeText(option.value) === expectedNormalized
      );
    });

    if (!matchingOption) {
      throw new Error(
        `${fieldName} option "${value}" was not found. ` +
        'Available options: ' +
        availableOptions
          .map(option => option.label)
          .join(', ')
      );
    }

    if (matchingOption.value) {
      await locator.selectOption({
        value: matchingOption.value
      });
    } else {
      await locator.selectOption({
        label: matchingOption.label
      });
    }

    await expect.poll(
      async () => {
        return String(
          await locator
            .locator('option:checked')
            .textContent()
            .catch(() => '')
        )
          .replace(/\s+/g, ' ')
          .trim();
      },
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ]
      }
    ).toBe(matchingOption.label);

    console.log(
      `${fieldName} selected: ${matchingOption.label}`
    );

    await this.waitForLoadingToComplete();
  }

  async enterAnnualIncome(annualIncome) {
    const value = String(annualIncome || '')
      .replace(/,/g, '')
      .replace(/\.0$/, '')
      .trim();

    if (!/^\d+$/.test(value)) {
      throw new Error(
        `Invalid AnnualIncome: "${annualIncome}".`
      );
    }

    const numericValue = Number(value);

    if (
      numericValue < 0 ||
      numericValue > 5000000
    ) {
      throw new Error(
        'AnnualIncome must be between 0 and 5000000. ' +
        `Received: "${value}".`
      );
    }

    await expect(
      this.annualIncomeRange
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.annualIncomeRange
    ).toBeEnabled({
      timeout: 60000
    });

    /*
     * Filling the range triggers SliderAnnualIncome(),
     * synchronizing the range and formatted textbox.
     */
    await this.annualIncomeRange.fill(value);

    await expect(
      this.annualIncomeRange
    ).toHaveValue(value, {
      timeout: 30000
    });

    await expect.poll(
      async () => {
        const displayedValue = await this.annualIncome
          .inputValue();

        return String(displayedValue)
          .replace(/,/g, '')
          .replace(/[₹\s]/g, '')
          .trim();
      },
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          'Annual Income textbox and range were not synchronized.'
      }
    ).toBe(value);

    /*
     * Trigger IncomeChange() through focusout.
     */
    await this.annualIncome.focus();
    await this.annualIncome.press('Tab');

    await this.waitForLoadingToComplete();

    const errorMessage = String(
      await this.annualIncomeError
        .textContent()
        .catch(() => '')
    ).trim();

    const errorVisible = await this.annualIncomeError
      .isVisible()
      .catch(() => false);

    if (errorVisible && errorMessage) {
      throw new Error(
        `Annual Income validation failed: ${errorMessage}`
      );
    }

    console.log(
      'Annual Income entered:',
      await this.annualIncome.inputValue()
    );

    console.log(
      'Annual Income range value:',
      await this.annualIncomeRange.inputValue()
    );
  }

  isSubOccupationRequired(occupation) {
    const normalizedOccupation = this.normalizeText(
      occupation
    );

    return [
      'salaried',
      'self employed professional',
      'self employed occupations'
    ].includes(normalizedOccupation);
  }

  async handleSubOccupation(
    occupation,
    subOccupation
  ) {
    const required = this.isSubOccupationRequired(
      occupation
    );

    if (!required) {
      console.log(
        'Sub Occupation is not required for ' +
        `Current Occupation: ${occupation}`
      );

      return;
    }

    if (!subOccupation) {
      throw new Error(
        'SubOccupation is required when ' +
        `CurrentOccupation is "${occupation}".`
      );
    }

    console.log(
      `Current Occupation "${occupation}" requires ` +
      'Sub Occupation.'
    );

    await expect(
      this.subOccupation
    ).toBeVisible({
      timeout: 60000
    });

    await this.selectDropdownByLabel(
      this.subOccupation,
      subOccupation,
      'Sub Occupation'
    );
  }

  async enterCurrentAddressPincode(pincode) {
    const value = String(pincode || '')
      .replace(/\.0$/, '')
      .trim();

    if (!/^\d{6}$/.test(value)) {
      throw new Error(
        'Invalid CurrentAddressPincode: ' +
        `"${value}". It must contain 6 digits.`
      );
    }

    await expect(
      this.currentAddressPincode
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.currentAddressPincode
    ).toBeEditable({
      timeout: 60000
    });

    await this.currentAddressPincode.fill(value);
    await this.currentAddressPincode.press('Tab');

    await expect(
      this.currentAddressPincode
    ).toHaveValue(value, {
      timeout: 30000
    });

    await this.waitForLoadingToComplete();

    const errorMessage = String(
      await this.pincodeError
        .textContent()
        .catch(() => '')
    ).trim();

    const errorVisible = await this.pincodeError
      .isVisible()
      .catch(() => false);

    if (errorVisible && errorMessage) {
      throw new Error(
        `Pincode validation failed: ${errorMessage}`
      );
    }

    console.log(
      `Current Address Pincode entered: ${value}`
    );
  }

  async setExistingCustomer(existingCustomer) {
  console.log(
    `Setting Existing Customer: ${existingCustomer}`
  );

  const value = String(
    existingCustomer || ''
  )
    .trim()
    .toLowerCase();

  const shouldBeChecked =
    value === 'yes' ||
    value === 'true';

  // Actual checkbox
  const checkbox = this.page.locator(
    '#chkbxExtCus'
  );

  // Get current status from hidden checkbox
  const currentlyChecked =
    await checkbox.isChecked();

  console.log(
    `Existing Customer current status: ${
      currentlyChecked ? 'Yes' : 'No'
    }`
  );

  // If already in expected state, no action required
  if (
    currentlyChecked === shouldBeChecked
  ) {
    console.log(
      `Existing Customer already selected: ${
        shouldBeChecked ? 'Yes' : 'No'
      }`
    );

    return;
  }

  console.log(
    `Existing Customer change required: ${
      shouldBeChecked ? 'Yes' : 'No'
    }`
  );

  // Try clicking the visible parent/label/toggle
  const visibleToggle = this.page
    .locator(
      '#chkbxExtCus'
    )
    .locator(
      'xpath=following-sibling::*'
    )
    .first();

  if (
    await visibleToggle
      .isVisible()
      .catch(() => false)
  ) {
    await visibleToggle.click();
  } else {
    // Try parent element
    const parentToggle = this.page.locator(
      '#chkbxExtCus'
    ).locator(
      'xpath=..'
    );

    if (
      await parentToggle
        .isVisible()
        .catch(() => false)
    ) {
      await parentToggle.click();
    } else {
      // Last fallback for custom hidden checkbox
      await checkbox.evaluate(
        (element, checked) => {
          if (element.checked !== checked) {
            element.click();
          }
        },
        shouldBeChecked
      );
    }
  }

  // Wait until checkbox state changes
  await this.page.waitForFunction(
    ({ selector, expectedState }) => {
      const element =
        document.querySelector(selector);

      return (
        element &&
        element.checked === expectedState
      );
    },
    {
      selector: '#chkbxExtCus',
      expectedState: shouldBeChecked,
    },
    {
      timeout: 10000,
    }
  );

  const finalState =
    await checkbox.isChecked();

  if (
    finalState !== shouldBeChecked
  ) {
    throw new Error(
      `Failed to set Existing Customer to ${
        shouldBeChecked ? 'Yes' : 'No'
      }.`
    );
  }

  console.log(
    `Existing Customer selected successfully: ${
      finalState ? 'Yes' : 'No'
    }`
  );
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

  async getVisibleValidationMessages() {
    const messages = await this.page
      .locator('[id^="lblerr"]:visible')
      .allTextContents();

    return messages
      .map(message => {
        return String(message)
          .replace(/\s+/g, ' ')
          .trim();
      })
      .filter(Boolean);
  }

  async fillPersonalDetails(row) {
    console.log(
      '===== Filling SP Pre-Plan Personal Details ====='
    );

    if (!row) {
      throw new Error(
        'Pre-Plan Personal Details Excel data is undefined.'
      );
    }

    const educationalQualification = this.getRequiredValue(
      row,
      'EducationalQualification'
    );

    const annualIncome = this.getRequiredValue(
      row,
      'AnnualIncome'
    ).replace(/\.0$/, '');

    const currentOccupation = this.getRequiredValue(
      row,
      'CurrentOccupation'
    );

    const subOccupation = this.getOptionalValue(
      row,
      'SubOccupation'
    );

    const currentAddressPincode = this.getRequiredValue(
      row,
      'CurrentAddressPincode'
    ).replace(/\.0$/, '');

    const maritalStatus = this.getRequiredValue(
      row,
      'MaritalStatus'
    );

    const existingCustomer = this.getRequiredValue(
      row,
      'ExistingCustomer'
    );

    if (!/^\d{1,9}$/.test(annualIncome)) {
      throw new Error(
        `Invalid AnnualIncome: "${annualIncome}". ` +
        'Enter numbers only.'
      );
    }

    if (!/^\d{6}$/.test(currentAddressPincode)) {
      throw new Error(
        'Invalid CurrentAddressPincode: ' +
        `"${currentAddressPincode}". ` +
        'Pincode must contain exactly 6 digits.'
      );
    }

    console.log(
      'SP Pre-Plan Personal Details Excel data:',
      {
        educationalQualification,
        annualIncome,
        currentOccupation,
        subOccupation,
        currentAddressPincode,
        maritalStatus,
        existingCustomer
      }
    );

    await this.waitForPage();

    await this.selectDropdownByLabel(
      this.educationalQualification,
      educationalQualification,
      'Educational Qualification'
    );

    await this.enterAnnualIncome(
      annualIncome
    );

    await this.selectDropdownByLabel(
      this.currentOccupation,
      currentOccupation,
      'Current Occupation'
    );

    await this.handleSubOccupation(
      currentOccupation,
      subOccupation
    );

    await this.enterCurrentAddressPincode(
      currentAddressPincode
    );

    await this.selectDropdownByLabel(
      this.maritalStatus,
      maritalStatus,
      'Marital Status'
    );

    await this.setExistingCustomer(
      existingCustomer
    );

    console.log(
      'SP Pre-Plan Personal Details completed successfully.'
    );
  }

  async clickContinue() {
    console.log(
      'Clicking Pre-Plan Personal Details Continue...'
    );

    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Pre-Plan Personal Details values before Continue:',
      {
        educationalQualification:
          await this.getSelectedOptionText(
            this.educationalQualification
          ),

        annualIncome:
          await this.annualIncome.inputValue(),

        annualIncomeRange:
          await this.annualIncomeRange.inputValue(),

        currentOccupation:
          await this.getSelectedOptionText(
            this.currentOccupation
          ),

        subOccupationVisible:
          await this.subOccupation
            .isVisible()
            .catch(() => false),

        subOccupation:
          await this.getSelectedOptionText(
            this.subOccupation
          ),

        currentAddressPincode:
          await this.currentAddressPincode.inputValue(),

        maritalStatus:
          await this.getSelectedOptionText(
            this.maritalStatus
          ),

        existingCustomer:
          await this.existingCustomerCheckbox.isChecked()
    }
    );

    await this.continueButton.scrollIntoViewIfNeeded();
    await this.continueButton.click();

    await this.waitForLoadingToComplete();

    const questionnaireDisplayed =
      await this.questionnairePageMarker
        .waitFor({
          state: 'attached',
          timeout: 30000
        })
        .then(() => true)
        .catch(() => false);

    if (!questionnaireDisplayed) {
      const validationMessages =
        await this.getVisibleValidationMessages();

      console.log(
        'Visible validation messages:',
        validationMessages
      );

      throw new Error(
        'Pre-Plan Personal Details did not navigate to ' +
        'Questionnaire. Visible validation errors: ' +
        (
          validationMessages.join(' | ') ||
          'No validation message was displayed.'
        )
      );
    }

    console.log(
      'Questionnaire page displayed successfully.'
    );
  }
}

module.exports = PrePlanPersonalDetailsPage;