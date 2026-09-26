const { expect } = require('@playwright/test');

class PlanDetailsPage {
  constructor(page) {
    this.page = page;

    // ============================================================
    // LIFE COVER AMOUNT
    // ============================================================

    this.lifeCoverContainer = page.locator(
      '#lifecoverchoosing_dsktp'
    );

    this.lifeCoverValue = page.locator(
      '#lifecoverval_dsktp'
    );

    // ============================================================
    // PAYMENT TYPE
    // ============================================================

    this.paymentTypeContainer = page.locator(
      '#navHdr4_dsktp #lifecoverchoosing'
    );

    this.paymentTypeValue = page.locator(
      '#paymenttypeval_dsktp'
    );

    // ============================================================
    // LIFE COVER OPTION
    // ============================================================

    this.lifeCoverOption = page.locator(
      '#SelLifeCoverOption_194'
    );

    // ============================================================
    // LIFE COVER SUB OPTION
    // ============================================================

    this.lifeCoverSubOption = page.locator(
      '#SelLifeCoverSubOption_194'
    );

    // ============================================================
    // POLICY TERM SLAB
    // ============================================================

    this.policyTermSlab = page.locator(
      '#SelPolicyTermSlab_194'
    );

    // ============================================================
    // PREMIUM TERM SLAB
    // ============================================================

    this.premiumTermSlab = page.locator(
      '#SelPremTermSlab_194'
    );

    // ============================================================
    // DEATH BENEFIT
    // ============================================================

    this.deathBenefit = page.locator(
      '#SelDeathBenefit_194'
    );

    // ============================================================
    // DEATH LIFE GOAL
    // ============================================================

    this.deathLifeGoal = page.locator(
      '#SelDeathLifeGoal_194'
    );

    // ============================================================
    // PAYOUT INCREASE TYPE
    // ============================================================

    this.payoutIncType = page.locator(
      '#SelPayoutIncType_194'
    );

    // ============================================================
    // PAYOUT INCREASE VALUE
    // ============================================================

    this.payoutIncValue = page.locator(
      '#SelPayoutIncValue_194'
    );

    // ============================================================
    // POLICY TERM
    // ============================================================

    this.policyTerm = page.locator(
      '#SelPolicyTerm_194'
    );

    // ============================================================
    // PREMIUM PAYING TERM
    // ============================================================

    this.premiumPayingTerm = page.locator(
      '#SelPayfor_194'
    );

    // ============================================================
    // PAYOUT RETIRE AGE
    // ============================================================

    this.payoutRetireAge = page.locator(
      '#SelPayoutRetireAge_194'
    );

    // ============================================================
    // RIDERS
    // ============================================================

    this.familyIncomeBenefitRider = page.locator(
      '#ChkBxAddons_1_194'
    );

    this.criticalIllnessWomanRider = page.locator(
      '#ChkBxAddons_2_194'
    );

    this.criticalIllnessPlusRider = page.locator(
      '#ChkBxAddons_3_194'
    );

    // ============================================================
    // SUITABILITY ANALYSIS
    // User confirmed this locator does not change
    // ============================================================

    this.suitabilityAnalysisButton = page
      .locator('button[id^="btnSuitability_"]')
      .first();

    // ============================================================
    // BUY NOW
    // User confirmed Buy Now locator does not change
    // ============================================================

    this.buyNowButton = page
      .getByText('Buy Now', {
        exact: true
      })
      .last();

    // ============================================================
    // LOADING
    // ============================================================

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

  // ============================================================
  // NORMALIZE TEXT
  // ============================================================

  normalizeText(value) {
    return String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // ============================================================
  // ESCAPE REGEX
  // ============================================================

  escapeRegExp(value) {
    return String(value ?? '').replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }

  // ============================================================
  // REQUIRED EXCEL VALUE
  // ============================================================

  getRequiredValue(row, columnName) {
    const value = String(
      row?.[columnName] ?? ''
    ).trim();

    if (!value) {
      throw new Error(
        `${columnName} is missing in PlanDetails Excel sheet.`
      );
    }

    return value;
  }

  // ============================================================
  // OPTIONAL EXCEL VALUE
  // ============================================================

  getOptionalValue(row, columnName) {
    return String(
      row?.[columnName] ?? ''
    ).trim();
  }

  // ============================================================
  // WAIT FOR LOADER
  // ============================================================

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

  // ============================================================
  // WAIT FOR PLAN DETAILS PAGE
  // ============================================================

  async waitForPlanDetailsPage() {

    console.log(
      'Waiting for Flexi Shield Plan Details page...'
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
      'Flexi Shield Plan Details page displayed.'
    );
  }

    // ============================================================
  // GET NORMAL HTML DROPDOWN OPTIONS
  // ============================================================

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

  // ============================================================
  // WAIT FOR DROPDOWN OPTION
  // ============================================================

  async waitForDropdownOption(
    locator,
    expectedValue,
    fieldName
  ) {

    const expected =
      this.normalizeText(expectedValue);

    console.log(
      `Waiting for ${fieldName} option: "${expectedValue}"`
    );

    await expect.poll(
      async () => {

        const options =
          await this.getDropdownOptions(locator);

        return options.some(option =>
          this.normalizeText(option.label) === expected ||
          this.normalizeText(option.value) === expected
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
          `${fieldName} option "${expectedValue}" ` +
          `was not loaded.`
      }

    ).toBeTruthy();
  }

  // ============================================================
  // SELECT NORMAL HTML DROPDOWN
  // ============================================================

  async selectDropdown(
    locator,
    expectedValue,
    fieldName
  ) {

    const expected =
      String(expectedValue ?? '').trim();

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
      await this.getDropdownOptions(locator);

    console.log(
      `${fieldName} available options:`,
      options.map(option => option.label)
    );

    const normalizedExpected =
      this.normalizeText(expected);

    const matchingOption =
      options.find(option =>
        this.normalizeText(option.label) ===
          normalizedExpected ||

        this.normalizeText(option.value) ===
          normalizedExpected
      );

    if (!matchingOption) {

      throw new Error(
        `${fieldName} "${expected}" was not found. ` +
        `Available options: ` +
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

  // ============================================================
  // SELECT LIFE COVER AMOUNT
  // ============================================================

  async selectLifeCoverAmount(value) {

    const expectedValue =
      String(value ?? '').trim();

    if (!expectedValue) {

      throw new Error(
        'LifeCover is missing in PlanDetails Excel sheet.'
      );
    }

    await expect(
      this.lifeCoverContainer
    ).toBeVisible({
      timeout: 60000
    });

    await this.lifeCoverContainer
      .scrollIntoViewIfNeeded();

    const currentValue =
      String(
        await this.lifeCoverValue
          .textContent()
          .catch(() => '')
      )
        .replace(/\s+/g, ' ')
        .trim();

    console.log(
      `Current Life Cover: ${currentValue}`
    );

    if (
      this.normalizeText(currentValue) ===
      this.normalizeText(expectedValue)
    ) {

      console.log(
        `Life Cover already selected: ${currentValue}`
      );

      return;
    }

    await this.lifeCoverContainer.click();

    console.log(
      `Selecting Life Cover: ${expectedValue}`
    );

    /*
     * The supplied HTML contains the container and
     * selected-value span, but not the HTML of the
     * opened Life Cover option list.
     *
     * Therefore select the visible exact option text.
     */

    const matchingOption =
      this.page
        .getByText(
          expectedValue,
          {
            exact: true
          }
        )
        .last();

    await expect(
      matchingOption
    ).toBeVisible({
      timeout: 30000
    });

    await matchingOption.click();

    await expect.poll(
      async () => {

        const selected =
          String(
            await this.lifeCoverValue
              .textContent()
              .catch(() => '')
          )
            .replace(/\s+/g, ' ')
            .trim();

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
        ]
      }

    ).toBe(
      this.normalizeText(
        expectedValue
      )
    );

    console.log(
      `Life Cover selected: ${expectedValue}`
    );

    await this.waitForLoadingToComplete();
  }

  // ============================================================
  // SELECT PAYMENT TYPE
  // ============================================================

  async selectPaymentType(value) {

    const expectedValue =
      String(value ?? '').trim();

    if (!expectedValue) {

      throw new Error(
        'PaymentType is missing in PlanDetails Excel sheet.'
      );
    }

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
          .catch(() => '')
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
        `Payment Type already selected: ${currentValue}`
      );

      return;
    }

    await this.paymentTypeContainer
      .scrollIntoViewIfNeeded();

    await this.paymentTypeContainer.click();

    /*
     * Try the known payment navigation first.
     */

    const knownOption =
      this.page
        .locator(
          '#navPaymentType_dsktp nav[id="PaymentType"]'
        )
        .filter({
          hasText: new RegExp(
            `^\\s*${this.escapeRegExp(
              expectedValue
            )}\\s*$`,
            'i'
          )
        })
        .first();

    if (
      await knownOption.count()
    ) {

      await expect(
        knownOption
      ).toBeVisible({
        timeout: 30000
      });

      await knownOption.click();

    } else {

      /*
       * Fallback if the Payment Type menu
       * has a different internal structure.
       */

      const genericOption =
        this.page
          .getByText(
            expectedValue,
            {
              exact: true
            }
          )
          .last();

      await expect(
        genericOption
      ).toBeVisible({
        timeout: 30000
      });

      await genericOption.click();
    }

    await expect.poll(
      async () => {

        const selected =
          String(
            await this.paymentTypeValue
              .textContent()
              .catch(() => '')
          );

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
        ]
      }

    ).toBe(
      this.normalizeText(
        expectedValue
      )
    );

    console.log(
      `Payment Type selected: ${expectedValue}`
    );

    await this.waitForLoadingToComplete();
  }

  // ============================================================
  // LIFE COVER OPTION
  // ============================================================

  async selectLifeCoverOption(value) {

    await this.selectDropdown(
      this.lifeCoverOption,
      value,
      'Life Cover Option'
    );
  }

  // ============================================================
  // LIFE COVER SUB OPTION
  // ============================================================

  async selectLifeCoverSubOption(value) {

    await this.selectDropdown(
      this.lifeCoverSubOption,
      value,
      'Life Cover SubOption'
    );
  }

  // ============================================================
  // POLICY TERM SLAB
  // ============================================================

  async selectPolicyTermSlab(value) {

    await this.selectDropdown(
      this.policyTermSlab,
      value,
      'Policy Term Slab'
    );
  }

  // ============================================================
  // PREMIUM TERM SLAB
  // ============================================================

  async selectPremiumTermSlab(value) {

    await this.selectDropdown(
      this.premiumTermSlab,
      value,
      'Premium Term Slab'
    );
  }

  // ============================================================
  // DEATH BENEFIT
  // ============================================================

  async selectDeathBenefit(value) {

    await this.selectDropdown(
      this.deathBenefit,
      value,
      'Death Benefit'
    );
  }

  // ============================================================
  // DEATH LIFE GOAL
  // ============================================================

  async selectDeathLifeGoal(value) {

    await this.selectDropdown(
      this.deathLifeGoal,
      value,
      'Death Life Goal'
    );
  }

  // ============================================================
  // PAYOUT INC TYPE
  // ============================================================

  async selectPayoutIncType(value) {

    await this.selectDropdown(
      this.payoutIncType,
      value,
      'Payout Inc Type'
    );
  }

  // ============================================================
  // PAYOUT INC VALUE
  // ============================================================

  async selectPayoutIncValue(value) {

    await this.selectDropdown(
      this.payoutIncValue,
      value,
      'Payout Inc Value'
    );
  }

  // ============================================================
  // PAYOUT RETIRE AGE
  // ============================================================

  async selectPayoutRetireAge(value) {

    await this.selectDropdown(
      this.payoutRetireAge,
      value,
      'Payout Retire Age'
    );
  }

  // ============================================================
  // POLICY TERM
  // ============================================================

  async selectPolicyTerm(value) {

    await this.selectDropdown(
      this.policyTerm,
      value,
      'Policy Term'
    );

    /*
     * Policy Term onchange:
     *
     * LoadPPT(
     *   this,
     *   'SelPayfor_194',
     *   '194'
     * )
     *
     * Therefore wait for Premium Paying Term
     * before selecting it.
     */

    await expect(
      this.premiumPayingTerm
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Premium Paying Term displayed after Policy Term selection.'
    );
  }

  // ============================================================
  // PREMIUM PAYING TERM
  // ============================================================

  async selectPremiumPayingTerm(value) {

    await this.selectDropdown(
      this.premiumPayingTerm,
      value,
      'Premium Paying Term'
    );
  }

    // ============================================================
  // VERIFY VISIBLE
  // ============================================================

  async verifyVisible(
    locator,
    fieldName
  ) {

    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      `${fieldName} is visible.`
    );
  }

  // ============================================================
  // VERIFY HIDDEN
  // ============================================================

  async verifyHidden(
    locator,
    fieldName
  ) {

    await expect(
      locator
    ).toBeHidden({
      timeout: 60000
    });

    console.log(
      `${fieldName} is hidden.`
    );
  }

  // ============================================================
  // SHIELD + LEVEL COVER
  // ============================================================

  async handleShieldLevelCover(
    planData
  ) {

    console.log(
      '===== Condition: Shield + Level Cover ====='
    );

    /*
     * Screenshot:
     *
     * Death Benefit
     * Death Life Goal
     *
     * Payout fields are not displayed.
     */

    await this.verifyVisible(
      this.deathBenefit,
      'Death Benefit'
    );

    await this.verifyVisible(
      this.deathLifeGoal,
      'Death Life Goal'
    );

    await this.verifyHidden(
      this.payoutIncType,
      'Payout Inc Type'
    );

    await this.verifyHidden(
      this.payoutIncValue,
      'Payout Inc Value'
    );

    await this.verifyHidden(
      this.payoutRetireAge,
      'Payout Retire Age'
    );

    await this.selectDeathBenefit(
      this.getRequiredValue(
        planData,
        'DeathBenefit'
      )
    );

    await this.selectDeathLifeGoal(
      this.getRequiredValue(
        planData,
        'DeathLifeGoal'
      )
    );
  }

  // ============================================================
  // SHIELD + INCREASING COVER
  // ============================================================

  async handleShieldIncreasingCover(
    planData
  ) {

    console.log(
      '===== Condition: Shield + Increasing Cover ====='
    );

    /*
     * Screenshot:
     *
     * Death Benefit
     * Payout Inc Type
     * Payout Inc Value
     *
     * Death Life Goal is not displayed.
     */

    await this.verifyVisible(
      this.deathBenefit,
      'Death Benefit'
    );

    await this.verifyHidden(
      this.deathLifeGoal,
      'Death Life Goal'
    );

    await this.verifyVisible(
      this.payoutIncType,
      'Payout Inc Type'
    );

    await this.verifyVisible(
      this.payoutIncValue,
      'Payout Inc Value'
    );

    await this.verifyHidden(
      this.payoutRetireAge,
      'Payout Retire Age'
    );

    await this.selectDeathBenefit(
      this.getRequiredValue(
        planData,
        'DeathBenefit'
      )
    );

    await this.selectPayoutIncType(
      this.getRequiredValue(
        planData,
        'PayoutIncType'
      )
    );

    await this.selectPayoutIncValue(
      this.getRequiredValue(
        planData,
        'PayoutIncValue'
      )
    );
  }

  // ============================================================
  // SHIELD + DECREASING COVER
  // ============================================================

  async handleShieldDecreasingCover(
    planData
  ) {

    console.log(
      '===== Condition: Shield + Decreasing Cover ====='
    );

    /*
     * Screenshot:
     *
     * Death Benefit
     * Payout Inc Type
     * Payout Inc Value
     * Payout Retire Age
     *
     * Death Life Goal is not displayed.
     */

    await this.verifyVisible(
      this.deathBenefit,
      'Death Benefit'
    );

    await this.verifyHidden(
      this.deathLifeGoal,
      'Death Life Goal'
    );

    await this.verifyVisible(
      this.payoutIncType,
      'Payout Inc Type'
    );

    await this.verifyVisible(
      this.payoutIncValue,
      'Payout Inc Value'
    );

    await this.verifyVisible(
      this.payoutRetireAge,
      'Payout Retire Age'
    );

    await this.selectDeathBenefit(
      this.getRequiredValue(
        planData,
        'DeathBenefit'
      )
    );

    await this.selectPayoutIncType(
      this.getRequiredValue(
        planData,
        'PayoutIncType'
      )
    );

    await this.selectPayoutIncValue(
      this.getRequiredValue(
        planData,
        'PayoutIncValue'
      )
    );

    await this.selectPayoutRetireAge(
      this.getRequiredValue(
        planData,
        'PayoutRetireAge'
      )
    );
  }

  // ============================================================
  // LIFE STAGE SHIELD
  // ============================================================

  async handleLifeStageShield(
    planData
  ) {

    console.log(
      '===== Condition: Life Stage Shield ====='
    );

    /*
     * Screenshot:
     *
     * Life Cover Option
     * Policy Term Slab
     * Premium Term Slab
     * Death Benefit
     * Payout Inc Type
     * Payout Inc Value
     *
     * Life Cover SubOption is not displayed.
     * Death Life Goal is not displayed.
     */

    await this.verifyHidden(
      this.lifeCoverSubOption,
      'Life Cover SubOption'
    );

    await this.verifyHidden(
      this.deathLifeGoal,
      'Death Life Goal'
    );

    await this.verifyVisible(
      this.policyTermSlab,
      'Policy Term Slab'
    );

    await this.verifyVisible(
      this.premiumTermSlab,
      'Premium Term Slab'
    );

    await this.verifyVisible(
      this.deathBenefit,
      'Death Benefit'
    );

    await this.verifyVisible(
      this.payoutIncType,
      'Payout Inc Type'
    );

    await this.verifyVisible(
      this.payoutIncValue,
      'Payout Inc Value'
    );

    await this.verifyHidden(
      this.payoutRetireAge,
      'Payout Retire Age'
    );

    await this.selectPolicyTermSlab(
      this.getRequiredValue(
        planData,
        'PolicyTermSlab'
      )
    );

    await this.selectPremiumTermSlab(
      this.getRequiredValue(
        planData,
        'PremiumTermSlab'
      )
    );

    await this.selectDeathBenefit(
      this.getRequiredValue(
        planData,
        'DeathBenefit'
      )
    );

    await this.selectPayoutIncType(
      this.getRequiredValue(
        planData,
        'PayoutIncType'
      )
    );

    await this.selectPayoutIncValue(
      this.getRequiredValue(
        planData,
        'PayoutIncValue'
      )
    );
  }

  // ============================================================
  // SMART SHIELD
  // ============================================================

  async handleSmartShield(
    planData
  ) {

    console.log(
      '===== Condition: Smart Shield ====='
    );

    /*
     * Screenshot:
     *
     * Life Cover Option
     * Policy Term Slab
     * Premium Term Slab
     * Death Benefit
     *
     * No:
     * Life Cover SubOption
     * Death Life Goal
     * Payout Inc Type
     * Payout Inc Value
     * Payout Retire Age
     */

    await this.verifyHidden(
      this.lifeCoverSubOption,
      'Life Cover SubOption'
    );

    await this.verifyHidden(
      this.deathLifeGoal,
      'Death Life Goal'
    );

    await this.verifyHidden(
      this.payoutIncType,
      'Payout Inc Type'
    );

    await this.verifyHidden(
      this.payoutIncValue,
      'Payout Inc Value'
    );

    await this.verifyHidden(
      this.payoutRetireAge,
      'Payout Retire Age'
    );

    await this.verifyVisible(
      this.policyTermSlab,
      'Policy Term Slab'
    );

    await this.verifyVisible(
      this.premiumTermSlab,
      'Premium Term Slab'
    );

    await this.verifyVisible(
      this.deathBenefit,
      'Death Benefit'
    );

    await this.selectPolicyTermSlab(
      this.getRequiredValue(
        planData,
        'PolicyTermSlab'
      )
    );

    await this.selectPremiumTermSlab(
      this.getRequiredValue(
        planData,
        'PremiumTermSlab'
      )
    );

    await this.selectDeathBenefit(
      this.getRequiredValue(
        planData,
        'DeathBenefit'
      )
    );
  }

    // ============================================================
  // SET RIDER CHECKBOX
  // ============================================================

  async setCheckbox(
    locator,
    expectedValue,
    fieldName
  ) {

    const expected =
      this.normalizeText(
        expectedValue
      );

    if (
      expected !== 'yes' &&
      expected !== 'no'
    ) {

      throw new Error(
        `${fieldName} must be Yes or No. ` +
        `Excel value: "${expectedValue}"`
      );
    }

    const shouldBeChecked =
      expected === 'yes';

    await expect(
      locator
    ).toBeAttached({
      timeout: 60000
    });

    /*
     * Some insurance applications use a hidden
     * checkbox input with a custom visual checkbox.
     * force:true allows Playwright to operate on
     * the actual supplied checkbox ID.
     */

    if (shouldBeChecked) {

      await locator.check({
        force: true
      });

    } else {

      await locator.uncheck({
        force: true
      });
    }

    await expect(
      locator
    ).toBeChecked({
      checked: shouldBeChecked
    });

    console.log(
      `${fieldName}: ` +
      `${shouldBeChecked ? 'Yes' : 'No'}`
    );
  }

  // ============================================================
  // HANDLE RIDERS
  // ============================================================

  async handleRiders(
    planData
  ) {

    console.log(
      '===== Selecting Riders ====='
    );

    await this.setCheckbox(
      this.familyIncomeBenefitRider,

      this.getRequiredValue(
        planData,
        'FamilyIncomeBenefitRider'
      ),

      'Shriram Family Income Benefit Rider V04'
    );

    await this.setCheckbox(
      this.criticalIllnessWomanRider,

      this.getRequiredValue(
        planData,
        'CriticalIllnessWomanRider'
      ),

      'Shriram Life Critical Illness Woman Rider'
    );

    await this.setCheckbox(
      this.criticalIllnessPlusRider,

      this.getRequiredValue(
        planData,
        'CriticalIllnessPlusRider'
      ),

      'Shriram Life Critical Illness Plus Rider V02'
    );

    console.log(
      'Riders completed successfully.'
    );
  }

  // ============================================================
  // COMPLETE FLEXI SHIELD PLAN DETAILS
  // ============================================================

  async fillPlanDetails(
    planData
  ) {

    console.log(
      '================================================'
    );

    console.log(
      '===== Filling Flexi Shield Plan Details ====='
    );

    console.log(
      '================================================'
    );

    if (!planData) {

      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }

    // ==========================================================
    // READ EXCEL VALUES
    // ==========================================================

    const lifeCover =
      this.getRequiredValue(
        planData,
        'LifeCover'
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

    const lifeCoverSub =
      this.getOptionalValue(
        planData,
        'LifeCoverSub'
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

    // ==========================================================
    // LOG EXCEL DATA
    // ==========================================================

    console.log(
      'Flexi Shield Plan Details Excel data:'
    );

    console.log({
      lifeCover,
      paymentType,
      lifeCoverOption,
      lifeCoverSub,

      policyTermSlab:
        this.getOptionalValue(
          planData,
          'PolicyTermSlab'
        ),

      premiumTermSlab:
        this.getOptionalValue(
          planData,
          'PremiumTermSlab'
        ),

      deathBenefit:
        this.getOptionalValue(
          planData,
          'DeathBenefit'
        ),

      deathLifeGoal:
        this.getOptionalValue(
          planData,
          'DeathLifeGoal'
        ),

      payoutIncType:
        this.getOptionalValue(
          planData,
          'PayoutIncType'
        ),

      payoutIncValue:
        this.getOptionalValue(
          planData,
          'PayoutIncValue'
        ),

      payoutRetireAge:
        this.getOptionalValue(
          planData,
          'PayoutRetireAge'
        ),

      policyTerm,
      premiumPayingTerm
    });

    // ==========================================================
    // WAIT FOR PLAN DETAILS PAGE
    // ==========================================================

    await this.waitForPlanDetailsPage();

    // ==========================================================
    // 1. LIFE COVER AMOUNT
    // ==========================================================

    console.log(
      'STEP 1: Selecting Life Cover'
    );

    await this.selectLifeCoverAmount(
      lifeCover
    );

    // ==========================================================
    // 2. PAYMENT TYPE
    // ==========================================================

    console.log(
      'STEP 2: Selecting Payment Type'
    );

    await this.selectPaymentType(
      paymentType
    );

    // ==========================================================
    // 3. LIFE COVER OPTION
    // ==========================================================

    console.log(
      'STEP 3: Selecting Life Cover Option'
    );

    await this.selectLifeCoverOption(
      lifeCoverOption
    );

    const normalizedOption =
      this.normalizeText(
        lifeCoverOption
      );

    // ==========================================================
    // 4. CONDITIONAL PLAN LOGIC
    // ==========================================================

    // ----------------------------------------------------------
    // SHIELD
    // ----------------------------------------------------------

    if (
      normalizedOption ===
      this.normalizeText('Shield')
    ) {

      if (!lifeCoverSub) {

        throw new Error(
          'LifeCoverSub is required when ' +
          'LifeCoverOption is Shield.'
        );
      }

      console.log(
        `Shield SubOption: ${lifeCoverSub}`
      );

      // Select Level / Increasing / Decreasing
      await this.selectLifeCoverSubOption(
        lifeCoverSub
      );

      const normalizedSub =
        this.normalizeText(
          lifeCoverSub
        );

      // --------------------------------------------------------
      // POLICY TERM SLAB
      // --------------------------------------------------------

      await this.selectPolicyTermSlab(
        this.getRequiredValue(
          planData,
          'PolicyTermSlab'
        )
      );

      // --------------------------------------------------------
      // PREMIUM TERM SLAB
      // --------------------------------------------------------

      await this.selectPremiumTermSlab(
        this.getRequiredValue(
          planData,
          'PremiumTermSlab'
        )
      );

      // --------------------------------------------------------
      // LEVEL COVER
      // --------------------------------------------------------

      if (
        normalizedSub ===
        this.normalizeText('Level Cover')
      ) {

        await this.handleShieldLevelCover(
          planData
        );

      }

      // --------------------------------------------------------
      // INCREASING COVER
      // --------------------------------------------------------

      else if (
        normalizedSub ===
        this.normalizeText('Increasing cover')
      ) {

        await this.handleShieldIncreasingCover(
          planData
        );

      }

      // --------------------------------------------------------
      // DECREASING COVER
      // --------------------------------------------------------

      else if (
        normalizedSub ===
        this.normalizeText('Decreasing cover')
      ) {

        await this.handleShieldDecreasingCover(
          planData
        );

      }

      else {

        throw new Error(
          `Unsupported Shield LifeCoverSub: "${lifeCoverSub}"`
        );
      }
    }

    // ==========================================================
    // LIFE STAGE SHIELD
    // ==========================================================

    else if (
      normalizedOption ===
      this.normalizeText('Life Stage Shield')
    ) {

      await this.handleLifeStageShield(
        planData
      );
    }

    // ==========================================================
    // SMART SHIELD
    // ==========================================================

    else if (
      normalizedOption ===
      this.normalizeText('Smart Shield')
    ) {

      await this.handleSmartShield(
        planData
      );
    }

    // ==========================================================
    // INVALID OPTION
    // ==========================================================

    else {

      throw new Error(
        `Unsupported Life Cover Option: "${lifeCoverOption}"`
      );
    }

    // ==========================================================
    // 5. POLICY TERM
    // ==========================================================

    console.log(
      'STEP 5: Selecting Policy Term'
    );

    await this.selectPolicyTerm(
      policyTerm
    );

    // ==========================================================
    // 6. PREMIUM PAYING TERM
    // ==========================================================

    console.log(
      'STEP 6: Selecting Premium Paying Term'
    );

    await this.selectPremiumPayingTerm(
      premiumPayingTerm
    );

    // ==========================================================
    // 7. RIDERS
    // ==========================================================

    console.log(
      'STEP 7: Selecting Riders'
    );

    await this.handleRiders(
      planData
    );

    // ==========================================================
    // FINAL PAYMENT TYPE VERIFICATION
    // ==========================================================

    const finalPaymentType =
      String(
        await this.paymentTypeValue
          .textContent()
          .catch(() => '')
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
      `Final Payment Type verified: ${finalPaymentType}`
    );

    console.log(
      '================================================'
    );

    console.log(
      'Flexi Shield Plan Details completed successfully.'
    );

    console.log(
      '================================================'
    );
  }

    // ============================================================
  // CLICK SUITABILITY ANALYSIS
  // ============================================================

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

    /*
     * User confirmed Suitability Analysis
     * locator does not change.
     *
     * Existing modal locator retained.
     */

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
  // CLICK BUY NOW
  // ============================================================

  async clickBuyNow() {

    console.log(
      'Clicking Buy Now...'
    );

    await expect(
      this.buyNowButton
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.buyNowButton
    ).toBeEnabled({
      timeout: 60000
    });

    await this.buyNowButton
      .scrollIntoViewIfNeeded();

    await this.buyNowButton
      .click();

    console.log(
      'Buy Now clicked successfully.'
    );
  }
}

// ============================================================
// COMMONJS EXPORT
// ============================================================

module.exports = PlanDetailsPage;