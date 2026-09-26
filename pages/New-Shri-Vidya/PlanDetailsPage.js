const {
  expect
} = require('@playwright/test');


class PlanDetailsPage {

  constructor(page) {

    this.page = page;


    // ========================================================
    // LIFE COVER
    // Custom section
    // ========================================================

    this.lifeCoverSection =
      page.locator(
        '#navHdr2_dsktp'
      );


    /*
     * Options inside Life Cover custom dropdown.
     *
     * Example Excel:
     * LifeCover = 3 Lakhs
     */
    this.lifeCoverOptions =
      this.lifeCoverSection
        .locator(
          '.navchildcls'
        );


    // ========================================================
    // PAYMENT TYPE
    // ========================================================

    this.paymentTypeSection =
      page.locator(
        '#navHdr4_dsktp'
      );


    /*
     * Duplicate id exists elsewhere in page,
     * therefore scope it under navHdr4_dsktp.
     */
    this.paymentTypeContainer =
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
        '#navHdr4_dsktp ' +
        '#navPaymentType_dsktp ' +
        '.navchildcls'
      );


    // ========================================================
    // LIFE COVER OPTION
    // Example: SelLifeCoverOption_204
    // ========================================================

    this.lifeCoverOption =
      page
        .locator(
          'select[id^="SelLifeCoverOption_"]'
        )
        .first();


    // ========================================================
    // MATURITY BENEFIT
    // Example: SelMaturityBenefit_204
    // ========================================================

    this.maturityBenefit =
      page
        .locator(
          'select[id^="SelMaturityBenefit_"]'
        )
        .first();


    // ========================================================
    // DEATH BENEFIT
    // Example: SelDeathBenefit_204
    // ========================================================

    this.deathBenefit =
      page
        .locator(
          'select[id^="SelDeathBenefit_"]'
        )
        .first();


    // ========================================================
    // DEATH PAYOUT MODE
    // Example: SelPayoutMode_204
    // ========================================================

    this.deathPayoutMode =
      page
        .locator(
          'select[id^="SelPayoutMode_"]'
        )
        .first();


    // ========================================================
    // POLICY TERM
    // Example: SelPolicyTerm_204
    // ========================================================

    this.policyTerm =
      page
        .locator(
          'select[id^="SelPolicyTerm_"]'
        )
        .first();


    // ========================================================
    // PREMIUM PAYING TERM
    // Example: SelPayfor_204
    // ========================================================

    this.premiumPayingTerm =
      page
        .locator(
          'select[id^="SelPayfor_"]'
        )
        .first();


    // ========================================================
    // BUY NOW
    // ========================================================

    this.buyNowButton =
      page
        .locator(
          'button[id^="btnBuyNow_"]'
        )
        .first();

    // ========================================================
    // SUITABILITY ANALYSIS
    // ========================================================

    this.suitabilityAnalysisButton =
      page
        .locator(
          'button[id^="btnSuitability_"]'
        )
        .first();


    this.suitabilityModal =
      page.locator(
        '#suitabilityModal'
      );


    // ========================================================
    // LOADERS
    // ========================================================

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
  // NORMALIZE TEXT
  // ==========================================================

