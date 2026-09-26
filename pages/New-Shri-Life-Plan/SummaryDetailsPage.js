const {
  expect
} = require('@playwright/test');


class SummaryDetailsPage {
  constructor(page) {
    this.page = page;

    /*
     * Summary page heading.
     */
    this.summaryHeading =
      page.getByText(
        'Summary Details',
        {
          exact: true
        }
      );

    /*
     * Benefit Illustration download.
     */
    this.downloadBenefitButton =
      page.locator(
        '#btnbidownload'
      );

    /*
     * Checkboxes.
     */
    this.termsCheckbox =
      page.locator(
        '#chkbxTandC'
      );

    this.autoDebitCheckbox =
      page.locator(
        '#chkbxagree_1'
      );

    /*
     * Pay button.
     */
    this.payButton =
      page.locator(
        '#btnpay'
      );

    /*
     * Proceed button inside payment popup.
     */
    this.proceedButton =
      page.locator(
        '#btnPayProcced'
      );

    /*
     * Payment popup heading.
     */
    this.paymentPopupHeading =
      page.getByText(
        'Select an option to pay',
        {
          exact: true
        }
      );
  }


  /*
   * Wait for Fetching Details loader.
   */
  async waitForLoaderToDisappear() {
    const loader =
      this.page.getByText(
        'Fetching Details',
        {
          exact: true
        }
      );

    await loader
      .waitFor({
        state: 'hidden',
        timeout: 60000
      })
      .catch(() => {
        console.log(
          'Fetching Details loader was not displayed.'
        );
      });
  }


  /*
   * Wait for Summary Details page.
   */
  async waitForPage() {
    await this.waitForLoaderToDisappear();

    await this.summaryHeading.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await expect(
      this.summaryHeading
    ).toBeVisible();

    console.log(
      'Summary Details page loaded successfully.'
    );
  }


  /*
   * Verify a displayed value.
   */
  async verifyDisplayedValue(
    value,
    fieldName
  ) {
    const expectedValue =
      String(
        value ?? ''
      ).trim();

    if (!expectedValue) {
      console.log(
        `${fieldName} is empty. ` +
        'Skipping verification.'
      );

      return;
    }

    const displayedValue =
      this.page
        .getByText(
          expectedValue,
          {
            exact: true
          }
        )
        .first();

    await expect(
      displayedValue
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      `${fieldName} verified: ` +
      `"${expectedValue}"`
    );
  }


