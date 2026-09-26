const {
  expect
} = require('@playwright/test');


class SummaryDetailsPage {

  constructor(page) {

    this.page = page;


    // ========================================================
    // SUITABILITY ANALYSIS MODAL
    // ========================================================

    this.suitabilityModal =
      page.locator(
        '#suitabilityModal'
      );


    this.suitabilityHeading =
      this.suitabilityModal
        .getByText(
          'Suitability Analysis',
          {
            exact: true
          }
        );


    this.suitabilitySubmitButton =
      this.suitabilityModal
        .getByRole(
          'button',
          {
            name: 'Submit',
            exact: true
          }
        );


    // ========================================================
    // SUMMARY PAGE
    // ========================================================

    this.summaryHeading =
      page.getByText(
        'Summary Details',
        {
          exact: true
        }
      );


    this.downloadBenefitButton =
      page.locator(
        '#btnbidownload'
      );


    this.termsCheckbox =
      page.locator(
        '#chkbxTandC'
      );


    this.autoDebitCheckbox =
      page.locator(
        '#chkbxagree_1'
      );


    this.payButton =
      page.locator(
        '#btnpay'
      );


    this.proceedButton =
      page.locator(
        '#btnPayProcced'
      );


    this.paymentPopupHeading =
      page.getByText(
        'Select an option to pay',
        {
          exact: true
        }
      );

      
  }


  // ==========================================================
  // WAIT FOR SUITABILITY ANALYSIS
  // ==========================================================

  async waitForSuitabilityAnalysis() {

    console.log(
      'Waiting for Suitability Analysis popup...'
    );


    await expect(
      this.suitabilityModal
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.suitabilityHeading
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Suitability Analysis popup displayed.'
    );
  }


  // ==========================================================
  // WAIT FOR LOADER
  // ==========================================================

  async waitForLoaderToDisappear() {

    const loader =
      this.page.getByText(
        'Fetching Details',
        {
          exact: true
        }
      );


    await loader
      .waitFor({
        state: 'hidden',
        timeout: 60000
      })
      .catch(
        () => {

          console.log(
            'Fetching Details loader was not displayed.'
          );

        }
      );
  }


  // ==========================================================
  // WAIT FOR SUMMARY PAGE
  // ==========================================================

  async waitForPage() {

    console.log(
      'Waiting for NSV Summary Details page...'
    );


    await this.waitForLoaderToDisappear();


    await expect(
      this.summaryHeading
    ).toBeVisible({
      timeout: 120000
    });


    console.log(
      'NSV Summary Details page displayed.'
    );
  }


  // ==========================================================
  // VERIFY DISPLAYED VALUE
  // ==========================================================

  async verifyDisplayedValue(
    value,
    fieldName
  ) {

    const expectedValue =
      String(
        value ?? ''
      ).trim();


    if (!expectedValue) {

      console.log(
        `${fieldName} is empty. ` +
        'Skipping verification.'
      );


      return;
    }


    const displayedValue =
      this.page
        .getByText(
          expectedValue,
          {
            exact: true
          }
        )
        .first();


    await expect(
      displayedValue
    ).toBeVisible({
      timeout: 30000
    });


    console.log(
      `${fieldName} verified: ` +
      `"${expectedValue}"`
    );
  }


  // ==========================================================
  // ESCAPE REGEX
  // ==========================================================

