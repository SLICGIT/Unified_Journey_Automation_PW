const {
  expect,
} = require('@playwright/test');


class PlanDetailsPage {

  constructor(page) {

    this.page = page;


    // =========================================================
    // LIFE COVER
    // =========================================================

    this.lifeCoverDropdown =
      page.locator(
        '#lifecoverchoosing_dsktp'
      );

    this.lifeCoverValue =
      page.locator(
        '#lifecoverval_dsktp'
      );

    this.lifeCoverOptions =
      page.locator(
        '#navLifeCover_dsktp nav.navchildcls'
      );


    // =========================================================
    // PAYMENT TYPE
    // =========================================================

    this.paymentTypeDropdown =
      page.locator(
        '#navHdr4_dsktp'
      );

    this.paymentTypeValue =
      page.locator(
        '#paymenttypeval_dsktp'
      );

    this.paymentTypeOptions =
      page.locator(
        '#navPaymentType_dsktp nav.navchildcls'
      );


    // =========================================================
    // LIFE COVER OPTION
    // Dynamic ID example:
    // SelLifeCoverOption_199
    // =========================================================

    this.lifeCoverOption =
      page.locator(
        'select[id^="SelLifeCoverOption_"]'
      );


    // =========================================================
    // DEATH BENEFIT
    // =========================================================

    this.deathBenefit =
      page.locator(
        'select[id^="SelDeathBenefit_"]'
      );


    // =========================================================
    // DEATH PAYOUT MODE
    // =========================================================

    this.deathPayoutMode =
      page.locator(
        'select[id^="SelDeathPayoutMode_"]'
      );


    // =========================================================
    // DEATH PAYOUT PERIOD
    // =========================================================

    this.deathPayoutPeriod =
      page.locator(
        'select[id^="SelDeathPayoutPeriod_"]'
      );


    // =========================================================
    // POLICY TERM
    // =========================================================

    this.policyTerm =
      page.locator(
        'select[id^="SelPolicyTerm_"]'
      );


    // =========================================================
    // BUY NOW
    // =========================================================

    this.buyNowButton =
      page.locator(
        'button[id^="btnBuyNow_"]'
      );
  }


  // ===========================================================
  // NORMALIZE TEXT
  // ===========================================================

  normalizeText(value) {

    return String(
      value ?? ''
    )
      .replace(/\s+/g, ' ')
      .trim();
  }


  // ===========================================================
  // WAIT FOR PLAN DETAILS PAGE
  // ===========================================================

  async waitForPage() {

    console.log(
      'Waiting for Family Protection Plan Details page...'
    );

    await expect(
      this.lifeCoverDropdown
    ).toBeVisible({
      timeout: 120000,
    });

    await expect(
      this.paymentTypeDropdown
    ).toBeVisible({
      timeout: 60000,
    });

    await expect(
      this.lifeCoverOption
    ).toBeVisible({
      timeout: 60000,
    });

    console.log(
      'Family Protection Plan Details page displayed.'
    );
  }


  // ===========================================================
  // WAIT FOR LOADING / UI UPDATE
  // ===========================================================

  async waitForUIUpdate() {

    /*
     * Short wait is useful because this page dynamically
     * updates dependent dropdowns through JavaScript.
     */

    await this.page.waitForTimeout(
      800
    );
  }


  // ===========================================================
  // SELECT LIFE COVER
  // ===========================================================

  async selectLifeCover(
    expectedValue
  ) {

    const requiredValue =
      this.normalizeText(
        expectedValue
      );

    if (!requiredValue) {

      throw new Error(
        'LifeCoverAmount is missing in PlanDetails Excel sheet.'
      );
    }

    console.log(
      `Waiting for Life Cover option: "${requiredValue}"`
    );


    await expect(
      this.lifeCoverDropdown
    ).toBeVisible({
      timeout: 60000,
    });


    /*
     * Click dropdown.
     */

    await this.lifeCoverDropdown.click();


    /*
     * Wait until options become visible.
     */

    await expect(
      this.lifeCoverOptions.first()
    ).toBeVisible({
      timeout: 30000,
    });


    /*
     * Print available options.
     */

    const availableOptions =
      (
        await this.lifeCoverOptions
          .allTextContents()
      )
        .map(value =>
          this.normalizeText(
            value
          )
        )
        .filter(Boolean);


    console.log(
      'Life Cover available options:',
      availableOptions
    );


    /*
     * Find exact option.
     */

    const requiredOption =
      this.lifeCoverOptions
        .filter({
          hasText:
            new RegExp(
              `^${this.escapeRegExp(requiredValue)}$`,
              'i'
            ),
        })
        .first();


    await expect(
      requiredOption
    ).toBeVisible({
      timeout: 30000,
    });


    await requiredOption.click();


    /*
     * Verify selected value.
     */

    await expect(
      this.lifeCoverValue
    ).toHaveText(
      requiredValue,
      {
        timeout: 30000,
      }
    );


    console.log(
      `Life Cover selected: ${requiredValue}`
    );


    await this.waitForUIUpdate();
  }