  /*
   * Escape text before using it
   * inside a regular expression.
   */
  escapeRegExp(value) {
    return String(value).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  /*
   * Verify masked email.
   */
  async verifyMaskedEmail(
    fullEmail
  ) {
    const email =
      String(
        fullEmail ?? ''
      )
        .trim()
        .toLowerCase();

    if (
      !email ||
      !email.includes('@')
    ) {
      throw new Error(
        `Invalid email received from Excel: ` +
        `"${email}"`
      );
    }

    const emailParts =
      email.split('@');

    if (
      emailParts.length !== 2
    ) {
      throw new Error(
        `Invalid email format received from Excel: ` +
        `"${email}"`
      );
    }

    const [
      localPart,
      domain
    ] = emailParts;

    const displayedEmail =
      this.page
        .locator('p')
        .filter({
          hasText:
            new RegExp(
              `\\*+@${this.escapeRegExp(domain)}$`,
              'i'
            )
        })
        .first();

    await expect(
      displayedEmail
    ).toBeVisible({
      timeout: 30000
    });

    const actualMaskedEmail =
      String(
        await displayedEmail
          .textContent()
      )
        .trim()
        .toLowerCase();

    const displayedParts =
      actualMaskedEmail.split('@');

    if (
      displayedParts.length !== 2
    ) {
      throw new Error(
        `Invalid masked email displayed on page: ` +
        `"${actualMaskedEmail}"`
      );
    }

    const [
      maskedLocalPart,
      actualDomain
    ] = displayedParts;

    const visiblePart =
      maskedLocalPart.replace(
        /\*+/g,
        ''
      );

    expect(
      actualDomain,
      'Displayed email domain does not match ' +
      'Excel email domain.'
    ).toBe(
      domain
    );

    expect(
      visiblePart.length,
      'Displayed email must show at least one ' +
      'character before masking.'
    ).toBeGreaterThan(
      0
    );

    expect(
      localPart.startsWith(
        visiblePart
      ),
      `Displayed email prefix "${visiblePart}" ` +
      `does not match Excel email "${localPart}".`
    ).toBeTruthy();

    expect(
      maskedLocalPart,
      'Displayed email is not masked with asterisks.'
    ).toMatch(
      /\*+/
    );

    console.log(
      `Masked Email verified: ` +
      `"${actualMaskedEmail}"`
    );
  }


  /*
   * Verify masked mobile number.
   */
  async verifyMaskedMobile(
    fullMobile
  ) {
    const mobile =
      String(
        fullMobile ?? ''
      ).replace(
        /\D/g,
        ''
      );

    if (
      mobile.length < 4
    ) {
      throw new Error(
        `Invalid mobile number received: ` +
        `"${fullMobile}"`
      );
    }

    const lastFourDigits =
      mobile.slice(
        -4
      );

    const maskedMobilePattern =
      new RegExp(
        `^\\*+${lastFourDigits}$`
      );

    const displayedMobile =
      this.page
        .getByText(
          maskedMobilePattern
        )
        .first();

    await expect(
      displayedMobile
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      `Masked Mobile verified: ` +
      `ending ${lastFourDigits}`
    );
  }


  /*
   * Verify Basic Details values.
   */
  async verifyPersonalInformation(
    basicData
  ) {
    await this.verifyDisplayedValue(
      basicData.AI_FullName,
      'Full Name'
    );

    await this.verifyDisplayedValue(
      basicData.AI_insureFor,
      'Insure For'
    );

    await this.verifyMaskedEmail(
      basicData.AI_Email
    );

    await this.verifyMaskedMobile(
      basicData.AI_Mobile
    );

    await this.verifyDisplayedValue(
      basicData.AI_dob,
      'Date of Birth'
    );

    await this.verifyDisplayedValue(
      basicData.AI_gender,
      'Gender'
    );

    console.log(
      'Personal Information verification completed.'
    );
  }


  /*
   * Verify Plan Details values.
   */
  async verifyPlanDetails(planData) {

  console.log(
    'Verifying Summary Plan Details...'
  );

  // ==========================================
  // Life Cover
  // Excel: 14 Lakhs
  // Summary screen may show ₹14 Lakhs
  // ==========================================

  const lifeCoverAmount =
    String(
      planData?.LifeCoverAmount || ''
    )
      .trim();

  if (!lifeCoverAmount) {
    throw new Error(
      'LifeCoverAmount is missing in PlanDetails Excel sheet.'
    );
  }

  const lifeCoverLocator =
    this.page
      .getByText(
        new RegExp(
          `₹?\\s*${this.escapeRegExp(
            lifeCoverAmount
          )}`,
          'i'
        )
      )
      .first();

  await expect(
    lifeCoverLocator
  ).toBeVisible({
    timeout: 30000
  });

  console.log(
    `Life Cover verified: "${lifeCoverAmount}"`
  );


  // ==========================================
  // Policy Term
  // ==========================================

  await this.verifyDisplayedValue(
    planData.PolicyTerm,
    'Policy Term'
  );


  // ==========================================
  // Premium Paying Term
  // Summary screen label is "Pay For"
  // ==========================================

  await this.verifyDisplayedValue(
    planData.PremiumPayingTerm,
    'Premium Paying Term'
  );


  // ==========================================
  // Payment Type
  // ==========================================

  await this.verifyDisplayedValue(
    planData.PaymentType,
    'Payment Type'
  );


  console.log(
    'Plan Details verification completed.'
  );
}

  /*
   * Download or open Benefit Illustration.
   */
  async downloadBenefitIllustration() {
    await this.downloadBenefitButton
      .waitFor({
        state: 'visible',
        timeout: 60000
      });

    await this.downloadBenefitButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.downloadBenefitButton
    ).toBeEnabled({
      timeout: 30000
    });

    console.log(
      'Clicking Download Benefit Illustration...'
    );

    const context =
      this.page.context();

    const pagePromise =
      context
        .waitForEvent(
          'page',
          {
            timeout: 10000
          }
        )
        .catch(
          () => null
        );

    const downloadPromise =
      this.page
        .waitForEvent(
          'download',
          {
            timeout: 10000
          }
        )
        .catch(
          () => null
        );

    await this.downloadBenefitButton
      .click();

    const newPage =
      await pagePromise;

    const download =
      await downloadPromise;

    if (download) {
      console.log(
        `Downloaded: ` +
        `${download.suggestedFilename()}`
      );

      return;
    }

    if (newPage) {
      await newPage.waitForLoadState(
        'domcontentloaded'
      );

      console.log(
        `Benefit Illustration opened in new tab: ` +
        `${newPage.url()}`
      );

      await newPage.close();

      await this.page.bringToFront();

      return;
    }

    console.log(
      'No download event or new tab detected. ' +
      'Continuing test.'
    );
  }


