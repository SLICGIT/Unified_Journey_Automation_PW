const {
  expect
} = require('@playwright/test');


class PlanDetailsPage {

  constructor(page) {

    this.page = page;


    // ========================================================
    // INVESTMENT AMOUNT
    // ========================================================

    this.investmentAmount =
      page.locator(
        '#txtInvestment_dsktp'
      );


      // ========================================================
      // PAYMENT TYPE
      // ========================================================

      this.paymentTypeContainer =
        page.locator(
          '#navHdr4_dsktp #lifecoverchoosing'
        );

      this.paymentTypeValue =
        page.locator(
          '#navHdr4_dsktp #paymenttypeval_dsktp'
        );

      this.paymentTypeOptions =
        page.locator(
          '#navHdr4_dsktp #navPaymentType_dsktp nav[id="PaymentType"]'
        );


    // ========================================================
    // LIFE COVER OPTION
    // Example: SelLifeCoverOption_185
    // ========================================================

    this.lifeCoverOption =
      page
        .locator(
          'select[id^="SelLifeCoverOption_"]'
        )
        .first();


    // ========================================================
    // MATURITY BENEFIT
    // Example: SelMaturityBenefit_185
    // ========================================================

    this.maturityBenefit =
      page
        .locator(
          'select[id^="SelMaturityBenefit_"]'
        )
        .first();


    // ========================================================
    // DEATH BENEFIT
    // Example: SelDeathBenefit_185
    // ========================================================

    this.deathBenefit =
      page
        .locator(
          'select[id^="SelDeathBenefit_"]'
        )
        .first();


    // ========================================================
    // POLICY TERM
    // Example: SelPolicyTerm_185
    // ========================================================

    this.policyTerm =
      page
        .locator(
          'select[id^="SelPolicyTerm_"]'
        )
        .first();


    // ========================================================
    // PREMIUM PAYING TERM
    // Example: SelPayfor_185
    // ========================================================

    this.premiumPayingTerm =
      page
        .locator(
          'select[id^="SelPayfor_"]'
        )
        .first();


    // ========================================================
    // SUITABILITY ANALYSIS
    // Example: btnSuitability_185
    // ========================================================

    this.suitabilityAnalysisButton =
      page
        .locator(
          'button[id^="btnSuitability_"]'
        )
        .first();


    // ========================================================
    // LOADER
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
  // GET REQUIRED EXCEL VALUE
  // ==========================================================

  getRequiredValue(
    row,
    columnName
  ) {

    const value =
      String(
        row?.[columnName] ?? ''
      ).trim();


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

  async waitForLoadingToComplete() {

    const loadingVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(() => false);


    if (loadingVisible) {

      console.log(
        'Waiting for loading overlay...'
      );


      await this.loadingOverlay.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }


    const fetchingVisible =
      await this.fetchingDetailsText
        .isVisible()
        .catch(() => false);


    if (fetchingVisible) {

      console.log(
        'Waiting for Fetching Details...'
      );


      await this.fetchingDetailsText.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }
  }


  // ==========================================================
  // WAIT FOR ASP PLAN DETAILS PAGE
  // ==========================================================

  async waitForPlanDetailsPage() {

    console.log(
      'Waiting for ASP Plan Details page...'
    );


    await this.waitForLoadingToComplete();


    /*
     * Only verify fields visible when
     * Plan Details first opens.
     *
     * Maturity Benefit and Death Benefit
     * may initially be hidden.
     */
    await expect(
      this.investmentAmount
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
      'ASP Plan Details page displayed.'
    );
  }


  // ==========================================================
  // GET DROPDOWN OPTIONS
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
                ).trim()

            })
          );

        }
      )
      .catch(
        () => []
      );
  }


  // ==========================================================
  // SELECT PAYMENT TYPE
  // ==========================================================

  async selectPaymentType(
    value
  ) {

    const expectedValue =
      String(
        value || ''
      ).trim();


    if (!expectedValue) {

      throw new Error(
        'PaymentType is missing in ' +
        'PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Selecting Payment Type: ${expectedValue}`
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


    const currentValue =
      String(
        await this.paymentTypeValue
          .textContent()
      )
        .replace(/\s+/g, ' ')
        .trim();


    console.log(
      `Current Payment Type: ${currentValue}`
    );


    /*
     * If expected Payment Type is already
     * selected, no click is necessary.
     */
    if (
      this.normalizeText(
        currentValue
      ) ===
      this.normalizeText(
        expectedValue
      )
    ) {

      console.log(
        `Payment Type already selected: ` +
        `${currentValue}`
      );

      return;
    }


    /*
     * Open custom Payment Type dropdown.
     */
    await this.paymentTypeContainer
      .scrollIntoViewIfNeeded();


    await this.paymentTypeContainer
      .click();


    /*
     * Find option by exact visible text.
     *
     * Monthly
     * Quarterly
     * Half Yearly
     * Yearly
     */
    const matchingOption =
      this.paymentTypeOptions
        .filter({
          hasText:
            new RegExp(
              `^\\s*${this.escapeRegExp(
                expectedValue
              )}\\s*$`,
              'i'
            )
        })
        .first();


    await expect(
      matchingOption
    ).toBeVisible({
      timeout: 30000
    });


    console.log(
      `Clicking Payment Type: ` +
      `${expectedValue}`
    );


    await matchingOption.click();


    /*
     * Verify UI was actually updated.
     */
    await expect.poll(

      async () => {

        return String(
          await this.paymentTypeValue
            .textContent()
            .catch(() => '')
        )
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();

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
        expectedValue
      )
    );


    console.log(
      `Payment Type selected: ` +
      `${expectedValue}`
    );


    await this.waitForLoadingToComplete();
  }


  // ==========================================================
  // WAIT FOR EXPECTED DROPDOWN OPTION
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
          option => {

            return (
              this.normalizeText(
                option.label
              ) === expected ||

              this.normalizeText(
                option.value
              ) === expected
            );

          }
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
  // SELECT NORMAL HTML DROPDOWN
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
        option => option.label
      )
    );


    const normalizedExpected =
      this.normalizeText(
        expected
      );


    const matchingOption =
      options.find(
        option => {

          return (
            this.normalizeText(
              option.label
            ) === normalizedExpected ||

            this.normalizeText(
              option.value
            ) === normalizedExpected
          );

        }
      );


    if (!matchingOption) {

      throw new Error(
        `${fieldName} "${expected}" ` +
        'was not found. Available options: ' +
        options
          .map(
            option => option.label
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
            .catch(() => '')
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


    await this.waitForLoadingToComplete();
  }


  // ==========================================================
  // INVESTMENT AMOUNT
  // ==========================================================

  async enterInvestmentAmount(
    value
  ) {

    const investmentAmount =
      String(
        value || ''
      )
        .replace(/,/g, '')
        .trim();


    if (!investmentAmount) {

      throw new Error(
        'InvestmentAmount is missing in ' +
        'PlanDetails Excel sheet.'
      );
    }


    if (
      !/^\d+$/.test(
        investmentAmount
      )
    ) {

      throw new Error(
        `Invalid InvestmentAmount: ` +
        `"${investmentAmount}"`
      );
    }


    const minAmountAttribute =
      await this.investmentAmount
        .getAttribute(
          'minamt'
        )
        .catch(() => null);


    const minimumAmount =
      Number(
        minAmountAttribute ||
        2500
      );


    if (
      Number(investmentAmount) <
      minimumAmount
    ) {

      throw new Error(
        `Investment Amount must be at least ` +
        `${minimumAmount}. ` +
        `Received: ${investmentAmount}`
      );
    }


    await expect(
      this.investmentAmount
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.investmentAmount
    ).toBeEditable({
      timeout: 60000
    });


    await this.investmentAmount.fill(
      investmentAmount
    );


    /*
     * ASP calls:
     * InvestAmtFocusout(this)
     */
    await this.investmentAmount.press(
      'Tab'
    );


    await expect(
      this.investmentAmount
    ).toHaveValue(
      investmentAmount,
      {
        timeout: 30000
      }
    );


    await this.waitForLoadingToComplete();


    console.log(
      `Investment Amount entered: ` +
      `${investmentAmount}`
    );
  }


  // ==========================================================
  // LIFE COVER OPTION
  // ==========================================================

  async selectLifeCoverOption(
    value
  ) {

    await this.selectDropdown(
      this.lifeCoverOption,
      value,
      'Life Cover Option'
    );


    console.log(
      'Waiting for dependent Plan Details fields...'
    );


    /*
     * Life Cover selection executes
     * onLifeCoverChange().
     *
     * Maturity Benefit and Death Benefit
     * can become visible only after this.
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
    value
  ) {

    await this.selectDropdown(
      this.maturityBenefit,
      value,
      'Maturity Benefit'
    );
  }


  // ==========================================================
  // DEATH BENEFIT BUSINESS RULE
  // ==========================================================

  getExpectedDeathBenefit(
    lifeCoverOption
  ) {

    const lifeCover =
      this.normalizeText(
        lifeCoverOption
      );


    if (
      lifeCover ===
      this.normalizeText(
        'Life Cover'
      )
    ) {

      return (
        'Life Cover-Lumpsum'
      );
    }


    if (
      lifeCover ===
      this.normalizeText(
        'Life Cover with In-built Accidental Death Benefit'
      )
    ) {

      return (
        'Life Cover with In-built ' +
        'Accidental Death Benefit-Lumpsum'
      );
    }


    throw new Error(
      `Unsupported Life Cover Option: ` +
      `"${lifeCoverOption}"`
    );
  }


  // ==========================================================
  // SELECT AND VERIFY DEATH BENEFIT
  // ==========================================================

  async selectDeathBenefit(
    lifeCoverOption,
    excelDeathBenefit
  ) {

    const expectedDeathBenefit =
      this.getExpectedDeathBenefit(
        lifeCoverOption
      );


    const excelValue =
      String(
        excelDeathBenefit || ''
      ).trim();


    /*
     * Verify Excel data follows the ASP
     * Life Cover / Death Benefit rule.
     */
    if (
      excelValue &&
      this.normalizeText(
        excelValue
      ) !==
      this.normalizeText(
        expectedDeathBenefit
      )
    ) {

      throw new Error(
        'Death Benefit does not match ' +
        'Life Cover Option business rule. ' +
        `Life Cover Option: "${lifeCoverOption}", ` +
        `Expected Death Benefit: ` +
        `"${expectedDeathBenefit}", ` +
        `Excel Death Benefit: ` +
        `"${excelValue}".`
      );
    }


    await this.selectDropdown(
      this.deathBenefit,
      expectedDeathBenefit,
      'Death Benefit'
    );


    console.log(
      'Life Cover / Death Benefit rule verified.'
    );


    console.log(
      `Life Cover Option: ` +
      `${lifeCoverOption}`
    );


    console.log(
      `Death Benefit: ` +
      `${expectedDeathBenefit}`
    );
  }


  // ==========================================================
  // POLICY TERM
  // ==========================================================

  async selectPolicyTerm(
    value
  ) {

    await expect(
      this.policyTerm
    ).toBeVisible({
      timeout: 60000
    });


    await this.selectDropdown(
      this.policyTerm,
      value,
      'Policy Term'
    );


    /*
     * Policy Term onchange executes:
     * LoadPPT(...)
     *
     * Premium Paying Term is therefore
     * dynamically refreshed.
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
    value
  ) {

    await this.selectDropdown(
      this.premiumPayingTerm,
      value,
      'Premium Paying Term'
    );
  }


  // ==========================================================
  // FILL COMPLETE PLAN DETAILS
  // ==========================================================

  async fillPlanDetails(
    planData
  ) {

    console.log(
      '===== Filling ASP Plan Details ====='
    );


    if (!planData) {

      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }


    // ========================================================
    // READ EXCEL DATA
    // ========================================================

    const investmentAmount =
      this.getRequiredValue(
        planData,
        'InvestmentAmount'
      );


    const paymentType =
      this.getRequiredValue(
        planData,
        'PaymentType'
      );


    const lifeCoverOption =
      this.getRequiredValue(
        planData,
        'LifeCover'
      );


    const maturityBenefit =
      this.getRequiredValue(
        planData,
        'MaturityBenefit'
      );


    const deathBenefit =
      String(
        planData.DeathBenefit || ''
      ).trim();


    const policyTerm =
      this.getRequiredValue(
        planData,
        'PolicyTerm'
      );


    const premiumPayingTerm =
      this.getRequiredValue(
        planData,
        'PremiumPayingTerm'
      );


    console.log(
      'ASP Plan Details Excel data:',
      {
        investmentAmount,
        paymentType,
        lifeCoverOption,
        maturityBenefit,
        deathBenefit,
        policyTerm,
        premiumPayingTerm
      }
    );


    // ========================================================
    // WAIT FOR PAGE
    // ========================================================

    await this.waitForPlanDetailsPage();


     // ========================================================
    // 1. PAYMENT TYPE
    // ========================================================

    await this.selectPaymentType(
      paymentType
    );

    // ========================================================
    // 2. INVESTMENT AMOUNT
    // ========================================================

    await this.enterInvestmentAmount(
      investmentAmount
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
      lifeCoverOption,
      deathBenefit
    );


    // ========================================================
    // 6. POLICY TERM
    // ========================================================

    await this.selectPolicyTerm(
      policyTerm
    );


    // ========================================================
    // 7. PREMIUM PAYING TERM
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
        `Payment Type changed unexpectedly. ` +
        `Expected: "${paymentType}", ` +
        `Actual: "${finalPaymentType}".`
      );
    }


    console.log(
      `Final Payment Type verified: ` +
      `${finalPaymentType}`
    );


    console.log(
      'ASP Plan Details completed successfully.'
    );
  }


  // ==========================================================
  // SUITABILITY ANALYSIS
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
}


module.exports = {
  PlanDetailsPage
};