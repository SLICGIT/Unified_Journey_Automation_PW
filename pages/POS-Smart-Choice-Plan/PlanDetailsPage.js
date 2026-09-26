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
    //
    // Example:
    // SelLifeCoverOption_215
    //
    // Do NOT hardcode 215 because product/card ID can change.
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
    // PAYOUT INCREASE TYPE
    // =========================================================

    this.payoutIncType =
      page.locator(
        'select[id^="SelPayoutIncType_"]'
      );


    // =========================================================
    // PAYOUT INCREASE VALUE
    // =========================================================

    this.payoutIncValue =
      page.locator(
        'select[id^="SelPayoutIncValue_"]'
      );


    // =========================================================
    // DEATH PAYOUT MODE
    //
    // HTML:
    // SelPayoutMode_215
    // =========================================================

    this.deathPayoutMode =
      page.locator(
        'select[id^="SelPayoutMode_"]'
      );


    // =========================================================
    // DEATH PAYOUT PERIOD
    //
    // Exact HTML was not supplied yet.
    //
    // These selectors cover the likely naming patterns.
    // Once exact HTML is available, keep only the correct one.
    // =========================================================

    this.deathPayoutPeriod =
      page.locator(
        'select[id^="SelPayoutPeriod_"], ' +
        'select[id^="SelDeathPayoutPeriod_"]'
      );


    // =========================================================
    // SMART EXIT
    // =========================================================

    this.smartExit =
      page.locator(
        'select[id^="SelSmartExit_"]'
      );


    // =========================================================
    // POLICY TERM
    // =========================================================

    this.policyTerm =
      page.locator(
        'select[id^="SelPolicyTerm_"]'
      );


    // =========================================================
    // PREMIUM PAYING TERM
    // =========================================================

    this.premiumPayingTerm =
      page.locator(
        'select[id^="SelPayfor_"]'
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
  // ESCAPE REGEX
  // ===========================================================

  escapeRegExp(value) {

    return String(
      value
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  // ===========================================================
  // WAIT FOR UI UPDATE
  //
  // This application dynamically reloads dependent dropdowns.
  // ===========================================================

  async waitForUIUpdate(
    timeout = 700
  ) {

    await this.page.waitForTimeout(
      timeout
    );
  }


  // ===========================================================
  // WAIT FOR PLAN DETAILS PAGE
  // ===========================================================

  async waitForPage() {

    console.log(
      'Waiting for POS Smart Choice Plan Details page...'
    );


    await expect(
      this.lifeCoverDropdown
    ).toBeVisible({
      timeout: 120000,
    });


    console.log(
      'Life Cover control displayed.'
    );


    await expect(
      this.paymentTypeDropdown
    ).toBeVisible({
      timeout: 60000,
    });


    console.log(
      'Payment Type control displayed.'
    );


    await expect(
      this.lifeCoverOption
    ).toBeVisible({
      timeout: 60000,
    });


    console.log(
      'Life Cover Option displayed.'
    );


    console.log(
      'POS Smart Choice Plan Details page loaded successfully.'
    );
  }


  // ===========================================================
  // GET DROPDOWN OPTIONS
  // ===========================================================

  async getDropdownOptions(
    locator
  ) {

    return (
      await locator
        .locator('option')
        .allTextContents()
    )
      .map(option =>
        this.normalizeText(
          option
        )
      )
      .filter(Boolean);
  }


  // ===========================================================
  // WAIT FOR EXPECTED DROPDOWN OPTION
  //
  // Required because most POS Plan Details dropdowns are
  // dynamically populated after previous selections.
  // ===========================================================

  async waitForDropdownOption(
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
      `${fieldName} value is missing in PlanDetails Excel sheet.`
    );
  }

  console.log(
    `Waiting for ${fieldName} option: "${requiredValue}"`
  );

  await expect(
    locator
  ).toBeAttached({
    timeout: 60000
  });

  await expect(
    locator
  ).toBeVisible({
    timeout: 60000
  });

  await expect.poll(
    async () => {

      const options =
        await locator
          .locator('option')
          .allTextContents();

      const normalizedOptions =
        options.map(
          option =>
            this.normalizeText(
              option
            )
        );

      return normalizedOptions.some(
        option =>
          option.toLowerCase() ===
          requiredValue.toLowerCase()
      );
    },
    {
      timeout: 60000,

      intervals: [
        500,
        1000,
        2000
      ],

      message:
        `${fieldName} option "${requiredValue}" ` +
        'was not loaded.'
    }
  ).toBeTruthy();

  const availableOptions =
    (
      await locator
        .locator('option')
        .allTextContents()
    )
      .map(
        option =>
          this.normalizeText(
            option
          )
      );

  console.log(
    `${fieldName} available options:`,
    availableOptions
  );
}


  // ===========================================================
  // GENERIC SELECT BY LABEL
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

  await this.waitForDropdownOption(
    locator,
    requiredValue,
    fieldName
  );

  const availableOptions =
    await locator
      .locator('option')
      .allTextContents();

  const matchingOption =
    availableOptions.find(
      option =>
        this.normalizeText(
          option
        ).toLowerCase() ===
        requiredValue.toLowerCase()
    );

  if (!matchingOption) {

    throw new Error(
      `${fieldName} "${requiredValue}" was not found.`
    );
  }

  await locator.selectOption({
    label:
      matchingOption.trim()
  });

  await expect.poll(
    async () => {

      return this.normalizeText(
        await locator
          .locator(
            'option:checked'
          )
          .textContent()
      );
    },
    {
      timeout: 30000,

      intervals: [
        500,
        1000,
        2000
      ],

      message:
        `${fieldName} "${requiredValue}" ` +
        'was not selected.'
    }
  ).toBe(
    requiredValue
  );

  console.log(
    `${fieldName} selected: ${requiredValue}`
  );

  await this.waitForUIUpdate(
    1000
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
    timeout: 60000
  });


  const currentValue =
    this.normalizeText(
      await this.lifeCoverValue
        .textContent()
    );


  if (
    currentValue.toLowerCase() ===
    requiredValue.toLowerCase()
  ) {

    console.log(
      `Life Cover already selected: ${requiredValue}`
    );

    return;
  }


  await this.lifeCoverDropdown.click();


  await expect(
    this.lifeCoverOptions.first()
  ).toBeVisible({
    timeout: 30000
  });


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


  const matchingIndex =
    availableOptions.findIndex(
      option =>
        option.toLowerCase() ===
        requiredValue.toLowerCase()
    );


  if (
    matchingIndex === -1
  ) {

    throw new Error(
      `Life Cover "${requiredValue}" was not found. ` +
      `Available options: ${availableOptions.join(', ')}`
    );
  }


  const requiredOption =
    this.lifeCoverOptions
      .nth(
        matchingIndex
      );


  await requiredOption.click();


  await expect.poll(
    async () => {

      return this.normalizeText(
        await this.lifeCoverValue
          .textContent()
      );
    },
    {
      timeout: 30000,

      intervals: [
        500,
        1000,
        2000
      ],

      message:
        `Life Cover "${requiredValue}" was not selected.`
    }
  ).toBe(
    requiredValue
  );


  console.log(
    `Life Cover selected: ${requiredValue}`
  );


  await this.waitForUIUpdate(
    1000
  );
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


    const exactOption =
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
      exactOption
    ).toBeVisible({
      timeout: 30000,
    });


    await exactOption.click();


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


    await this.waitForUIUpdate(
      1000
    );
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
  // SELECT PAYOUT INCREASE TYPE
  // ===========================================================

  async selectPayoutIncType(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.payoutIncType,
      expectedValue,
      'Payout Inc Type'
    );
  }


  // ===========================================================
  // SELECT PAYOUT INCREASE VALUE
  // ===========================================================

  async selectPayoutIncValue(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.payoutIncValue,
      expectedValue,
      'Payout Inc Value'
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

    const requiredValue =
      this.normalizeText(
        expectedValue
      );


    /*
     * Some Death Benefit configurations may not show this field.
     */

    if (!requiredValue) {

      console.log(
        'Death Payout Period is blank in Excel. Skipping.'
      );

      return;
    }


    const count =
      await this.deathPayoutPeriod.count();


    if (
      count === 0
    ) {

      console.log(
        'Death Payout Period control was not found.'
      );

      console.log(
        'Exact Death Payout Period locator may need to be updated.'
      );

      return;
    }


    await this.selectDropdownByLabel(
      this.deathPayoutPeriod,
      requiredValue,
      'Death Payout Period'
    );
  }


  // ===========================================================
  // SELECT SMART EXIT
  // ===========================================================

  async selectSmartExit(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.smartExit,
      expectedValue,
      'Smart Exit'
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
  // SELECT PREMIUM PAYING TERM
  // ===========================================================

  async selectPremiumPayingTerm(
    expectedValue
  ) {

    await this.selectDropdownByLabel(
      this.premiumPayingTerm,
      expectedValue,
      'Premium Paying Term'
    );
  }


  // ===========================================================
  // VALIDATE LIFE COVER OPTION
  // ===========================================================

  validateLifeCoverOption(
    value
  ) {

    const lifeCoverOption =
      this.normalizeText(
        value
      );


    const supportedOptions = [

      'Basic Cover Plus Inbuilt Accident benefit cover',

      'Basic Cover',
    ];


    const valid =
      supportedOptions.some(
        option =>
          option.toUpperCase() ===
          lifeCoverOption.toUpperCase()
      );


    if (!valid) {

      throw new Error(
        `Unsupported Life Cover Option: "${lifeCoverOption}". ` +
        `Supported values: ${supportedOptions.join(', ')}`
      );
    }
  }


  // ===========================================================
  // VALIDATE DEATH BENEFIT AGAINST LIFE COVER OPTION
  // ===========================================================

  validateDeathBenefit(
    lifeCoverOption,
    deathBenefit
  ) {

    const lifeCover =
      this.normalizeText(
        lifeCoverOption
      );

    const death =
      this.normalizeText(
        deathBenefit
      );


    if (
      lifeCover.toUpperCase() ===
      'BASIC COVER PLUS INBUILT ACCIDENT BENEFIT COVER'
    ) {

      const allowedValues = [

        'Basic Cover Plus Inbuilt Accident benefit cover-Lumpsum',

        'Basic Cover Plus Inbuilt Accident benefit cover-Both',

        'Basic Cover Plus Inbuilt Accident benefit cover-Installments',
      ];


      const valid =
        allowedValues.some(
          option =>
            option.toUpperCase() ===
            death.toUpperCase()
        );


      if (!valid) {

        throw new Error(
          `Invalid DeathBenefit "${death}" for ` +
          `LifeCoverOption "${lifeCover}".`
        );
      }
    }


    else if (
      lifeCover.toUpperCase() ===
      'BASIC COVER'
    ) {

      const allowedValues = [

        'Basic Cover-Lumpsum',

        'Basic Cover-Installments',

        'Basic Cover-Both',
      ];


      const valid =
        allowedValues.some(
          option =>
            option.toUpperCase() ===
            death.toUpperCase()
        );


      if (!valid) {

        throw new Error(
          `Invalid DeathBenefit "${death}" for ` +
          `LifeCoverOption "${lifeCover}".`
        );
      }
    }
  }


  // ===========================================================
  // FILL COMPLETE PLAN DETAILS
  // ===========================================================

  async fillPlanDetails(
    planData
  ) {

    console.log(
      '================================================'
    );

    console.log(
      'Filling POS Smart Choice Plan Details'
    );

    console.log(
      '================================================'
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
    // READ EXCEL VALUES
    // =========================================================

    const lifeCoverOption =
      this.normalizeText(
        planData.LifeCoverOption
      );


    const deathBenefit =
      this.normalizeText(
        planData.DeathBenefit
      );


    const payoutIncType =
      this.normalizeText(
        planData.PayoutIncType
      );


    // =========================================================
    // VALIDATE EXCEL CONDITIONS FIRST
    // =========================================================

    this.validateLifeCoverOption(
      lifeCoverOption
    );


    this.validateDeathBenefit(
      lifeCoverOption,
      deathBenefit
    );


    // =========================================================
    // 1. LIFE COVER
    // =========================================================

    await this.selectLifeCover(
      planData.LifeCoverAmount
    );


    // =========================================================
    // 2. PAYMENT TYPE
    // =========================================================

    await this.selectPaymentType(
      planData.PaymentType
    );


    // =========================================================
    // 3. LIFE COVER OPTION
    // =========================================================

    await this.selectLifeCoverOption(
      lifeCoverOption
    );


    /*
     * Changing Life Cover Option dynamically reloads
     * Death Benefit.
     */

    await this.waitForUIUpdate(
      1000
    );


    // =========================================================
    // 4. DEATH BENEFIT
    // =========================================================

    await this.selectDeathBenefit(
      deathBenefit
    );


    /*
     * Changing Death Benefit dynamically loads
     * payout-related fields.
     */

    await this.waitForUIUpdate(
      1000
    );


    // =========================================================
    // 5. PAYOUT INCREASE TYPE
    // =========================================================

    await this.selectPayoutIncType(
      payoutIncType
    );


    // =========================================================
    // 6. PAYOUT INCREASE VALUE
    //
    // Only required when:
    //
    // PayoutIncType = Increasing
    // =========================================================

    if (
      payoutIncType.toUpperCase() ===
      'INCREASING'
    ) {

      console.log(
        'Payout Inc Type is Increasing.'
      );

      console.log(
        'Payout Inc Value selection is required.'
      );


      await this.selectPayoutIncValue(
        planData.PayoutIncValue
      );
    }

    else {

      console.log(
        `Payout Inc Type is "${payoutIncType}".`
      );

      console.log(
        'Payout Inc Value selection is not required.'
      );
    }


    // =========================================================
    // 7. DEATH PAYOUT MODE
    //
    // Select only if Excel contains a value.
    // =========================================================

    const deathPayoutMode =
      this.normalizeText(
        planData.DeathPayoutMode
      );


    if (
      deathPayoutMode
    ) {

      await this.selectDeathPayoutMode(
        deathPayoutMode
      );
    }

    else {

      console.log(
        'Death Payout Mode is blank in Excel. Skipping.'
      );
    }


    // =========================================================
    // 8. DEATH PAYOUT PERIOD
    // =========================================================

    const deathPayoutPeriod =
      this.normalizeText(
        planData.DeathPayoutPeriod
      );


    if (
      deathPayoutPeriod
    ) {

      await this.selectDeathPayoutPeriod(
        deathPayoutPeriod
      );
    }

    else {

      console.log(
        'Death Payout Period is blank in Excel. Skipping.'
      );
    }


    // =========================================================
    // 9. SMART EXIT
    // =========================================================

    const smartExit =
      this.normalizeText(
        planData.SmartExit
      );


    if (
      smartExit
    ) {

      await this.selectSmartExit(
        smartExit
      );
    }

    else {

      console.log(
        'Smart Exit is blank in Excel. Skipping.'
      );
    }


    // =========================================================
    // 10. POLICY TERM
    // =========================================================

    await this.selectPolicyTerm(
      planData.PolicyTerm
    );


    /*
     * Policy Term selection dynamically reloads
     * Premium Paying Term.
     */

    await this.waitForUIUpdate(
      1000
    );


    // =========================================================
    // 11. PREMIUM PAYING TERM
    // =========================================================

    await this.selectPremiumPayingTerm(
      planData.PremiumPayingTerm
    );


    console.log(
      '================================================'
    );

    console.log(
      'POS Smart Choice Plan Details completed successfully.'
    );

    console.log(
      '================================================'
    );
  }


  // ===========================================================
  // CLICK BUY NOW
  // ===========================================================

  async clickBuyNow(
    planData
  ) {

    console.log(
      'Waiting for Buy Now button...'
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
      'Plan Details data before Buy Now:',
      planData
    );


    console.log(
      'Clicking Buy Now...'
    );


    await this.buyNowButton.click();


    console.log(
      'Buy Now clicked successfully.'
    );


    /*
     * Do not add another plan's modal handling here.
     *
     * We first verify what POS Smart Choice Plan displays
     * after Buy Now.
     */

    await this.page.waitForTimeout(
      1000
    );
  }
}


module.exports =
  PlanDetailsPage;