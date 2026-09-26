const { expect } = require('@playwright/test');

class PlanDetailsPage {

  constructor(page) {

    this.page = page;


    // ==========================================================
    // LIFE COVER
    // ==========================================================

    this.lifeCoverHeader =
      page.locator(
        '#navHdr2_dsktp'
      );

    this.lifeCoverChoosing =
      page.locator(
        '#lifecoverchoosing_dsktp'
      );

    this.lifeCoverValue =
      page.locator(
        '#lifecoverval_dsktp'
      );

    this.lifeCoverMenu =
      page.locator(
        '#navLifeCover_dsktp'
      );

    this.lifeCoverOptions =
      page.locator(
        '#navLifeCover_dsktp nav.navchildcls'
      );


      // ==========================================================
      // PAYMENT TYPE
      // ==========================================================

      this.paymentTypeHeader =
        page.locator(
          '#navHdr4_dsktp'
        );

      this.paymentTypeChoosing =
        page.locator(
          '#navHdr4_dsktp #lifecoverchoosing'
        );

      this.paymentTypeValue =
        page.locator(
          '#navHdr4_dsktp #paymenttypeval_dsktp'
        );

      this.paymentTypeMenu =
        page.locator(
          '#navHdr4_dsktp #navPaymentType_dsktp'
        );

      this.paymentTypeOptions =
        page.locator(
          '#navHdr4_dsktp #navPaymentType_dsktp nav.navchildcls'
        );


    // ==========================================================
    // LIFE COVER OPTION
    // ==========================================================

    this.lifeCoverOption =
      page.locator(
        '#SelLifeCoverOption_200'
      );


    // ==========================================================
    // POLICY TERM SLAB
    // ==========================================================

    this.policyTermSlab =
      page.locator(
        '#SelPolicyTermSlab_200'
      );


    // ==========================================================
    // PREMIUM TERM SLAB
    // ==========================================================

    this.premiumTermSlab =
      page.locator(
        '#SelPremTermSlab_200'
      );


    // ==========================================================
    // DEATH BENEFIT
    // ==========================================================

    this.deathBenefit =
      page.locator(
        '#SelDeathBenefit_200'
      );


    // ==========================================================
    // DEATH PAYOUT MODE
    // ==========================================================

    this.deathPayoutMode =
      page.locator(
        '#SelDeathPayoutMode_200'
      );


    // ==========================================================
    // DEATH PAYOUT PERIOD
    // ==========================================================

    this.deathPayoutPeriod =
      page.locator(
        '#SelDeathPayoutPeriod_200'
      );


    // ==========================================================
    // POLICY TERM
    // ==========================================================

    this.policyTerm =
      page.locator(
        '#SelPolicyTerm_200'
      );


    // ==========================================================
    // PREMIUM PAYING TERM
    // ==========================================================

    this.premiumPayingTerm =
      page.locator(
        '#SelPayfor_200'
      );


    /*
     * Keep your EXISTING working locators for:
     *
     * Suitability Analysis
     * Buy Now
     *
     * Do not modify those locators.
     */
  }


  // ============================================================
  // NORMALIZE TEXT
  // ============================================================

  normalizeText(value) {

    return String(
      value || ''
    )
      .replace(
        /\s+/g,
        ' '
      )
      .replace(
        /\s*-\s*/g,
        '-'
      )
      .trim()
      .toLowerCase();
  }


  // ============================================================
  // REQUIRED EXCEL VALUE
  // ============================================================

  getRequiredValue(
    data,
    columnName
  ) {

    const value =
      data?.[columnName];

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    ) {

      throw new Error(
        `${columnName} is missing in ` +
        'the PlanDetails sheet.'
      );
    }

