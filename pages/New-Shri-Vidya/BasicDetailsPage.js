const { expect } = require('@playwright/test');

class BasicDetailsPage {
  constructor(page) {
    this.page = page;

    this.insureFor = page.getByRole(
      'combobox',
      {
        name: 'Insure For *'
      }
    );

    this.fullName = page.locator(
      '#txtbxBDName'
    );

    this.mobileNumber = page.getByRole(
      'textbox',
      {
        name: 'Mobile Number'
      }
    );

    this.email = page.getByRole(
      'textbox',
      {
        name: 'E-mail ID'
      }
    );

    this.dob = page.getByPlaceholder(
      'DD-MM-YYYY'
    );

    this.gender = page.getByRole(
      'combobox',
      {
        name: 'Gender'
      }
    );

    /*
     * NSLP Annual Income is a dropdown.
     */
    this.annualIncome = page.locator(
      'select#selAnnIncome'
    );

    this.consentCheckbox = page.locator(
      '#chkbxBDChecked'
    );

    this.getOtpButton = page.locator(
      '#btnBDgetotp'
    );

    this.otpModal = page.locator(
      '#bdOtpVerify'
    );

    /*
     * Application loading indicators.
     */
    this.loadingOverlay = page.locator(
      '#loading2'
    );

    this.fetchingDetailsText =
      page.getByText(
        'Fetching Details',
        {
          exact: true
        }
      );
  }
    getRequiredValue(
    row,
    columnName
  ) {
    const value = String(
      row?.[columnName] ?? ''
    ).trim();

    if (!value) {
      throw new Error(
        `${columnName} is missing in ` +
        'the BasicDetails sheet.'
      );
    }

    return value;
  }

  normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
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

    const fetchingVisible =
      await this.fetchingDetailsText
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

  async waitForBasicDetailsPage() {
    console.log(
      'Waiting for NSLP Basic Details page...'
    );

    await expect(
      this.insureFor
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.fullName
    ).toBeVisible({
      timeout: 120000
    });

    await this.waitForLoadingToComplete();

    console.log(
      'NSLP Basic Details page loaded.'
    );
  }
    async getDropdownOptions(locator) {
    return locator
      .locator('option')
      .evaluateAll(options => {
        return options.map(option => ({
          label: String(
            option.textContent || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),

          value: String(
            option.value || ''
          ).trim()
        }));
      })
      .catch(() => []);
  }