  escapeRegExp(value) {

    return String(
      value
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }


  // ==========================================================
  // VERIFY MASKED EMAIL
  // ==========================================================

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
        `Invalid email received from Excel: ` +
        `"${email}"`
      );
    }


    const emailParts =
      email.split('@');


    if (
      emailParts.length !== 2
    ) {

      throw new Error(
        `Invalid email format received from Excel: ` +
        `"${email}"`
      );
    }


    const [
      localPart,
      domain
    ] =
      emailParts;


    const displayedEmail =
      this.page
        .locator(
          'p'
        )
        .filter({
          hasText:
            new RegExp(
              `\\*+@${this.escapeRegExp(
                domain
              )}$`,
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
    ] =
      displayedParts;


    const visiblePart =
      maskedLocalPart.replace(
        /\*+/g,
        ''
      );


    expect(
      actualDomain,
      'Displayed email domain does not match ' +
      'Excel email domain.'
    ).toBe(
      domain
    );


    expect(
      visiblePart.length,
      'Displayed email must show at least one ' +
      'character before masking.'
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
      'Displayed email is not masked.'
    ).toMatch(
      /\*+/
    );


    console.log(
      `Masked Email verified: ` +
      `"${actualMaskedEmail}"`
    );
  }


  // ==========================================================
  // VERIFY MASKED MOBILE
  // ==========================================================

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
        `Invalid mobile number received: ` +
        `"${fullMobile}"`
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
      `Masked Mobile verified: ` +
      `ending ${lastFourDigits}`
    );
  }


  // ==========================================================
  // VERIFY PERSONAL INFORMATION
  // ==========================================================

  async verifyPersonalInformation(
    basicData
  ) {

    if (!basicData) {

      throw new Error(
        'BasicDetails Excel data is undefined.'
      );
    }


    console.log(
      '===== Verifying NSV Personal Information ====='
    );


    /*
     * Follow BasicDetails Excel headings directly.
     *
     * FullName
     * InsureFor
     * Email
     * Mobile
     * DOB
     * Gender
     */


    await this.verifyDisplayedValue(
      basicData.FullName,
      'Full Name'
    );


    await this.verifyDisplayedValue(
      basicData.InsureFor,
      'Insure For'
    );


    await this.verifyMaskedEmail(
      basicData.Email
    );


    await this.verifyMaskedMobile(
      basicData.Mobile
    );


    await this.verifyDisplayedValue(
      basicData.DOB,
      'Date of Birth'
    );


    await this.verifyDisplayedValue(
      basicData.Gender,
      'Gender'
    );


    console.log(
      'NSV Personal Information verification completed.'
    );
  }


  // ==========================================================
  // VERIFY NSV PLAN DETAILS
  // ==========================================================

  async verifyPlanDetails(
    planData
  ) {

    console.log(
      '===== Verifying NSV Summary Plan Details ====='
    );


    if (!planData) {

      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }


    console.log(
      'NSV PlanDetails Excel data:',
      {

        LifeCover:
          planData.LifeCover,

        PaymentType:
          planData.PaymentType,

        LifeCoverOption:
          planData.LifeCoverOption,

        MaturityBenefit:
          planData.MaturityBenefit,

        DeathBenefit:
          planData.DeathBenefit,

        DeathPayOutMode:
          planData.DeathPayOutMode,

        PolicyTerm:
          planData.PolicyTerm,

        PremiumPayingTerm:
          planData.PremiumPayingTerm

      }
    );


    /*
     * Print Summary visible text.
     *
     * Useful during initial NSV implementation
     * because exact summary labels can differ
     * from other plans.
     */
    const bodyText =
      String(
        await this.page
          .locator(
            'body'
          )
          .innerText()
    )
      .replace(
        /\r/g,
        ''
      );


    console.log(
      '===== NSV SUMMARY PAGE VISIBLE TEXT ====='
    );


    console.log(
      bodyText
    );


    console.log(
      '===== END SP SPP SUMMARY PAGE TEXT ====='
    );


    /*
     * Verify fields already known to
     * appear reliably.
     */

    await this.verifyDisplayedValue(
      planData.PolicyTerm,
      'Policy Term'
    );


    await this.verifyDisplayedValue(
      planData.PremiumPayingTerm,
      'Premium Paying Term'
    );


    /*
     * Verify Payment Type if displayed
     * as exact standalone text.
     *
     * We do not make this mandatory here
     * because some summary pages display
     * Payment Type as part of another string.
     */

    const paymentType =
      String(
        planData.PaymentType || ''
      ).trim();


    if (paymentType) {

      const paymentTypeVisible =
        await this.page
          .getByText(
            paymentType,
            {
              exact: true
            }
          )
          .first()
          .isVisible()
          .catch(
            () => false
          );


      if (paymentTypeVisible) {

        console.log(
          `Payment Type verified: ` +
          `"${paymentType}"`
        );

      } else {

        console.log(
          `Payment Type "${paymentType}" ` +
          'is not displayed as standalone text. ' +
          'Skipping exact verification.'
        );
      }
    }


    console.log(
      'SP SPP Summary Plan Details basic verification completed.'
    );
  }


  // ==========================================================
  // DOWNLOAD BENEFIT ILLUSTRATION
  // ==========================================================

  async downloadBenefitIllustration() {
  console.log(
    'Checking Benefit Illustration button...'
  );

  const buttonVisible =
    await this.downloadBenefitButton
      .isVisible()
      .catch(() => false);

  if (!buttonVisible) {
    console.log(
      'Benefit Illustration button is hidden. ' +
      'Skipping download for SP.'
    );

    return false;
  }

  await expect(
    this.downloadBenefitButton
  ).toBeEnabled({
    timeout: 30000
  });

  console.log(
    'Clicking Download Benefit Illustration...'
  );

  await this.downloadBenefitButton.click();

  console.log(
    'Benefit Illustration clicked successfully.'
  );

  return true;
}

  // ==========================================================
  // ACCEPT TERMS AND CONDITIONS
  // ==========================================================

  async acceptTermsAndConditions(
    planData
  ) {

    console.log(
      'Checking Terms & Conditions...'
    );


    const paymentType =
      String(
        planData?.PaymentType ||
        planData?.['Payment Type'] ||
        ''
      )
        .trim()
        .toUpperCase();


    if (!paymentType) {

      throw new Error(
        'PaymentType is missing in ' +
        'PlanDetails Excel sheet.'
      );
    }


    console.log(
      `Payment Type from Excel: ${paymentType}`
    );


    // ========================================================
    // FIRST CHECKBOX
    // Terms and Conditions
    // Always selected
    // ========================================================

    await this.termsCheckbox
      .waitFor({
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
      'First checkbox - Terms & Conditions selected.'
    );


    // ========================================================
    // SECOND CHECKBOX
    // AUTO DEBIT
    // ========================================================

    await this.autoDebitCheckbox
      .waitFor({
        state: 'visible',
        timeout: 30000
      });


    await this.autoDebitCheckbox
      .scrollIntoViewIfNeeded();


    let autoDebitSelected =
      false;


    // ========================================================
    // MONTHLY
    // ========================================================

    if (
      paymentType ===
      'MONTHLY'
    ) {

      console.log(
        'Monthly payment detected.'
      );


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
        'Second checkbox - Auto Debit selected.'
      );

    } else {

      // ======================================================
      // QUARTERLY / HALF YEARLY / YEARLY
      // ======================================================

      console.log(
        `${paymentType} payment detected.`
      );


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
        'Second checkbox - Auto Debit not selected.'
      );
    }


    // ========================================================
    // FINAL CHECKBOX VERIFICATION
    // ========================================================

    console.log(
      'Checkbox verification:'
    );


    console.log(
      `Terms & Conditions: ${
        await this.termsCheckbox
          .isChecked()
      }`
    );


    console.log(
      `Auto Debit: ${
        await this.autoDebitCheckbox
          .isChecked()
      }`
    );


    return autoDebitSelected;
  }


  // ==========================================================
  // CLICK PAY
  // ==========================================================

  async clickPay() {

    await this.payButton
      .waitFor({
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
      `URL before Pay: ` +
      `${this.page.url()}`
    );


    console.log(
      'Clicking Pay button...'
    );


    await this.payButton
      .click();


    console.log(
      'Pay button clicked successfully.'
    );


    await this.paymentPopupHeading
      .waitFor({
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


  // ==========================================================
  // CLICK PROCEED
  // ==========================================================

  async clickProceed() {

    await this.proceedButton
      .waitFor({
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


    await this.proceedButton
      .click();


    console.log(
      'Proceed button clicked.'
    );


    await Promise.race([

      this.page.waitForURL(
        url =>
          url.toString() !==
          oldUrl,
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

    ])
      .catch(
        () => {

          console.log(
            'URL did not change after Proceed.'
          );

        }
      );


    await this.waitForLoaderToDisappear();


    console.log(
      `URL after Proceed: ` +
      `${this.page.url()}`
    );
  }


  // ==========================================================
  // BUY NOW FALLBACK
  // ==========================================================

  async clickBuyNowIfRequired() {

    console.log(
      'Checking whether Buy Now click is required...'
    );


    /*
     * Your EndToEnd currently clicks Buy Now
     * before calling SummaryDetailsPage.
     *
     * Therefore in normal NSV flow,
     * Summary Details should already be visible.
     */
    const summaryVisible =
      await this.summaryHeading
        .isVisible()
        .catch(
          () => false
        );


    if (summaryVisible) {

      console.log(
        'Summary Details page already displayed. ' +
        'Buy Now click not required.'
      );


      return;
    }


    /*
     * Fallback only.
     *
     * Avoid hardcoding _204.
     */
    const buyNowButton =
      this.page
        .locator(
          'button[id^="btnBuyNow_"]'
        )
        .first();


    await expect(
      buyNowButton
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      buyNowButton
    ).toBeEnabled({
      timeout: 60000
    });


    await buyNowButton
      .scrollIntoViewIfNeeded();


    console.log(
      'Clicking Buy Now...'
    );


    await buyNowButton
      .click();


    console.log(
      'Buy Now clicked successfully.'
    );


    await this.waitForLoaderToDisappear();
  }


  // ==========================================================
  // COMPLETE SUMMARY DETAILS
  // ==========================================================

  async completeSummaryDetails(
    basicData,
    planData
  ) {

    console.log(
      '===== Completing SP Summary Details ====='
    );


    if (!basicData) {

      throw new Error(
        'BasicDetails Excel data is undefined.'
      );
    }


    if (!planData) {

      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }


    // ========================================================
    // WAIT FOR SUMMARY PAGE
    // ========================================================

    await this.waitForPage();


    // ========================================================
    // VERIFY PERSONAL INFORMATION
    // ========================================================

    await this.verifyPersonalInformation(
      basicData
    );


    // ========================================================
    // VERIFY NSV PLAN DETAILS
    // ========================================================

    await this.verifyPlanDetails(
      planData
    );



    // ========================================================
    // TERMS & CONDITIONS / AUTO DEBIT
    // ========================================================

    const autoDebitSelected =
      await this.acceptTermsAndConditions(
        planData
      );


    // ========================================================
    // PAY
    // ========================================================

    await this.clickPay();


    // ========================================================
    // PROCEED
    // ========================================================

    await this.clickProceed();


    console.log(
      'NSV Summary Details flow completed successfully.'
    );


    console.log(
      `Returning Auto Debit selected: ` +
      `${autoDebitSelected}`
    );


    return autoDebitSelected;
  }
}


module.exports =
  SummaryDetailsPage;