    return String(
      value
    ).trim();
  }


  // ============================================================
  // WAIT FOR PAGE
  // ============================================================

  async waitForPage() {

    console.log(
      'Waiting for Smart Protection Plan Details page...'
    );

    await this.lifeCoverHeader.waitFor({
      state: 'visible',
      timeout: 60000,
    });

    await this.paymentTypeHeader.waitFor({
      state: 'visible',
      timeout: 60000,
    });

    await this.lifeCoverOption.waitFor({
      state: 'visible',
      timeout: 60000,
    });

    console.log(
      'Smart Protection Plan Details page loaded.'
    );
  }


  // ============================================================
  // PAGE PROCESSING
  // ============================================================

  async waitForPlanProcessing() {

    /*
     * Small wait to allow onchange JavaScript
     * to start.
     *
     * Actual dependent dropdown readiness is
     * handled using expect.poll().
     */

    await this.page.waitForTimeout(
      500
    );
  }


  // ============================================================
  // GET NORMAL SELECT OPTIONS
  // ============================================================

  async getDropdownOptions(
    locator
  ) {

    return (
      await locator
        .locator('option')
        .allTextContents()
    )
      .map(
        option =>
          option.trim()
      )
      .filter(Boolean);
  }


  // ============================================================
  // WAIT FOR EXPECTED OPTION
  // ============================================================

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
      `Waiting for ${fieldName} option: "${expectedValue}"`
    );

    await locator.waitFor({
      state: 'attached',
      timeout: 30000,
    });

    await expect.poll(
      async () => {

        const options =
          await this.getDropdownOptions(
            locator
          );

        return options.some(
          option =>
            this.normalizeText(
              option
            ) === expected
        );
      },
      {
        timeout: 60000,

        intervals: [
          300,
          500,
          1000,
        ],

        message:
          `${fieldName} option ` +
          `"${expectedValue}" was not loaded.`,
      }
    ).toBeTruthy();
  }


  // ============================================================
  // COMMON NORMAL SELECT
  // ============================================================

  async selectDropdown(
    locator,
    value,
    fieldName
  ) {

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    ) {

      console.log(
        `${fieldName} is empty. Skipping.`
      );

      return;
    }

    const expectedValue =
      String(
        value
      ).trim();

    await locator.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await locator
      .scrollIntoViewIfNeeded();

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
      availableOptions
    );

    const expectedNormalized =
      this.normalizeText(
        expectedValue
      );

    const matchingOption =
      availableOptions.find(
        option =>
          this.normalizeText(
            option
          ) === expectedNormalized
      );

    if (!matchingOption) {

      throw new Error(
        `${fieldName} option "${expectedValue}" ` +
        'was not found. Available options: ' +
        availableOptions.join(', ')
      );
    }

    const optionLocator =
      locator
        .locator('option')
        .filter({
          hasText:
            matchingOption,
        })
        .first();

    const optionValue =
      await optionLocator
        .getAttribute(
          'value'
        );

    if (
      optionValue !== null &&
      optionValue !== ''
    ) {

      await locator.selectOption(
        optionValue
      );

    } else {

      await locator.selectOption({
        label:
          matchingOption,
      });
    }

    const selectedText =
      (
        await locator
          .locator(
            'option:checked'
          )
          .textContent()
      )?.trim();

    if (
      this.normalizeText(
        selectedText
      ) !== expectedNormalized
    ) {

      throw new Error(
        `${fieldName} selection failed. ` +
        `Expected "${expectedValue}", ` +
        `selected "${selectedText}".`
      );
    }

    console.log(
      `${fieldName} selected: ${selectedText}`
    );

    await this.waitForPlanProcessing();
  }


  // ============================================================
  // LIFE COVER
  // ============================================================

  async selectLifeCover(
  lifeCoverAmount
) {

  if (
    !lifeCoverAmount ||
    !String(lifeCoverAmount).trim()
  ) {

    throw new Error(
      'LifeCoverAmount is missing in PlanDetails sheet.'
    );
  }

  const expectedLifeCover =
    String(
      lifeCoverAmount
    ).trim();

  console.log(
    `Selecting Life Cover: "${expectedLifeCover}"`
  );

  await this.lifeCoverHeader.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  /*
   * Do NOT wait for lifeCoverValue to be visible.
   * On this page the span can exist in hidden state.
   */
  let currentLifeCover = '';

  if (
    await this.lifeCoverValue
      .count()
  ) {

    currentLifeCover =
      (
        await this.lifeCoverValue
          .textContent()
      )?.trim() || '';
  }

  console.log(
    `Current Life Cover: ${currentLifeCover}`
  );

  if (
    currentLifeCover ===
    expectedLifeCover
  ) {

    console.log(
      `Life Cover already selected: ${expectedLifeCover}`
    );

    return;
  }

  /*
   * Open Life Cover dropdown using the visible clickable container.
   */
  await this.lifeCoverChoosing.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await this.lifeCoverChoosing.click();

  await this.lifeCoverMenu.waitFor({
    state: 'visible',
    timeout: 10000,
  });

  const availableOptions =
    (
      await this.lifeCoverOptions
        .allTextContents()
    )
      .map(
        option => option.trim()
      )
      .filter(Boolean);

  console.log(
    'Life Cover available options:',
    availableOptions
  );

  if (
    !availableOptions.includes(
      expectedLifeCover
    )
  ) {

    throw new Error(
      `Life Cover "${expectedLifeCover}" ` +
      'was not found. Available options: ' +
      availableOptions.join(', ')
    );
  }

  const lifeCoverOption =
    this.lifeCoverMenu
      .locator(
        'nav.navchildcls'
      )
      .filter({
        hasText:
          expectedLifeCover,
      })
      .first();

  await lifeCoverOption.click();

  /*
   * Verify using textContent instead of visibility.
   */
  await expect.poll(
    async () => {

      const selected =
        (
          await this.lifeCoverValue
            .textContent()
        )?.trim() || '';

      return selected ===
        expectedLifeCover;
    },
    {
      timeout: 30000,
      message:
        `Life Cover did not change to "${expectedLifeCover}".`,
    }
  ).toBeTruthy();

  console.log(
    `Life Cover selected: ${expectedLifeCover}`
  );

  await this.waitForPlanProcessing();
}

  // ============================================================
  // PAYMENT TYPE
  // ============================================================

  async selectPaymentType(paymentType) {
  if (
    paymentType === undefined ||
    paymentType === null ||
    String(paymentType).trim() === ''
  ) {
    throw new Error(
      'PaymentType is missing in PlanDetails sheet.'
    );
  }

  const expectedPaymentType = String(
    paymentType
  ).trim();

  console.log(
    `Selecting Payment Type: "${expectedPaymentType}"`
  );

  // ==========================================================
  // WAIT FOR PAYMENT TYPE HEADER
  // ==========================================================

  await this.paymentTypeHeader.waitFor({
    state: 'visible',
    timeout: 30000
  });

  // ==========================================================
  // READ CURRENT PAYMENT TYPE
  // ==========================================================

  let currentPaymentType =
    (
      await this.paymentTypeValue.textContent()
    )?.trim() || '';

  console.log(
    `Current Payment Type: ${currentPaymentType}`
  );

  // ==========================================================
  // IF ALREADY SELECTED, SKIP
  // ==========================================================

  if (
    this.normalizeText(currentPaymentType) ===
    this.normalizeText(expectedPaymentType)
  ) {
    console.log(
      `Payment Type already selected: ${expectedPaymentType}`
    );

    return;
  }

  // ==========================================================
  // OPEN PAYMENT TYPE DROPDOWN
  // ==========================================================

  console.log(
    'Opening Payment Type dropdown...'
  );

  await this.paymentTypeChoosing.waitFor({
    state: 'visible',
    timeout: 30000
  });

  await this.paymentTypeChoosing.click();

  // ==========================================================
  // WAIT FOR PAYMENT TYPE MENU
  // ==========================================================

  await this.paymentTypeMenu.waitFor({
    state: 'visible',
    timeout: 10000
  });

  // ==========================================================
  // GET PAYMENT TYPE OPTIONS
  // ==========================================================

  const optionCount =
    await this.paymentTypeOptions.count();

  const availableOptions = [];

  for (let i = 0; i < optionCount; i++) {
    const text =
      (
        await this.paymentTypeOptions
          .nth(i)
          .textContent()
      )?.trim() || '';

    if (text) {
      availableOptions.push(text);
    }
  }

  console.log(
    'Payment Type available options:',
    availableOptions
  );

  // ==========================================================
  // FIND EXACT PAYMENT TYPE
  // ==========================================================

  const expectedNormalized =
    this.normalizeText(expectedPaymentType);

  let matchingIndex = -1;

  for (let i = 0; i < availableOptions.length; i++) {
    if (
      this.normalizeText(
        availableOptions[i]
      ) === expectedNormalized
    ) {
      matchingIndex = i;
      break;
    }
  }

  if (matchingIndex === -1) {
    throw new Error(
      `Payment Type "${expectedPaymentType}" was not found. ` +
      `Available options: ${availableOptions.join(', ')}`
    );
  }

  console.log(
    `Payment Type exact match found at index: ${matchingIndex}`
  );

  console.log(
    `Clicking Payment Type option: "${availableOptions[matchingIndex]}"`
  );

  // ==========================================================
  // CLICK EXACT OPTION
  // ==========================================================

  const paymentOption =
    this.paymentTypeOptions.nth(
      matchingIndex
    );

  await paymentOption.scrollIntoViewIfNeeded();

  await paymentOption.click();

  // ==========================================================
  // WAIT UNTIL UI VALUE CHANGES
  // ==========================================================

  await expect.poll(
    async () => {
      const selected =
        (
          await this.paymentTypeValue.textContent()
        )?.trim() || '';

      return this.normalizeText(
        selected
      );
    },
    {
      timeout: 30000,
      intervals: [
        300,
        500,
        1000
      ],
      message:
        `Payment Type did not change to "${expectedPaymentType}".`
    }
  ).toBe(
    expectedNormalized
  );

  // ==========================================================
  // READ FINAL SELECTED VALUE
  // ==========================================================

  currentPaymentType =
    (
      await this.paymentTypeValue.textContent()
    )?.trim() || '';

  console.log(
    `Payment Type selected: ${currentPaymentType}`
  );

  // ==========================================================
  // FINAL VERIFICATION
  // ==========================================================

  if (
    this.normalizeText(currentPaymentType) !==
    expectedNormalized
  ) {
    throw new Error(
      `Payment Type selection failed. ` +
      `Expected "${expectedPaymentType}", ` +
      `selected "${currentPaymentType}".`
    );
  }


  await this.waitForPlanProcessing();
}

  // ============================================================
  // LIFE COVER OPTION
  // ============================================================

  async selectLifeCoverOption(
    lifeCoverOption
  ) {

    await this.selectDropdown(
      this.lifeCoverOption,
      lifeCoverOption,
      'Life Cover Option'
    );
  }


  // ============================================================
  // POLICY TERM SLAB
  // ============================================================

  async selectPolicyTermSlab(
    policyTermSlab
  ) {

    await this.selectDropdown(
      this.policyTermSlab,
      policyTermSlab,
      'Policy Term Slab'
    );
  }


  // ============================================================
  // PREMIUM TERM SLAB
  // ============================================================

  async selectPremiumTermSlab(
    premiumTermSlab
  ) {

    await this.selectDropdown(
      this.premiumTermSlab,
      premiumTermSlab,
      'Premium Term Slab'
    );
  }


  // ============================================================
  // VALIDATE DEATH BENEFIT
  // ============================================================

  validateDeathBenefit(
    lifeCoverOption,
    deathBenefit
  ) {

    const cover =
      this.normalizeText(
        lifeCoverOption
      );

    const benefit =
      this.normalizeText(
        deathBenefit
      );


    // SILVER

    if (
      cover.includes(
        'silver life cover'
      )
    ) {

      const allowedBenefits = [
        'silver-lumpsum',
        'silver-installments',
      ];

      if (
        !allowedBenefits.includes(
          benefit
        )
      ) {

        throw new Error(
          `Invalid DeathBenefit "${deathBenefit}" ` +
          `for LifeCoverOption "${lifeCoverOption}".`
        );
      }

      return;
    }


    // GOLD

    if (
      cover.includes(
        'gold-life cover'
      )
    ) {

      const allowedBenefits = [
        'gold-lumpsum',
        'gold-installments',
      ];

      if (
        !allowedBenefits.includes(
          benefit
        )
      ) {

        throw new Error(
          `Invalid DeathBenefit "${deathBenefit}" ` +
          `for LifeCoverOption "${lifeCoverOption}".`
        );
      }

      return;
    }


    // DIAMOND

    if (
      cover.includes(
        'diamond-life cover'
      )
    ) {

      const allowedBenefits = [
        'diamond-lumpsum',
        'diamond-installments',
      ];

      if (
        !allowedBenefits.includes(
          benefit
        )
      ) {

        throw new Error(
          `Invalid DeathBenefit "${deathBenefit}" ` +
          `for LifeCoverOption "${lifeCoverOption}".`
        );
      }

      return;
    }


    throw new Error(
      `Unsupported LifeCoverOption: "${lifeCoverOption}".`
    );
  }


  // ============================================================
  // DEATH BENEFIT
  // ============================================================

  async selectDeathBenefit(
    lifeCoverOption,
    deathBenefit
  ) {

    this.validateDeathBenefit(
      lifeCoverOption,
      deathBenefit
    );

    await this.selectDropdown(
      this.deathBenefit,
      deathBenefit,
      'Death Benefit'
    );
  }


  // ============================================================
  // CHECK INSTALLMENT DEATH BENEFIT
  // ============================================================

  isInstallmentDeathBenefit(
    deathBenefit
  ) {

    return this.normalizeText(
      deathBenefit
    ).endsWith(
      '-installments'
    );
  }


  // ============================================================
  // DEATH PAYOUT DETAILS
  // ============================================================

  async handleDeathPayoutDetails(
    deathBenefit,
    deathPayoutMode,
    deathPayoutPeriod
  ) {

    if (
      !this.isInstallmentDeathBenefit(
        deathBenefit
      )
    ) {

      console.log(
        `Death Benefit "${deathBenefit}" is Lumpsum.`
      );

      console.log(
        'Death Payout Mode and Death Payout Period skipped.'
      );

      return;
    }

    console.log(
      `Death Benefit "${deathBenefit}" is Installments.`
    );

    if (
      !deathPayoutMode ||
      !String(
        deathPayoutMode
      ).trim()
    ) {

      throw new Error(
        'DeathPayoutMode is required ' +
        'when DeathBenefit is Installments.'
      );
    }

    if (
      deathPayoutPeriod === undefined ||
      deathPayoutPeriod === null ||
      String(
        deathPayoutPeriod
      ).trim() === ''
    ) {

      throw new Error(
        'DeathPayoutPeriod is required ' +
        'when DeathBenefit is Installments.'
      );
    }

    await this.deathPayoutMode.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await this.selectDropdown(
      this.deathPayoutMode,
      deathPayoutMode,
      'Death Payout Mode'
    );

    await this.deathPayoutPeriod.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await this.selectDropdown(
      this.deathPayoutPeriod,
      String(
        deathPayoutPeriod
      ).trim(),
      'Death Payout Period'
    );

    console.log(
      'Death Payout details completed.'
    );
  }


  // ============================================================
  // POLICY TERM
  // ============================================================

  async selectPolicyTerm(
    policyTerm
  ) {

    await this.selectDropdown(
      this.policyTerm,
      policyTerm,
      'Policy Term'
    );
  }


  // ============================================================
  // PREMIUM PAYING TERM
  // ============================================================

  async selectPremiumPayingTerm(
    premiumPayingTerm
  ) {

    if (
      premiumPayingTerm === undefined ||
      premiumPayingTerm === null ||
      String(
        premiumPayingTerm
      ).trim() === ''
    ) {

      console.log(
        'PremiumPayingTerm is empty in Excel.'
      );

      if (
        await this.premiumPayingTerm
          .isVisible()
          .catch(() => false)
      ) {

        const availableOptions =
          await this.getDropdownOptions(
            this.premiumPayingTerm
          );

        console.log(
          'Premium Paying Term available options:',
          availableOptions
        );

        const selectedValue =
          (
            await this.premiumPayingTerm
              .locator(
                'option:checked'
              )
              .textContent()
          )?.trim();

        console.log(
          `Premium Paying Term retained: ${selectedValue}`
        );
      }

      return;
    }

    await this.selectDropdown(
      this.premiumPayingTerm,
      premiumPayingTerm,
      'Premium Paying Term'
    );
  }


  // ============================================================
  // FILL PLAN DETAILS
  // ============================================================

  async fillPlanDetails(
    planData
  ) {

    console.log(
      '\n===== Filling Smart Protection Plan Details ====='
    );


    const lifeCoverAmount =
      this.getRequiredValue(
        planData,
        'LifeCoverAmount'
      );

    const paymentType =
      this.getRequiredValue(
        planData,
        'PaymentType'
      );

    const lifeCoverOption =
      this.getRequiredValue(
        planData,
        'LifeCoverOption'
      );

    const policyTermSlab =
      this.getRequiredValue(
        planData,
        'PolicyTermSlab'
      );

    const premiumTermSlab =
      this.getRequiredValue(
        planData,
        'PremiumTermSlab'
      );

    const deathBenefit =
      this.getRequiredValue(
        planData,
        'DeathBenefit'
      );

    const deathPayoutMode =
      String(
        planData.DeathPayoutMode ||
        ''
      ).trim();

    const deathPayoutPeriod =
      String(
        planData.DeathPayoutPeriod ||
        ''
      ).trim();

    const policyTerm =
      this.getRequiredValue(
        planData,
        'PolicyTerm'
      );

    const premiumPayingTerm =
      String(
        planData.PremiumPayingTerm ||
        ''
      ).trim();


    console.log(
      'Smart Protection Plan Details Excel data:',
      {
        lifeCoverAmount,
        paymentType,
        lifeCoverOption,
        policyTermSlab,
        premiumTermSlab,
        deathBenefit,
        deathPayoutMode,
        deathPayoutPeriod,
        policyTerm,
        premiumPayingTerm,
      }
    );


    await this.waitForPage();


    // 1. LIFE COVER
    await this.selectLifeCover(
      lifeCoverAmount
    );


    // 2. PAYMENT TYPE
    await this.selectPaymentType(
      paymentType
    );


    // 3. LIFE COVER OPTION
    await this.selectLifeCoverOption(
      lifeCoverOption
    );


    // 4. POLICY TERM SLAB
    await this.selectPolicyTermSlab(
      policyTermSlab
    );


    // 5. PREMIUM TERM SLAB
    await this.selectPremiumTermSlab(
      premiumTermSlab
    );


    // 6. DEATH BENEFIT
    await this.selectDeathBenefit(
      lifeCoverOption,
      deathBenefit
    );


    // 7. CONDITIONAL DEATH PAYOUT
    await this.handleDeathPayoutDetails(
      deathBenefit,
      deathPayoutMode,
      deathPayoutPeriod
    );


    // 8. POLICY TERM
    await this.selectPolicyTerm(
      policyTerm
    );


    // 9. PREMIUM PAYING TERM
    await this.selectPremiumPayingTerm(
      premiumPayingTerm
    );


    console.log(
      'Smart Protection Plan Details completed successfully.'
    );
  }


