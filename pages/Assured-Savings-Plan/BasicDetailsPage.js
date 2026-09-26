const { expect } = require('@playwright/test');


class BasicDetailsPage {

  constructor(page) {

    this.page = page;


    // ==========================================================
    // BASIC DETAILS LOCATORS
    // ==========================================================

    this.insureFor =
      page.getByRole(
        'combobox',
        {
          name: 'Insure For *'
        }
      );


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


    // ==========================================================
    // LOADING INDICATORS
    // ==========================================================

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


  // ==========================================================
  // GET REQUIRED EXCEL VALUE
  // ==========================================================

  getRequiredValue(
    row,
    columnName
  ) {

    const value =
      String(
        row?.[columnName] ?? ''
      )
        .trim();


    if (!value) {

      throw new Error(
        `${columnName} is missing in ` +
        'the BasicDetails sheet.'
      );
    }


    return value;
  }


  // ==========================================================
  // NORMALIZE TEXT
  // ==========================================================

  normalizeText(value) {

    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }


  // ==========================================================
  // WAIT FOR LOADING
  // ==========================================================

  async waitForLoadingToComplete() {

    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(() => false);


    if (overlayVisible) {

      console.log(
        'Waiting for loading overlay...'
      );

      await this.loadingOverlay
        .waitFor({
          state: 'hidden',
          timeout: 120000
        })
        .catch(() => {

          console.log(
            'Loading overlay did not disappear within timeout.'
          );
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

      await this.fetchingDetailsText
        .waitFor({
          state: 'hidden',
          timeout: 120000
        })
        .catch(() => {

          console.log(
            'Fetching Details did not disappear within timeout.'
          );
        });
    }
  }


  // ==========================================================
  // WAIT FOR BASIC DETAILS PAGE
  // ==========================================================

  async waitForBasicDetailsPage() {

    console.log(
      'Waiting for ASP Basic Details page...'
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
      'ASP Basic Details page loaded.'
    );
  }


  // ==========================================================
  // GET DROPDOWN OPTIONS
  // ==========================================================

  async getDropdownOptions(locator) {

    return locator
      .locator('option')
      .evaluateAll(
        options => {

          return options.map(
            option => ({

              label:
                String(
                  option.textContent || ''
                )
                  .replace(/\s+/g, ' ')
                  .trim(),

              value:
                String(
                  option.value || ''
                )
                  .trim()

            })
          );
        }
      )
      .catch(() => []);
  }


  // ==========================================================
  // WAIT FOR DROPDOWN OPTION
  // ==========================================================

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


  // ==========================================================
  // GET CURRENT SELECTED DROPDOWN TEXT
  // ==========================================================

  async getSelectedDropdownText(
    locator
  ) {

    return String(

      await locator
        .locator(
          'option:checked'
        )
        .textContent()
        .catch(() => '')

    )
      .replace(/\s+/g, ' ')
      .trim();
  }


  // ==========================================================
  // ROBUST DROPDOWN SELECTION
  // ==========================================================

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


    // Wait until expected option is loaded.
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

        `${fieldName} "${expectedValue}" ` +
        'was not found. Available options: ' +

        availableOptions
          .map(
            option => option.label
          )
          .join(', ')

      );
    }


    console.log(
      `${fieldName} target option: ` +
      `${matchingOption.label}`
    );


    /*
     * The application can asynchronously
     * reset the dropdown after selectOption.
     *
     * Therefore retry the selection.
     */
    const maximumAttempts = 3;


    for (
      let attempt = 1;
      attempt <= maximumAttempts;
      attempt++
    ) {

      console.log(
        `Selecting ${fieldName}: ` +
        `"${matchingOption.label}" ` +
        `(Attempt ${attempt}/${maximumAttempts})`
      );


      /*
       * Select using label first.
       *
       * This is safer when option values
       * are internal application values.
       */
      await locator.selectOption(
        {
          label:
            matchingOption.label
        }
      );


      /*
       * Wait for application events and
       * asynchronous UI updates.
       */
      await this.page.waitForTimeout(
        500
      );


      await this.waitForLoadingToComplete();


      /*
       * Allow dropdown to stabilize after
       * application rerender/update.
       */
      await this.page.waitForTimeout(
        500
      );


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
        ) === expectedNormalized

      ) {

        console.log(
          `${fieldName} selected successfully: ` +
          `${matchingOption.label}`
        );


        return;
      }


