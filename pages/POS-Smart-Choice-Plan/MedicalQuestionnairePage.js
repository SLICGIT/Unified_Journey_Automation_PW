const { expect } = require('@playwright/test');

class MedicalQuestionnairePage {
  constructor(page) {
    this.page = page;

    /*
     * Use the first family member field as
     * the unique Medical Questionnaire marker.
     */
    this.familyMember1Name =
      page.locator(
        '#txtFM1Name'
      );

    this.continueButton =
      page.locator(
        '#btnContinue'
      );

    this.loadingOverlay =
      page.locator(
        '#loading2'
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
    columnName,
    sheetName
  ) {
    const value =
      String(
        row?.[columnName] ?? ''
      ).trim();

    if (!value) {
      throw new Error(
        `${columnName} is missing in ` +
        `the ${sheetName} sheet.`
      );
    }

    return value;
  }

  getOptionalValue(
    row,
    columnName
  ) {
    return String(
      row?.[columnName] ?? ''
    ).trim();
  }

  getFamilyMemberLocators(
    memberNumber
  ) {
    return {
      fullName:
        this.page.locator(
          `#txtFM${memberNumber}Name`
        ),

      status:
        this.page.locator(
          `#selFM${memberNumber}Status`
        ),

      age:
        this.page.locator(
          `#txtFM${memberNumber}Age`
        ),

      healthStatus:
        this.page.locator(
          `#txtFM${memberNumber}HealthStatus`
        ),

      dateOfDeath:
        this.page.locator(
          `#txtFM${memberNumber}DeathDt`
        ),

      reasonOfDeath:
        this.page.locator(
          `#txtFM${memberNumber}DthReason`
        )
    };
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
  }

  async waitForPage() {
    console.log(
      'Waiting for SP Medical Questionnaire page...'
    );

    await expect(
      this.familyMember1Name
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.continueButton
    ).toBeEnabled({
      timeout: 120000
    });

    await this.waitForLoadingToComplete();

    console.log(
      'SP Medical Questionnaire page loaded.'
    );
  }

  async fillAndVerify(
    locator,
    value,
    fieldName
  ) {
    const expectedValue =
      String(value || '')
        .trim();

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
    ).toBeEditable({
      timeout: 60000
    });

    await locator.fill('');

    await locator.fill(
      expectedValue
    );

    await locator.press(
      'Tab'
    );

    await expect(
      locator
    ).toHaveValue(
      expectedValue,
      {
        timeout: 30000
      }
    );

    console.log(
      `${fieldName} entered: ` +
      `${expectedValue}`
    );
  }