  // ===========================================================
  // SELECT PAYMENT TYPE
  // ===========================================================

  async selectPaymentType(
    expectedValue
  ) {

    const requiredValue =
      this.normalizeText(
        expectedValue
      );

    if (!requiredValue) {

      throw new Error(
        'PaymentType is missing in PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Waiting for Payment Type option: "${requiredValue}"`
    );


    await expect(
      this.paymentTypeDropdown
    ).toBeVisible({
      timeout: 60000,
    });


    /*
     * Check whether required payment type is already selected.
     */

    const currentlySelected =
      this.normalizeText(
        await this.paymentTypeValue
          .textContent()
      );


    if (
      currentlySelected.toUpperCase() ===
      requiredValue.toUpperCase()
    ) {

      console.log(
        `Payment Type already selected: ${requiredValue}`
      );

      return;
    }


    /*
     * Open Payment Type dropdown.
     */

    await this.paymentTypeDropdown.click();


    await expect(
      this.paymentTypeOptions.first()
    ).toBeVisible({
      timeout: 30000,
    });


    const availableOptions =
      (
        await this.paymentTypeOptions
          .allTextContents()
      )
        .map(value =>
          this.normalizeText(
            value
          )
        )
        .filter(Boolean);


    console.log(
      'Payment Type available options:',
      availableOptions
    );


    const requiredOption =
      this.paymentTypeOptions
        .filter({
          hasText:
            new RegExp(
              `^${this.escapeRegExp(requiredValue)}$`,
              'i'
            ),
        })
        .first();


    await expect(
      requiredOption
    ).toBeVisible({
      timeout: 30000,
    });


    await requiredOption.click();


    await expect(
      this.paymentTypeValue
    ).toHaveText(
      requiredValue,
      {
        timeout: 30000,
      }
    );


    console.log(
      `Payment Type selected: ${requiredValue}`
    );


    await this.waitForUIUpdate();
  }


  // ===========================================================
  // GENERIC SELECT DROPDOWN METHOD
  // ===========================================================

  async selectDropdownByLabel(
    locator,
    expectedValue,
    fieldName
  ) {

    const requiredValue =
      this.normalizeText(
        expectedValue
      );


    if (!requiredValue) {

      throw new Error(
        `${fieldName} is missing in PlanDetails Excel sheet.`
      );
    }


    console.log(
      `Waiting for ${fieldName} option: "${requiredValue}"`
    );


    await expect(
      locator
    ).toBeAttached({
      timeout: 60000,
    });


    await expect(
      locator
    ).toBeVisible({
      timeout: 60000,
    });


    /*
     * Wait for dependent dropdown values to load.
     */

    await expect
      .poll(
        async () => {

          const options =
            await locator
              .locator('option')
              .allTextContents();


          return options
            .map(option =>
              this.normalizeText(
                option
              )
            )
            .some(option =>
              option.toUpperCase() ===
              requiredValue.toUpperCase()
            );
        },
        {
          timeout: 60000,

          message:
            `${fieldName} option "${requiredValue}" ` +
            'did not load.',
        }
      )
      .toBeTruthy();


    /*
     * Print available dropdown options.
     */

    const availableOptions =
      (
        await locator
          .locator('option')
          .allTextContents()
      )
        .map(option =>
          this.normalizeText(
            option
          )
        );


    console.log(
      `${fieldName} available options:`,
      availableOptions
    );


    /*
     * Select using exact visible label.
     */

    await locator.selectOption({
      label: requiredValue,
    });


    /*
     * Verify.
     */

    await expect(
      locator
    ).toHaveValue(
      /.+/,
      {
        timeout: 30000,
      }
    );


    const selectedText =
      this.normalizeText(
        await locator
          .locator(
            'option:checked'
          )
          .textContent()
      );


    if (
      selectedText.toUpperCase() !==
      requiredValue.toUpperCase()
    ) {

      throw new Error(
        `${fieldName} selection failed. ` +
        `Expected "${requiredValue}", ` +
        `but selected "${selectedText}".`
      );
    }


    console.log(
      `${fieldName} selected: ${selectedText}`
    );


    await this.waitForUIUpdate();
  }


  // ===========================================================
  // SELECT LIFE COVER OPTION
  // ===========================================================

  async selectLifeCoverOption(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.lifeCoverOption,
      expectedValue,
      'Life Cover Option'
    );
  }