      console.log(
        `${fieldName} selection did not persist.`
      );


      if (
        attempt < maximumAttempts
      ) {

        console.log(
          `Retrying ${fieldName} selection...`
        );


        await this.page.waitForTimeout(
          1000
        );
      }
    }


    /*
     * Final verification after all retries.
     */
    const finalSelectedText =
      await this.getSelectedDropdownText(
        locator
      );


    throw new Error(

      `${fieldName} selection failed. ` +
      `Expected: "${matchingOption.label}", ` +
      `Received: "${finalSelectedText}"`

    );
  }


  // ==========================================================
  // FILL AND VERIFY TEXT FIELD
  // ==========================================================

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


  // ==========================================================
  // FILL BASIC DETAILS
  // ==========================================================

  async fillBasicDetails(
    row
  ) {

    console.log(
      '===== Filling ASP Basic Details ====='
    );


    if (!row) {

      throw new Error(
        'Basic Details Excel data is undefined.'
      );
    }


    /*
     * Reading values directly from
     * Excel column headings.
     */
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
      )
        .replace(
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


    // ==========================================================
    // MOBILE VALIDATION
    // ==========================================================

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
      'ASP Basic Details Excel data:',
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


    // ==========================================================
    // WAIT FOR PAGE
    // ==========================================================

    await this.waitForBasicDetailsPage();


    // ==========================================================
    // INSURE FOR
    // ==========================================================

    await this.selectDropdownByLabel(
      this.insureFor,
      insureFor,
      'Insure For'
    );


    // ==========================================================
    // FULL NAME
    // ==========================================================

    await this.fillAndVerify(
      this.fullName,
      fullName,
      'Full Name'
    );


    // ==========================================================
    // MOBILE NUMBER
    // ==========================================================

    await this.fillAndVerify(
      this.mobileNumber,
      mobile,
      'Mobile Number'
    );


    // ==========================================================
    // EMAIL
    // ==========================================================

    await this.fillAndVerify(
      this.email,
      email,
      'Email'
    );


    // ==========================================================
    // DATE OF BIRTH
    // ==========================================================

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
     * Enter DOB using native events.
     */
    await this.dob.evaluate(

      (element, value) => {

        element.value =
          value;


        element.dispatchEvent(
          new Event(
            'input',
            {
              bubbles: true
            }
          )
        );


        element.dispatchEvent(
          new Event(
            'change',
            {
              bubbles: true
            }
          )
        );


        element.dispatchEvent(
          new Event(
            'blur',
            {
              bubbles: true
            }
          )
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


    await this.waitForLoadingToComplete();


    // ==========================================================
    // ANNUAL INCOME
    // ==========================================================

    await this.selectDropdownByLabel(
      this.annualIncome,
      income,
      'Annual Income'
    );


    // ==========================================================
    // GENDER
    // ==========================================================

    await this.selectDropdownByLabel(
      this.gender,
      gender,
      'Gender'
    );


    // ==========================================================
    // CONSENT CHECKBOX
    // ==========================================================

    const isConsentChecked =
      await this.consentCheckbox
        .isChecked()
        .catch(() => false);


    if (!isConsentChecked) {

      await this.consentCheckbox
        .check();
    }


    await expect(
      this.consentCheckbox
    ).toBeChecked({
      timeout: 30000
    });


    console.log(
      'ASP Basic Details completed successfully.'
    );
  }


  // ==========================================================
  // CLICK GET OTP
  // ==========================================================

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