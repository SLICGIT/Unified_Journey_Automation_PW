const {
  expect
} = require('@playwright/test');


class PaymentSuccessPage {

  constructor(page) {

    this.page = page;


    /*
     * Payment Success heading.
     */
    this.paymentSuccessHeading =
      page.getByRole(
        'heading',
        {
          name: 'Payment Successful'
        }
      );


    /*
     * Common Continue button on
     * Payment Success page.
     */
    this.continueButton =
      page.getByRole(
        'button',
        {
          name: 'Continue',
          exact: true
        }
      );


    /*
     * Quote ID label.
     */
    this.quoteIdLabel =
      page.getByText(
        'Quote ID',
        {
          exact: true
        }
      );


    /*
     * Monthly Auto Pay Registration button.
     *
     * This appears only after clicking Continue
     * when Auto Debit was selected.
     */
    this.autoPayRegistrationButton =
      page.getByRole(
        'button',
        {
          name: 'Auto Pay Registration',
          exact: true
        }
      );


    /*
     * Register Bank Details popup controls.
     */
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


    /*
     * Manual KYC indicator.
     *
     * For non-monthly flow, clicking Continue
     * opens KYC Selection directly.
     */
    this.manualKycRadio =
      page.locator(
        '#manualkycRadio'
      );
  }


  /*
   * Wait for Payment Success page.
   */
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


  /*
   * Normalize amount.
   *
   * Examples:
   *
   * ₹1,53,150
   * 1,53,150
   * 153150
   *
   * become:
   *
   * 153150
   */
  normalizeAmount(
    amount
  ) {

    return String(
      amount ?? ''
    )
      .replace(
        /₹/g,
        ''
      )
      .replace(
        /,/g,
        ''
      )
      .replace(
        /\s/g,
        ''
      )
      .trim();
  }


  /*
   * Format amount using Indian numbering.
   */
  formatIndianAmount(
    amount
  ) {

    const numericAmount =
      Number(
        this.normalizeAmount(
          amount
        )
      );


    if (
      Number.isNaN(
        numericAmount
      )
    ) {

      throw new Error(
        `Invalid amount received: "${amount}"`
      );
    }


    return numericAmount.toLocaleString(
      'en-IN'
    );
  }


