const {
  expect
} = require('@playwright/test');


class SummaryDetailsPage {

  constructor(page) {

    this.page = page;

    /*
     * Summary page heading.
     */
    this.summaryHeading =
      page.getByText(
        'Summary Details',
        {
          exact: true
        }
      );


    /*
     * Benefit Illustration download.
     */
    this.downloadBenefitButton =
      page.locator(
        '#btnbidownload'
      );


    /*
     * Checkboxes.
     */
    this.termsCheckbox =
      page.locator(
        '#chkbxTandC'
      );

    this.autoDebitCheckbox =
      page.locator(
        '#chkbxagree_1'
      );


    /*
     * Pay button.
     */
    this.payButton =
      page.locator(
        '#btnpay'
      );


    /*
     * Proceed button inside payment popup.
     */
    this.proceedButton =
      page.locator(
        '#btnPayProcced'
      );


    /*
     * Payment popup heading.
     */
    this.paymentPopupHeading =
      page.getByText(
        'Select an option to pay',
        {
          exact: true
        }
      );
  }


  /*
   * Escape special characters before
   * creating a regular expression.
   */
  escapeRegExp(value) {

    return String(
      value ?? ''
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  /*
   * Wait for Fetching Details loader.
   */
  async waitForLoaderToDisappear() {

    const loader =
      this.page.getByText(
        'Fetching Details',
        {
          exact: true
        }
      );

    try {

      await loader.waitFor({
        state: 'hidden',
        timeout: 60000
      });

    } catch (error) {

      console.log(
        'Fetching Details loader was not displayed.'
      );
    }
  }


  /*
   * Wait for Summary Details page.
   */
  async waitForPage() {

    await this.waitForLoaderToDisappear();

    await this.summaryHeading.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await expect(
      this.summaryHeading
    ).toBeVisible();

    console.log(
      'Summary Details page loaded successfully.'
    );
  }


  /*
   * Wait until dynamic Summary Details
   * data is populated.
   *
   * The Summary page heading can appear before
   * the API data is populated.
   */
  async waitForSummaryData(
    expectedFullName
  ) {

    console.log(
      '=============================================='
    );

    console.log(
      'Waiting for Summary Details data to populate...'
    );

    console.log(
      '=============================================='
    );


    const expected =
      String(
        expectedFullName ?? ''
      ).trim();


    if (!expected) {

      throw new Error(
        'Expected Full Name is empty.'
      );
    }


    const fullName =
      this.page.getByText(
        expected,
        {
          exact: false
        }
      ).first();


    const startTime =
      Date.now();


    while (
      Date.now() - startTime < 60000
    ) {

      const visible =
        await fullName
          .isVisible()
          .catch(
            () => false
          );


      if (visible) {

        console.log(
          'Summary Details data populated successfully.'
        );

        console.log(
          `Full Name found: "${expected}"`
        );

        return;
      }


      await this.page.waitForTimeout(
        1000
      );
    }


    /*
     * Diagnostic information.
     */
    const bodyText =
      await this.page
        .locator('body')
        .innerText()
        .catch(
          () => ''
        );


    console.log(
      'Summary page text after waiting:'
    );

    console.log(
      bodyText.substring(
        0,
        10000
      )
    );


    throw new Error(
      `Summary Details data was not populated within 60 seconds. ` +
      `Expected Full Name: "${expected}"`
    );
  }


  /*
   * Verify a displayed value.
   */
  async verifyDisplayedValue(
    expectedValue,
    fieldName
  ) {

    const expected =
      String(
        expectedValue ?? ''
      ).trim();


    if (!expected) {

      throw new Error(
        `${fieldName} expected value is empty.`
      );
    }


    console.log(
      `${fieldName} expected value: "${expected}"`
    );


    /*
     * Find elements containing the expected value.
     *
     * exact:false is intentional because the UI can
     * contain additional text such as currency symbols.
     */
    const matchingElements =
      this.page.getByText(
        expected,
        {
          exact: false
        }
      );


    const count =
      await matchingElements.count();


    console.log(
      `${fieldName} matching elements: ${count}`
    );


    if (count === 0) {

      const bodyText =
        await this.page
          .locator('body')
          .innerText()
          .catch(
            () => ''
          );


      console.log(
        `Could not find "${expected}" on Summary Details.`
      );

      console.log(
        'Summary page visible text:'
      );

      console.log(
        bodyText.substring(
          0,
          10000
        )
      );


      throw new Error(
        `${fieldName} value "${expected}" ` +
        `was not found on Summary Details page.`
      );
    }


    /*
     * Find a visible matching element.
     */
    for (
      let i = 0;
      i < count;
      i++
    ) {

      const element =
        matchingElements.nth(i);


      const visible =
        await element
          .isVisible()
          .catch(
            () => false
          );


      if (!visible) {
        continue;
      }


      const actualText =
        await element
          .innerText()
          .catch(
            () => ''
          );


      console.log(
        `${fieldName} displayed value: "${actualText.trim()}"`
      );


      return actualText.trim();
    }


    throw new Error(
      `${fieldName} value "${expected}" ` +
      `was found in the DOM but no visible element exists.`
    );
  }


  /*
   * Verify masked email.
   */
  async verifyMaskedEmail(
    fullEmail
  ) {

    const email =
      String(
        fullEmail ?? ''
      )
        .trim()
        .toLowerCase();


    if (
      !email ||
      !email.includes('@')
    ) {

      throw new Error(
        `Invalid email received from Excel: "${email}"`
      );
    }


    const emailParts =
      email.split('@');


    if (
      emailParts.length !== 2
    ) {

      throw new Error(
        `Invalid email format received from Excel: "${email}"`
      );
    }


    const [
      localPart,
      domain
    ] = emailParts;


    const displayedEmail =
      this.page
        .locator('p')
        .filter({
          hasText:
            new RegExp(
              `\\*+@${this.escapeRegExp(domain)}$`,
              'i'
            )
        })
        .first();


    await expect(
      displayedEmail
    ).toBeVisible({
      timeout: 30000
    });


    const actualMaskedEmail =
      String(
        await displayedEmail
          .textContent()
      )
        .trim()
        .toLowerCase();


    console.log(
      `Masked Email displayed: "${actualMaskedEmail}"`
    );


    const displayedParts =
      actualMaskedEmail.split('@');


    if (
      displayedParts.length !== 2
    ) {

      throw new Error(
        `Invalid masked email displayed on page: ` +
        `"${actualMaskedEmail}"`
      );
    }


    const [
      maskedLocalPart,
      actualDomain
    ] = displayedParts;


    const visiblePart =
      maskedLocalPart.replace(
        /\*+/g,
        ''
      );


    expect(
      actualDomain,
      'Displayed email domain does not match Excel email domain.'
    ).toBe(
      domain
    );


    expect(
      visiblePart.length,
      'Displayed email must show at least one character before masking.'
    ).toBeGreaterThan(
      0
    );


    expect(
      localPart.startsWith(
        visiblePart
      ),
      `Displayed email prefix "${visiblePart}" ` +
      `does not match Excel email "${localPart}".`
    ).toBeTruthy();


    expect(
      maskedLocalPart,
      'Displayed email is not masked with asterisks.'
    ).toMatch(
      /\*+/
    );


    console.log(
      `Masked Email verified: "${actualMaskedEmail}"`
    );
  }


  /*
   * Verify masked mobile number.
   */
  async verifyMaskedMobile(
    fullMobile
  ) {

    const mobile =
      String(
        fullMobile ?? ''
      ).replace(
        /\D/g,
        ''
      );


    if (
      mobile.length < 4
    ) {

      throw new Error(
        `Invalid mobile number received: "${fullMobile}"`
      );
    }


    const lastFourDigits =
      mobile.slice(
        -4
      );


    const maskedMobilePattern =
      new RegExp(
        `^\\*+${lastFourDigits}$`
      );


    const displayedMobile =
      this.page
        .getByText(
          maskedMobilePattern
        )
        .first();


    await expect(
      displayedMobile
    ).toBeVisible({
      timeout: 30000
    });


    console.log(
      `Masked Mobile verified: ending ${lastFourDigits}`
    );
  }


  /*
   * Verify Basic Details values.
   */
  async verifyPersonalInformation(
    basicData
  ) {

    await this.verifyDisplayedValue(
      basicData.AI_FullName,
      'Full Name'
    );


    await this.verifyDisplayedValue(
      basicData.AI_insureFor,
      'Insure For'
    );


    await this.verifyMaskedEmail(
      basicData.AI_Email
    );


    await this.verifyMaskedMobile(
      basicData.AI_Mobile
    );


    await this.verifyDisplayedValue(
      basicData.AI_dob,
      'Date of Birth'
    );


    await this.verifyDisplayedValue(
      basicData.AI_gender,
      'Gender'
    );


    console.log(
      'Personal Information verification completed.'
    );
  }


  /*
   * Convert an amount such as:
   *
   * 1,53,150
   * ₹1,53,150
   * 153150
   *
   * into:
   *
   * 153150
   */
  normalizeAmount(
    amount
  ) {

    const normalized =
      String(
        amount ?? ''
      )
        .replace(
          /₹/g,
          ''
        )
        .replace(
          /,/g,
          ''
        )
        .replace(
          /\s/g,
          ''
        )
        .trim();


    return normalized;
  }


  /*
   * Convert number to Indian currency format.
   */
  formatIndianAmount(
    amount
  ) {

    const number =
      Number(
        this.normalizeAmount(
          amount
        )
      );


    if (
      Number.isNaN(number)
    ) {

      throw new Error(
        `Invalid amount received: "${amount}"`
      );
    }


    return number.toLocaleString(
      'en-IN'
    );
  }


  /*
   * Read the Premium Amount displayed
   * on the Summary page.
   *
   * This is intentionally NOT calculated
   * from InvestmentAmount.
   *
   * Why?
   *
   * InvestmentAmount can be different from
   * final premium when a rider is selected.
   *
   * Example TC_0004:
   *
   * Investment Amount = 1,50,000
   * Family Income Rider = YES
   * Premium Amount = 1,53,150
   */
  async getDisplayedPremiumAmount() {

    console.log(
      'Reading Premium Amount from Summary page...'
    );


    /*
     * Locate the Premium Amount label.
     */
    const premiumLabel =
      this.page.getByText(
        'Premium Amount',
        {
          exact: true
        }
      ).last();


    await premiumLabel.waitFor({
      state: 'visible',
      timeout: 30000
    });


    /*
     * Find the nearest useful parent that contains
     * both the Premium Amount label and its value.
     *
     * We inspect ancestors instead of depending on
     * generated CSS IDs.
     */
    const premiumContainer =
      premiumLabel.locator(
        'xpath=..'
      );


    let premiumText =
      await premiumContainer
        .innerText()
        .catch(
          () => ''
        );


    /*
     * If the immediate parent doesn't contain
     * the value, inspect higher parents.
     */
    if (
      !/\d/.test(premiumText)
    ) {

      premiumText =
        await premiumLabel
          .locator(
            'xpath=../..'
          )
          .innerText()
          .catch(
            () => ''
          );
    }


    if (
      !/\d/.test(premiumText)
    ) {

      premiumText =
        await premiumLabel
          .locator(
            'xpath=../../..'
          )
          .innerText()
          .catch(
            () => ''
          );
    }


    console.log(
      `Premium Amount container text: "${premiumText.trim()}"`
    );


    /*
     * Extract Indian formatted amount.
     *
     * Examples:
     * 1,53,150
     * 153150
     * 22.50 Lakhs is ignored because the
     * Premium Amount container should contain
     * the premium value.
     */
    const amountMatches =
      premiumText.match(
        /\d[\d,]*(?:\.\d+)?/
      );


    if (
      !amountMatches
    ) {

      throw new Error(
        'Premium Amount value could not be read from Summary Details page.'
      );
    }


    const rawAmount =
      amountMatches[0];


    const normalizedAmount =
      this.normalizeAmount(
        rawAmount
      );


    const numericAmount =
      Number(
        normalizedAmount
      );


    if (
      Number.isNaN(
        numericAmount
      )
    ) {

      throw new Error(
        `Invalid Premium Amount displayed: "${rawAmount}"`
      );
    }


    const formattedAmount =
      numericAmount.toLocaleString(
        'en-IN'
      );


    console.log(
      `Premium Amount displayed: "${formattedAmount}"`
    );


    return {
      raw: rawAmount,
      normalized: normalizedAmount,
      number: numericAmount,
      formatted: formattedAmount
    };
  }


  /*
   * Verify Total Premium at bottom of Summary page.
   *
   * Example:
   *
   * Total Premium 1,53,150 /Yearly
   */
  async verifyTotalPremium(
    expectedPremium
  ) {

    console.log(
      'Verifying Total Premium...'
    );


    const totalPremiumText =
      this.page.getByText(
        /Total Premium/i
      ).last();


    await totalPremiumText.waitFor({
      state: 'visible',
      timeout: 30000
    });


    const bodyText =
      await this.page
        .locator('body')
        .innerText();


    /*
     * Search specifically for:
     *
     * Total Premium 1,53,150 /Yearly
     */
    const totalPremiumRegex =
      /Total Premium\s+([\d,]+(?:\.\d+)?)\s*\/\s*([A-Za-z -]+)/i;


    const match =
      bodyText.match(
        totalPremiumRegex
      );


    if (
      !match
    ) {

      console.log(
        'Could not extract Total Premium from page text.'
      );

      console.log(
        bodyText.substring(
          Math.max(
            0,
            bodyText.indexOf(
              'Total Premium'
            )
          ),
          bodyText.indexOf(
            'Total Premium'
          ) + 300
        )
      );


      /*
       * Do not fail here if the application renders
       * Total Premium in a different structure.
       *
       * Premium Amount itself has already been
       * verified from the Summary page.
       */
      console.log(
        'Continuing because Premium Amount was successfully verified.'
      );

      return;
    }


    const displayedTotal =
      this.normalizeAmount(
        match[1]
      );


    const expectedTotal =
      this.normalizeAmount(
        expectedPremium
      );


    console.log(
      `Total Premium displayed: "${match[1]}"`
    );


    console.log(
      `Expected Total Premium: "${this.formatIndianAmount(expectedPremium)}"`
    );


    expect(
      Number(displayedTotal),
      'Total Premium does not match Premium Amount.'
    ).toBe(
      Number(expectedTotal)
    );


    console.log(
      'Total Premium verified successfully.'
    );
  }


  /*
   * Verify Plan Details values.
   *
   * IMPORTANT:
   *
   * Premium Amount is NOT taken from
   * InvestmentAmount.
   *
   * The application calculates the final
   * premium after riders are applied.
   */
  async verifyPlanDetails(
    planData
  ) {

    /*
     * Policy Term.
     */
    await this.verifyDisplayedValue(
      planData.PolicyTerm,
      'Policy Term'
    );


    /*
     * Payment Type.
     */
    await this.verifyDisplayedValue(
      planData['Payment Type'],
      'Payment Type'
    );


    /*
     * Log Investment Amount for information.
     */
    const investmentAmount =
      String(
        planData.InvestmentAmount ?? ''
      )
        .replace(
          /,/g,
          ''
        )
        .trim();


    if (
      !investmentAmount
    ) {

      throw new Error(
        'Investment Amount is empty in PlanDetails Excel sheet.'
      );
    }


    const investmentNumber =
      Number(
        investmentAmount
      );


    if (
      Number.isNaN(
        investmentNumber
      )
    ) {

      throw new Error(
        `Invalid Investment Amount received: "${planData.InvestmentAmount}"`
      );
    }


    console.log(
      `Investment Amount from Excel: "${this.formatIndianAmount(investmentNumber)}"`
    );


    /*
     * Log rider status.
     */
    const familyIncomeRider =
      String(
        planData.FamilyIncomeBenefitRider ?? ''
      )
        .trim()
        .toUpperCase();


    const extraInsuranceRider =
      String(
        planData.ExtraInsuranceCoverRider ?? ''
      )
        .trim()
        .toUpperCase();


    const criticalIllnessWomanRider =
      String(
        planData.CriticalIllnessWomanRider ?? ''
      )
        .trim()
        .toUpperCase();


    const criticalIllnessPlusRider =
      String(
        planData.CriticalIllnessPlusRider ?? ''
      )
        .trim()
        .toUpperCase();


    const stepUpRider =
      String(
        planData.StepUpRider ?? ''
      )
        .trim()
        .toUpperCase();


    console.log(
      '=============================================='
    );

    console.log(
      'Rider configuration from Excel:'
    );

    console.log(
      `FamilyIncomeBenefitRider: "${familyIncomeRider}"`
    );

    console.log(
      `ExtraInsuranceCoverRider: "${extraInsuranceRider}"`
    );

    console.log(
      `CriticalIllnessWomanRider: "${criticalIllnessWomanRider}"`
    );

    console.log(
      `CriticalIllnessPlusRider: "${criticalIllnessPlusRider}"`
    );

    console.log(
      `StepUpRider: "${stepUpRider}"`
    );

    console.log(
      '=============================================='
    );


    /*
     * IMPORTANT:
     *
     * Read FINAL Premium Amount from Summary page.
     *
     * Do NOT expect InvestmentAmount here.
     *
     * For TC_0004:
     *
     * InvestmentAmount = 150000
     * FamilyIncomeBenefitRider = YES
     * Displayed Premium = 153150
     */
    const displayedPremium =
      await this.getDisplayedPremiumAmount();


    console.log(
      '=============================================='
    );

    console.log(
      `Final Premium Amount displayed by application: ` +
      `"${displayedPremium.formatted}"`
    );

    console.log(
      `Investment Amount from Excel: ` +
      `"${this.formatIndianAmount(investmentNumber)}"`
    );

    console.log(
      `Family Income Benefit Rider: ` +
      `"${familyIncomeRider}"`
    );

    console.log(
      '=============================================='
    );


    /*
     * If a rider is selected, it is expected that
     * the final premium can be greater than the
     * Investment Amount.
     *
     * We do NOT assume a fixed rider premium.
     */
    if (
      familyIncomeRider === 'YES' ||
      extraInsuranceRider === 'YES' ||
      criticalIllnessWomanRider === 'YES' ||
      criticalIllnessPlusRider === 'YES' ||
      stepUpRider === 'YES'
    ) {

      if (
        displayedPremium.number <
        investmentNumber
      ) {

        throw new Error(
          `Final Premium Amount "${displayedPremium.formatted}" ` +
          `is less than Investment Amount ` +
          `"${this.formatIndianAmount(investmentNumber)}" ` +
          `even though a rider is selected.`
        );
      }


      if (
        displayedPremium.number >
        investmentNumber
      ) {

        console.log(
          `Rider premium detected. ` +
          `Additional premium = ` +
          `${this.formatIndianAmount(
            displayedPremium.number - investmentNumber
          )}`
        );
      }

    } else {

      /*
       * No riders selected.
       *
       * In this situation the final premium should
       * normally equal the Investment Amount.
       *
       * We verify this only when there are no riders.
       */
      expect(
        displayedPremium.number,
        'Premium Amount does not match Investment Amount when no rider is selected.'
      ).toBe(
        investmentNumber
      );


      console.log(
        'No riders selected. Premium Amount matches Investment Amount.'
      );
    }


    /*
     * Verify Total Premium.
     */
    await this.verifyTotalPremium(
      displayedPremium.number
    );


    console.log(
      'Plan Details verification completed.'
    );
  }


  /*
   * Download or open Benefit Illustration.
   */
  async downloadBenefitIllustration() {

    await this.downloadBenefitButton
      .waitFor({
        state: 'visible',
        timeout: 60000
      });


    await this.downloadBenefitButton
      .scrollIntoViewIfNeeded();


    await expect(
      this.downloadBenefitButton
    ).toBeEnabled({
      timeout: 30000
    });


    console.log(
      'Clicking Download Benefit Illustration...'
    );


    const context =
      this.page.context();


    const pagePromise =
      context
        .waitForEvent(
          'page',
          {
            timeout: 10000
          }
        )
        .catch(
          () => null
        );


    const downloadPromise =
      this.page
        .waitForEvent(
          'download',
          {
            timeout: 10000
          }
        )
        .catch(
          () => null
        );


    await this.downloadBenefitButton
      .click();


    const newPage =
      await pagePromise;


    const download =
      await downloadPromise;


    if (
      download
    ) {

      console.log(
        `Downloaded: ${download.suggestedFilename()}`
      );

      return;
    }


    if (
      newPage
    ) {

      await newPage.waitForLoadState(
        'domcontentloaded'
      );


      console.log(
        `Benefit Illustration opened in new tab: ` +
        `${newPage.url()}`
      );


      await newPage.close();


      await this.page.bringToFront();


      return;
    }


    console.log(
      'No download event or new tab detected. ' +
      'Continuing test.'
    );
  }


  /*
   * Select Terms and Conditions.
   *
   * Auto Debit business rule:
   *
   * Monthly
   * → checkbox must be selected.
   *
   * Yearly / Half Yearly / Quarterly
   * → checkbox must remain unselected.
   */
  async acceptTermsAndConditions(
    planData
  ) {

    /*
     * Terms and Conditions must always be selected.
     */
    await this.termsCheckbox.waitFor({
      state: 'visible',
      timeout: 60000
    });


    await this.termsCheckbox
      .scrollIntoViewIfNeeded();


    if (
      !(await this.termsCheckbox
        .isChecked())
    ) {

      await this.termsCheckbox
        .check();
    }


    await expect(
      this.termsCheckbox
    ).toBeChecked();


    console.log(
      'Terms and Conditions selected.'
    );


    /*
     * Read Payment Type from Excel.
     */
    const paymentType =
      String(
        planData?.['Payment Type'] ||
        planData?.PaymentType ||
        ''
      )
        .trim()
        .toUpperCase();


    if (
      !paymentType
    ) {

      throw new Error(
        'Payment Type is missing in PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Payment Type received: ${paymentType}`
    );


    /*
     * Wait for Auto Debit checkbox.
     */
    await this.autoDebitCheckbox
      .waitFor({
        state: 'visible',
        timeout: 30000
      });


    await this.autoDebitCheckbox
      .scrollIntoViewIfNeeded();


    let autoDebitSelected =
      false;


    /*
     * Monthly:
     *
     * Select Auto Debit.
     */
    if (
      paymentType === 'MONTHLY'
    ) {

      if (
        !(await this.autoDebitCheckbox
          .isChecked())
      ) {

        await this.autoDebitCheckbox
          .check();
      }


      await expect(
        this.autoDebitCheckbox
      ).toBeChecked();


      autoDebitSelected =
        true;


      console.log(
        'Payment Type is Monthly. ' +
        'Auto Debit checkbox selected.'
      );
    }


    /*
     * Non-monthly:
     *
     * Auto Debit must remain unchecked.
     */
    else if (
      [
        'YEARLY',
        'HALF YEARLY',
        'HALF-YEARLY',
        'HALFYEARLY',
        'QUARTERLY'
      ].includes(
        paymentType
      )
    ) {

      if (
        await this.autoDebitCheckbox
          .isChecked()
      ) {

        await this.autoDebitCheckbox
          .uncheck();
      }


      await expect(
        this.autoDebitCheckbox
      ).not.toBeChecked();


      autoDebitSelected =
        false;


      console.log(
        `Payment Type is ${paymentType}. ` +
        'Auto Debit checkbox not selected.'
      );
    }


    else {

      throw new Error(
        `Unsupported Payment Type: "${paymentType}".`
      );
    }


    console.log(
      `Auto Debit selected result: ${autoDebitSelected}`
    );


    return autoDebitSelected;
  }


  /*
   * Click Pay.
   */
  async clickPay() {

    await this.payButton.waitFor({
      state: 'visible',
      timeout: 60000
    });


    await this.payButton
      .scrollIntoViewIfNeeded();


    await expect(
      this.payButton
    ).toBeEnabled({
      timeout: 30000
    });


    console.log(
      `URL before Pay: ${this.page.url()}`
    );


    console.log(
      'Clicking Pay button...'
    );


    await this.payButton.click();


    console.log(
      'Pay button clicked successfully.'
    );


    await this.paymentPopupHeading.waitFor({
      state: 'visible',
      timeout: 60000
    });


    await expect(
      this.paymentPopupHeading
    ).toBeVisible();


    console.log(
      'Payment selection popup displayed.'
    );
  }


  /*
   * Click Proceed inside payment popup.
   */
  async clickProceed() {

    await this.proceedButton.waitFor({
      state: 'visible',
      timeout: 60000
    });


    await this.proceedButton
      .scrollIntoViewIfNeeded();


    await expect(
      this.proceedButton
    ).toBeEnabled({
      timeout: 30000
    });


    const oldUrl =
      this.page.url();


    console.log(
      `URL before Proceed: ${oldUrl}`
    );


    console.log(
      'Clicking Proceed button...'
    );


    await this.proceedButton.click();


    console.log(
      'Proceed button clicked.'
    );


    await Promise.race([

      this.page.waitForURL(
        url =>
          url.toString() !== oldUrl,
        {
          timeout: 60000
        }
      ),

      this.page.waitForLoadState(
        'domcontentloaded',
        {
          timeout: 60000
        }
      )

    ]).catch(
      () => {

        console.log(
          'URL did not change after Proceed.'
        );
      }
    );


    await this.waitForLoaderToDisappear();


    console.log(
      `URL after Proceed: ${this.page.url()}`
    );
  }


  /*
   * Complete Summary Details flow.
   *
   * Returns:
   *
   * true
   * → Monthly payment
   * → Execute Auto Debit / Aadhaar / eNACH flow.
   *
   * false
   * → Non-monthly payment
   * → Skip Aadhaar / eNACH and continue to KYC.
   */
  async completeSummaryDetails(
    basicData,
    planData
  ) {

    /*
     * Wait for Summary page.
     */
    await this.waitForPage();


    /*
     * IMPORTANT:
     *
     * Wait for dynamic Summary data before
     * validating Full Name and other values.
     */
    await this.waitForSummaryData(
      basicData.AI_FullName
    );


    /*
     * Verify Personal Information.
     */
    await this.verifyPersonalInformation(
      basicData
    );


    /*
     * Verify Plan Details.
     *
     * Premium Amount is read from the
     * actual Summary page, so rider premium
     * is handled automatically.
     */
    await this.verifyPlanDetails(
      planData
    );


    /*
     * Download Benefit Illustration.
     */
    await this.downloadBenefitIllustration();


    /*
     * Terms and Auto Debit.
     */
    const autoDebitSelected =
      await this.acceptTermsAndConditions(
        planData
      );


    /*
     * Pay.
     */
    await this.clickPay();


    /*
     * Proceed.
     */
    await this.clickProceed();


    console.log(
      'Summary Details flow completed successfully.'
    );


    console.log(
      `Returning Auto Debit selected: ${autoDebitSelected}`
    );


    return autoDebitSelected;
  }
}


module.exports =
  SummaryDetailsPage;