const {
  expect
} = require('@playwright/test');


class SuitabilityAnalysisPage {

  constructor(page) {

    this.page = page;


    // ========================================================
    // SUITABILITY ANALYSIS MODAL
    // ========================================================

    this.suitabilityModal =
      page.locator(
        '#suitabilityModal'
      );


    this.heading =
      this.suitabilityModal
        .getByText(
          'Suitability Analysis',
          {
            exact: true
          }
        );


    // ========================================================
    // OBJECTIVE OF INSURANCE
    // ========================================================

    this.objectiveOfInsurance =
      page.locator(
        '#selObjectiveOfInsurance'
      );


    // ========================================================
    // RISK APPETITE
    // ========================================================

    this.riskAppetite =
      page.locator(
        '#selRiskAppetite'
      );


    // ========================================================
    // SUBMIT
    // ========================================================

    this.submitButton =
      page.locator(
        '#btnSuitabilitySubmit'
      );
  }


  // ==========================================================
  // COMMON HELPERS
  // ==========================================================

  normalizeText(value) {

    return String(
      value || ''
    )
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
        'PlanDetails Excel sheet.'
      );
    }


    return value;
  }


  // ==========================================================
  // WAIT FOR PAGE
  // ==========================================================

  async waitForPage() {

    console.log(
      'Waiting for Suitability Analysis popup...'
    );


    await expect(
      this.suitabilityModal
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.heading
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.objectiveOfInsurance
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.riskAppetite
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      this.submitButton
    ).toBeVisible({
      timeout: 60000
    });


    console.log(
      'Suitability Analysis popup displayed.'
    );
  }


  // ==========================================================
  // GET DROPDOWN OPTIONS
  // ==========================================================

  async getDropdownOptions(
    locator
  ) {

    return locator
      .locator('option')
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
                )
                  .trim()

            })
          );

        }
      );
  }


  // ==========================================================
  // SELECT DROPDOWN
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
      timeout: 30000
    });


    await expect(
      locator
    ).toBeEnabled({
      timeout: 30000
    });


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


    const matchingOption =
      options.find(
        option => {

          return (
            this.normalizeText(
              option.label
            ) ===
            this.normalizeText(
              expected
            ) ||

            this.normalizeText(
              option.value
            ) ===
            this.normalizeText(
              expected
            )
          );

        }
      );


    if (!matchingOption) {

      throw new Error(
        `${fieldName} option "${expected}" ` +
        'was not found. Available options: ' +
        options
          .map(
            option => option.label
          )
          .join(', ')
      );
    }


    /*
     * Select using value when available.
     */
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


    /*
     * Verify selected option.
     */
    await expect.poll(
      async () => {

        return String(
          await locator
            .locator(
              'option:checked'
            )
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
        ]
      }
    ).toBe(
      matchingOption.label
    );


    console.log(
      `${fieldName} selected: ` +
      `${matchingOption.label}`
    );
  }


  // ==========================================================
  // OBJECTIVE OF INSURANCE
  // ==========================================================

  async selectObjectiveOfInsurance(
    value
  ) {

    await this.selectDropdown(
      this.objectiveOfInsurance,
      value,
      'Objective of Insurance'
    );
  }


  // ==========================================================
  // RISK APPETITE
  // ==========================================================

  async selectRiskAppetite(
    value
  ) {

    await this.selectDropdown(
      this.riskAppetite,
      value,
      'Risk Appetite'
    );
  }


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async clickSubmit() {

    console.log(
      'Clicking Suitability Analysis Submit...'
    );


    await expect(
      this.submitButton
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      this.submitButton
    ).toBeEnabled({
      timeout: 30000
    });


    await this.submitButton
      .scrollIntoViewIfNeeded();


    await this.submitButton.click();


    /*
     * Modal should disappear after Submit.
     */
    await expect(
      this.suitabilityModal
    ).toBeHidden({
      timeout: 60000
    });


    console.log(
      'Suitability Analysis submitted successfully.'
    );
  }


  // ==========================================================
  // COMPLETE SUITABILITY ANALYSIS
  // ==========================================================

  async completeSuitabilityAnalysis(
    planData
  ) {

    console.log(
      '===== Completing PAB Suitability Analysis ====='
    );


    if (!planData) {

      throw new Error(
        'PlanDetails Excel data is undefined.'
      );
    }


    const objectiveOfInsurance =
      this.getRequiredValue(
        planData,
        'Objective of Insurance'
      );


    const riskAppetite =
      this.getRequiredValue(
        planData,
        'Risk Appetite'
      );


    console.log(
      'Suitability Analysis Excel data:',
      {
        objectiveOfInsurance,
        riskAppetite
      }
    );


    await this.waitForPage();


    // ========================================================
    // OBJECTIVE OF INSURANCE
    // ========================================================

    await this.selectObjectiveOfInsurance(
      objectiveOfInsurance
    );


    // ========================================================
    // RISK APPETITE
    // ========================================================

    await this.selectRiskAppetite(
      riskAppetite
    );


    // ========================================================
    // SUBMIT
    // ========================================================

    await this.clickSubmit();


    console.log(
      'PAB Suitability Analysis completed successfully.'
    );
  }
}


module.exports =
  SuitabilityAnalysisPage;