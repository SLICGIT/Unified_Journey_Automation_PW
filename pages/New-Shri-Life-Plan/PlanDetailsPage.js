const { expect } = require('@playwright/test');

class PlanDetailsPage {
  constructor(page) {
    this.page = page;

    // =========================================================
    // TOP BLUE BAR
    // =========================================================

    // Life Cover - example: 14 Lakhs
    this.lifeCoverAmount =
      page.locator('#lifecoverchoosing_dsktp');

    // Payment Type - Quarterly / Monthly / Yearly etc.
    this.paymentType =
      page
        .getByText(/^Payment Type\s*-/i)
        .first();


    // =========================================================
    // PLAN DETAILS CARD
    // =========================================================

    // Life Cover Option
    this.lifeCoverOption =
      page
        .locator('select[id^="SelLifeCoverOption_"]')
        .first();

    // Maturity Benefit
    this.maturityBenefit =
      page
        .locator('select[id^="SelMaturityBenefit_"]')
        .first();

    // Death Benefit
    this.deathBenefit =
      page
        .locator('select[id^="SelDeathBenefit_"]')
        .first();

    // Policy Term
    this.policyTerm =
      page
        .locator('select[id^="SelPolicyTerm_"]')
        .first();

    // Premium Paying Term
    this.premiumPayingTerm =
      page
        .locator('select[id^="SelPayfor_"]')
        .first();

      // =========================================================
      // RIDERS
      // =========================================================

      // 0 - Shriram Accident Benefit Rider V04
      this.accidentBenefitRider =
        page.locator('#ChkBxAddons_0_201');

      // 1 - Shriram Family Income Benefit Rider V04
      this.familyIncomeBenefitRider =
        page.locator('#ChkBxAddons_1_201');

      // 2 - Shriram Extra Insurance Cover Rider V03
      this.extraInsuranceCoverRider =
        page.locator('#ChkBxAddons_2_201');

      // 3 - Shriram Life Critical Illness Woman Rider
      this.criticalIllnessWomanRider =
        page.locator('#ChkBxAddons_3_201');

      // 4 - Shriram Life Critical Illness Plus Rider V02
      this.criticalIllnessPlusRider =
        page.locator('#ChkBxAddons_4_201');

      // 5 - Shriram Life Step Up Rider
      this.stepUpRider =
        page.locator('#ChkBxAddons_5_201');

    // =========================================================
    // SUITABILITY ANALYSIS
    // =========================================================

    this.suitabilityAnalysisButton =
      page.getByRole(
        'button',
        {
          name: 'Suitability Analysis',
          exact: true
        }
      );

    this.objectiveOfInsurance =
      page.locator('#selObjectiveOfInsurance');

    this.riskAppetite =
      page.locator('#selRiskAppetite');

    this.suitabilitySubmitButton =
      page.locator('#btnSuitabilitySubmit');


    // =========================================================
    // BUY NOW
    // =========================================================

    this.buyNowButton =
      page.getByRole(
        'button',
        {
          name: 'Buy Now',
          exact: true
        }
      );


    // =========================================================
    // LOADER
    // =========================================================

    this.loadingOverlay =
      page.locator('#loading2');

    this.fetchingDetails =
      page.getByText(
        'Fetching Details',
        {
          exact: true
        }
      );
  }


  // =========================================================
  // COMMON WAIT
  // =========================================================

  async waitForLoader() {

    const loaderVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(() => false);

    if (loaderVisible) {

      console.log(
        'Waiting for loading overlay to disappear...'
      );

      await this.loadingOverlay.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }


    const fetchingVisible =
      await this.fetchingDetails
        .isVisible()
        .catch(() => false);

    if (fetchingVisible) {

      console.log(
        'Waiting for Fetching Details to disappear...'
      );

      await this.fetchingDetails.waitFor({
        state: 'hidden',
        timeout: 120000
      });
    }
  }


  // =========================================================
  // WAIT FOR PLAN DETAILS PAGE
  // =========================================================

  async waitForPage() {

    console.log(
      'Waiting for New Shri Life Plan Details page...'
    );

    await this.waitForLoader();

    await expect(
      this.lifeCoverOption
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.policyTerm
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.buyNowButton
    ).toBeVisible({
      timeout: 120000
    });

    console.log(
      'New Shri Life Plan Details page loaded successfully.'
    );
  }


  // =========================================================
  // NORMALIZE TEXT
  // =========================================================

  normalizeText(value) {

    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }


