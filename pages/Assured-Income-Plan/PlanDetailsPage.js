const { expect } = require('@playwright/test');

class PlanDetailsPage {
  
  constructor(page) {
    this.page = page;

    // Plan Details fields
    this.investmentAmount = page.locator(
      '#txtInvestment_dsktp'
    );


    // Rider checkboxes
      this.familyIncomeBenefitRider = page.locator(
          '#ChkBxAddons_1_189'
      );

      this.extraInsuranceCoverRider = page.locator(
          '#ChkBxAddons_2_189'
      );

      this.criticalIllnessWomanRider = page.locator(
          '#ChkBxAddons_3_189'
      );

      this.criticalIllnessPlusRider = page.locator(
          '#ChkBxAddons_4_189'
      );

      this.stepUpRider = page.locator(
          '#ChkBxAddons_5_189'
      );

    this.suitabilityAnalysisButton = page.locator(
      '#btnSuitability_189'
    );

    this.buyNowButton = page.locator(
      '#btnBuyNow_189'
    );
    

    // Suitability Analysis popup
    this.suitabilityPopup = page.locator(
      '#btnSuitabilitySubmit'
    ).locator('xpath=ancestor::*[contains(@class,"modal")][1]');

    this.objectiveOfInsurance = page.locator(
      '#selObjectiveOfInsurance'
    );

    this.riskAppetite = page.locator(
      '#selRiskAppetite'
    );
    

    this.suitabilitySubmitButton = page.locator(
      '#btnSuitabilitySubmit'
    );
  }

  async waitForLoaderToDisappear() {
    const loaderText = this.page.getByText(
      'Fetching Details',
      { exact: true }
    );

    const loaderImage = this.page.getByRole(
      'img',
      { name: 'Loading...' }
    );

    await loaderText.waitFor({
      state: 'hidden',
      timeout: 60000
    }).catch(() => {
      // Loader might not appear.
    });

    await loaderImage.waitFor({
      state: 'hidden',
      timeout: 60000
    }).catch(() => {
      // Loader image might not appear.
    });
  }

  async waitForPage() {
    await this.waitForLoaderToDisappear();

    const heading = this.page
      .getByText('Plan Details', {
        exact: true
      })
      .first();

    await expect(heading).toBeVisible({
      timeout: 60000
    });

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

    console.log(
      'Plan Details page loaded successfully'
    );
  }

    async selectPaymentType(excelValue) {
    const value = String(
      excelValue ?? ''
    ).trim();

    if (!value) {
      console.log(
        'Payment Type is empty. Skipping.'
      );
      return;
    }

    console.log(
      `Payment Type from Excel: "${value}"`
    );

    await this.waitForLoaderToDisappear();

    const trigger = this.page
      .getByText(/^Payment Type\s*-/)
      .first();

    await expect(trigger).toBeVisible({
      timeout: 60000
    });

    await trigger.click();

    const visibleMenu = this.page.locator(
      '#navPaymentType_dsktp:visible'
    );

    await expect(visibleMenu).toBeVisible({
      timeout: 30000
    });

    const option = visibleMenu
      .locator('.navchildcls')
      .filter({
        hasText: new RegExp(
          `^${this.escapeRegExp(value)}$`,
          'i'
        )
      })
      .first();

    await expect(option).toBeVisible({
      timeout: 30000
    });

    await option.click();

    await expect(
      this.page.getByText(
        new RegExp(
          `^Payment Type\\s*-\\s*` +
          `${this.escapeRegExp(value)}$`,
          'i'
        )
      )
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      `Selected Payment Type: "${value}"`
    );

    await this.waitForLoaderToDisappear();
  }

  escapeRegExp(value) {
    return String(value).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }

  async getDropdownByLabel(labelText) {
    const label = this.page
      .getByText(labelText, {
        exact: true
      })
      .first();

    await expect(label).toBeVisible({
      timeout: 60000
    });

    const parentContainer = label.locator('..');

    let dropdown = parentContainer
      .getByRole('combobox')
      .first();

    const count = await dropdown.count();

    if (count === 0) {
      dropdown = label
        .locator('xpath=following::select[1]');
    }

    await expect(dropdown).toBeVisible({
      timeout: 60000
    });

    await expect(dropdown).toBeEnabled({
      timeout: 30000
    });

    return dropdown;
  }

