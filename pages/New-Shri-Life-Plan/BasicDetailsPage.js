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

  // Wait until expected option is actually loaded
  await this.waitForDropdownOption(
    locator,
    expectedValue,
    fieldName
  );

  const availableOptions =
    await this.getDropdownOptions(locator);

  console.log(
    `${fieldName} available options:`,
    availableOptions
  );

  const expectedNormalized =
    this.normalizeText(expectedValue);

  const matchingOption =
    availableOptions.find(option =>
      this.normalizeText(option.label) ===
      expectedNormalized
    );

  if (!matchingOption) {
    throw new Error(
      `${fieldName} "${expectedValue}" was not found. ` +
      `Available options: ${availableOptions
        .map(option => option.label)
        .join(', ')}`
    );
  }

  console.log(
    `${fieldName} matching option:`,
    matchingOption
  );

  /*
   * IMPORTANT:
   * Select using LABEL instead of VALUE.
   *
   * The NSLP dropdown can contain option values
   * which do not reliably correspond to the displayed
   * option text.
   */
  await locator.selectOption({
    label: matchingOption.label
  });

  /*
   * Wait for the actual selected option to become
   * the expected label.
   */
  await expect.poll(
    async () => {
      return this.normalizeText(
        await locator
          .locator('option:checked')
          .textContent()
          .catch(() => '')
      );
    },
    {
      timeout: 30000,
      intervals: [
        300,
        500,
        1000
      ],
      message:
        `${fieldName} did not select ` +
        `"${matchingOption.label}".`
    }
  ).toBe(
    expectedNormalized
  );

  console.log(
    `${fieldName} selected successfully: ` +
    `${matchingOption.label}`
  );

  /*
   * Log the actual selected value also.
   * This will help identify any value/label mismatch.
   */
  const selectedValue =
    await locator.inputValue();

  console.log(
    `${fieldName} selected value: ${selectedValue}`
  );

  await this.waitForLoadingToComplete();

  /*
   * Some NSLP dropdown changes trigger an asynchronous
   * UI refresh. Verify once again after that refresh.
   */
  await expect.poll(
    async () => {
      return this.normalizeText(
        await locator
          .locator('option:checked')
          .textContent()
          .catch(() => '')
      );
    },
    {
      timeout: 30000,
      intervals: [
        500,
        1000,
        2000
      ]
    }
  ).toBe(
    expectedNormalized
  );

  console.log(
    `${fieldName} final verified selection: ` +
    `${matchingOption.label}`
  );
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