  // =========================================================
  // ESCAPE REGEX
  // =========================================================

  escapeRegExp(value) {

    return String(value).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  // =========================================================
  // GET EXCEL VALUE
  // =========================================================

  getExcelValue(
    data,
    headers
  ) {

    for (const header of headers) {

      const value =
        String(
          data?.[header] ?? ''
        ).trim();

      if (value) {
        return value;
      }
    }

    throw new Error(
      `Excel value missing. Expected header: ` +
      `${headers.join(' / ')}`
    );
  }


  // =========================================================
  // GET DROPDOWN OPTIONS
  // =========================================================

  async getDropdownOptions(dropdown) {

    return await dropdown
      .locator('option')
      .evaluateAll(options => {

        return options
          .map(option => ({
            text: String(
              option.textContent || ''
            )
              .replace(/\s+/g, ' ')
              .trim(),

            value: String(
              option.value || ''
            ).trim()
          }))
          .filter(option => {

            const text =
              option.text.toLowerCase();

            return (
              option.text &&
              text !== 'select' &&
              text !== '--select--' &&
              text !== 'select option'
            );
          });
      });
  }


  // =========================================================
  // SELECT NORMAL HTML DROPDOWN
  // =========================================================

  async selectDropdown(
    dropdown,
    excelValue,
    fieldName
  ) {

    const expected =
      String(excelValue).trim();

    console.log(
      `${fieldName} from Excel: "${expected}"`
    );

    await expect(
      dropdown
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      dropdown
    ).toBeEnabled({
      timeout: 60000
    });


    /*
     * Wait until options are loaded.
     */
    await expect.poll(
      async () => {

        const options =
          await this.getDropdownOptions(
            dropdown
          );

        return options.length;

      },
      {
        timeout: 120000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          `${fieldName} options not loaded.`
      }
    ).toBeGreaterThan(0);


    const options =
      await this.getDropdownOptions(
        dropdown
      );


    console.log(
      `${fieldName} available options:`,
      options.map(x => x.text)
    );


    const expectedNormalized =
      this.normalizeText(expected);


    const matchedOption =
      options.find(option => {

        return (
          this.normalizeText(
            option.text
          ) === expectedNormalized
          ||
          this.normalizeText(
            option.value
          ) === expectedNormalized
        );
      });


    if (!matchedOption) {

      throw new Error(
        `${fieldName} value "${expected}" ` +
        `was not found.\n` +
        `Available options: ` +
        `${options.map(x => x.text).join(', ')}`
      );
    }


    await dropdown.selectOption({
      value: matchedOption.value
    });


    await expect.poll(
      async () => {

        const selectedText =
          await dropdown
            .locator('option:checked')
            .textContent();

        return this.normalizeText(
          selectedText
        );

      },
      {
        timeout: 30000
      }
    ).toBe(
      this.normalizeText(
        matchedOption.text
      )
    );


    console.log(
      `${fieldName} selected successfully: ` +
      `${matchedOption.text}`
    );


    await this.page.waitForTimeout(500);

    await this.waitForLoader();
  }


  // =========================================================
  // SELECT TOP BLUE BAR OPTION
  // =========================================================

  async selectTopBarOption(
    trigger,
    excelValue,
    fieldName
  ) {

    const expected =
      String(excelValue).trim();


    console.log(
      `${fieldName} from Excel: "${expected}"`
    );


    await expect(
      trigger
    ).toBeVisible({
      timeout: 60000
    });


    await trigger
      .scrollIntoViewIfNeeded();


    await trigger.click();


    /*
     * Locate all elements containing exact required text.
     * Then use the visible one.
     */
    const options =
      this.page.getByText(
        new RegExp(
          `^\\s*${this.escapeRegExp(expected)}\\s*$`,
          'i'
        )
      );


    const count =
      await options.count();


    let optionFound = false;


    for (
      let index = 0;
      index < count;
      index++
    ) {

      const option =
        options.nth(index);


      if (
        await option
          .isVisible()
          .catch(() => false)
      ) {

        await option.click();

        optionFound = true;

        break;
      }
    }


    if (!optionFound) {

      throw new Error(
        `${fieldName} option "${expected}" ` +
        `was not visible.`
      );
    }


    console.log(
      `${fieldName} selected successfully: ${expected}`
    );


    await this.page.waitForTimeout(500);

    await this.waitForLoader();
  }


  // =========================================================
  // LIFE COVER AMOUNT
  // =========================================================

  async selectLifeCoverAmount(
    lifeCoverAmount
  ) {

    await this.selectTopBarOption(
      this.lifeCoverAmount,
      lifeCoverAmount,
      'Life Cover Amount'
    );
  }


  // =========================================================
  // PAYMENT TYPE
  // =========================================================

  async selectPaymentType(
    paymentType
  ) {

    /*
     * Payment Type text changes after selecting,
     * therefore recreate locator.
     */

    const paymentTrigger =
      this.page
        .getByText(
          /^Payment Type\s*-/i
        )
        .first();


    await this.selectTopBarOption(
      paymentTrigger,
      paymentType,
      'Payment Type'
    );
  }


  // =========================================================
  // POLICY TERM + PREMIUM PAYING TERM
  // =========================================================

  async selectPolicyAndPremiumTerm(
    policyTerm,
    premiumPayingTerm
  ) {

    /*
     * First select Policy Term.
     */
    await this.selectDropdown(
      this.policyTerm,
      policyTerm,
      'Policy Term'
    );


    console.log(
      'Waiting for Premium Paying Term options to refresh...'
    );


    await this.page.waitForTimeout(1000);

    await this.waitForLoader();


    /*
     * Premium Paying Term depends on Policy Term.
     *
     * Therefore wait until required Excel value
     * appears in the dropdown.
     */
    await expect.poll(
      async () => {

        const options =
          await this.getDropdownOptions(
            this.premiumPayingTerm
          );


        return options.some(option =>

          this.normalizeText(
            option.text
          ) ===
          this.normalizeText(
            premiumPayingTerm
          )
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
          `Premium Paying Term ` +
          `"${premiumPayingTerm}" ` +
          `was not loaded after Policy Term ` +
          `"${policyTerm}".`
      }
    ).toBeTruthy();


    await this.selectDropdown(
      this.premiumPayingTerm,
      premiumPayingTerm,
      'Premium Paying Term'
    );
  }


  // =========================================================
// RIDER HANDLING
// =========================================================

async setRider(
  locator,
  excelValue,
  riderName
) {

  const value =
    String(excelValue ?? '')
      .trim()
      .toUpperCase();

  if (!value) {

    console.log(
      `${riderName} is empty in Excel. Skipping.`
    );

    return;
  }


  if (
    ![
      'YES',
      'NO'
    ].includes(value)
  ) {

    throw new Error(
      `${riderName}: Expected YES or NO. ` +
      `Received "${excelValue}".`
    );
  }


  await this.waitForLoader();


  const visible =
    await locator
      .isVisible()
      .catch(() => false);


  if (!visible) {

    console.log(
      `${riderName} is not available ` +
      `for the selected plan combination.`
    );

    return;
  }


  const enabled =
    await locator
      .isEnabled()
      .catch(() => false);


  if (!enabled) {

    console.log(
      `${riderName} is disabled by application.`
    );

    return;
  }


  const checked =
    await locator.isChecked();


  console.log(
    `${riderName} current state: ` +
    `${checked ? 'Selected' : 'Not Selected'}`
  );


  if (value === 'YES') {

    if (!checked) {

      await locator.check({
        timeout: 30000
      });

      await this.waitForLoader();
    }


    await expect(
      locator
    ).toBeChecked({
      timeout: 30000
    });


    console.log(
      `${riderName} selected successfully.`
    );

  } else {

    if (checked) {

      await locator.uncheck({
        timeout: 30000
      });

      await this.waitForLoader();
    }


    await expect(
      locator
    ).not.toBeChecked({
      timeout: 30000
    });


    console.log(
      `${riderName} not selected.`
    );
  }
}

async selectRiders(data) {

  console.log('');
  console.log(
    '===== Selecting Riders ====='
  );

  const riders = [
    {
      locator: this.accidentBenefitRider,
      value: data.AccidentBenefitRider,
      name: 'Shriram Accident Benefit Rider V04'
    },
    {
      locator: this.familyIncomeBenefitRider,
      value: data.FamilyIncomeBenefitRider,
      name: 'Shriram Family Income Benefit Rider V04'
    },
    {
      locator: this.extraInsuranceCoverRider,
      value: data.ExtraInsuranceCoverRider,
      name: 'Shriram Extra Insurance Cover Rider V03'
    },
    {
      locator: this.criticalIllnessWomanRider,
      value: data.CriticalIllnessWomanRider,
      name: 'Shriram Life Critical Illness Woman Rider'
    },
    {
      locator: this.criticalIllnessPlusRider,
      value: data.CriticalIllnessPlusRider,
      name: 'Shriram Life Critical Illness Plus Rider V02'
    },
    {
      locator: this.stepUpRider,
      value: data.StepUpRider,
      name: 'Shriram Life Step Up Rider'
    }
  ];


  // =====================================================
  // FIRST PASS - APPLY EXCEL VALUES
  // =====================================================

  for (const rider of riders) {

    await this.setRider(
      rider.locator,
      rider.value,
      rider.name
    );
  }


  /*
   * Rider selection can trigger AddonClick()
   * and recalculate other Riders.
   */
  await this.waitForLoader();

  await this.page.waitForTimeout(2000);


  console.log('');
  console.log(
    '===== Final Rider Verification ====='
  );


  // =====================================================
  // SECOND PASS - VERIFY FINAL RIDER STATE
  // =====================================================

  for (const rider of riders) {

    const expected =
      String(rider.value ?? '')
        .trim()
        .toUpperCase();


    if (!expected) {

      console.log(
        `${rider.name}: Excel value empty. Skipping.`
      );

      continue;
    }


    const visible =
      await rider.locator
        .isVisible()
        .catch(() => false);


    if (!visible) {

      console.log(
        `${rider.name} is not available.`
      );

      continue;
    }


    const enabled =
      await rider.locator
        .isEnabled()
        .catch(() => false);


    const checked =
      await rider.locator.isChecked();


    console.log(
      `${rider.name} - ` +
      `Excel: ${expected}, ` +
      `Application: ${checked ? 'YES' : 'NO'}`
    );


    // =================================================
    // EXCEL = NO
    // =================================================

    if (
      expected === 'NO' &&
      checked
    ) {

      if (!enabled) {

        throw new Error(
          `${rider.name} is selected by application ` +
          `but checkbox is disabled.`
        );
      }


      console.log(
        `${rider.name} is selected but Excel = NO. ` +
        `Unselecting...`
      );


      await rider.locator.uncheck({
        timeout: 30000
      });


      await this.waitForLoader();


      await expect(
        rider.locator
      ).not.toBeChecked({
        timeout: 30000
      });


      console.log(
        `${rider.name} unselected successfully.`
      );
    }


    // =================================================
    // EXCEL = YES
    // =================================================

    if (
      expected === 'YES' &&
      !checked
    ) {

      if (!enabled) {

        throw new Error(
          `${rider.name} should be selected according ` +
          `to Excel but checkbox is disabled.`
        );
      }


      console.log(
        `${rider.name} is not selected but Excel = YES. ` +
        `Selecting...`
      );


      await rider.locator.check({
        timeout: 30000
      });


      await this.waitForLoader();


      await expect(
        rider.locator
      ).toBeChecked({
        timeout: 30000
      });


      console.log(
        `${rider.name} selected successfully.`
      );
    }
  }


  console.log(
    'Rider selection and final verification completed.'
  );
}

  // =========================================================
  // SUITABILITY ANALYSIS
  // =========================================================

  async completeSuitabilityAnalysis(
    objective,
    riskAppetite
  ) {

    console.log(
      'Opening Suitability Analysis...'
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
     * Wait for popup.
     */
    await expect(
      this.objectiveOfInsurance
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Suitability Analysis popup opened.'
    );


    /*
     * Objective of Insurance
     *
     * Excel:
     * Protection
     */
    await this.selectDropdown(
      this.objectiveOfInsurance,
      objective,
      'Objective of Insurance'
    );


    /*
     * Risk Appetite
     *
     * Excel:
     * Low
     */
    await this.selectDropdown(
      this.riskAppetite,
      riskAppetite,
      'Risk Appetite'
    );


    await expect(
      this.suitabilitySubmitButton
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      this.suitabilitySubmitButton
    ).toBeEnabled({
      timeout: 30000
    });


    console.log(
      'Clicking Suitability Analysis Submit...'
    );


    await this.suitabilitySubmitButton
      .click();


    await expect(
      this.suitabilitySubmitButton
    ).toBeHidden({
      timeout: 60000
    });


    await this.waitForLoader();


    console.log(
      'Suitability Analysis completed successfully.'
    );
  }


  // =========================================================
  // BUY NOW
  // =========================================================

  async clickBuyNow() {

    console.log(
      'Waiting for Buy Now button...'
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


    const currentUrl =
      this.page.url();


    console.log(
      `Current URL before Buy Now: ${currentUrl}`
    );


    await this.buyNowButton.click();


    await this.waitForLoader();


    /*
     * Wait for navigation to next page.
     */
    await expect.poll(
      () => this.page.url(),
      {
        timeout: 120000,
        intervals: [
          500,
          1000,
          2000
        ],

        message:
          'Page did not navigate after clicking Buy Now.'
      }
    ).not.toBe(currentUrl);


    console.log(
      `URL after Buy Now: ${this.page.url()}`
    );


    console.log(
      'Buy Now completed successfully.'
    );
  }


  // =========================================================
  // MAIN METHOD
  // =========================================================

  async fillPlanDetails(data) {

    console.log('');
    console.log(
      '=========================================='
    );
    console.log(
      '   NEW SHRI LIFE PLAN - PLAN DETAILS'
    );
    console.log(
      '=========================================='
    );


    if (!data) {

      throw new Error(
        'Plan Details Excel data is missing.'
      );
    }


    // =====================================================
    // READ EXCEL
    // =====================================================

    const lifeCoverAmount =
      this.getExcelValue(
        data,
        [
          'LifeCoverAmount',
          'Life Cover Amount'
        ]
      );


    const paymentType =
      this.getExcelValue(
        data,
        [
          'PaymentType',
          'Payment Type'
        ]
      );


    const lifeCover =
      this.getExcelValue(
        data,
        [
          'LifeCover',
          'Life Cover'
        ]
      );


    const maturityBenefit =
      this.getExcelValue(
        data,
        [
          'MaturityBenefit',
          'Maturity Benefit'
        ]
      );


    const deathBenefit =
      this.getExcelValue(
        data,
        [
          'DeathBenefit',
          'Death Benefit'
        ]
      );


    const policyTerm =
      this.getExcelValue(
        data,
        [
          'PolicyTerm',
          'Policy Term'
        ]
      );


    const premiumPayingTerm =
      this.getExcelValue(
        data,
        [
          'PremiumPayingTerm',
          'Premium Paying Term'
        ]
      );


    const objective =
      this.getExcelValue(
        data,
        [
          'Objective of Insurance',
          'ObjectiveOfInsurance'
        ]
      );


    const riskAppetite =
      this.getExcelValue(
        data,
        [
          'Risk Appetite',
          'RiskAppetite'
        ]
      );


    console.log(
      'Excel Plan Details:'
    );


    console.log({
      lifeCoverAmount,
      paymentType,
      lifeCover,
      maturityBenefit,
      deathBenefit,
      policyTerm,
      premiumPayingTerm,
      objective,
      riskAppetite
    });


    // =====================================================
    // WAIT FOR PAGE
    // =====================================================

    await this.waitForPage();


    // =====================================================
    // 1. LIFE COVER AMOUNT
    // =====================================================

    await this.selectLifeCoverAmount(
      lifeCoverAmount
    );


    // =====================================================
    // 2. PAYMENT TYPE
    // =====================================================

    await this.selectPaymentType(
      paymentType
    );


    // =====================================================
    // 3. LIFE COVER OPTION
    // =====================================================

    await this.selectDropdown(
      this.lifeCoverOption,
      lifeCover,
      'Life Cover'
    );


    // =====================================================
    // 4. MATURITY BENEFIT
    // =====================================================

    await this.selectDropdown(
      this.maturityBenefit,
      maturityBenefit,
      'Maturity Benefit'
    );


    // =====================================================
    // 5. DEATH BENEFIT
    // =====================================================

    await this.selectDropdown(
      this.deathBenefit,
      deathBenefit,
      'Death Benefit'
    );


    // =====================================================
    // 6. POLICY TERM
    // 7. PREMIUM PAYING TERM
    // =====================================================

    await this.selectPolicyAndPremiumTerm(
        policyTerm,
        premiumPayingTerm
      );


      // =====================================================
      // 8. RIDERS
      // =====================================================

      await this.selectRiders(
        data
      );



      // =====================================================
      // 9. SUITABILITY ANALYSIS
      // =====================================================

      await this.completeSuitabilityAnalysis(
        objective,
        riskAppetite
      );


      // =====================================================
      // 10. BUY NOW
      // =====================================================

      await this.clickBuyNow();

    console.log(
      '=========================================='
    );
    console.log(
      'Plan Details completed successfully.'
    );
    console.log(
      '=========================================='
    );
  }
}


module.exports = PlanDetailsPage;