  // ===========================================================
  // SELECT DEATH BENEFIT
  // ===========================================================

  async selectDeathBenefit(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.deathBenefit,
      expectedValue,
      'Death Benefit'
    );
  }


  // ===========================================================
  // SELECT DEATH PAYOUT MODE
  // ===========================================================

  async selectDeathPayoutMode(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.deathPayoutMode,
      expectedValue,
      'Death Payout Mode'
    );
  }


  // ===========================================================
  // SELECT DEATH PAYOUT PERIOD
  // ===========================================================

  async selectDeathPayoutPeriod(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.deathPayoutPeriod,
      expectedValue,
      'Death Payout Period'
    );
  }


  // ===========================================================
  // SELECT POLICY TERM
  // ===========================================================

  async selectPolicyTerm(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.policyTerm,
      expectedValue,
      'Policy Term'
    );
  }


  // ===========================================================
  // FILL COMPLETE PLAN DETAILS
  // ===========================================================

  async fillPlanDetails(
    planData
  ) {

    console.log(
      '=============================================='
    );

    console.log(
      'Filling Family Protection Plan Details'
    );

    console.log(
      '=============================================='
    );


    if (!planData) {

      throw new Error(
        'PlanDetails Excel data is missing.'
      );
    }


    console.log(
      'Plan Details data received:',
      planData
    );


    // =========================================================
    // LIFE COVER
    // =========================================================

    await this.selectLifeCover(
      planData.LifeCoverAmount
    );


    // =========================================================
    // PAYMENT TYPE
    // =========================================================

    await this.selectPaymentType(
      planData.PaymentType
    );


    // =========================================================
    // LIFE COVER OPTION
    // =========================================================

    await this.selectLifeCoverOption(
      planData.LifeCoverOption
    );


    const lifeCoverOption =
      this.normalizeText(
        planData.LifeCoverOption
      ).toUpperCase();


    // =========================================================
    // DEATH BENEFIT
    // =========================================================

    await this.selectDeathBenefit(
      planData.DeathBenefit
    );


    const deathBenefit =
      this.normalizeText(
        planData.DeathBenefit
      ).toUpperCase();


    // =========================================================
    // CONDITIONAL DEATH PAYOUT FIELDS
    //
    // Life Cover Option = Installment Option
    // Death Benefit = Installment Option-Both
    //
    // Then:
    // Death Payout Mode
    // Death Payout Period
    // are required.
    // =========================================================

    const payoutFieldsRequired =
      lifeCoverOption ===
        'INSTALLMENT OPTION' &&
      deathBenefit ===
        'INSTALLMENT OPTION-BOTH';


    if (
      payoutFieldsRequired
    ) {

      console.log(
        'Installment Option-Both selected. ' +
        'Death Payout Mode and Period are required.'
      );


      await this.selectDeathPayoutMode(
        planData.DeathPayoutMode
      );


      await this.selectDeathPayoutPeriod(
        planData.DeathPayoutPeriod
      );
    }

    else {

      console.log(
        'Death Payout Mode and Death Payout Period ' +
        'are not required for this selection.'
      );
    }


    // =========================================================
    // POLICY TERM
    // =========================================================

    await this.selectPolicyTerm(
      planData.PolicyTerm
    );


    console.log(
      '=============================================='
    );

    console.log(
      'Family Protection Plan Details completed.'
    );

    console.log(
      '=============================================='
    );
  }


  // ===========================================================
  // CLICK BUY NOW
  // ===========================================================

  async clickBuyNow(
    planData
  ) {

    console.log(
      'Checking Buy Now button...'
    );


    await expect(
      this.buyNowButton
    ).toBeVisible({
      timeout: 60000,
    });


    await expect(
      this.buyNowButton
    ).toBeEnabled({
      timeout: 60000,
    });


    await this.buyNowButton
      .scrollIntoViewIfNeeded();


    console.log(
      'Clicking Buy Now...'
    );


    await this.buyNowButton.click();


    console.log(
      'Buy Now clicked successfully.'
    );


    /*
     * Do not add Smart Protection Plan Benefit Payout
     * modal handling here.
     *
     * Family Protection Plan behavior after Buy Now
     * will be added once its next screen / popup is confirmed.
     */

    await this.page.waitForTimeout(
      1000
    );
  }


  // ===========================================================
  // REGEX ESCAPE
  // ===========================================================

  escapeRegExp(
    value
  ) {

    return String(
      value
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }
}


module.exports =
  PlanDetailsPage;