  async selectDropdownByLabel(
    labelText,
    excelValue,
    fieldName = labelText
  ) {
    const value = String(
      excelValue ?? ''
    ).trim();

    if (!value) {
      console.log(
        `${fieldName} is empty. Skipping.`
      );
      return;
    }

    console.log(
      `${fieldName} from Excel: "${value}"`
    );

    await this.waitForLoaderToDisappear();

    const dropdown =
      await this.getDropdownByLabel(
        labelText
      );

    const availableOptions = (
      await dropdown
        .locator('option')
        .allTextContents()
    )
      .map(option => option.trim())
      .filter(Boolean);

    console.log(
      `${fieldName} available options:`,
      availableOptions
    );

    const matchingOption =
      availableOptions.find(
        option =>
          option.toLowerCase() ===
          value.toLowerCase()
      );

    if (!matchingOption) {
      throw new Error(
        `${fieldName}: Excel value "${value}" ` +
        `is unavailable. Available options: ` +
        `${availableOptions.join(', ')}`
      );
    }

    await dropdown.selectOption({
      label: matchingOption
    });

    await expect(
      dropdown.locator('option:checked')
    ).toHaveText(matchingOption, {
      timeout: 30000
    });

    console.log(
      `Selected ${fieldName}: ` +
      `"${matchingOption}"`
    );

    await this.waitForLoaderToDisappear();
  }

  async selectLifeCoverOption(excelValue) {
    await this.selectDropdownByLabel(
      'Life Cover Option',
      excelValue,
      'Life Cover Option'
    );
  }

  async selectMaturityBenefit(excelValue) {
    await this.selectDropdownByLabel(
      'Maturity Benefit',
      excelValue,
      'Maturity Benefit'
    );
  }

  async selectMaturityPayoutMode(excelValue) {
    await this.selectDropdownByLabel(
      'Maturity Payout Mode',
      excelValue,
      'Maturity Payout Mode'
    );
  }

  async selectDeathBenefit(excelValue) {
    await this.selectDropdownByLabel(
      'Death Benefit',
      excelValue,
      'Death Benefit'
    );

    await this.waitForLoaderToDisappear();
  }

    async selectDeathPayoutMode(excelValue) {
    const value = String(
      excelValue ?? ''
    ).trim();

    if (!value) {
      console.log(
        'Death Payout Mode is empty. Skipping.'
      );
      return;
    }

    console.log(
      `Death Payout Mode from Excel: "${value}"`
    );

    await this.waitForLoaderToDisappear();

    let dropdown;

    const label = this.page
      .getByText('Death Payout Mode', {
        exact: true
      })
      .first();

    if (
      await label.isVisible()
        .catch(() => false)
    ) {
      dropdown = label
        .locator('..')
        .getByRole('combobox')
        .first();
    } else {
      dropdown = this.page
        .locator(
          'select[id*="SelPayoutMode"]:visible'
        )
        .first();
    }

    await expect(dropdown).toBeVisible({
      timeout: 60000
    });

    await expect(dropdown).toBeEnabled({
      timeout: 30000
    });

    const availableOptions = (
      await dropdown
        .locator('option')
        .allTextContents()
    )
      .map(option => option.trim())
      .filter(Boolean);

    const matchingOption =
      availableOptions.find(
        option =>
          option.toLowerCase() ===
          value.toLowerCase()
      );

    if (!matchingOption) {
      throw new Error(
        `Death Payout Mode "${value}" is ` +
        `unavailable. Available options: ` +
        `${availableOptions.join(', ')}`
      );
    }

    await dropdown.selectOption({
      label: matchingOption
    });

    await expect(
      dropdown.locator('option:checked')
    ).toHaveText(matchingOption, {
      timeout: 30000
    });

    console.log(
      `Selected Death Payout Mode: ` +
      `"${matchingOption}"`
    );

    await this.waitForLoaderToDisappear();
  }

  async selectPolicyTerm(excelValue) {
    await this.selectDropdownByLabel(
      'Policy Term',
      excelValue,
      'Policy Term'
    );
  }