  /*
   * Verify premium displayed on
   * Payment Success page.
   *
   * IMPORTANT:
   *
   * We DO NOT calculate Premium from
   * InvestmentAmount.
   *
   * The application can add rider premium.
   *
   * Example TC_0004:
   *
   * Investment Amount          = ₹1,50,000
   * Family Income Benefit Rider = YES
   * Final Premium              = ₹1,53,150
   *
   * Therefore the application displayed
   * premium is read from the Payment
   * Successful page.
   */
  async verifyPremium(
    planData
  ) {

    console.log(
      '=============================================='
    );

    console.log(
      'Verifying Premium on Payment Successful page...'
    );

    console.log(
      '=============================================='
    );


    /*
     * Read Investment Amount from Excel.
     *
     * This is used as the base amount only.
     * It is NOT directly used as the expected
     * Payment Success premium when riders are
     * selected.
     */
    const investmentAmountText =
      String(
        planData?.InvestmentAmount ?? ''
      )
        .replace(
          /,/g,
          ''
        )
        .trim();


    if (
      !investmentAmountText
    ) {

      throw new Error(
        'InvestmentAmount is missing in PlanDetails Excel data.'
      );
    }


    const investmentAmount =
      Number(
        investmentAmountText
      );


    if (
      Number.isNaN(
        investmentAmount
      )
    ) {

      throw new Error(
        `Invalid InvestmentAmount received: ` +
        `"${planData?.InvestmentAmount}".`
      );
    }


    /*
     * Payment Type.
     */
    const paymentType =
      String(
        planData?.['Payment Type'] ||
        planData?.PaymentType ||
        ''
      )
        .trim();


    if (
      !paymentType
    ) {

      throw new Error(
        'Payment Type is missing in PlanDetails Excel data.'
      );
    }


    /*
     * Normalize Payment Type for comparison.
     */
    const normalizedPaymentType =
      paymentType
        .replace(
          /-/g,
          ' '
        )
        .replace(
          /\s+/g,
          ' '
        )
        .trim()
        .toUpperCase();


    /*
     * Read rider configuration.
     */
    const familyIncomeRider =
      String(
        planData?.FamilyIncomeBenefitRider ?? ''
      )
        .trim()
        .toUpperCase();


    const extraInsuranceRider =
      String(
        planData?.ExtraInsuranceCoverRider ?? ''
      )
        .trim()
        .toUpperCase();


    const criticalIllnessWomanRider =
      String(
        planData?.CriticalIllnessWomanRider ?? ''
      )
        .trim()
        .toUpperCase();


    const criticalIllnessPlusRider =
      String(
        planData?.CriticalIllnessPlusRider ?? ''
      )
        .trim()
        .toUpperCase();


    const stepUpRider =
      String(
        planData?.StepUpRider ?? ''
      )
        .trim()
        .toUpperCase();


    const riderSelected =
      [
        familyIncomeRider,
        extraInsuranceRider,
        criticalIllnessWomanRider,
        criticalIllnessPlusRider,
        stepUpRider
      ].includes(
        'YES'
      );


    console.log(
      `Investment Amount from Excel: ₹${this.formatIndianAmount(investmentAmount)}`
    );


    console.log(
      `Payment Type from Excel: ${paymentType}`
    );


    console.log(
      'Rider configuration:'
    );


    console.log(
      `FamilyIncomeBenefitRider: ${familyIncomeRider || 'NOT PROVIDED'}`
    );


    console.log(
      `ExtraInsuranceCoverRider: ${extraInsuranceRider || 'NOT PROVIDED'}`
    );


    console.log(
      `CriticalIllnessWomanRider: ${criticalIllnessWomanRider || 'NOT PROVIDED'}`
    );


    console.log(
      `CriticalIllnessPlusRider: ${criticalIllnessPlusRider || 'NOT PROVIDED'}`
    );


    console.log(
      `StepUpRider: ${stepUpRider || 'NOT PROVIDED'}`
    );


    console.log(
      `Rider selected: ${riderSelected}`
    );


    /*
     * Wait for the Payment Successful page
     * premium to be rendered.
     *
     * We search the page body because the
     * application generates the premium
     * value dynamically.
     */
    console.log(
      'Waiting for final premium to be displayed...'
    );


    const startTime =
      Date.now();


    let premiumMatch =
      null;


    while (
      Date.now() - startTime < 60000
    ) {

      const bodyText =
        await this.page
          .locator('body')
          .innerText()
          .catch(
            () => ''
          );


      /*
       * Expected application format:
       *
       * ₹1,53,150/Yearly
       *
       * Also allow spaces:
       *
       * ₹1,53,150 / Yearly
       */
      const premiumRegex =
        /₹\s*([\d,]+(?:\.\d+)?)\s*\/\s*(Monthly|Quarterly|Half\s*Yearly|Yearly|Single)/i;


      premiumMatch =
        bodyText.match(
          premiumRegex
        );


      if (
        premiumMatch
      ) {

        break;
      }


      await this.page.waitForTimeout(
        1000
      );
    }


    if (
      !premiumMatch
    ) {

      const bodyText =
        await this.page
          .locator('body')
          .innerText()
          .catch(
            () => ''
          );


      console.log(
        'Payment Successful page visible text:'
      );


      console.log(
        bodyText.substring(
          0,
          10000
        )
      );


      throw new Error(
        'Final Premium Amount was not displayed ' +
        'on Payment Successful page within 60 seconds.'
      );
    }


    /*
     * Extract displayed premium.
     */
    const displayedPremiumText =
      premiumMatch[1];


    const displayedPaymentType =
      premiumMatch[2]
        .replace(
          /\s+/g,
          ' '
        )
        .trim();


    const displayedPremium =
      Number(
        this.normalizeAmount(
          displayedPremiumText
        )
      );


    if (
      Number.isNaN(
        displayedPremium
      )
    ) {

      throw new Error(
        `Invalid Premium displayed on Payment Successful page: ` +
        `"${displayedPremiumText}"`
      );
    }


    /*
     * Normalize displayed payment type.
     */
    const normalizedDisplayedPaymentType =
      displayedPaymentType
        .replace(
          /\s+/g,
          ' '
        )
        .trim()
        .toUpperCase();


    /*
     * Verify Payment Type.
     */
    expect(
      normalizedDisplayedPaymentType,
      'Payment Type displayed on Payment Successful page does not match Excel.'
    ).toBe(
      normalizedPaymentType
    );


    /*
     * Format values for logging.
     */
    const formattedDisplayedPremium =
      this.formatIndianAmount(
        displayedPremium
      );


    const formattedInvestmentAmount =
      this.formatIndianAmount(
        investmentAmount
      );


    console.log(
      '=============================================='
    );


    console.log(
      `Premium displayed on Payment Successful page: ` +
      `₹${formattedDisplayedPremium}/${displayedPaymentType}`
    );


    console.log(
      `Investment Amount from Excel: ` +
      `₹${formattedInvestmentAmount}`
    );


    console.log(
      `Payment Type verified: ${displayedPaymentType}`
    );


    console.log(
      '=============================================='
    );


    /*
     * Rider selected.
     *
     * The final premium is allowed to be
     * greater than the Investment Amount
     * because rider premium may be added.
     *
     * We do NOT hard-code the rider amount.
     */
    if (
      riderSelected
    ) {

      if (
        displayedPremium <
        investmentAmount
      ) {

        throw new Error(
          `Payment Successful Premium ` +
          `₹${formattedDisplayedPremium} ` +
          `is less than Investment Amount ` +
          `₹${formattedInvestmentAmount} ` +
          `even though a rider is selected.`
        );
      }


      const additionalPremium =
        displayedPremium -
        investmentAmount;


      console.log(
        `Rider premium included in final premium: ` +
        `₹${this.formatIndianAmount(additionalPremium)}`
      );


      console.log(
        'Premium verification passed with rider premium.'
      );
    }


    /*
     * No rider selected.
     *
     * In this case the final premium should
     * match the Investment Amount.
     */
    else {

      expect(
        displayedPremium,
        'Premium displayed on Payment Successful page does not match Investment Amount when no rider is selected.'
      ).toBe(
        investmentAmount
      );


      console.log(
        'No rider selected.'
      );


      console.log(
        'Premium matches Investment Amount.'
      );
    }


    /*
     * Return the actual premium so that
     * another page/test can use it later
     * if required.
     */
    return {
      premiumAmount:
        displayedPremium,

      formattedPremium:
        formattedDisplayedPremium,

      paymentType:
        displayedPaymentType,

      riderSelected
    };
  }