  async waitForDropdownOption(
    locator,
    expectedValue,
    fieldName
  ) {
    const expected =
      this.normalizeText(
        expectedValue
      );

    console.log(
      `Waiting for ${fieldName} option: ` +
      `"${expectedValue}"`
    );

    await expect.poll(
      async () => {
        const options =
          await this.getDropdownOptions(
            locator
          );

        return options.some(option => {
          return (
            this.normalizeText(
              option.label
            ) === expected ||
            this.normalizeText(
              option.value
            ) === expected
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

    console.log(
      `${fieldName} expected option loaded.`
    );
  }
    async selectDropdownByLabel(
  locator,
  value,
  fieldName
) {
  const expectedValue =
    String(value || '').trim();

  if (!expectedValue) {
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

  /*
   * Wait until the expected option
   * is available in the dropdown.
   */
  await this.waitForDropdownOption(
    locator,
    expectedValue,
    fieldName
  );

  const availableOptions =
    await this.getDropdownOptions(
      locator
    );

  console.log(
    `${fieldName} available options:`,
    availableOptions.map(
      option => option.label
    )
  );

  const expectedNormalized =
    this.normalizeText(
      expectedValue
    );

  const matchingOption =
    availableOptions.find(
      option =>
        this.normalizeText(
          option.label
        ) === expectedNormalized
    );

  if (!matchingOption) {
    throw new Error(
      `${fieldName} "${expectedValue}" ` +
      'was not found. Available options: ' +
      availableOptions
        .map(option => option.label)
        .join(', ')
    );
  }

  console.log(
    `Selecting ${fieldName}: ` +
    `"${matchingOption.label}"`
  );

  /*
   * Retry because this application
   * sometimes reloads/resets dropdowns.
   */
  let selectedSuccessfully = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(
      `${fieldName} selection attempt ${attempt}...`
    );

    /*
     * Select using LABEL instead of
     * option value.
     */
    await locator.selectOption({
      label: matchingOption.label
    });

    /*
     * Trigger application events explicitly.
     */
    await locator.evaluate(element => {
      element.dispatchEvent(
        new Event('input', {
          bubbles: true
        })
      );

      element.dispatchEvent(
        new Event('change', {
          bubbles: true
        })
      );

      element.dispatchEvent(
        new Event('blur', {
          bubbles: true
        })
      );
    });

    await this.page.waitForTimeout(1000);

    const selectedText =
      await locator
        .locator('option:checked')
        .textContent()
        .catch(() => '');

    const actualValue =
      String(selectedText || '')
        .replace(/\s+/g, ' ')
        .trim();

    console.log(
      `${fieldName} currently selected: ` +
      `"${actualValue}"`
    );

    if (
      this.normalizeText(actualValue) ===
      expectedNormalized
    ) {
      selectedSuccessfully = true;
      break;
    }

    await this.page.waitForTimeout(1000);
  }

  if (!selectedSuccessfully) {
    const actualValue =
      await locator
        .locator('option:checked')
        .textContent()
        .catch(() => '');

    throw new Error(
      `${fieldName} selection failed. ` +
      `Expected: "${matchingOption.label}", ` +
      `Received: "${String(actualValue).trim()}"`
    );
  }

  console.log(
    `${fieldName} selected successfully: ` +
    `${matchingOption.label}`
  );

  /*
   * Wait for any application loading
   * triggered by dropdown selection.
   */
  await this.waitForLoadingToComplete();
}

  async fillAndVerify(
    locator,
    value,
    fieldName
  ) {
    const expectedValue =
      String(value || '').trim();

    if (!expectedValue) {
      throw new Error(
        `${fieldName} is missing in Excel.`
      );
    }

    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      locator
    ).toBeEditable({
      timeout: 60000
    });

    await locator.fill('');

    await locator.fill(
      expectedValue
    );

    await expect(
      locator
    ).toHaveValue(
      expectedValue,
      {
        timeout: 30000
      }
    );

    console.log(
      `${fieldName} entered: ` +
      `${expectedValue}`
    );
  }
    async fillBasicDetails(row) {
    console.log(
      '===== Filling NSLP Basic Details ====='
    );

    if (!row) {
      throw new Error(
        'Basic Details Excel data is undefined.'
      );
    }

    const insureFor =
      this.getRequiredValue(
        row,
        'InsureFor'
      );

    const fullName =
      this.getRequiredValue(
        row,
        'FullName'
      );

    const mobile =
      this.getRequiredValue(
        row,
        'Mobile'
      ).replace(/\.0$/, '');

    const email =
      this.getRequiredValue(
        row,
        'Email'
      );

    const dob =
      this.getRequiredValue(
        row,
        'DOB'
      );

    const income =
      this.getRequiredValue(
        row,
        'Income'
      );

    const gender =
      this.getRequiredValue(
        row,
        'Gender'
      );

    if (!/^\d{10}$/.test(mobile)) {
      throw new Error(
        `Invalid Mobile Number: "${mobile}"`
      );
    }

    console.log(
      'NSLP Basic Details Excel data:',
      {
        insureFor,
        fullName,
        mobile,
        email,
        dob,
        income,
        gender
      }
    );

    await this.waitForBasicDetailsPage();

    /*
     * Insure For options are loaded
     * dynamically, so wait before selecting.
     */
    await this.selectDropdownByLabel(
      this.insureFor,
      insureFor,
      'Insure For'
    );

    await this.fillAndVerify(
      this.fullName,
      fullName,
      'Full Name'
    );

    await this.fillAndVerify(
      this.mobileNumber,
      mobile,
      'Mobile Number'
    );

    await this.fillAndVerify(
      this.email,
      email,
      'Email'
    );

    await expect(
      this.dob
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.dob
    ).toBeEditable({
      timeout: 60000
    });

    /*
     * Enter DOB and trigger the application
     * input/change/blur events.
     */
    await this.dob.evaluate(
      (element, value) => {
        element.value = value;

        element.dispatchEvent(
          new Event('input', {
            bubbles: true
          })
        );

        element.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );

        element.dispatchEvent(
          new Event('blur', {
            bubbles: true
          })
        );
      },
      dob
    );

    await expect(
      this.dob
    ).toHaveValue(
      dob,
      {
        timeout: 30000
      }
    );

    console.log(
      `DOB entered: ${dob}`
    );

    await this.selectDropdownByLabel(
      this.annualIncome,
      income,
      'Annual Income'
    );

    await this.selectDropdownByLabel(
      this.gender,
      gender,
      'Gender'
    );

    if (
      !await this.consentCheckbox
        .isChecked()
        .catch(() => false)
    ) {
      await this.consentCheckbox
        .check();
    }

    await expect(
      this.consentCheckbox
    ).toBeChecked({
      timeout: 30000
    });

    console.log(
      'NSLP Basic Details completed successfully.'
    );
  }
    async clickGetOtp() {
    console.log(
      'Clicking Get OTP...'
    );

    await expect(
      this.getOtpButton
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.getOtpButton
    ).toBeEnabled({
      timeout: 60000
    });

    await this.getOtpButton
      .scrollIntoViewIfNeeded();

    await this.getOtpButton.click();

    await expect(
      this.otpModal
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Get OTP clicked and OTP popup displayed.'
    );
  }
}

module.exports = {
  BasicDetailsPage
};