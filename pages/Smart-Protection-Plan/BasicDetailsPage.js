const { expect } = require('@playwright/test');

class BasicDetailsPage {
  constructor(page) {
    this.page = page;

    /*
     * Insure For is fixed as Self.
     * It is displayed as a dropdown but does
     * not require any selection.
     */
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

    /*
     * Preferred Language
     */
    this.preferredLanguage = page.locator(
      '#selBDLang'
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
      'Waiting for SP Basic Details page...'
    );

    await expect(
      this.fullName
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.mobileNumber
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.email
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.preferredLanguage
    ).toBeVisible({
      timeout: 120000
    });

    await this.waitForLoadingToComplete();

    console.log(
      'SP Basic Details page loaded.'
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

    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      locator
    ).toBeEnabled({
      timeout: 60000
    });

    /*
     * Some dropdown options are loaded
     * asynchronously by the application.
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
      availableOptions.find(option => {
        return (
          this.normalizeText(
            option.label
          ) === expectedNormalized ||
          this.normalizeText(
            option.value
          ) === expectedNormalized
        );
      });

    if (!matchingOption) {
      throw new Error(
        `${fieldName} "${expectedValue}" ` +
        'was not found. Available options: ' +
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
      `${fieldName} selected: ` +
      `${matchingOption.label}`
    );

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


  async verifyFixedInsureFor(
    excelInsureFor
  ) {
    const expectedInsureFor =
      this.normalizeText(
        excelInsureFor
      );

    if (expectedInsureFor !== 'self') {
      throw new Error(
        'Smart-Protection-Plan supports ' +
        'only "Self" for InsureFor. ' +
        `Excel contains: "${excelInsureFor}".`
      );
    }

    /*
     * Insure For is fixed as Self.
     * No dropdown selection is required.
     */
    console.log(
      'Insure For validated from Excel: Self. ' +
      'No UI selection is required.'
    );
  }


  async enterDOB(dob) {
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
     * Set DOB and dispatch the events required
     * by the application.
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
  }


  async selectPreferredLanguage(
    language
  ) {
    await this.selectDropdownByLabel(
      this.preferredLanguage,
      language,
      'Preferred Language'
    );
  }


  async selectConsentCheckbox() {
    await expect(
      this.consentCheckbox
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.consentCheckbox
    ).toBeEnabled({
      timeout: 60000
    });

    if (
      !await this.consentCheckbox
        .isChecked()
        .catch(() => false)
    ) {
      await this.consentCheckbox.check();
    }

    await expect(
      this.consentCheckbox
    ).toBeChecked({
      timeout: 30000
    });

    console.log(
      'Consent checkbox selected.'
    );
  }


  async fillBasicDetails(row) {
    console.log(
      '===== Filling SP Basic Details ====='
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

    /*
     * New Excel column
     */
    const preferredLanguage =
      this.getRequiredValue(
        row,
        'PreferredLanguage'
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
      'SP Basic Details Excel data:',
      {
        insureFor,
        fullName,
        mobile,
        email,
        preferredLanguage,
        dob,
        income,
        gender
      }
    );

    await this.waitForBasicDetailsPage();

    /*
     * Insure For is fixed as Self.
     */
    await this.verifyFixedInsureFor(
      insureFor
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

    /*
     * Preferred Language
     * Added after Email ID
     */
    await this.selectPreferredLanguage(
      preferredLanguage
    );

    await this.enterDOB(
      dob
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

    await this.selectConsentCheckbox();

    console.log(
      'SP Basic Details completed successfully.'
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