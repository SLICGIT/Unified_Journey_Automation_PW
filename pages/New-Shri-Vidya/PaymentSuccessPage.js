const {
  expect
} = require('@playwright/test');


class PaymentSuccessPage {

  constructor(page) {

    this.page = page;


    // ========================================================
    // PAYMENT SUCCESS HEADING
    // ========================================================

    this.paymentSuccessHeading =
      page.getByRole(
        'heading',
        {
          name: 'Payment Successful'
        }
      );


    // ========================================================
    // CONTINUE BUTTON
    // ========================================================

    this.continueButton =
      page.getByRole(
        'button',
        {
          name: 'Continue',
          exact: true
        }
      );


    // ========================================================
    // QUOTE ID
    // ========================================================

    this.quoteIdLabel =
      page.getByText(
        'Quote ID',
        {
          exact: true
        }
      );


    // ========================================================
    // AUTO PAY REGISTRATION
    // ========================================================

    this.autoPayRegistrationButton =
      page.getByRole(
        'button',
        {
          name: 'Auto Pay Registration',
          exact: true
        }
      );


    // ========================================================
    // REGISTER BANK DETAILS POPUP
    // ========================================================

    this.bankDropdown =
      page.locator(
        '#selectBanks'
      );


    this.registerNowButton =
      page.getByRole(
        'button',
        {
          name: 'Register Now',
          exact: true
        }
      );


    // ========================================================
    // KYC SELECTION
    // ========================================================

    this.manualKycRadio =
      page.locator(
        '#manualkycRadio'
      );
  }


  // ==========================================================
  // ESCAPE REGEX
  // ==========================================================

  escapeRegExp(value) {

    return String(
      value || ''
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  // ==========================================================
  // WAIT FOR PAYMENT SUCCESS PAGE
  // ==========================================================

  async waitForPage() {

    console.log(
      'Entered PaymentSuccessPage'
    );


    await expect(
      this.paymentSuccessHeading
    ).toBeVisible({
      timeout: 120000
    });


    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Payment Successful page loaded.'
    );
  }


  // ==========================================================
  // VERIFY NSV PREMIUM
  // ==========================================================

  async verifyPremium(planData) {

    console.log(
        'Verifying NSV Premium...'
    );

    if (!planData) {

        throw new Error(
            'PlanDetails Excel data is undefined.'
        );
    }


    const paymentType =
        String(
            planData.PaymentType || ''
        ).trim();


    if (!paymentType) {

        throw new Error(
            'PaymentType is missing in ' +
            'PlanDetails Excel data.'
        );
    }


    console.log(
        `Payment Type for Payment Success: ${paymentType}`
    );


    /*
     * Find premium text.
     *
     * Examples:
     *
     * ₹41,242/Half Yearly
     * ₹42,176/Yearly
     * ₹10,000/Monthly
     */
    const premiumPattern =
        new RegExp(
            `₹\\s*[\\d,]+\\s*\\/\\s*` +
            `${this.escapeRegExp(paymentType)}`,
            'i'
        );


    const premiumValue =
        this.page
            .getByText(
                premiumPattern
            )
            .first();


    await expect(
        premiumValue
    ).toBeVisible({
        timeout: 60000
    });


    const actualPremium =
        String(
            await premiumValue.textContent()
        )
            .replace(/\s+/g, ' ')
            .trim();


    console.log(
        `Actual Premium Text: "${actualPremium}"`
    );


    if (!actualPremium) {

        throw new Error(
            'Premium value is empty on ' +
            'Payment Successful page.'
        );
    }


    /*
     * Normalize both values before verification.
     *
     * Example:
     *
     * "₹41,242/Half Yearly"
     * becomes
     * "₹41,242/halfyearly"
     */
    const normalizedActualPremium =
        actualPremium
            .toLowerCase()
            .replace(/\s+/g, '');


    const normalizedPaymentType =
        paymentType
            .toLowerCase()
            .replace(/\s+/g, '');


    console.log(
        `Normalized Premium: "${normalizedActualPremium}"`
    );

    console.log(
        `Normalized Payment Type: "${normalizedPaymentType}"`
    );


    /*
     * Verify that the premium contains
     * the expected payment mode.
     */
    const paymentModeExists =
        normalizedActualPremium.includes(
            `/${normalizedPaymentType}`
        );


    if (!paymentModeExists) {

        throw new Error(
            `Premium payment mode verification failed. ` +
            `Expected payment type: "${paymentType}". ` +
            `Actual premium text: "${actualPremium}".`
        );
    }


    console.log(
        `Premium verified: ${actualPremium}`
    );


    return actualPremium;
}

  // ==========================================================
  // READ QUOTE ID
  // ==========================================================

  async getQuoteId() {

    console.log(
      'Reading Quote ID...'
    );


    await expect(
      this.quoteIdLabel
    ).toBeVisible({
      timeout: 60000
    });


    /*
     * First attempt:
     * value immediately after Quote ID label.
     */
    let quoteValueLocator =
      this.quoteIdLabel
        .locator(
          'xpath=following-sibling::*[1]'
        );


    let quoteVisible =
      await quoteValueLocator
        .isVisible()
        .catch(
          () => false
        );


    /*
     * Fallback:
     * find the next element after Quote ID.
     */
    if (!quoteVisible) {

      quoteValueLocator =
        this.quoteIdLabel
          .locator(
            'xpath=following::*[1]'
          );


      quoteVisible =
        await quoteValueLocator
          .isVisible()
          .catch(
            () => false
          );
    }


    if (!quoteVisible) {

      throw new Error(
        'Quote ID value was not displayed.'
      );
    }


    const quoteId =
      String(
        await quoteValueLocator
          .textContent()
    )
      .replace(/\s+/g, ' ')
      .trim();


    if (!quoteId) {

      throw new Error(
        'Quote ID is empty on ' +
        'Payment Success page.'
      );
    }


    console.log(
      `Quote ID: ${quoteId}`
    );


    return quoteId;
  }


  // ==========================================================
  // CLICK PAYMENT SUCCESS CONTINUE
  // ==========================================================

  async clickPaymentContinue() {

    console.log(
      'Waiting for Payment Success Continue button...'
    );


    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.continueButton
    ).toBeEnabled({
      timeout: 30000
    });


    await this.continueButton
      .scrollIntoViewIfNeeded();


    console.log(
      'Clicking Payment Success Continue button...'
    );


    await this.continueButton
      .click();


    console.log(
      'Payment Success Continue button clicked.'
    );
  }


