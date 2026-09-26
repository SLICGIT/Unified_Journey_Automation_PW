const { expect } = require('@playwright/test');

class PlanDetailsPage {
  constructor(page) {
    this.page = page;

    this.lifeCoverDropdown =
      page.locator(
        '#lifecoverchoosing_dsktp'
      );

    this.selectedLifeCover =
      page.locator(
        '#lifecoverval_dsktp'
      );

    this.lifeCoverMenu =
      page.locator(
        '#navLifeCover_dsktp'
      );

    this.lifeCoverOptions =
      this.lifeCoverMenu.locator(
        'nav.navchildcls'
      );

    /*
     * Prefix locators avoid hardcoding
     * product configuration ID 137.
     */
    this.policyTerm =
      page.locator(
        'select[id^="SelPolicyTerm_"]'
      ).first();

    this.buyNowButton =
      page.locator(
        'button[id^="btnBuyNow_"]'
      ).first();

    /*
     * Benefit Payout to Nominee popup.
     */
    this.benefitPayoutModal =
      page.locator(
        '#benefitpayoutMDL'
      );

    this.benefitPayoutRadios =
      this.benefitPayoutModal.locator(
        'input[name="benefitpayout"]'
      );

    this.benefitPayoutLabels =
      this.benefitPayoutModal.locator(
        'label.rdbtnbnft'
      );

    this.benefitPayoutContinueButton =
      this.benefitPayoutModal.getByRole(
        'button',
        {
          name: 'Continue',
          exact: true
        }
      );

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

  normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

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
        'the PlanDetails sheet.'
      );
    }

    return value;
  }

  async waitForLoadingToComplete() {
    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(() => false);

    if (overlayVisible) {
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

  async waitForPage() {
    console.log(
      'Waiting for SP Plan Details page...'
    );

    await expect(
      this.lifeCoverDropdown
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

    await this.waitForLoadingToComplete();

    console.log(
      'SP Plan Details page loaded.'
    );
  }

  async getLifeCoverOptions() {
    return this.lifeCoverOptions
      .allTextContents()
      .then(options => {
        return options.map(option => {
          return String(option || '')
            .replace(/\s+/g, ' ')
            .trim();
        });
      })
      .catch(() => []);
  }

  async selectLifeCover(
    expectedLifeCover
  ) {
    const expectedValue =
      String(
        expectedLifeCover || ''
      ).trim();

    if (!expectedValue) {
      throw new Error(
        'LifeCoverAmount is missing in Excel.'
      );
    }

    console.log(
      `Selecting Life Cover: ` +
      `"${expectedValue}"`
    );

    await expect(
      this.lifeCoverDropdown
    ).toBeVisible({
      timeout: 60000
    });

    await this.lifeCoverDropdown.click();

    await expect(
      this.lifeCoverMenu
    ).toBeVisible({
      timeout: 60000
    });

    await expect.poll(
      async () => {
        const options =
          await this.getLifeCoverOptions();

        return options.length;
      },
      {
        timeout: 60000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          'Life Cover options were not loaded.'
      }
    ).toBeGreaterThan(0);

    const availableOptions =
      await this.getLifeCoverOptions();

    console.log(
      'Life Cover available options:',
      availableOptions
    );

    const expectedNormalized =
      this.normalizeText(
        expectedValue
      );

    let matchingOption =
      null;

    const optionCount =
      await this.lifeCoverOptions.count();

    for (
      let index = 0;
      index < optionCount;
      index++
    ) {
      const option =
        this.lifeCoverOptions.nth(
          index
        );

      const optionText =
        this.normalizeText(
          await option.textContent()
        );

      if (
        optionText ===
        expectedNormalized
      ) {
        matchingOption =
          option;

        break;
      }
    }

    if (!matchingOption) {
      throw new Error(
        `Life Cover "${expectedValue}" ` +
        'was not found. Available options: ' +
        availableOptions.join(', ')
      );
    }

    await matchingOption
      .scrollIntoViewIfNeeded();

    await matchingOption.click();

    await expect.poll(
      async () => {
        return this.normalizeText(
          await this.selectedLifeCover
            .textContent()
            .catch(() => '')
        );
      },
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          `Life Cover was not updated to ` +
          `"${expectedValue}".`
      }
    ).toBe(
      expectedNormalized
    );

    console.log(
      `Life Cover selected: ` +
      `${expectedValue}`
    );

    await this.waitForLoadingToComplete();
  }

  async getPolicyTermOptions() {
    return this.policyTerm
      .locator('option')
      .allTextContents()
      .then(options => {
        return options.map(option => {
          return String(option || '')
            .replace(/\s+/g, ' ')
            .trim();
        });
      })
      .catch(() => []);
  }

  async selectPolicyTerm(
    expectedPolicyTerm
  ) {
    const expectedValue =
      String(
        expectedPolicyTerm || ''
      ).trim();

    if (!expectedValue) {
      throw new Error(
        'PolicyTerm is missing in Excel.'
      );
    }

    await expect(
      this.policyTerm
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.policyTerm
    ).toBeEnabled({
      timeout: 60000
    });

    await expect.poll(
      async () => {
        const options =
          await this.getPolicyTermOptions();

        return options.some(option => {
          return (
            this.normalizeText(option) ===
            this.normalizeText(
              expectedValue
            )
          );
        });
      },
      {
        timeout: 60000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          `Policy Term option ` +
          `"${expectedValue}" was not loaded.`
      }
    ).toBeTruthy();

    const availableOptions =
      await this.getPolicyTermOptions();

    console.log(
      'Policy Term available options:',
      availableOptions
    );

    const matchingOption =
      availableOptions.find(option => {
        return (
          this.normalizeText(option) ===
          this.normalizeText(
            expectedValue
          )
        );
      });

    if (!matchingOption) {
      throw new Error(
        `Policy Term "${expectedValue}" ` +
        'was not found. Available options: ' +
        availableOptions.join(', ')
      );
    }

    await this.policyTerm.selectOption({
      label: matchingOption
    });

    await expect.poll(
      async () => {
        return String(
          await this.policyTerm
            .locator('option:checked')
            .textContent()
            .catch(() => '')
        )
          .replace(/\s+/g, ' ')
          .trim();
      },
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ]
      }
    ).toBe(
      matchingOption
    );

    console.log(
      `Policy Term selected: ` +
      `${matchingOption}`
    );

    await this.waitForLoadingToComplete();
  }

  async fillPlanDetails(row) {
    console.log(
      '===== Filling SP Plan Details ====='
    );

    if (!row) {
      throw new Error(
        'Plan Details Excel data is undefined.'
      );
    }

    const lifeCoverAmount =
      this.getRequiredValue(
        row,
        'LifeCoverAmount'
      );

    const policyTerm =
      this.getRequiredValue(
        row,
        'PolicyTerm'
      );

    console.log(
      'Payment Type is fixed as Single. ' +
      'No selection is required.'
    );

    console.log(
      'SP Plan Details Excel data:',
      {
        lifeCoverAmount,
        paymentType:
          'Single',
        policyTerm
      }
    );

    await this.waitForPage();

    await this.selectLifeCover(
      lifeCoverAmount
    );

    await this.selectPolicyTerm(
      policyTerm
    );

    console.log(
      'SP Plan Details completed successfully.'
    );
  }

  async getBenefitPayoutOptions() {
    return this.benefitPayoutLabels
      .allTextContents()
      .then(options => {
        return options.map(option => {
          return String(option || '')
            .replace(/\s+/g, ' ')
            .trim();
        });
      })
      .catch(() => []);
  }

  findBenefitPayoutIndex(
    availableOptions,
    expectedBenefitPayout
  ) {
    const expectedValue =
      this.normalizeText(
        expectedBenefitPayout
      );

    for (
      let index = 0;
      index < availableOptions.length;
      index++
    ) {
      const optionText =
        this.normalizeText(
          availableOptions[index]
        );

      if (
        expectedValue ===
        'death only'
      ) {
        if (
          optionText.includes(
            'on death'
          ) &&
          !optionText.includes(
            'accidental death'
          ) &&
          !optionText.includes(
            'critical illness'
          )
        ) {
          return index;
        }
      } else if (
        expectedValue ===
        'accidental death'
      ) {
        if (
          optionText.includes(
            'accidental death'
          )
        ) {
          return index;
        }
      } else if (
        expectedValue ===
        'critical illness'
      ) {
        if (
          optionText.includes(
            'critical illness'
          )
        ) {
          return index;
        }
      } else if (
        optionText ===
        expectedValue
      ) {
        /*
         * Exact popup text fallback.
         */
        return index;
      }
    }

    return -1;
  }

  async selectBenefitPayout(
    expectedBenefitPayout
  ) {
    const expectedValue =
      String(
        expectedBenefitPayout || ''
      ).trim();

    if (!expectedValue) {
      throw new Error(
        'BenefitPayout is missing in ' +
        'the PlanDetails sheet.'
      );
    }

    console.log(
      `Waiting for Benefit Payout: ` +
      `"${expectedValue}"`
    );

    await expect(
      this.benefitPayoutModal
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.benefitPayoutRadios.first()
    ).toBeAttached({
      timeout: 60000
    });

    await expect(
      this.benefitPayoutLabels.first()
    ).toBeVisible({
      timeout: 60000
    });

    const availableOptions =
      await this.getBenefitPayoutOptions();

    console.log(
      'Benefit Payout available options:',
      availableOptions
    );

    const matchingIndex =
      this.findBenefitPayoutIndex(
        availableOptions,
        expectedValue
      );

    if (
      matchingIndex ===
      -1
    ) {
      throw new Error(
        `Benefit Payout "${expectedValue}" ` +
        'was not found. Available options: ' +
        availableOptions.join(' | ')
      );
    }

    const matchingLabel =
      this.benefitPayoutLabels.nth(
        matchingIndex
      );

    const radioId =
      await matchingLabel.getAttribute(
        'for'
      );

    if (!radioId) {
      throw new Error(
        'Benefit Payout radio ID was not found ' +
        'for option: ' +
        `"${availableOptions[matchingIndex]}".`
      );
    }

    const matchingRadio =
      this.benefitPayoutModal.locator(
        `#${radioId}`
      );

    await expect(
      matchingRadio
    ).toBeAttached({
      timeout: 30000
    });

        /*
    * The loading overlay may remain briefly
    * after the Benefit Payout popup opens.
    */
    await this.waitForLoadingToComplete();

    if (
      !await matchingRadio
        .isChecked()
        .catch(() => false)
    ) {
      /*
      * The label visually covers the radio input.
      * Click the associated label instead.
      */
      await expect(
        matchingLabel
      ).toBeVisible({
        timeout: 60000
      });

      await matchingLabel
        .scrollIntoViewIfNeeded();

      await matchingLabel.click();
    }

    await expect(
      matchingRadio
    ).toBeChecked({
      timeout: 30000
    });

    console.log(
      `Benefit Payout selected: ` +
      `${availableOptions[matchingIndex]}`
    );

    console.log(
      `Benefit Payout type from Excel: ` +
      `${expectedValue}`
    );
  }

  async clickBuyNow(planData) {
  console.log(
    'Clicking SP Buy Now...'
  );

  if (!planData) {
    throw new Error(
      'Plan Details Excel data is undefined.'
    );
  }

  const benefitPayout =
    this.getRequiredValue(
      planData,
      'BenefitPayout'
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

  await this.buyNowButton.click();

  /*
   * Wait for the Benefit Payout popup.
   */
  await expect(
    this.benefitPayoutModal
  ).toBeVisible({
    timeout: 60000
  });

  console.log(
    'Benefit Payout to Nominee popup displayed.'
  );

  /*
   * Wait for the loading overlay before
   * interacting with popup options.
   */
  await this.waitForLoadingToComplete();

  await this.selectBenefitPayout(
    benefitPayout
  );

  await expect(
    this.benefitPayoutContinueButton
  ).toBeVisible({
    timeout: 60000
  });

  await expect(
    this.benefitPayoutContinueButton
  ).toBeEnabled({
    timeout: 60000
  });

  console.log(
    'Clicking Benefit Payout Continue...'
  );

  await this.benefitPayoutContinueButton
    .click();

  await expect(
    this.benefitPayoutModal
  ).toBeHidden({
    timeout: 120000
  });

  await this.waitForLoadingToComplete();

  console.log(
    'Benefit Payout popup completed successfully.'
  );
}
}

module.exports = PlanDetailsPage;