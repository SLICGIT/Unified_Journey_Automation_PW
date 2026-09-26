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
  console.log('Verifying Smart Protection Plan Premium...');

  if (!planData) {
    throw new Error('PlanDetails Excel data is undefined.');
  }

  const paymentType = String(
    planData.PaymentType || ''
  ).trim();

  if (!paymentType) {
    throw new Error(
      'PaymentType is missing in PlanDetails Excel data.'
    );
  }

  console.log(
    `Payment Type for Payment Success: ${paymentType}`
  );

  const normalizedPaymentType = paymentType
    .replace(/\s+/g, ' ')
    .trim();

  console.log(
    `Normalized Payment Type: ${normalizedPaymentType}`
  );

  const premiumPattern = new RegExp(
    `^\\s*₹?\\s*[\\d,]+\\s*\\/\\s*` +
    `${this.escapeRegExp(normalizedPaymentType)}` +
    `\\s*$`,
    'i'
  );

  console.log(
    `Premium search pattern: ${premiumPattern}`
  );

  const premiumValue = this.page
    .getByText(premiumPattern)
    .first();

  await expect(
    premiumValue
  ).toBeVisible({
    timeout: 60000
  });

  const rawPremiumText = String(
    await premiumValue.textContent()
  );

  console.log(
    `Raw Premium text: "${rawPremiumText}"`
  );

  const actualPremium = rawPremiumText
    .replace(/\s+/g, ' ')
    .trim();

  if (!actualPremium) {
    throw new Error(
      'Premium value is empty on Payment Successful page.'
    );
  }

  const normalizedActualPremium = actualPremium
    .replace(/\s+/g, '')
    .toLowerCase();

  const normalizedExpectedPaymentType =
    normalizedPaymentType
      .replace(/\s+/g, '')
      .toLowerCase();

  console.log(
    `Normalized Premium: "${normalizedActualPremium}"`
  );

  console.log(
    `Expected Payment Type: "${normalizedExpectedPaymentType}"`
  );

  const paymentModeFound =
    normalizedActualPremium.includes(
      `/${normalizedExpectedPaymentType}`
    );

  if (!paymentModeFound) {
    throw new Error(
      `Premium payment mode verification failed.\n` +
      `Actual Premium: "${actualPremium}"\n` +
      `Expected Payment Type: "${paymentType}"`
    );
  }

  const premiumAmountPattern = /₹?[\d,]+/;

  const premiumAmountFound =
    premiumAmountPattern.test(actualPremium);

  if (!premiumAmountFound) {
    throw new Error(
      `Premium amount was not found on Payment Successful page.\n` +
      `Actual Premium: "${actualPremium}"`
    );
  }

  console.log(
    `Premium verified successfully: ${actualPremium}`
  );

  console.log(
    `Payment Type verified successfully: ${paymentType}`
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