  /*
   * Select Terms and Conditions.
   *
   * Auto Debit business rule:
   *
   * Monthly
   * → checkbox must be selected.
   *
   * Yearly / Half Yearly / Quarterly
   * → checkbox must remain unselected.
   */
  async acceptTermsAndConditions(planData) {

  console.log(
    'Checking Terms & Conditions...'
  );

  // ==========================================
  // Get Payment Type from Excel
  // ==========================================

  const paymentType =
    String(
      planData?.PaymentType ||
      planData?.['Payment Type'] ||
      ''
    )
      .trim()
      .toUpperCase();


  if (!paymentType) {
    throw new Error(
      'PaymentType is missing in PlanDetails Excel sheet.'
    );
  }


  console.log(
    `Payment Type from Excel: ${paymentType}`
  );


  // ==========================================
  // FIRST CHECKBOX
  // Terms & Conditions
  // ALWAYS CHECK
  // ==========================================

  await this.termsCheckbox.waitFor({
    state: 'visible',
    timeout: 60000
  });


  await this.termsCheckbox
    .scrollIntoViewIfNeeded();


  if (
    !(await this.termsCheckbox.isChecked())
  ) {

    await this.termsCheckbox.check();
  }


  await expect(
    this.termsCheckbox
  ).toBeChecked();


  console.log(
    'First checkbox - Terms & Conditions selected.'
  );


  // ==========================================
  // SECOND CHECKBOX
  // Auto Debit
  // ==========================================

  await this.autoDebitCheckbox.waitFor({
    state: 'visible',
    timeout: 30000
  });


  await this.autoDebitCheckbox
    .scrollIntoViewIfNeeded();


  let autoDebitSelected = false;


  // ==========================================
  // MONTHLY
  // Check second checkbox
  // ==========================================

  if (
    paymentType === 'MONTHLY'
  ) {

    console.log(
      'Monthly payment detected.'
    );


    if (
      !(await this.autoDebitCheckbox.isChecked())
    ) {

      await this.autoDebitCheckbox.check();
    }


    await expect(
      this.autoDebitCheckbox
    ).toBeChecked();


    autoDebitSelected = true;


    console.log(
      'Second checkbox - Auto Debit selected.'
    );
  }


  // ==========================================
  // OTHER PAYMENT TYPES
  // Do NOT check second checkbox
  // ==========================================

  else {

    console.log(
      `${paymentType} payment detected.`
    );


    /*
     * Make sure Auto Debit remains unchecked.
     */
    if (
      await this.autoDebitCheckbox.isChecked()
    ) {

      await this.autoDebitCheckbox.uncheck();
    }


    await expect(
      this.autoDebitCheckbox
    ).not.toBeChecked();


    autoDebitSelected = false;


    console.log(
      'Second checkbox - Auto Debit not selected.'
    );
  }


  // ==========================================
  // FINAL VERIFICATION
  // ==========================================

  console.log(
    'Checkbox verification:'
  );

  console.log(
    `Terms & Conditions: ${
      await this.termsCheckbox.isChecked()
    }`
  );

  console.log(
    `Auto Debit: ${
      await this.autoDebitCheckbox.isChecked()
    }`
  );


  return autoDebitSelected;
}


  /*
   * Click Pay.
   */
  async clickPay() {
    await this.payButton.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await this.payButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.payButton
    ).toBeEnabled({
      timeout: 30000
    });

    console.log(
      `URL before Pay: ` +
      `${this.page.url()}`
    );

    console.log(
      'Clicking Pay button...'
    );

    await this.payButton.click();

    console.log(
      'Pay button clicked successfully.'
    );

    await this.paymentPopupHeading.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await expect(
      this.paymentPopupHeading
    ).toBeVisible();

    console.log(
      'Payment selection popup displayed.'
    );
  }


  /*
   * Click Proceed inside payment popup.
   */
  async clickProceed() {
    await this.proceedButton.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await this.proceedButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.proceedButton
    ).toBeEnabled({
      timeout: 30000
    });

    const oldUrl =
      this.page.url();

    console.log(
      `URL before Proceed: ${oldUrl}`
    );

    console.log(
      'Clicking Proceed button...'
    );

    await this.proceedButton.click();

    console.log(
      'Proceed button clicked.'
    );

    await Promise.race([
      this.page.waitForURL(
        url =>
          url.toString() !== oldUrl,
        {
          timeout: 60000
        }
      ),

      this.page.waitForLoadState(
        'domcontentloaded',
        {
          timeout: 60000
        }
      )
    ]).catch(() => {
      console.log(
        'URL did not change after Proceed.'
      );
    });

    await this.waitForLoaderToDisappear();

    console.log(
      `URL after Proceed: ` +
      `${this.page.url()}`
    );
  }


  /*
   * Complete Summary Details flow.
   *
   * Returns:
   *
   * true
   * → Monthly payment
   * → Execute Auto Debit / Aadhaar / eNACH flow.
   *
   * false
   * → Non-monthly payment
   * → Skip Aadhaar / eNACH and continue to KYC.
   */
  async completeSummaryDetails(
    basicData,
    planData
  ) {
    await this.waitForPage();

    await this.verifyPersonalInformation(
      basicData
    );

    await this.verifyPlanDetails(
      planData
    );

    await this.downloadBenefitIllustration();

    const autoDebitSelected =
      await this.acceptTermsAndConditions(
        planData
      );

    await this.clickPay();

    await this.clickProceed();

    console.log(
      'Summary Details flow completed successfully.'
    );

    console.log(
      `Returning Auto Debit selected: ` +
      `${autoDebitSelected}`
    );

    return autoDebitSelected;
  }
}


module.exports = SummaryDetailsPage;