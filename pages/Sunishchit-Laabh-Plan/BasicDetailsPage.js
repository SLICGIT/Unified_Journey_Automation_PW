const { expect } = require(
  '@playwright/test'
);

class BasicDetailsPage {

  constructor(page) {

    this.page = page;


    // =========================================================
    // BASIC DETAILS LOCATORS
    // =========================================================

    /*
     * Insure For
     *
     * Using the visible select element directly.
     */
    this.insureFor =
      page.locator(
        'select'
      ).filter({
        has: page.locator(
          'option'
        )
      }).first();


    this.fullName =
      page.locator(
        '#txtbxBDName'
      );


    this.mobileNumber =
      page.getByRole(
        'textbox',
        {
          name: 'Mobile Number'
        }
      );


    this.email =
      page.getByRole(
        'textbox',
        {
          name: 'E-mail ID'
        }
      );


    this.dob =
      page.getByPlaceholder(
        'DD-MM-YYYY'
      );


    this.gender =
      page.getByRole(
        'combobox',
        {
          name: 'Gender'
        }
      );


    this.annualIncome =
      page.locator(
        'select#selAnnIncome'
      );


    this.consentCheckbox =
      page.locator(
        '#chkbxBDChecked'
      );


    this.getOtpButton =
      page.locator(
        '#btnBDgetotp'
      );


    this.otpModal =
      page.locator(
        '#bdOtpVerify'
      );


    // =========================================================
    // LOADING LOCATORS
    // =========================================================

    this.loadingOverlay =
      page.locator(
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


  // =========================================================
  // GET REQUIRED EXCEL VALUE
  // =========================================================

  getRequiredValue(
    row,
    columnName
  ) {

    const value =
      String(
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


  // =========================================================
  // NORMALIZE TEXT
  // =========================================================

  normalizeText(value) {

    return String(
      value || ''
    )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()
      .toLowerCase();
  }


  // =========================================================
  // WAIT FOR LOADER
  // =========================================================

  async waitForLoadingToComplete() {

    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(
          () => false
        );


    if (overlayVisible) {

      console.log(
        'Waiting for loading overlay...'
      );

      await this.loadingOverlay
        .waitFor({
          state: 'hidden',
          timeout: 120000
        });
    }


    const fetchingVisible =
      await this.fetchingDetailsText
        .isVisible()
        .catch(
          () => false
        );


    if (fetchingVisible) {

      console.log(
        'Waiting for Fetching Details...'
      );

      await this.fetchingDetailsText
        .waitFor({
          state: 'hidden',
          timeout: 120000
        });
    }
  }


  // =========================================================
  // WAIT FOR BASIC DETAILS PAGE
  // =========================================================

  async waitForBasicDetailsPage() {

    console.log(
      'Waiting for Sunishchit Laabh Basic Details page...'
    );


    await this.waitForLoadingToComplete();


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


    console.log(
      'Sunishchit Laabh Basic Details page loaded.'
    );
  }


  // =========================================================
  // GET DROPDOWN OPTIONS
  // =========================================================

  async getDropdownOptions(locator) {

    return await locator
      .locator(
        'option'
      )
      .evaluateAll(
        options => {

          return options.map(
            option => ({

              label:
                String(
                  option.textContent || ''
                )
                  .replace(
                    /\s+/g,
                    ' '
                  )
                  .trim(),

              value:
                String(
                  option.value || ''
                ).trim()

            })
          );
        }
      );
  }


  // =========================================================
  // WAIT FOR REQUIRED DROPDOWN OPTION
  // =========================================================

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
          )
            .catch(
              () => []
            );


        return options.some(
          option => {

            return (
              this.normalizeText(
                option.label
              ) === expected ||

              this.normalizeText(
                option.value
              ) === expected
            );
          }
        );
      },

      {
        timeout: 120000,

        intervals: [
          500,
          1000,
          2000
        ]
      }

    ).toBeTruthy();


    console.log(
      `${fieldName} expected option loaded.`
    );
  }


  // =========================================================
  // GET SELECTED DROPDOWN TEXT
  // =========================================================

  async getSelectedDropdownText(
    locator
  ) {

    return await locator
      .locator(
        'option:checked'
      )
      .textContent()
      .then(
        text =>
          String(
            text || ''
          )
            .replace(
              /\s+/g,
              ' '
            )
            .trim()
      )
      .catch(
        () => ''
      );
  }


  // =========================================================
  // GENERIC DROPDOWN SELECTION
  // =========================================================

  async selectDropdownByLabel(
    locator,
    value,
    fieldName
  ) {

    const expectedValue =
      String(
        value || ''
      ).trim();


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


    // Wait until expected option is available
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
        option => {

          return (
            this.normalizeText(
              option.label
            ) === expectedNormalized ||

            this.normalizeText(
              option.value
            ) === expectedNormalized
          );
        }
      );


    if (!matchingOption) {

      throw new Error(
        `${fieldName} value ` +
        `"${expectedValue}" was not found.`
      );
    }


    console.log(
      `Selecting ${fieldName}: ` +
      `"${matchingOption.label}"`
    );


    // =====================================================
    // SELECT OPTION
    // =====================================================

    await locator.selectOption({
      label: matchingOption.label
    });


    // =====================================================
    // WAIT FOR APPLICATION EVENTS / LOADER
    // =====================================================

