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
    // ACTUAL SUMMARY PAGE
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

  /*
 * Wait for all application loaders/overlays to disappear.
 */
async waitForLoaderToDisappear() {

  console.log('Waiting for application loader to disappear...');

  // ==========================================
  // Loader overlay
  // ==========================================

  const loadingOverlay = this.page.locator('#loading2');

  // Wait until the actual blocking overlay is hidden
  await loadingOverlay.waitFor({
    state: 'hidden',
    timeout: 120000
  }).catch(() => {
    console.log(
      'WARNING: #loading2 did not become hidden within timeout.'
    );
  });

  // ==========================================
  // Fetching Details text
  // ==========================================

  const fetchingDetails = this.page.getByText(
    'Fetching Details',
    {
      exact: true
    }
  );

  await fetchingDetails.waitFor({
    state: 'hidden',
    timeout: 60000
  }).catch(() => {
    console.log(
      'Fetching Details text was not found or already hidden.'
    );
  });

  // ==========================================
  // Final verification
  // ==========================================

  const overlayVisible =
    await loadingOverlay.isVisible().catch(() => false);

  if (overlayVisible) {

    console.log(
      'WARNING: #loading2 is still visible.'
    );

  } else {

    console.log(
      'Application loader disappeared successfully.'
    );
  }

  // Small stabilization delay
  await this.page.waitForTimeout(500);
}

  /*
   * Wait for Summary Details page.
   */
  async waitForPage() {

    console.log(
      'Waiting for Summary Details page...'
    );

    await this.waitForLoaderToDisappear();

    await expect(
      this.summaryHeading
    ).toBeVisible({
      timeout: 120000
    });

    console.log(
      'Summary Details page displayed.'
    );
  }


  /*
   * Verify a displayed value.
   */
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


  /*
   * Escape text before using it
   * inside a regular expression.
   */
  escapeRegExp(value) {
    return String(value).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
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
      'Displayed email is not masked with asterisks.'
    ).toMatch(
      /\*+/
    );

    console.log(
      `Masked Email verified: ` +
      `"${actualMaskedEmail}"`
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


async verifyPlanDetails(
  planData
) {

  console.log(
    '===== Verifying PAB Summary Plan Details ====='
  );

  console.log(
    'PlanDetails Excel data:',
    {
      PaymentType:
        planData.PaymentType,

      LifeCover:
        planData.LifeCover,

      MaturityBenefit:
        planData.MaturityBenefit,

      MaturityPayoutMode:
        planData.MaturityPayoutMode,

      MaturityPayoutPeriod:
        planData.MaturityPayoutPeriod,

      DeathBenefit:
        planData.DeathBenefit,

      DeathPayoutMode:
        planData.DeathPayoutMode,

      PolicyTerm:
        planData.PolicyTerm,

      PremiumPayingTerm:
        planData.PremiumPayingTerm
    }
  );


  /*
   * Print visible text from Summary page.
   * This will tell us the exact text used
   * by the application.
   */
  const bodyText =
    String(
      await this.page.locator('body')
        .innerText()
    )
      .replace(/\r/g, '');


  console.log(
    '===== SUMMARY PAGE VISIBLE TEXT ====='
  );

  console.log(
    bodyText
  );

  console.log(
    '===== END SUMMARY PAGE TEXT ====='
  );


  /*
   * For now verify only fields already known
   * to be displayed reliably.
   */

  await this.verifyDisplayedValue(
    planData.PolicyTerm,
    'Policy Term'
  );

  await this.verifyDisplayedValue(
    planData.PremiumPayingTerm,
    'Premium Paying Term'
  );


  console.log(
    'PAB Summary Plan Details basic verification completed.'
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

    if (download) {
      console.log(
        `Downloaded: ` +
        `${download.suggestedFilename()}`
      );

      return;
    }

    if (newPage) {
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
  async acceptTermsAndConditions(planData) {

  console.log(
    'Checking Terms & Conditions...'
  );

  // ==========================================
  // Get Payment Type from Excel
  // ==========================================

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
      'PaymentType is missing in PlanDetails Excel sheet.'
    );
  }


  console.log(
    `Payment Type from Excel: ${paymentType}`
  );


  // ==========================================
  // FIRST CHECKBOX
  // Terms & Conditions
  // ALWAYS CHECK
  // ==========================================

  // ==========================================
// WAIT FOR APPLICATION LOADER
// ==========================================

await this.waitForLoaderToDisappear();

// ==========================================
// TERMS & CONDITIONS CHECKBOX
// ==========================================

await this.termsCheckbox.waitFor({
  state: 'visible',
  timeout: 60000
});

await expect(this.termsCheckbox).toBeEnabled({
  timeout: 30000
});

await this.termsCheckbox.scrollIntoViewIfNeeded();

// Make sure blocking overlay is gone
const loadingOverlay = this.page.locator('#loading2');

await expect(loadingOverlay).toBeHidden({
  timeout: 120000
});

if (!(await this.termsCheckbox.isChecked())) {

  console.log(
    'Selecting Terms & Conditions checkbox...'
  );

  await this.termsCheckbox.check({
    timeout: 30000
  });
}

await expect(this.termsCheckbox).toBeChecked();

console.log(
  'First checkbox - Terms & Conditions selected.'
);

  await expect(
    this.termsCheckbox
  ).toBeChecked();


  console.log(
    'First checkbox - Terms & Conditions selected.'
  );


  // ==========================================
  // SECOND CHECKBOX
  // Auto Debit
  // ==========================================

  await this.autoDebitCheckbox.waitFor({
    state: 'visible',
    timeout: 30000
  });


  await this.autoDebitCheckbox
    .scrollIntoViewIfNeeded();


  let autoDebitSelected = false;


  // ==========================================
  // MONTHLY
  // Check second checkbox
  // ==========================================

  if (
    paymentType === 'MONTHLY'
  ) {

    console.log(
      'Monthly payment detected.'
    );


    if (
      !(await this.autoDebitCheckbox.isChecked())
    ) {

      await this.autoDebitCheckbox.check();
    }


    await expect(
      this.autoDebitCheckbox
    ).toBeChecked();


    autoDebitSelected = true;


    console.log(
      'Second checkbox - Auto Debit selected.'
    );
  }


  // ==========================================
  // OTHER PAYMENT TYPES
  // Do NOT check second checkbox
  // ==========================================

  else {

    console.log(
      `${paymentType} payment detected.`
    );


    /*
     * Make sure Auto Debit remains unchecked.
     */
    if (
      await this.autoDebitCheckbox.isChecked()
    ) {

      await this.autoDebitCheckbox.uncheck();
    }


    await expect(
      this.autoDebitCheckbox
    ).not.toBeChecked();


    autoDebitSelected = false;


    console.log(
      'Second checkbox - Auto Debit not selected.'
    );
  }


  // ==========================================
  // FINAL VERIFICATION
  // ==========================================

  console.log(
    'Checkbox verification:'
  );

  console.log(
    `Terms & Conditions: ${
      await this.termsCheckbox.isChecked()
    }`
  );

  console.log(
    `Auto Debit: ${
      await this.autoDebitCheckbox.isChecked()
    }`
  );


  return autoDebitSelected;
}


  /*
   * Click Pay.
   */
  async clickPay() {

  console.log('Preparing to click Pay...');

  // Make sure no application overlay is blocking the page
  await this.waitForLoaderToDisappear();

  await this.payButton.waitFor({
    state: 'visible',
    timeout: 60000
  });

  await this.payButton.scrollIntoViewIfNeeded();

  await expect(this.payButton).toBeEnabled({
    timeout: 30000
  });

  // Final loader check
  await expect(
    this.page.locator('#loading2')
  ).toBeHidden({
    timeout: 60000
  });

  console.log(
    `URL before Pay: ${this.page.url()}`
  );

  console.log('Clicking Pay button...');

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
    ]).catch(() => {
      console.log(
        'URL did not change after Proceed.'
      );
    });

    await this.waitForLoaderToDisappear();

    console.log(
      `URL after Proceed: ` +
      `${this.page.url()}`
    );
  }


  async clickBuyNowIfRequired() {

  console.log(
    'Checking whether Buy Now click is required...'
  );

  /*
   * If Summary Details is already visible,
   * no Buy Now click is required.
   */
  const summaryVisible =
    await this.summaryHeading
      .isVisible()
      .catch(() => false);


  if (summaryVisible) {

    console.log(
      'Summary Details page already displayed. ' +
      'Buy Now click not required.'
    );

    return;
  }


  /*
   * Buy Now button on PAB Plan Details page.
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


  await buyNowButton.click();


  console.log(
    'Buy Now clicked successfully.'
  );


  /*
   * Wait for page transition / loader.
   */
  await this.waitForLoaderToDisappear();
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

  console.log(
    '===== Completing PAB Summary Details ====='
  );

  /*
   * Suitability Analysis is already completed
   * in SuitabilityAnalysisPage.js.
   *
   * Do NOT call completeSuitabilityAnalysis()
   * from this page object.
   */


  /*
   * If Buy Now is still required after
   * Suitability Analysis Submit,
   * click it here.
   */
  await this.clickBuyNowIfRequired();


  /*
   * Wait for actual Summary Details page.
   */
  await this.waitForPage();


  /*
   * Verify Personal Information.
   */
  await this.verifyPersonalInformation(
    basicData
  );


  /*
   * Verify PAB Plan Details.
   */
  await this.verifyPlanDetails(
    planData
  );


  /*
   * Download Benefit Illustration.
   */
  await this.downloadBenefitIllustration();


  /*
   * Terms & Conditions / Auto Debit.
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
    'PAB Summary Details flow completed successfully.'
  );


  console.log(
    `Returning Auto Debit selected: ` +
    `${autoDebitSelected}`
  );


  return autoDebitSelected;
}
}


module.exports = SummaryDetailsPage;