  async fillInvestmentAmount(excelValue) {
    const amount = String(
      excelValue ?? ''
    ).trim();

    if (!amount) {
      throw new Error(
        'InvestmentAmount is empty. ' +
        `Received: ${excelValue}`
      );
    }

    if (!/^\d+$/.test(amount)) {
      throw new Error(
        `InvestmentAmount must contain only ` +
        `numbers. Received: "${amount}"`
      );
    }

    console.log(
      `Investment Amount from Excel: ` +
      `"${amount}"`
    );

    await this.waitForLoaderToDisappear();

    const field = this.investmentAmount;

    await expect(field).toBeVisible({
      timeout: 60000
    });

    await field.scrollIntoViewIfNeeded();

    await expect(field).toBeEnabled({
      timeout: 30000
    });

    await expect(field).toBeEditable({
      timeout: 30000
    });

    const existingValue =
      await field.inputValue();

    console.log(
      `Existing Investment Amount: ` +
      `"${existingValue}"`
    );

    await field.click();

    await field.fill('');

    await expect(field).toHaveValue('', {
      timeout: 10000
    });

    await field.fill(amount);

    await expect(field).toHaveValue(
      amount,
      {
        timeout: 30000
      }
    );

    console.log(
      `Investment Amount entered: ` +
      `"${await field.inputValue()}"`
    );

    await field.press('Tab');

    await this.waitForLoaderToDisappear();

    // Application calculation time
    await this.page.waitForTimeout(5000);

    await expect(field).toHaveValue(
      amount,
      {
        timeout: 30000
      }
    );

    console.log(
      `Final Investment Amount: ` +
      `"${await field.inputValue()}"`
    );
  }


  async setRider(
    locator,
    excelValue,
    riderName
) {
    const value = String(
        excelValue ?? ''
    )
        .trim()
        .toUpperCase();

    /*
     * Empty value means do not change
     * the rider.
     */
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
            `${riderName}: Expected YES or NO ` +
            `but received "${excelValue}".`
        );
    }

    console.log(
        `${riderName} from Excel: "${value}"`
    );

    await this.waitForLoaderToDisappear();

    await expect(locator).toBeVisible({
        timeout: 60000
    });

    await locator.scrollIntoViewIfNeeded();

    await expect(locator).toBeEnabled({
        timeout: 30000
    });

    const currentlyChecked =
        await locator.isChecked();

    console.log(
        `${riderName} current state: ` +
        `${currentlyChecked ? 'Selected' : 'Not Selected'}`
    );

    if (value === 'YES') {

        if (!currentlyChecked) {
            await locator.check({
                timeout: 30000
            });
        }

        await expect(locator).toBeChecked({
            timeout: 30000
        });

        console.log(
            `${riderName} selected successfully.`
        );

    } else {

        if (currentlyChecked) {
            await locator.uncheck({
                timeout: 30000
            });
        }

        await expect(locator).not.toBeChecked({
            timeout: 30000
        });

        console.log(
            `${riderName} not selected.`
        );
    }

    await this.waitForLoaderToDisappear();
}

