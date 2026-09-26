const { expect } = require('@playwright/test');

class PlanDetailsPage {
  constructor(page) {
    this.page = page;

    // ========================================================
    // LIFE COVER
    // ========================================================

    this.lifeCoverContainer = page.locator(
      '#navHdr2_dsktp'
    );

    // ========================================================
    // PAYMENT TYPE
    // Same locator used in the previous plan
    // ========================================================

    this.paymentTypeContainer = page.locator(
      '#navHdr4_dsktp #lifecoverchoosing'
    );

    this.paymentTypeValue = page.locator(
      '#navHdr4_dsktp #paymenttypeval_dsktp'
    );

    this.paymentTypeOptions = page.locator(
      '#navHdr4_dsktp ' +
      '#navPaymentType_dsktp ' +
      'nav[id="PaymentType"]'
    );

    // ========================================================
    // INVESTMENT AMOUNT
    // ========================================================

    this.investmentAmount = page.locator(
      '#txtInvestment_dsktp'
    );

    // ========================================================
    // LIFE COVER OPTION
    // ========================================================

    this.lifeCoverOption = page.locator(
      '#SelLifeCoverOption_220'
    );

    // ========================================================
    // POLICY TERM SLAB
    // ========================================================

    this.policyTermSlab = page.locator(
      '#SelPolicyTermSlab_220'
    );

    // ========================================================
    // PREMIUM TERM SLAB
    // ========================================================

    this.premiumTermSlab = page.locator(
      '#SelPremTermSlab_220'
    );

    // ========================================================
    // DEATH BENEFIT
    // ========================================================

    this.deathBenefit = page.locator(
      '#SelDeathBenefit_220'
    );

    // ========================================================
    // MATURITY BENEFIT
    // ========================================================

    this.maturityBenefit = page.locator(
      '#SelMaturityBenefit_220'
    );

    // ========================================================
    // SURVIVAL BENEFIT
    // ========================================================

    this.survivalBenefit = page.locator(
      '#SelSurvivalBenefit_220'
    );

    // ========================================================
    // SURVIVAL BENEFIT PAYOUT MODE
    // ========================================================

    this.survivalBenefitPayoutMode = page.locator(
      '#SelSBPayoutMode_220'
    );

    // ========================================================
    // POLICY TERM
    // ========================================================

    this.policyTerm = page.locator(
      '#SelPolicyTerm_220'
    );

    // ========================================================
    // PREMIUM PAYING TERM
    // ========================================================

    this.premiumPayingTerm = page.locator(
      '#SelPayfor_220'
    );

    // ========================================================
    // SUITABILITY ANALYSIS
    // ========================================================

    this.suitabilityAnalysisButton = page
      .locator('button[id^="btnSuitability_"]')
      .first();

    // ========================================================
    // LOADERS
    // ========================================================

    this.loadingOverlay = page.locator(
      '#loading2'
    );

    this.fetchingDetailsText = page.getByText(
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
    return String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // ==========================================================
  // ESCAPE REGULAR EXPRESSION
  // ==========================================================

  escapeRegExp(value) {
    return String(value ?? '').replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }

  // ==========================================================
  // GET REQUIRED EXCEL VALUE
  // ==========================================================

  getRequiredValue(row, columnName) {
    const value = String(
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
  // WAIT FOR PLAN DETAILS PAGE
  // ==========================================================

  async waitForPlanDetailsPage() {
    console.log(
      'Waiting for Early Cash Plan Details page...'
    );

    await this.waitForLoadingToComplete();

    await expect(
      this.lifeCoverContainer
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
      'Early Cash Plan Details page displayed.'
    );
  }

    // ==========================================================
  // GET DROPDOWN OPTIONS
  // ==========================================================

  async getDropdownOptions(locator) {
    return locator
      .locator('option')
      .evaluateAll(options => {
        return options.map(option => ({
          label: String(
            option.textContent ?? ''
          )
            .replace(/\s+/g, ' ')
            .trim(),

          value: String(
            option.value ?? ''
          ).trim()
        }));
      });
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
      this.normalizeText(expectedValue);

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

        return options.some(option => {
          return (
            this.normalizeText(option.label) ===
              expected ||
            this.normalizeText(option.value) ===
              expected
          );
        });
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
    const expected = String(
      expectedValue ?? ''
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
      options.map(option => option.label)
    );

    const normalizedExpected =
      this.normalizeText(expected);

    const matchingOption =
      options.find(option => {
        return (
          this.normalizeText(option.label) ===
            normalizedExpected ||
          this.normalizeText(option.value) ===
            normalizedExpected
        );
      });

    if (!matchingOption) {
      throw new Error(
        `${fieldName} "${expected}" was not found. ` +
        'Available options: ' +
        options
          .map(option => option.label)
          .join(', ')
      );
    }

    if (matchingOption.value) {
      await locator.selectOption({
        value: matchingOption.value
      });
    } else {
      await locator.selectOption({
        label: matchingOption.label
      });
    }

    await expect(
      locator.locator('option:checked')
    ).toHaveText(
      matchingOption.label,
      {
        timeout: 30000
      }
    );

    console.log(
      `${fieldName} selected: ` +
      `${matchingOption.label}`
    );

    await this.waitForLoadingToComplete();
  }

  // ==========================================================
  // SELECT PAYMENT TYPE
  // ==========================================================

  async selectPaymentType(value) {
    const expectedValue = String(
      value ?? ''
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

    const currentValue = String(
      await this.paymentTypeValue.textContent()
    )
      .replace(/\s+/g, ' ')
      .trim();

    console.log(
      `Current Payment Type: ${currentValue}`
    );

    if (
      this.normalizeText(currentValue) ===
      this.normalizeText(expectedValue)
    ) {
      console.log(
        `Payment Type already selected: ` +
        `${currentValue}`
      );

      return;
    }

    await this.paymentTypeContainer
      .scrollIntoViewIfNeeded();

    await this.paymentTypeContainer.click();

    const matchingOption =
      this.paymentTypeOptions
        .filter({
          hasText: new RegExp(
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

    await matchingOption.click();

    await expect.poll(
      async () => {
        const selectedValue = String(
          await this.paymentTypeValue
            .textContent()
            .catch(() => '')
        );

        return this.normalizeText(
          selectedValue
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
      this.normalizeText(expectedValue)
    );

    console.log(
      `Payment Type selected: ${expectedValue}`
    );

    await this.waitForLoadingToComplete();
  }

    // ==========================================================
  // SELECT LIFE COVER OPTION
  // ==========================================================

  async selectLifeCoverOption(value) {
    await this.selectDropdown(
      this.lifeCoverOption,
      value,
      'Life Cover Option'
    );

    await expect(
      this.policyTermSlab
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.premiumTermSlab
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.deathBenefit
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.maturityBenefit
    ).toBeVisible({
      timeout: 60000
    });

    const selectedLifeCoverOption =
      this.normalizeText(value);

    if (
      selectedLifeCoverOption ===
      this.normalizeText('Early Cash')
    ) {
      await expect(
        this.survivalBenefit
      ).toBeVisible({
        timeout: 60000
      });

      console.log(
        'Early Cash selected. ' +
        'Survival Benefit displayed.'
      );
    } else if (
      selectedLifeCoverOption ===
      this.normalizeText('Super Growth')
    ) {
      await expect(
        this.survivalBenefit
      ).toBeHidden({
        timeout: 60000
      });

      await expect(
        this.survivalBenefitPayoutMode
      ).toBeHidden({
        timeout: 60000
      });

      console.log(
        'Super Growth selected. ' +
        'Survival Benefit fields are hidden.'
      );
    } else {
      throw new Error(
        `Unsupported Life Cover Option: ` +
        `"${value}".`
      );
    }
  }

  // ==========================================================
  // SELECT POLICY TERM SLAB
  // ==========================================================

  async selectPolicyTermSlab(value) {
    await this.selectDropdown(
      this.policyTermSlab,
      value,
      'Policy Term Slab'
    );
  }

  // ==========================================================
  // SELECT PREMIUM TERM SLAB
  // ==========================================================

  async selectPremiumTermSlab(value) {
    await this.selectDropdown(
      this.premiumTermSlab,
      value,
      'Premium Term Slab'
    );
  }

  // ==========================================================
  // SELECT AND VERIFY FIXED BENEFIT
  // ==========================================================

  async selectAndVerifyFixedBenefit(
    locator,
    excelValue,
    expectedValue,
    fieldName
  ) {
    if (
      this.normalizeText(excelValue) !==
      this.normalizeText(expectedValue)
    ) {
      throw new Error(
        `${fieldName} must be ` +
        `"${expectedValue}". ` +
        `Excel value: "${excelValue}".`
      );
    }

    await this.selectDropdown(
      locator,
      expectedValue,
      fieldName
    );
  }

  // ==========================================================
  // SELECT DEATH BENEFIT
  // ==========================================================

  async selectDeathBenefit(value) {
    await this.selectAndVerifyFixedBenefit(
      this.deathBenefit,
      value,
      'Death Sum Assured-Lumpsum',
      'Death Benefit'
    );
  }

  // ==========================================================
  // SELECT MATURITY BENEFIT
  // ==========================================================

  async selectMaturityBenefit(value) {
    await this.selectAndVerifyFixedBenefit(
      this.maturityBenefit,
      value,
      'Basic Sum Assured-Lumpsum',
      'Maturity Benefit'
    );
  }

  // ==========================================================
  // COMPLETE SURVIVAL BENEFIT
  // ==========================================================

  async completeSurvivalBenefit(
    lifeCoverOption,
    survivalBenefit,
    payoutMode
  ) {
    const selectedLifeCoverOption =
      this.normalizeText(
        lifeCoverOption
      );

    if (
      selectedLifeCoverOption ===
      this.normalizeText('Early Cash')
    ) {
      await this.selectDropdown(
        this.survivalBenefit,
        survivalBenefit,
        'Survival Benefit'
      );

      /*
       * Survival Benefit selection executes:
       * onSurvivalBenefitChange()
       *
       * Payout Mode becomes visible after this.
       */
      await expect(
        this.survivalBenefitPayoutMode
      ).toBeVisible({
        timeout: 60000
      });

      await this.selectDropdown(
        this.survivalBenefitPayoutMode,
        payoutMode,
        'Survival Benefit Payout Mode'
      );

      console.log(
        'Early Cash Survival Benefit ' +
        'completed successfully.'
      );

      return;
    }

    /*
     * Super Growth:
     * Survival Benefit and Payout Mode
     * must not be displayed.
     */
    await expect(
      this.survivalBenefit
    ).toBeHidden({
      timeout: 60000
    });

    await expect(
      this.survivalBenefitPayoutMode
    ).toBeHidden({
      timeout: 60000
    });

    console.log(
      'Super Growth Survival Benefit ' +
      'visibility rule verified.'
    );
  }

  // ==========================================================
  // SELECT POLICY TERM
  // ==========================================================

  async selectPolicyTerm(value) {
    await this.selectDropdown(
      this.policyTerm,
      value,
      'Policy Term'
    );

    /*
     * Policy Term onchange executes:
     * LoadPPT()
     *
     * Premium Paying Term options
     * are refreshed after this.
     */
    await expect(
      this.premiumPayingTerm
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Premium Paying Term displayed.'
    );
  }

  // ==========================================================
  // SELECT PREMIUM PAYING TERM
  // ==========================================================

  async selectPremiumPayingTerm(value) {
    await this.selectDropdown(
      this.premiumPayingTerm,
      value,
      'Premium Paying Term'
    );
  }

    // ==========================================================
  // FILL COMPLETE PLAN DETAILS
  // ==========================================================

  async fillPlanDetails(planData) {
    console.log(
      '===== Filling Early Cash Plan Details ====='
    );

    if (!planData) {
      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }

    // ========================================================
    // READ EXCEL DATA
    // ========================================================

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

    const maturityBenefit =
      this.getRequiredValue(
        planData,
        'MaturityBenefit'
      );

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

    const survivalBenefit = String(
      planData.SurvivalBenefit ?? ''
    ).trim();

    const survivalBenefitPayoutMode =
      String(
        planData
          .SurvivalBenefitPayoutMode ?? ''
      ).trim();

    // ========================================================
    // VALIDATE CONDITIONAL EXCEL DATA
    // ========================================================

    if (
      this.normalizeText(
        lifeCoverOption
      ) ===
      this.normalizeText(
        'Early Cash'
      )
    ) {
      if (!survivalBenefit) {
        throw new Error(
          'SurvivalBenefit is required when ' +
          'LifeCoverOption is Early Cash.'
        );
      }

      if (!survivalBenefitPayoutMode) {
        throw new Error(
          'SurvivalBenefitPayoutMode is required ' +
          'when LifeCoverOption is Early Cash.'
        );
      }
    }

    console.log(
      'Early Cash Plan Details Excel data:',
      {
        paymentType,
        lifeCoverOption,
        policyTermSlab,
        premiumTermSlab,
        deathBenefit,
        maturityBenefit,
        survivalBenefit,
        survivalBenefitPayoutMode,
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
    // 2. LIFE COVER OPTION
    // ========================================================

    await this.selectLifeCoverOption(
      lifeCoverOption
    );

    // ========================================================
    // 3. POLICY TERM SLAB
    // ========================================================

    await this.selectPolicyTermSlab(
      policyTermSlab
    );

    // ========================================================
    // 4. PREMIUM TERM SLAB
    // ========================================================

    await this.selectPremiumTermSlab(
      premiumTermSlab
    );

    // ========================================================
    // 5. DEATH BENEFIT
    // ========================================================

    await this.selectDeathBenefit(
      deathBenefit
    );

    // ========================================================
    // 6. MATURITY BENEFIT
    // ========================================================

    await this.selectMaturityBenefit(
      maturityBenefit
    );

    // ========================================================
    // 7. SURVIVAL BENEFIT
    // Conditional: Early Cash only
    // ========================================================

    await this.completeSurvivalBenefit(
      lifeCoverOption,
      survivalBenefit,
      survivalBenefitPayoutMode
    );

    // ========================================================
    // 8. POLICY TERM
    // ========================================================

    await this.selectPolicyTerm(
      policyTerm
    );

    // ========================================================
    // 9. PREMIUM PAYING TERM
    // ========================================================

    await this.selectPremiumPayingTerm(
      premiumPayingTerm
    );

    // ========================================================
    // FINAL PAYMENT TYPE VERIFICATION
    // ========================================================

    const finalPaymentType = String(
      await this.paymentTypeValue.textContent()
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

    console.log(
      'Early Cash Plan Details ' +
      'completed successfully.'
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
}

module.exports = {
  PlanDetailsPage
};