  normalizeText(value) {

    return String(
      value || ''
    )
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
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
  // GET EXCEL VALUE
  // ==========================================================

  getExcelValue(
    row,
    columnName
  ) {

    return String(
      row?.[columnName] ?? ''
    ).trim();
  }


  // ==========================================================
  // GET REQUIRED EXCEL VALUE
  // ==========================================================

  getRequiredValue(
    row,
    columnName
  ) {

    const value =
      this.getExcelValue(
        row,
        columnName
      );


    if (!value) {

      throw new Error(
        `${columnName} is missing in ` +
        'PlanDetails Excel sheet.'
      );
    }


    return value;
  }


  // ==========================================================
  // WAIT FOR LOADER
  // ==========================================================

  async waitForLoaderToDisappear() {

    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(
          () => false
        );


    if (overlayVisible) {

      console.log(
        'Waiting for loading overlay...'
      );


      await this.loadingOverlay
        .waitFor({
          state: 'hidden',
          timeout: 120000
        });
    }


    const fetchingVisible =
      await this.fetchingDetailsText
        .isVisible()
        .catch(
          () => false
        );


    if (fetchingVisible) {

      console.log(
        'Waiting for Fetching Details...'
      );


      await this.fetchingDetailsText
        .waitFor({
          state: 'hidden',
          timeout: 120000
        });
    }
  }


  // ==========================================================
  // WAIT FOR NSV PLAN DETAILS PAGE
  // ==========================================================

  async waitForPage() {

    console.log(
      'Waiting for NSV Plan Details page...'
    );


    await this.waitForLoaderToDisappear();


    await expect(
      this.lifeCoverSection
    ).toBeVisible({
      timeout: 120000
    });


    await expect(
      this.paymentTypeContainer
    ).toBeVisible({
      timeout: 120000
    });


    await expect(
      this.lifeCoverOption
    ).toBeVisible({
      timeout: 120000
    });


    console.log(
      'NSV Plan Details page loaded successfully.'
    );
  }


  // ==========================================================
  // GET NORMAL SELECT OPTIONS
  // ==========================================================

  async getDropdownOptions(
    locator
  ) {

    return locator
      .locator(
        'option'
      )
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
      .catch(
        () => []
      );
  }


  // ==========================================================
  // WAIT FOR OPTION
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
          option =>

            this.normalizeText(
              option.label
            ) === expected ||

            this.normalizeText(
              option.value
            ) === expected
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
  }


  // ==========================================================
  // SELECT STANDARD HTML DROPDOWN
  // ==========================================================