    await this.page.waitForTimeout(
      500
    );


    await this.waitForLoadingToComplete();


    // =====================================================
    // VERIFY SELECTED VALUE
    // =====================================================

    const selectedText =
      await this.getSelectedDropdownText(
        locator
      );


    console.log(
      `${fieldName} currently selected: ` +
      `"${selectedText}"`
    );


    if (
      this.normalizeText(
        selectedText
      ) !==
      this.normalizeText(
        matchingOption.label
      )
    ) {

      throw new Error(
        `${fieldName} selection failed. ` +
        `Expected: "${matchingOption.label}". ` +
        `Received: "${selectedText}".`
      );
    }


    console.log(
      `${fieldName} selected successfully: ` +
      `${matchingOption.label}`
    );
  }


  // =========================================================
  // SPECIAL HANDLER FOR INSURE FOR
  // =========================================================

 async selectInsureFor(insureFor) {
    const expectedValue = String(insureFor || '').trim();

    console.log(`Selecting Insure For: "${expectedValue}"`);

    if (!expectedValue) {
        throw new Error('Insure For value is empty.');
    }

    // Find the select dropdown which contains all Insure For options
    const dropdown = this.page.locator('select').filter({
        has: this.page.locator('option', {
            hasText: 'Grand Child'
        })
    }).first();

    await dropdown.waitFor({
        state: 'visible',
        timeout: 30000
    });

    const options = await dropdown.locator('option').allTextContents();

    console.log(
        'Insure For available options:',
        options.map(x => x.trim())
    );

    const matchingOption = options.find(
        option =>
            option.trim().toLowerCase() ===
            expectedValue.toLowerCase()
    );

    if (!matchingOption) {
        throw new Error(
            `Insure For option "${expectedValue}" not found. ` +
            `Available options: ${JSON.stringify(options)}`
        );
    }

    console.log(
        `Selecting Insure For option: "${matchingOption.trim()}"`
    );

    await dropdown.selectOption({
        label: matchingOption.trim()
    });

    await this.page.waitForTimeout(1500);

    const selectedText = await dropdown
        .locator('option:checked')
        .textContent();

    const actualValue = String(selectedText || '').trim();

    console.log(
        `Insure For currently selected: "${actualValue}"`
    );

    if (
        actualValue.toLowerCase() !==
        expectedValue.toLowerCase()
    ) {
        throw new Error(
            `Insure For selection failed. ` +
            `Expected: "${expectedValue}". ` +
            `Received: "${actualValue}".`
        );
    }

    console.log(
        `Insure For selected successfully: "${actualValue}"`
    );

    await this.page.waitForTimeout(1000);
}


  // =========================================================
  // FILL TEXT FIELD AND VERIFY
  // =========================================================

  async fillAndVerify(
    locator,
    value,
    fieldName
  ) {

    const expectedValue =
      String(
        value || ''
      ).trim();


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


    await locator.fill(
      ''
    );


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


  // =========================================================
  // FILL BASIC DETAILS
  // =========================================================

  async fillBasicDetails(
    row
  ) {

    console.log(
      '===== Filling Sunishchit Laabh Basic Details ====='
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
      ).replace(
        /\.0$/,
        ''
      );


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


    if (
      !/^\d{10}$/.test(
        mobile
      )
    ) {

      throw new Error(
        `Invalid Mobile Number: "${mobile}"`
      );
    }


    console.log(
      'Sunishchit Laabh Basic Details Excel data:',
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


    // =====================================================
    // WAIT FOR PAGE
    // =====================================================

    await this.waitForBasicDetailsPage();


    // =====================================================
    // INSURE FOR
    // =====================================================

    await this.selectInsureFor(
      insureFor
    );


    // =====================================================
    // FULL NAME
    // =====================================================

    await this.fillAndVerify(
      this.fullName,
      fullName,
      'Full Name'
    );


    // =====================================================
    // MOBILE NUMBER
    // =====================================================

    await this.fillAndVerify(
      this.mobileNumber,
      mobile,
      'Mobile Number'
    );


    // =====================================================
    // EMAIL
    // =====================================================

    await this.fillAndVerify(
      this.email,
      email,
      'Email'
    );


    // =====================================================
    // DOB
    // =====================================================

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


    await this.dob.fill(
      ''
    );


    await this.dob.fill(
      dob
    );


    await this.dob.blur();


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


    // =====================================================
    // ANNUAL INCOME
    // =====================================================

    await this.selectDropdownByLabel(
      this.annualIncome,
      income,
      'Annual Income'
    );


    // =====================================================
    // GENDER
    // =====================================================

    await this.selectDropdownByLabel(
      this.gender,
      gender,
      'Gender'
    );


    // =====================================================
    // CONSENT CHECKBOX
    // =====================================================

    const isConsentChecked =
      await this.consentCheckbox
        .isChecked()
        .catch(
          () => false
        );


    if (!isConsentChecked) {

      await this.consentCheckbox
        .check({
          force: true
        });
    }


    await expect(
      this.consentCheckbox
    ).toBeChecked({
      timeout: 30000
    });


    console.log(
      'Sunishchit Laabh Basic Details completed successfully.'
    );
  }


  // =========================================================
  // CLICK GET OTP
  // =========================================================

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


    await this.getOtpButton
      .click();


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