  // ==========================================================
  // AUTO PAY REGISTRATION
  // ==========================================================

  async clickAutoPayRegistration() {

    console.log(
      'Waiting for Auto Pay Registration button...'
    );


    await expect(
      this.autoPayRegistrationButton
    ).toBeVisible({
      timeout: 120000
    });


    await expect(
      this.autoPayRegistrationButton
    ).toBeEnabled({
      timeout: 30000
    });


    await this.autoPayRegistrationButton
      .scrollIntoViewIfNeeded();


    console.log(
      'Clicking Auto Pay Registration button...'
    );


    await this.autoPayRegistrationButton
      .click();


    console.log(
      'Auto Pay Registration button clicked.'
    );


    /*
     * Register Bank Details popup.
     */
    await expect(
      this.bankDropdown
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.registerNowButton
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Register Bank Details popup loaded successfully.'
    );
  }


  // ==========================================================
  // HANDLE NEXT FLOW
  // ==========================================================

  async handleNextFlow(
    autoDebitSelected
  ) {

    console.log(
      `Auto Debit selected: ` +
      `${autoDebitSelected}`
    );


    if (
      typeof autoDebitSelected !==
      'boolean'
    ) {

      throw new Error(
        `Invalid autoDebitSelected value: ` +
        `"${autoDebitSelected}". ` +
        'Expected true or false.'
      );
    }


    /*
     * Continue is required for
     * Monthly and Non-monthly flows.
     */
    await this.clickPaymentContinue();


    // ========================================================
    // MONTHLY
    // ========================================================

    if (
      autoDebitSelected === true
    ) {

      console.log(
        'Monthly flow detected.'
      );


      /*
       * Continue
       * → Auto Pay Registration
       * → Register Bank
       * → Aadhaar
       * → eNACH
       */
      await this.clickAutoPayRegistration();


      return 'AUTO_PAY';
    }


    // ========================================================
    // NON-MONTHLY
    // ========================================================

    console.log(
      'Non-monthly flow detected.'
    );


    console.log(
      'Skipping Auto Pay Registration.'
    );


    /*
     * Yearly / Half Yearly / Quarterly
     *
     * Continue
     * → KYC Selection
     */
    await expect(
      this.manualKycRadio
    ).toBeAttached({
      timeout: 120000
    });


    console.log(
      'KYC Selection page opened.'
    );


    return 'DIRECT_KYC';
  }


  // ==========================================================
  // COMPLETE PAYMENT SUCCESS
  // ==========================================================

  async completePaymentSuccess(
    planData,
    autoDebitSelected
  ) {

    console.log(
      '===== Completing NSV Payment Success ====='
    );


    // ========================================================
    // WAIT FOR PAGE
    // ========================================================

    await this.waitForPage();


    // ========================================================
    // VERIFY PREMIUM
    // ========================================================

    const premium =
      await this.verifyPremium(
        planData
      );


    // ========================================================
    // GET QUOTE ID
    // ========================================================

    const quoteId =
      await this.getQuoteId();


    // ========================================================
    // HANDLE NEXT FLOW
    // ========================================================

    const paymentNextFlow =
      await this.handleNextFlow(
        autoDebitSelected
      );


    console.log(
      `Premium: ${premium}`
    );


    console.log(
      `Payment Success next flow: ` +
      `${paymentNextFlow}`
    );


    console.log(
      'NSV Payment Success flow completed successfully.'
    );


    return {

      quoteId,

      paymentNextFlow

    };
  }
}


module.exports = PaymentSuccessPage;