  /*
   * Read Quote ID.
   */
  async getQuoteId() {

    await expect(
      this.quoteIdLabel
    ).toBeVisible({
      timeout: 60000
    });


    /*
     * Quote value is expected to be the
     * next sibling of Quote ID label.
     */
    const quoteValueLocator =
      this.quoteIdLabel.locator(
        'xpath=following-sibling::*[1]'
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
      ).trim();


    if (
      !quoteId
    ) {

      throw new Error(
        'Quote ID is empty on Payment Success page.'
      );
    }


    console.log(
      `Quote ID: ${quoteId}`
    );


    return quoteId;
  }


  /*
   * Click the common Continue button.
   *
   * Monthly:
   *
   * Continue
   * → Auto Pay Registration.
   *
   * Non-monthly:
   *
   * Continue
   * → KYC Selection.
   */
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


    await this.continueButton.click();


    console.log(
      'Payment Success Continue button clicked.'
    );
  }


  /*
   * Monthly flow:
   *
   * After clicking Continue,
   * wait for Auto Pay Registration,
   * click it, and wait for the
   * Register Bank Details popup.
   */
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


    await this.autoPayRegistrationButton.click();


    console.log(
      'Auto Pay Registration button clicked.'
    );


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


  /*
   * Decide the next flow using
   * autoDebitSelected returned from
   * SummaryDetailsPage.js.
   */
  async handleNextFlow(
    autoDebitSelected
  ) {

    console.log(
      `Auto Debit selected: ${autoDebitSelected}`
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


    /*
     * Monthly:
     *
     * Continue
     * → Auto Pay Registration
     * → Register Bank
     * → Aadhaar
     * → eNACH
     */
    if (
      autoDebitSelected === true
    ) {

      console.log(
        'Monthly flow detected.'
      );


      await this.clickAutoPayRegistration();


      return 'AUTO_PAY';
    }


    /*
     * Yearly / Half Yearly / Quarterly:
     *
     * Continue
     * → KYC Selection
     */
    console.log(
      'Non-monthly flow detected.'
    );


    console.log(
      'Skipping Auto Pay Registration.'
    );


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


  /*
   * Complete Payment Success flow.
   *
   * Returns:
   *
   * {
   *   quoteId,
   *   paymentNextFlow
   * }
   *
   * paymentNextFlow:
   *
   * AUTO_PAY
   * → Monthly
   * → Register Bank / Aadhaar / eNACH
   *
   * DIRECT_KYC
   * → Yearly / Half Yearly / Quarterly
   * → Direct KYC Selection
   */
  async completePaymentSuccess(
    planData,
    autoDebitSelected
  ) {

    /*
     * Wait for Payment Success page.
     */
    await this.waitForPage();


    /*
     * Verify final premium.
     *
     * IMPORTANT:
     *
     * This now reads the actual premium
     * displayed by the application.
     */
    const premiumResult =
      await this.verifyPremium(
        planData
      );


    /*
     * Log final premium.
     */
    console.log(
      `Final Payment Premium verified: ` +
      `₹${premiumResult.formattedPremium}/` +
      `${premiumResult.paymentType}`
    );


    /*
     * Read Quote ID.
     */
    const quoteId =
      await this.getQuoteId();


    /*
     * Continue to next flow.
     */
    const paymentNextFlow =
      await this.handleNextFlow(
        autoDebitSelected
      );


    console.log(
      `Payment Success next flow: ` +
      `${paymentNextFlow}`
    );


    console.log(
      'Payment Success flow completed successfully.'
    );


    return {
      quoteId,
      paymentNextFlow
    };
  }
}


module.exports =
  PaymentSuccessPage;