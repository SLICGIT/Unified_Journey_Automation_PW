const {
  expect
} = require('@playwright/test');


class PaymentSuccessPage {

  constructor(page) {

    this.page = page;


    // ==========================================
    // PAYMENT SUCCESS PAGE
    // ==========================================

    this.quoteIdLabel =
      page.getByText(
        'Quote ID',
        {
          exact: true
        }
      );


    this.premiumLabel =
      page.getByText(
        'Premium',
        {
          exact: true
        }
      );


    this.continueButton =
      page.locator(
        '#btnFirstContinue'
      );


    this.autoPayRegistrationButton =
      page.locator(
        '#btneNACHReg'
      );
  }


  // ==========================================
  // WAIT FOR PAYMENT SUCCESS PAGE
  // ==========================================

  async waitForPage() {

    console.log(
      'Waiting for Payment Successful page...'
    );


    await this.quoteIdLabel.waitFor({
      state: 'visible',
      timeout: 120000
    });


    await expect(
      this.quoteIdLabel
    ).toBeVisible();


    console.log(
      'Payment Successful page loaded.'
    );
  }


  // ==========================================
  // VERIFY PREMIUM
  // ==========================================

  async verifyPremium(planData) {

    /*
     * NSLP does NOT have InvestmentAmount
     * in PlanDetails Excel.
     *
     * Therefore do not calculate the premium
     * from Excel here.
     *
     * We only verify the Payment Type against
     * the Premium value displayed by the
     * application.
     */


    const paymentType =
      String(
        planData?.PaymentType ||
        planData?.['Payment Type'] ||
        ''
      )
        .trim();


    if (!paymentType) {

      throw new Error(
        'PaymentType is missing in PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Payment Type for Payment Success: ${paymentType}`
    );


    /*
     * Example page text:
     *
     * ₹12,268/Quarterly
     * ₹3,945/Monthly
     *
     * We don't know Premium Amount from Excel,
     * so verify the format and Payment Type.
     */

    const premiumValue =
      this.page.getByText(
        new RegExp(
          `^₹[\\d,]+\\/${this.escapeRegExp(
            paymentType
          )}$`,
          'i'
        )
      )
      .first();


    await expect(
      premiumValue
    ).toBeVisible({
      timeout: 60000
    });


    const premiumText =
      String(
        await premiumValue.textContent()
      ).trim();


    console.log(
      `Premium verified: ${premiumText}`
    );
  }


  // ==========================================
  // ESCAPE REGEX
  // ==========================================

  escapeRegExp(value) {

    return String(value).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  // ==========================================
  // GET QUOTE ID
  // ==========================================

  async getQuoteId() {

    const quoteValueLocator =
      this.quoteIdLabel.locator(
        'xpath=following::*[1]'
      );


    await expect(
      quoteValueLocator
    ).toBeVisible({
      timeout: 30000
    });


    const quoteId =
      String(
        await quoteValueLocator
          .textContent()
      )
        .trim();


    if (!quoteId) {

      throw new Error(
        'Quote ID is empty on Payment Success page.'
      );
    }


    console.log(
      `Quote ID: ${quoteId}`
    );


    return quoteId;
  }


  // ==========================================
  // CLICK CONTINUE
  // ==========================================

  async clickContinue() {

    console.log(
      'Waiting for Payment Success Continue button...'
    );


    await this.continueButton.waitFor({
      state: 'visible',
      timeout: 60000
    });


    await this.continueButton
      .scrollIntoViewIfNeeded();


    await expect(
      this.continueButton
    ).toBeEnabled({
      timeout: 30000
    });


    console.log(
      'Clicking Payment Success Continue button...'
    );


    await this.continueButton.click();


    console.log(
      'Payment Success Continue button clicked.'
    );
  }


  // ==========================================
  // CLICK AUTO PAY REGISTRATION
  // ==========================================

  async clickAutoPayRegistration() {

    console.log(
      'Waiting for Auto Pay Registration button...'
    );


    await this.autoPayRegistrationButton.waitFor({
      state: 'visible',
      timeout: 60000
    });


    await this.autoPayRegistrationButton
      .scrollIntoViewIfNeeded();


    await expect(
      this.autoPayRegistrationButton
    ).toBeEnabled({
      timeout: 30000
    });


    console.log(
      'Clicking Auto Pay Registration button...'
    );


    await this.autoPayRegistrationButton.click();


    console.log(
      'Auto Pay Registration button clicked.'
    );
  }


  // ==========================================
  // COMPLETE PAYMENT SUCCESS
  // ==========================================

  async completePaymentSuccess(
    planData,
    autoDebitSelected = false
  ) {

    console.log(
      'Entered PaymentSuccessPage'
    );


    await this.waitForPage();


    await this.verifyPremium(
      planData
    );


    const quoteId =
      await this.getQuoteId();


    console.log(
      `Auto Debit selected: ${autoDebitSelected}`
    );


    await this.clickContinue();


    /*
     * Monthly
     * → Auto Debit selected
     * → Auto Pay Registration required.
     *
     * Quarterly / Yearly / Half Yearly
     * → Auto Debit not selected
     * → do NOT click Auto Pay Registration here.
     */
    if (
      autoDebitSelected
    ) {

      console.log(
        'Monthly flow detected.'
      );


      await this.clickAutoPayRegistration();


      console.log(
        'Payment Success next flow: AUTO_PAY'
      );
    }
    else {

      console.log(
        'Non-Monthly flow detected.'
      );


      console.log(
        'Skipping Auto Pay Registration.'
      );


      console.log(
        'Payment Success next flow: NORMAL'
      );
    }


    console.log(
      'Payment Success flow completed successfully.'
    );


    const paymentNextFlow =
      autoDebitSelected
        ? 'AUTO_PAY'
        : 'DIRECT_KYC';

    console.log(
      `Payment Success next flow: ${paymentNextFlow}`
    );

    return {
      quoteId,
      paymentNextFlow
    };
  }
}


module.exports = PaymentSuccessPage;