// ==========================================================
  // CLICK SUITABILITY ANALYSIS
  // ==========================================================

  async clickSuitabilityAnalysis() {
    console.log(
      'Clicking Suitability Analysis...'
    );

    await expect(
      this.suitabilityAnalysisButton
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.suitabilityAnalysisButton
    ).toBeEnabled({
      timeout: 60000
    });

    await this.suitabilityAnalysisButton
      .scrollIntoViewIfNeeded();

    await this.suitabilityAnalysisButton
      .click();

    await expect(
      this.page.locator(
        '#suitabilityModal'
      )
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Suitability Analysis popup displayed.'
    );
  }

// ============================================================
// BUY NOW
// ============================================================

async clickBuyNow(planData) {

  console.log(
    '\n===== Clicking Smart Protection Plan Buy Now ====='
  );

  console.log(
    'Plan Details data received in Buy Now:',
    planData
  );


  /*
   * Create locator directly here.
   *
   * Actual HTML:
   *
   * <button
   *   class="btnbynow"
   *   id="btnBuyNow_200">
   *   Buy Now
   * </button>
   */

  const buyNowButton =
    this.page.locator(
      '#btnBuyNow_200'
    );


  console.log(
    'Waiting for Buy Now button...'
  );


  await buyNowButton.waitFor({
    state: 'visible',
    timeout: 60000
  });


  await buyNowButton
    .scrollIntoViewIfNeeded();


  await expect(
    buyNowButton
  ).toBeEnabled({
    timeout: 60000
  });


  console.log(
    'Buy Now button displayed and enabled.'
  );


  await buyNowButton.click();


  console.log(
    'Buy Now clicked successfully.'
  );


  /*
   * Allow BuyNow JavaScript function
   * to start processing.
   */
  await this.page.waitForTimeout(
    1000
  );


  console.log(
    'Smart Protection Plan Buy Now completed successfully.'
  );
}
}


module.exports = PlanDetailsPage;