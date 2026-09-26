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

  async verifyPremium(
    planData
  ) {

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
        planData.PaymentType ||
        ''
      ).trim();


    if (!paymentType) {

      throw new Error(
        'PaymentType is missing in ' +
        'PlanDetails Excel data.'
      );
    }


    console.log(
      `Payment Type for Payment Success: ` +
      `${paymentType}`
    );


    /*
     * NSV premium is calculated by
     * the application.
     *
     * Example:
     *
     * ₹42,176/Yearly
     *
     * Therefore InvestmentAmount must NOT
     * be read from Excel.
     */
    const premiumPattern =
      new RegExp(

        `^\\s*₹?\\s*` +
        `[\\d,]+` +
        `\\s*\\/\\s*` +
        `${this.escapeRegExp(
          paymentType
        )}` +
        `\\s*$`,

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
        await premiumValue
          .textContent()
    )
      .replace(/\s+/g, '')
      .trim();


    if (!actualPremium) {

      throw new Error(
        'Premium value is empty on ' +
        'Payment Successful page.'
      );
    }


    /*
     * Additional payment-mode verification.
     */
    expect(
      actualPremium
        .toLowerCase()
        .endsWith(
          `/${paymentType.toLowerCase()}`
        )
    ).toBeTruthy();


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

  async completePaymentSuccess(planData, autoDebitSelected) {

    console.log('Entered PaymentSuccessPage');

    // ============================================================
    // STEP 1 - HANDLE PAYMENT SELECTION POPUP
    // ============================================================

    console.log('Checking Payment Selection popup...');

    const paymentPopup =
        this.page.locator(
            'text=Select an option to pay'
        );

    const paymentPopupVisible =
        await paymentPopup
            .isVisible()
            .catch(() => false);


    if (paymentPopupVisible) {

        console.log(
            'Payment Selection popup is displayed.'
        );


        // ========================================================
        // PAYMENT OPTIONS
        // ========================================================

        const upiOption =
            this.page.getByText(
                'UPI Payment',
                {
                    exact: true,
                }
            );


        const netBankingOption =
            this.page.getByText(
                'Net Banking, Credit Card, Debit Card, Wallets',
                {
                    exact: true,
                }
            );


        console.log(
            'Checking available payment options...'
        );


        const upiVisible =
            await upiOption
                .isVisible()
                .catch(() => false);


        const netBankingVisible =
            await netBankingOption
                .isVisible()
                .catch(() => false);


        console.log(
            `UPI option visible: ${upiVisible}`
        );


        console.log(
            `Net Banking option visible: ${netBankingVisible}`
        );


        // ========================================================
        // SELECT PAYMENT METHOD
        // ========================================================
        //
        // For automation, select UPI when available.
        //
        // IMPORTANT:
        // Do NOT click Proceed before selecting an option.
        // ========================================================

        if (upiVisible) {

            console.log(
                'Selecting UPI Payment...'
            );


            await upiOption.click();


            console.log(
                'UPI Payment selected successfully.'
            );

        }

        else if (netBankingVisible) {

            console.log(
                'Selecting Net Banking / Card / Wallets...'
            );


            await netBankingOption.click();


            console.log(
                'Net Banking / Card / Wallet option selected successfully.'
            );

        }

        else {

            throw new Error(
                'No payment option was available in Payment Selection popup.'
            );
        }


        // ========================================================
        // PROCEED BUTTON
        // ========================================================

        const proceedButton =
            this.page.getByRole(
                'button',
                {
                    name: 'Proceed',
                    exact: true,
                }
            );


        await expect(
            proceedButton
        ).toBeVisible({
            timeout: 30000,
        });


        await expect(
            proceedButton
        ).toBeEnabled({
            timeout: 30000,
        });


        console.log(
            'Proceed button is enabled.'
        );


        console.log(
            `URL before Proceed: ${this.page.url()}`
        );


        await proceedButton.click();


        console.log(
            'Proceed button clicked successfully.'
        );


        // ========================================================
        // WAIT FOR PAYMENT POPUP TO CLOSE
        // ========================================================

        await paymentPopup
            .waitFor({
                state: 'hidden',
                timeout: 30000,
            })
            .catch(() => {

                console.log(
                    'Payment selection popup did not close immediately.'
                );

            });


        // ========================================================
        // WAIT FOR PAYMENT NAVIGATION / PAYMENT SUCCESS
        // ========================================================

        console.log(
            `URL after Proceed: ${this.page.url()}`
        );


        await this.page.waitForLoadState(
            'domcontentloaded'
        ).catch(() => {});


        await this.page.waitForTimeout(
            3000
        );

    }

    else {

        console.log(
            'Payment Selection popup was not displayed.'
        );

    }


    // ============================================================
    // STEP 2 - WAIT FOR PAYMENT SUCCESS
    // ============================================================

    console.log(
        `URL before Payment Success verification: ${this.page.url()}`
    );


    await this.waitForPage();


    // ============================================================
    // REST OF YOUR EXISTING PAYMENT SUCCESS LOGIC
    // ============================================================

    // Keep the existing code below this point unchanged.
}
}


module.exports = PaymentSuccessPage;