  async selectDropdown(
    locator,
    expectedValue,
    fieldName
  ) {

    const expected =
      String(
        expectedValue || ''
      ).trim();


    if (!expected) {

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


    await this.waitForDropdownOption(
      locator,
      expected,
      fieldName
    );


    const options =
      await this.getDropdownOptions(
        locator
      );


    console.log(
      `${fieldName} available options:`,
      options.map(
        option =>
          option.label
      )
    );


    const expectedNormalized =
      this.normalizeText(
        expected
      );


    const matchingOption =
      options.find(
        option =>

          this.normalizeText(
            option.label
          ) === expectedNormalized ||

          this.normalizeText(
            option.value
          ) === expectedNormalized
      );


    if (!matchingOption) {

      throw new Error(
        `${fieldName} "${expected}" ` +
        'was not found. Available options: ' +
        options
          .map(
            option =>
              option.label
          )
          .join(', ')
      );
    }


    if (matchingOption.value) {

      await locator.selectOption({
        value:
          matchingOption.value
      });

    } else {

      await locator.selectOption({
        label:
          matchingOption.label
      });
    }


    await expect.poll(

      async () => {

        return String(
          await locator
            .locator(
              'option:checked'
            )
            .textContent()
            .catch(
              () => ''
            )
        )
          .replace(/\s+/g, ' ')
          .trim();

      },

      {
        timeout: 30000,

        intervals: [
          300,
          500,
          1000
        ]
      }

    ).toBe(
      matchingOption.label
    );


    console.log(
      `${fieldName} selected: ` +
      `${matchingOption.label}`
    );


    await this.waitForLoaderToDisappear();
  }


  // ==========================================================
  // LIFE COVER
  // ==========================================================

  async selectLifeCover(
    excelValue
  ) {

    const lifeCover =
      String(
        excelValue || ''
      ).trim();


    if (!lifeCover) {

      throw new Error(
        'LifeCover is missing in ' +
        'PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Selecting Life Cover: ${lifeCover}`
    );


    await expect(
      this.lifeCoverSection
    ).toBeVisible({
      timeout: 60000
    });


    /*
     * First check whether required Life Cover
     * is already displayed as selected.
     */
    const sectionText =
      this.normalizeText(
        await this.lifeCoverSection
          .innerText()
          .catch(
            () => ''
          )
      );


    /*
     * If current section already contains
     * selected value, don't change it.
     *
     * This is particularly useful when NSV
     * loads a default Life Cover.
     */
    if (
      sectionText.includes(
        this.normalizeText(
          lifeCover
        )
      )
    ) {

      console.log(
        `Life Cover already displayed: ` +
        `${lifeCover}`
      );


      return;
    }


    /*
     * Open custom Life Cover dropdown.
     */
    await this.lifeCoverSection
      .scrollIntoViewIfNeeded();


    await this.lifeCoverSection
      .click();


    /*
     * Find option inside Life Cover section.
     */
    let option =
      this.lifeCoverOptions
        .filter({
          hasText:
            new RegExp(
              `^\\s*${this.escapeRegExp(
                lifeCover
              )}\\s*$`,
              'i'
            )
        })
        .first();


    /*
     * Fallback in case this product does not
     * use .navchildcls for Life Cover options.
     */
    if (
      await option.count() === 0
    ) {

      option =
        this.page
          .getByText(
            lifeCover,
            {
              exact: true
            }
          )
          .filter({
            visible: true
          })
          .first();
    }


    await expect(
      option
    ).toBeVisible({
      timeout: 30000
    });


    await option.click();


    await this.waitForLoaderToDisappear();


    console.log(
      `Life Cover selected: ${lifeCover}`
    );
  }


  // ==========================================================
  // PAYMENT TYPE
  // ==========================================================

  async selectPaymentType(
    excelValue
  ) {

    const paymentType =
      String(
        excelValue || ''
      ).trim();


    if (!paymentType) {

      throw new Error(
        'PaymentType is missing in ' +
        'PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Selecting Payment Type: ` +
      `${paymentType}`
    );


    await expect(
      this.paymentTypeContainer
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.paymentTypeValue
    ).toBeVisible({
      timeout: 60000
    });


    const currentPaymentType =
      String(
        await this.paymentTypeValue
          .textContent()
    )
      .replace(/\s+/g, ' ')
      .trim();


    console.log(
      `Current Payment Type: ` +
      `${currentPaymentType}`
    );


    if (
      this.normalizeText(
        currentPaymentType
      ) ===
      this.normalizeText(
        paymentType
      )
    ) {

      console.log(
        `Payment Type already selected: ` +
        `${currentPaymentType}`
      );


      return;
    }


    await this.paymentTypeContainer
      .scrollIntoViewIfNeeded();


    await this.paymentTypeContainer
      .click();


    await expect(
      this.paymentTypeMenu
    ).toBeVisible({
      timeout: 30000
    });


    const paymentOption =
      this.paymentTypeOptions
        .filter({
          hasText:
            new RegExp(
              `^\\s*${this.escapeRegExp(
                paymentType
              )}\\s*$`,
              'i'
            )
        })
        .first();


    await expect(
      paymentOption
    ).toBeVisible({
      timeout: 30000
    });


    console.log(
      `Clicking Payment Type: ` +
      `${paymentType}`
    );


    await paymentOption.click();


    await expect.poll(

      async () => {

        return this.normalizeText(
          await this.paymentTypeValue
            .textContent()
            .catch(
              () => ''
            )
        );

      },

      {
        timeout: 30000,

        intervals: [
          300,
          500,
          1000
        ]
      }

    ).toBe(
      this.normalizeText(
        paymentType
      )
    );


    console.log(
      `Payment Type selected: ` +
      `${paymentType}`
    );


    await this.waitForLoaderToDisappear();
  }


  // ==========================================================
  // LIFE COVER OPTION
  // ==========================================================

  async selectLifeCoverOption(
    excelValue
  ) {

    await this.selectDropdown(
      this.lifeCoverOption,
      excelValue,
      'Life Cover Option'
    );


    /*
     * Life Cover Option onchange:
     * onLifeCoverChange()
     *
     * Maturity / Death benefits may appear
     * only after this selection.
     */
    await expect(
      this.maturityBenefit
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.deathBenefit
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Maturity Benefit and Death Benefit ' +
      'fields displayed.'
    );
  }


  // ==========================================================
  // MATURITY BENEFIT
  // ==========================================================

  async selectMaturityBenefit(
    excelValue
  ) {

    await this.selectDropdown(
      this.maturityBenefit,
      excelValue,
      'Maturity Benefit'
    );
  }


  // ==========================================================
  // DEATH BENEFIT
  // ==========================================================

  async selectDeathBenefit(
    excelValue
  ) {

    await this.selectDropdown(
      this.deathBenefit,
      excelValue,
      'Death Benefit'
    );
  }


  // ==========================================================
  // DEATH PAYOUT MODE
  // ==========================================================

  async handleDeathPayoutMode(
    deathBenefitValue,
    deathPayoutModeValue
  ) {

    const deathBenefit =
      this.normalizeText(
        deathBenefitValue
      );


    const installments =
      this.normalizeText(
        'Installments-Installments'
      );


    // ========================================================
    // INSTALLMENTS
    // ========================================================

    if (
      deathBenefit ===
      installments
    ) {

      console.log(
        'Installments Death Benefit detected.'
      );


      console.log(
        'Death Payout Mode is required.'
      );


      const payoutMode =
        String(
          deathPayoutModeValue || ''
        ).trim();


      if (!payoutMode) {

        throw new Error(
          'DeathPayOutMode is required when ' +
          'DeathBenefit is ' +
          '"Installments-Installments".'
        );
      }


      await expect(
        this.deathPayoutMode
      ).toBeVisible({
        timeout: 60000
      });


      await this.selectDropdown(
        this.deathPayoutMode,
        payoutMode,
        'Death Payout Mode'
      );


      return;
    }


    // ========================================================
    // LUMPSUM
    // ========================================================

    console.log(
      `Death Benefit "${deathBenefitValue}" ` +
      'does not require Death Payout Mode.'
    );


    console.log(
      'Death Payout Mode skipped.'
    );
  }


  // ==========================================================
  // POLICY TERM
  // ==========================================================

  async selectPolicyTerm(
    excelValue
  ) {

    await expect(
      this.policyTerm
    ).toBeVisible({
      timeout: 60000
    });


    await this.selectDropdown(
      this.policyTerm,
      excelValue,
      'Policy Term'
    );


    /*
     * Policy Term triggers LoadPPT().
     */
    await expect(
      this.premiumPayingTerm
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Premium Paying Term field displayed.'
    );
  }


  // ==========================================================
  // PREMIUM PAYING TERM
  // ==========================================================

  async selectPremiumPayingTerm(
    excelValue
  ) {

    await this.selectDropdown(
      this.premiumPayingTerm,
      excelValue,
      'Premium Paying Term'
    );
  }

  // ==========================================================
// CLICK BUY NOW
// ==========================================================

async clickBuyNow() {

  console.log(
    'Checking Buy Now button...'
  );


  await this.waitForLoaderToDisappear();


  await expect(
    this.buyNowButton
  ).toBeVisible({
    timeout: 60000
  });


  await expect(
    this.buyNowButton
  ).toBeEnabled({
    timeout: 30000
  });


  await this.buyNowButton
    .scrollIntoViewIfNeeded();


  const oldUrl =
    this.page.url();


  console.log(
    `URL before Buy Now: ${oldUrl}`
  );


  console.log(
    'Clicking Buy Now...'
  );


  await this.buyNowButton.click();


  console.log(
    'Buy Now clicked successfully.'
  );


  /*
   * Wait until Summary page starts loading.
   */
  await Promise.race([

    this.page.waitForURL(
      url =>
        url.toString() !== oldUrl,
      {
        timeout: 60000
      }
    ),

    this.page
      .getByText(
        'Summary Details',
        {
          exact: true
        }
      )
      .waitFor({
        state: 'visible',
        timeout: 60000
      })

  ]).catch(() => {

    console.log(
      'URL did not change immediately after Buy Now.'
    );

  });


  await this.waitForLoaderToDisappear();


  console.log(
    `URL after Buy Now: ${this.page.url()}`
  );
}


  // ==========================================================
  // CLICK SUITABILITY ANALYSIS
  // ==========================================================

  async clickSuitabilityAnalysis() {

    console.log(
      'Clicking Suitability Analysis...'
    );


    await this.waitForLoaderToDisappear();


    await expect(
      this.suitabilityAnalysisButton
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.suitabilityAnalysisButton
    ).toBeEnabled({
      timeout: 30000
    });


    await this.suitabilityAnalysisButton
      .scrollIntoViewIfNeeded();


    await this.suitabilityAnalysisButton
      .click();


    await expect(
      this.suitabilityModal
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Suitability Analysis popup displayed.'
    );
  }


  // ==========================================================
  // COMPLETE NSV PLAN DETAILS
  // ==========================================================

  async fillPlanDetails(
    data
  ) {

    console.log(
      '===== Filling NSV Plan Details ====='
    );


    if (!data) {

      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }


    // ========================================================
    // READ NSV EXCEL HEADINGS
    // ========================================================

    const lifeCover =
      this.getRequiredValue(
        data,
        'LifeCover'
      );


    const paymentType =
      this.getRequiredValue(
        data,
        'PaymentType'
      );


    const lifeCoverOption =
      this.getRequiredValue(
        data,
        'LifeCoverOption'
      );


    const maturityBenefit =
      this.getRequiredValue(
        data,
        'MaturityBenefit'
      );


    const deathBenefit =
      this.getRequiredValue(
        data,
        'DeathBenefit'
      );


    /*
     * Optional for Lumpsum.
     * Required for Installments.
     *
     * IMPORTANT:
     * Follow Excel heading exactly:
     * DeathPayOutMode
     */
    const deathPayoutMode =
      this.getExcelValue(
        data,
        'DeathPayOutMode'
      );


    const policyTerm =
      this.getRequiredValue(
        data,
        'PolicyTerm'
      );


    const premiumPayingTerm =
      this.getRequiredValue(
        data,
        'PremiumPayingTerm'
      );


    console.log(
      'NSV Plan Details Excel data:',
      {
        lifeCover,
        paymentType,
        lifeCoverOption,
        maturityBenefit,
        deathBenefit,
        deathPayoutMode,
        policyTerm,
        premiumPayingTerm
      }
    );


    await this.waitForPage();


    // ========================================================
    // 1. LIFE COVER
    // ========================================================

    await this.selectLifeCover(
      lifeCover
    );


    // ========================================================
    // 2. PAYMENT TYPE
    // ========================================================

    await this.selectPaymentType(
      paymentType
    );


    // ========================================================
    // 3. LIFE COVER OPTION
    // ========================================================

    await this.selectLifeCoverOption(
      lifeCoverOption
    );


    // ========================================================
    // 4. MATURITY BENEFIT
    // ========================================================

    await this.selectMaturityBenefit(
      maturityBenefit
    );


    // ========================================================
    // 5. DEATH BENEFIT
    // ========================================================

    await this.selectDeathBenefit(
      deathBenefit
    );


    // ========================================================
    // 6. CONDITIONAL DEATH PAYOUT MODE
    // ========================================================

    await this.handleDeathPayoutMode(
      deathBenefit,
      deathPayoutMode
    );


    // ========================================================
    // 7. POLICY TERM
    // ========================================================

    await this.selectPolicyTerm(
      policyTerm
    );


    // ========================================================
    // 8. PREMIUM PAYING TERM
    // ========================================================

    await this.selectPremiumPayingTerm(
      premiumPayingTerm
    );


    // ========================================================
    // FINAL PAYMENT TYPE VERIFICATION
    // ========================================================

    const finalPaymentType =
      String(
        await this.paymentTypeValue
          .textContent()
    )
      .replace(/\s+/g, ' ')
      .trim();


    if (
      this.normalizeText(
        finalPaymentType
      ) !==
      this.normalizeText(
        paymentType
      )
    ) {

      throw new Error(
        'Payment Type changed unexpectedly. ' +
        `Expected: "${paymentType}", ` +
        `Actual: "${finalPaymentType}".`
      );
    }


    console.log(
      `Final Payment Type verified: ` +
      `${finalPaymentType}`
    );


    /*
     * IMPORTANT:
     *
     * Do NOT complete Suitability Analysis here.
     *
     * EndToEnd.spec.js performs:
     *
     * planDetailsPage.clickSuitabilityAnalysis()
     *
     * followed by:
     *
     * suitabilityAnalysisPage
     *   .completeSuitabilityAnalysis(planData)
     */


    console.log(
      'NSV Plan Details completed successfully.'
    );
  }
}


module.exports =
  PlanDetailsPage;