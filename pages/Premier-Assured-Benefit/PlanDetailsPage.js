const { expect } = require('@playwright/test');

class PlanDetailsPage {
  constructor(page) {
    this.page = page;

    this.investmentAmount = page.locator(
      '#txtInvestment_dsktp'
    );

      /*
    * PAB Payment Type section.
    *
    * The application contains duplicate IDs.
    * Scope the locator to the PAB desktop section.
    */
    this.paymentTypeSection = page.locator(
      '#navHdr4_dsktp'
    );

    this.paymentTypeContainer =
      this.paymentTypeSection.locator(
        '#lifecoverchoosing'
      );

    this.paymentTypeValue =
      this.paymentTypeSection.locator(
        '#paymenttypeval_dsktp'
      );

    this.lifeCover = page.locator(
      '#SelLifeCoverOption_209'
    );

    this.maturityBenefit = page.locator(
      '#SelMaturityBenefit_209'
    );

    this.maturityPayoutMode = page.locator(
      '#SelMatPayoutMode_209'
    );

    this.maturityPayoutPeriod = page.locator(
      '#SelMatPayoutPeriod_209'
    );

    this.deathBenefit = page.locator(
      '#SelDeathBenefit_209'
    );

    this.deathPayoutMode = page.locator(
      '#SelPayoutMode_209'
    );

    this.policyTerm = page.locator(
      '#SelPolicyTerm_209'
    );

    this.premiumPayingTerm = page.locator(
      '#SelPayfor_209'
    );

    // =========================================================
    // RIDER LOCATORS
    // =========================================================

    this.familyIncomeBenefitRider =
        page.locator('#ChkBxAddons_1_209');

    this.extraInsuranceCoverRider =
        page.locator('#ChkBxAddons_2_209');

    this.criticalIllnessWomanRider =
        page.locator('#ChkBxAddons_3_209');

    this.criticalIllnessPlusRider =
        page.locator('#ChkBxAddons_4_209');

    this.stepUpRider =
        page.locator('#ChkBxAddons_5_209');

    this.buyNowButton = page.locator(
      '#btnBuyNow_209'
    );

    this.suitabilityAnalysisButton = page.getByRole(
      'button',
    {
      name: 'Suitability Analysis',
      exact: true
    }
  );

    this.loadingOverlay = page.locator(
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

  getRequiredValue(row, columnName) {
    const value = String(
      row?.[columnName] ?? ''
    ).trim();

    if (!value) {
      throw new Error(
        `${columnName} is missing in ` +
        'the PlanDetails Excel sheet.'
      );
    }

    return value;
  }

  normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  async waitForLoadingToComplete() {
    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(() => false);

    if (overlayVisible) {
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
      await this.fetchingDetailsText.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }
  }

  async waitForPlanDetailsPage() {
    console.log(
      'Waiting for PAB Plan Details page...'
    );

    await expect(
      this.investmentAmount
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.lifeCover
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.buyNowButton
    ).toBeVisible({
      timeout: 120000
    });

    await this.waitForLoadingToComplete();

    console.log(
      'PAB Plan Details page loaded.'
    );
  }

  async getDropdownOptions(locator) {
    return locator
      .locator('option')
      .evaluateAll(options => {
        return options.map(option => ({
          label: String(
            option.textContent || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),

          value: String(
            option.value || ''
          ).trim()
        }));
      })
      .catch(() => []);
  }

  async waitForDropdownOption(
    locator,
    expectedValue,
    fieldName
  ) {
    const expected =
      this.normalizeText(
        expectedValue
      );

    await expect.poll(
      async () => {
        const options =
          await this.getDropdownOptions(
            locator
          );

        return options.some(option => {
          return (
            this.normalizeText(
              option.label
            ) === expected ||
            this.normalizeText(
              option.value
            ) === expected
          );
        });
      },
      {
        timeout: 120000,
        intervals: [
          500,
          1000,
          2000
        ]
      }
    ).toBeTruthy();
  }

  async selectDropdownByLabel(
    locator,
    value,
    fieldName
  ) {
    const expectedValue =
      String(value || '').trim();

    if (!expectedValue) {
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
      expectedValue,
      fieldName
    );

    const availableOptions =
      await this.getDropdownOptions(
        locator
      );

    console.log(
      `${fieldName} available options:`,
      availableOptions.map(
        option => option.label
      )
    );

    const expectedNormalized =
      this.normalizeText(
        expectedValue
      );

    const matchingOption =
      availableOptions.find(option => {
        return (
          this.normalizeText(
            option.label
          ) === expectedNormalized ||
          this.normalizeText(
            option.value
          ) === expectedNormalized
        );
      });

    if (!matchingOption) {
      throw new Error(
        `${fieldName} "${expectedValue}" ` +
        'was not found.'
      );
    }

    await locator.selectOption({
      value: matchingOption.value
    });

    console.log(
      `${fieldName} selected: ` +
      `${matchingOption.label}`
    );

    await this.waitForLoadingToComplete();
  }

  async enterInvestmentAmount(
    investmentAmount
  ) {
    await expect(
      this.investmentAmount
    ).toBeVisible({
      timeout: 60000
    });

    const minimumAmount =
      Number(
        await this.investmentAmount
          .getAttribute('minamt') || 0
      );

    const amount =
      Number(investmentAmount);

    if (
      minimumAmount &&
      amount < minimumAmount
    ) {
      throw new Error(
        `Investment Amount ${amount} ` +
        `is below minimum ${minimumAmount}.`
      );
    }

    await this.investmentAmount.fill('');

    await this.investmentAmount.fill(
      String(investmentAmount)
    );

    await this.investmentAmount.press(
      'Tab'
    );

    await this.waitForLoadingToComplete();

    console.log(
      `Investment Amount entered: ${investmentAmount}`
    );
  }

  async selectPaymentType(
  expectedPaymentType
) {

  const expected =
    String(
      expectedPaymentType || ''
    )
      .replace(/\s+/g, ' ')
      .trim();

  if (!expected) {
    throw new Error(
      'PaymentType is missing in ' +
      'PlanDetails Excel sheet.'
    );
  }


  console.log(
    `Payment Type from Excel: ${expected}`
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


  /*
   * Read currently selected payment type.
   */
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


  /*
   * If already selected correctly,
   * don't open the dropdown.
   */
  if (
    this.normalizeText(
      currentPaymentType
    ) ===
    this.normalizeText(
      expected
    )
  ) {

    console.log(
      `Payment Type already selected: ` +
      `${expected}`
    );

    return;
  }


  /*
   * Open custom Payment Type dropdown.
   */
  console.log(
    'Opening Payment Type dropdown...'
  );


  await this.paymentTypeContainer
    .scrollIntoViewIfNeeded();


  await this.paymentTypeContainer.click();


  /*
   * Give the application's custom dropdown
   * a short time to render.
   */
  await this.page.waitForTimeout(500);


  /*
   * Search all exact matches because the
   * application can contain duplicate text.
   */
  const matchingOptions =
    this.page.getByText(
      expected,
      {
        exact: true
      }
    );


  const optionCount =
    await matchingOptions.count();


  console.log(
    `Payment Type "${expected}" ` +
    `matches found: ${optionCount}`
  );


  let selected = false;


  for (
    let index = 0;
    index < optionCount;
    index++
  ) {

    const option =
      matchingOptions.nth(index);


    const visible =
      await option
        .isVisible()
        .catch(() => false);


    if (!visible) {
      continue;
    }


    /*
     * Don't click the value currently shown
     * in the header itself.
     */
    const insideCurrentValue =
      await option.evaluate(
        element =>
          Boolean(
            element.closest(
              '#paymenttypeval_dsktp'
            )
          )
      )
      .catch(() => false);


    if (insideCurrentValue) {
      continue;
    }


    console.log(
      `Selecting Payment Type: ${expected}`
    );


    await option.click();


    selected = true;

    break;
  }


  if (!selected) {
    throw new Error(
      `Payment Type option "${expected}" ` +
      'was not found as a visible selectable option.'
    );
  }


  /*
   * Verify application changed from
   * Monthly to Excel value.
   */
  await expect.poll(
    async () => {

      return String(
        await this.paymentTypeValue
          .textContent()
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
      ],

      message:
        `Payment Type did not change ` +
        `to "${expected}".`
    }
  ).toBe(expected);


  console.log(
    `Payment Type selected successfully: ` +
    `${expected}`
  );


  await this.waitForLoadingToComplete();
}

async fillPlanDetails(row) {

  console.log(
    '===== Filling PAB Plan Details ====='
  );

  const investmentAmount =
    this.getRequiredValue(
      row,
      'InvestmentAmount'
    );

  const paymentType =
    this.getRequiredValue(
      row,
      'PaymentType'
    );

  const lifeCover =
    this.getRequiredValue(
      row,
      'LifeCover'
    );

  const maturityBenefit =
    this.getRequiredValue(
      row,
      'MaturityBenefit'
    );

  const policyTerm =
    this.getRequiredValue(
      row,
      'PolicyTerm'
    );

  const premiumPayingTerm =
    this.getRequiredValue(
      row,
      'PremiumPayingTerm'
    );


  await this.waitForPlanDetailsPage();


  /*
   * 1. Investment Amount
   */
  await this.enterInvestmentAmount(
    investmentAmount
  );


  /*
   * 2. Payment Type
   */
  await this.selectPaymentType(
    paymentType
  );


  /*
   * 3. Life Cover Option
   *
   * Life Option
   * Life Plus Option
   */
  await this.selectDropdownByLabel(
    this.lifeCover,
    lifeCover,
    'Life Cover Option'
  );

  await this.waitForLoadingToComplete();


  /*
   * ==========================================
   * 4. MATURITY BENEFIT
   * ==========================================
   *
   * Life Option / Life Plus Option
   *
   * Maturity Benefit options:
   *
   * Settlement-Installments
   * Income-Lumpsum
   * Settlement-Lumpsum
   */

  if (
    [
      'life option',
      'life plus option'
    ].includes(
      this.normalizeText(
        lifeCover
      )
    )
  ) {

    await this.selectDropdownByLabel(
      this.maturityBenefit,
      maturityBenefit,
      'Maturity Benefit'
    );

    await this.waitForLoadingToComplete();


    /*
     * Settlement-Installments
     *
     * Only for this option:
     * Maturity Payout Mode will appear.
     */

    if (
      this.normalizeText(
        maturityBenefit
      ) ===
      'settlement-installments'
    ) {

      const maturityPayoutMode =
        this.getRequiredValue(
          row,
          'MaturityPayoutMode'
        );

      await expect(
        this.maturityPayoutMode
      ).toBeVisible({
        timeout: 60000
      });


      await this.selectDropdownByLabel(
        this.maturityPayoutMode,
        maturityPayoutMode,
        'Maturity Payout Mode'
      );

      await this.waitForLoadingToComplete();


      /*
       * If Maturity Payout Mode = Yearly,
       * Maturity Payout Period will appear.
       */

      if (
        this.normalizeText(
          maturityPayoutMode
        ) === 'yearly'
      ) {

        const maturityPayoutPeriod =
          this.getRequiredValue(
            row,
            'MaturityPayoutPeriod'
          );


        await expect(
          this.maturityPayoutPeriod
        ).toBeVisible({
          timeout: 60000
        });


        await this.selectDropdownByLabel(
          this.maturityPayoutPeriod,
          maturityPayoutPeriod,
          'Maturity Payout Period'
        );

      }

    } else {

      /*
       * Income-Lumpsum
       * Settlement-Lumpsum
       *
       * Maturity Payout Mode
       * should NOT be selected.
       */

      console.log(
        `Maturity Benefit selected: ${maturityBenefit}. ` +
        'Maturity Payout Mode and Period are not required.'
      );
    }
  }


  /*
   * ==========================================
   * 5. DEATH BENEFIT
   * ==========================================
   */

  const normalizedLifeCover =
    this.normalizeText(
      lifeCover
    );


  /*
   * Life Option
   *
   * Death Benefit will have
   * Option-Lumpsum.
   */
  if (
    normalizedLifeCover ===
    'life option'
  ) {

    const deathBenefit =
      this.getRequiredValue(
        row,
        'DeathBenefit'
      );


    await this.selectDropdownByLabel(
      this.deathBenefit,
      deathBenefit,
      'Death Benefit'
    );


    console.log(
      'Life Option selected. ' +
      `Death Benefit selected: ${deathBenefit}`
    );
  }


  /*
   * Life Plus Option
   *
   * Death Benefit can contain
   * Life Plus options.
   */
  else if (
    normalizedLifeCover ===
    'life plus option'
  ) {

    const deathBenefit =
      this.getRequiredValue(
        row,
        'DeathBenefit'
      );


    await this.selectDropdownByLabel(
      this.deathBenefit,
      deathBenefit,
      'Death Benefit'
    );

    await this.waitForLoadingToComplete();


    /*
     * Life Plus-Installments
     *
     * Death Payout Mode appears.
     */
    if (
      this.normalizeText(
        deathBenefit
      ) ===
      'life plus-installments'
    ) {

      const deathPayoutMode =
        this.getRequiredValue(
          row,
          'DeathPayoutMode'
        );


      await expect(
        this.deathPayoutMode
      ).toBeVisible({
        timeout: 60000
      });


      await this.selectDropdownByLabel(
        this.deathPayoutMode,
        deathPayoutMode,
        'Death Payout Mode'
      );


      console.log(
        `Death Payout Mode selected: ` +
        `${deathPayoutMode}`
      );

    } else {

      console.log(
        `Death Benefit selected: ${deathBenefit}. ` +
        'Death Payout Mode is not required.'
      );
    }
  }


  /*
   * ==========================================
   * 6. POLICY TERM
   * ==========================================
   */

  await this.selectDropdownByLabel(
    this.policyTerm,
    policyTerm,
    'Policy Term'
  );

  await this.waitForLoadingToComplete();


  /*
   * ==========================================
   * 7. PREMIUM PAYING TERM
   * ==========================================
   */

  await this.selectDropdownByLabel(
    this.premiumPayingTerm,
    premiumPayingTerm,
    'Premium Paying Term'
  );


  console.log(
    'PAB Plan Details completed successfully.'
  );
}

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

  console.log(
    'Suitability Analysis clicked successfully.'
  );

  await this.waitForLoadingToComplete();
}

  async clickBuyNow() {
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

    await this.buyNowButton.click();

    console.log(
      'PAB Buy Now clicked successfully.'
    );
  }
}

module.exports = {
  PlanDetailsPage
};