  async selectStatus(
    locator,
    status,
    memberNumber
  ) {
    let expectedStatus =
      String(status || '')
        .trim();

    /*
     * Excel may contain "Died",
     * while the application option is "Dead".
     */
    if (
      this.normalizeText(
        expectedStatus
      ) === 'died'
    ) {
      expectedStatus =
        'Dead';
    }

    if (
      ![
        'alive',
        'dead'
      ].includes(
        this.normalizeText(
          expectedStatus
        )
      )
    ) {
      throw new Error(
        `Invalid Status for Family Member ` +
        `${memberNumber}: "${status}". ` +
        'Use Alive or Dead.'
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

    const availableOptions =
      await locator
        .locator('option')
        .allTextContents()
        .then(options => {
          return options.map(option => {
            return String(option || '')
              .replace(/\s+/g, ' ')
              .trim();
          });
        });

    console.log(
      `Family Member ${memberNumber} ` +
      'Status available options:',
      availableOptions
    );

    const matchingOption =
      availableOptions.find(option => {
        return (
          this.normalizeText(option) ===
          this.normalizeText(
            expectedStatus
          )
        );
      });

    if (!matchingOption) {
      throw new Error(
        `Status "${expectedStatus}" was not found ` +
        `for Family Member ${memberNumber}.`
      );
    }

    await locator.selectOption({
      label: matchingOption
    });

    await expect.poll(
      async () => {
        return String(
          await locator
            .locator('option:checked')
            .textContent()
            .catch(() => '')
        )
          .replace(/\s+/g, ' ')
          .trim();
      },
      {
        timeout: 30000
      }
    ).toBe(
      matchingOption
    );

    console.log(
      `Family Member ${memberNumber} ` +
      `Status selected: ${matchingOption}`
    );

    await this.waitForLoadingToComplete();

    return this.normalizeText(
      matchingOption
    );
  }

  async enterDateOfDeath(
    locator,
    dateOfDeath,
    memberNumber
  ) {
    const value =
      String(dateOfDeath || '')
        .trim()
        .replace(/\//g, '-');

    if (!value) {
      throw new Error(
        `DateOfDeath is required for ` +
        `Family Member ${memberNumber} ` +
        'when Status is Dead.'
      );
    }

    if (
      !/^\d{2}-\d{2}-\d{4}$/.test(
        value
      )
    ) {
      throw new Error(
        `Invalid DateOfDeath for Family Member ` +
        `${memberNumber}: "${value}". ` +
        'Use DD-MM-YYYY.'
      );
    }

    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      locator
    ).toBeEditable({
      timeout: 60000
    });

    /*
     * fill() works even though the field
     * prevents keyboard input using onkeypress.
     */
    await locator.fill(
      value
    );

    await locator.press(
      'Tab'
    );

    await expect(
      locator
    ).toHaveValue(
      value,
      {
        timeout: 30000
      }
    );

    console.log(
      `Family Member ${memberNumber} ` +
      `Date of Death entered: ${value}`
    );
  }

  async fillFamilyMember(
    memberNumber,
    data,
    sheetName
  ) {
    console.log(
      `===== Filling Family Member ` +
      `${memberNumber} =====`
    );

    if (!data) {
      throw new Error(
        `${sheetName} Excel data is undefined.`
      );
    }

    const fullName =
      this.getRequiredValue(
        data,
        'FullName',
        sheetName
      );

    const status =
      this.getRequiredValue(
        data,
        'Status',
        sheetName
      );

    const age =
      this.getRequiredValue(
        data,
        'Age',
        sheetName
      ).replace(/\.0$/, '');

    const healthStatus =
      this.getOptionalValue(
        data,
        'HealthStatus'
      );

    const dateOfDeath =
      this.getOptionalValue(
        data,
        'DateOfDeath'
      );

    const reasonOfDeath =
      this.getOptionalValue(
        data,
        'ReasonOfDeath'
      );

    if (!/^\d{1,3}$/.test(age)) {
      throw new Error(
        `Invalid Age for Family Member ` +
        `${memberNumber}: "${age}".`
      );
    }

    const locators =
      this.getFamilyMemberLocators(
        memberNumber
      );

    await expect(
      locators.fullName
    ).toBeVisible({
      timeout: 60000
    });

    await this.fillAndVerify(
      locators.fullName,
      fullName,
      `Family Member ${memberNumber} Full Name`
    );

    const selectedStatus =
      await this.selectStatus(
        locators.status,
        status,
        memberNumber
      );

    /*
     * The Age field is used as:
     *
     * Alive → Age
     * Dead  → Age at Death
     */
    await this.fillAndVerify(
      locators.age,
      age,
      selectedStatus === 'dead'
        ? `Family Member ${memberNumber} Age at Death`
        : `Family Member ${memberNumber} Age`
    );

    if (
      selectedStatus ===
      'alive'
    ) {
      if (!healthStatus) {
        throw new Error(
          `HealthStatus is required for ` +
          `Family Member ${memberNumber} ` +
          'when Status is Alive.'
        );
      }

      await this.fillAndVerify(
        locators.healthStatus,
        healthStatus,
        `Family Member ${memberNumber} Health Status`
      );

      console.log(
        `Family Member ${memberNumber} ` +
        'Alive condition completed.'
      );
    } else {
      await this.enterDateOfDeath(
        locators.dateOfDeath,
        dateOfDeath,
        memberNumber
      );

      if (!reasonOfDeath) {
        throw new Error(
          `ReasonOfDeath is required for ` +
          `Family Member ${memberNumber} ` +
          'when Status is Dead.'
        );
      }

      await this.fillAndVerify(
        locators.reasonOfDeath,
        reasonOfDeath,
        `Family Member ${memberNumber} Reason of Death`
      );

      console.log(
        `Family Member ${memberNumber} ` +
        'Dead condition completed.'
      );
    }

    console.log(
      `Family Member ${memberNumber} ` +
      'completed successfully.'
    );
  }

  async completeMedicalQuestionnaire({
    familyHistory1Data,
    familyHistory2Data
  }) {
    console.log(
      '===== Completing SP Medical Questionnaire ====='
    );

    await this.waitForPage();

    await this.fillFamilyMember(
      1,
      familyHistory1Data,
      'FamilyHistory1'
    );

    await this.fillFamilyMember(
      2,
      familyHistory2Data,
      'FamilyHistory2'
    );

    /*
     * Medical Yes/No questions and
     * Family Member 3 will be added after
     * their HTML locators are provided.
     */

    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.continueButton
    ).toBeEnabled({
      timeout: 60000
    });

    await this.continueButton
      .scrollIntoViewIfNeeded();

    await this.continueButton.click();

    console.log(
      'Medical Questionnaire Continue clicked.'
    );
  }
}

module.exports = MedicalQuestionnairePage;