async selectRiders(data) {
    console.log(
        '===== Selecting Riders ====='
    );

    await this.setRider(
        this.familyIncomeBenefitRider,
        data.FamilyIncomeBenefitRider,
        'Shriram Family Income Benefit Rider V04'
    );

    await this.setRider(
        this.extraInsuranceCoverRider,
        data.ExtraInsuranceCoverRider,
        'Shriram Extra Insurance Cover Rider V03'
    );

    await this.setRider(
        this.criticalIllnessWomanRider,
        data.CriticalIllnessWomanRider,
        'Shriram Life Critical Illness Woman Rider'
    );

    await this.setRider(
        this.criticalIllnessPlusRider,
        data.CriticalIllnessPlusRider,
        'Shriram Life Critical Illness Plus Rider V02'
    );

    await this.setRider(
        this.stepUpRider,
        data.StepUpRider,
        'Shriram Life Step Up Rider'
    );

    console.log(
        'Rider selection completed.'
    );
}

    async clickSuitabilityAnalysis() {
    console.log(
      'Waiting for Suitability Analysis button'
    );

    await this.waitForLoaderToDisappear();

    const button =
      this.suitabilityAnalysisButton;

    await expect(button).toBeVisible({
      timeout: 60000
    });

    await button.scrollIntoViewIfNeeded();

    await expect(button).toBeEnabled({
      timeout: 30000
    });

    await button.click({
      timeout: 30000
    });

    await expect(
      this.suitabilitySubmitButton
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Suitability Analysis popup displayed'
    );
  }

  async selectPopupDropdown(
    locator,
    excelValue,
    fieldName
  ) {
    const value = String(
      excelValue ?? ''
    ).trim();

    if (!value) {
      throw new Error(
        `${fieldName} is empty in Excel.`
      );
    }

    await expect(locator).toBeVisible({
      timeout: 30000
    });

    await expect(locator).toBeEnabled({
      timeout: 30000
    });

    const options = (
      await locator
        .locator('option')
        .allTextContents()
    )
      .map(option => option.trim())
      .filter(Boolean);

    console.log(
      `${fieldName} available options:`,
      options
    );

    const matchingOption = options.find(
      option =>
        option.toLowerCase() ===
        value.toLowerCase()
    );

    if (!matchingOption) {
      throw new Error(
        `${fieldName}: Excel value "${value}" ` +
        `is unavailable. Available options: ` +
        `${options.join(', ')}`
      );
    }

    await locator.selectOption({
      label: matchingOption
    });

    await expect(
      locator.locator('option:checked')
    ).toHaveText(matchingOption, {
      timeout: 30000
    });

    console.log(
      `Selected ${fieldName}: ` +
      `"${matchingOption}"`
    );
  }

  async handleSuitabilityAnalysis(data) {
    await this.clickSuitabilityAnalysis();

    let objectiveDropdown =
      this.objectiveOfInsurance;

    if (
      await objectiveDropdown.count() === 0
    ) {
      objectiveDropdown = this.page
        .getByRole('combobox', {
          name: /Objective of Insurance/i
        })
        .first();
    }

    let riskDropdown = this.riskAppetite;

    if (
      await riskDropdown.count() === 0
    ) {
      riskDropdown = this.page
        .getByRole('combobox', {
          name: /Risk Appetite/i
        })
        .first();
    }

    await this.selectPopupDropdown(
      objectiveDropdown,
      data['Objective of Insurance'],
      'Objective of Insurance'
    );

    await this.selectPopupDropdown(
      riskDropdown,
      data['Risk Appetite'],
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
      'Clicking Suitability Analysis Submit'
    );

    await this.suitabilitySubmitButton.click();

    await expect(
      this.suitabilitySubmitButton
    ).toBeHidden({
      timeout: 60000
    });

    await this.waitForLoaderToDisappear();

    console.log(
      'Suitability Analysis completed'
    );
  }

    async clickBuyNow() {
    console.log(
      'Waiting for Buy Now button'
    );

    await expect(
      this.suitabilitySubmitButton
    ).toBeHidden({
      timeout: 60000
    });

    await this.waitForLoaderToDisappear();

    const button = this.buyNowButton;

    await expect(button).toBeVisible({
      timeout: 60000
    });

    await button.scrollIntoViewIfNeeded();

    await expect(button).toBeEnabled({
      timeout: 30000
    });

    const oldUrl = this.page.url();

    console.log(
      `URL before Buy Now: ${oldUrl}`
    );

    await button.click({
      timeout: 30000
    });

    console.log(
      'Buy Now button clicked'
    );

    await Promise.race([
      this.page.waitForURL(
        url =>
          url.toString() !== oldUrl,
        {
          timeout: 60000
        }
      ),

      this.page
        .getByText(/Summary|Proposal Summary/i)
        .first()
        .waitFor({
          state: 'visible',
          timeout: 60000
        })
    ]).catch(() => {
      console.log(
        'URL did not change. Verify the next-page locator.'
      );
    });

    await this.waitForLoaderToDisappear();

    console.log(
      `URL after Buy Now: ${this.page.url()}`
    );
  }

  async fillPlanDetails(data) {
    if (!data) {
      throw new Error(
        'Plan Details Excel data is undefined.'
      );
    }

    console.log(
      'Plan Details Excel data:',
      data
    );

    await this.waitForPage();

    await this.selectPaymentType(
      data['Payment Type']
    );

    await this.selectLifeCoverOption(
      data.LifeCover
    );

    await this.selectMaturityBenefit(
      data.MaturityBenefit
    );

    await this.selectMaturityPayoutMode(
      data.MaturityPayoutMode
    );

    await this.selectDeathBenefit(
      data.DeathBenefit
    );

    await this.selectDeathPayoutMode(
      data.DeathPayoutMode
    );

    await this.selectPolicyTerm(
      data.PolicyTerm
    );

    /*
     * Keep Investment Amount last because
     * dropdown changes may reset the amount.
     */
    await this.fillInvestmentAmount(
      data.InvestmentAmount
      );

      /*
      * Select Riders before
      * Suitability Analysis.
      */
      await this.selectRiders(
          data
      );

      await this.handleSuitabilityAnalysis(
          data
      );

      await this.clickBuyNow();

    console.log(
      `Plan Details completed for test case: ` +
      `${data.tc_id}`
    );
  }
}

module.exports = PlanDetailsPage;