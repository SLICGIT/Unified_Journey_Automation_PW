const { expect } = require('@playwright/test');

class HealthQuestionnairePage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByText(
      'Questionnaire',
      {
        exact: true
      }
    );

    this.goodHealthCheckbox = page.locator(
      '#chkbxGoodHealth'
    );

    this.continueButton = page.locator(
      '#btnContinue'
    );

    this.loadingOverlay = page.locator(
      '#loading2'
    );
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
        'Waiting for SP Health Questionnaire page...'
    );

    await expect(
        this.goodHealthCheckbox
    ).toBeAttached({
        timeout: 120000
    });

    await expect(
        this.continueButton
    ).toBeVisible({
        timeout: 120000
    });

    await this.waitForLoadingToComplete();

    console.log(
        'SP Health Questionnaire page loaded.'
    );
    }

  async completeQuestionnaire() {
    console.log(
      '===== Completing SP Health Questionnaire ====='
    );

    await this.waitForPage();

    /*
     * Good Health must be Yes.
     * All remaining questions stay at their
     * default No values.
     */
    if (
      !await this.goodHealthCheckbox
        .isChecked()
        .catch(() => false)
    ) {
      await this.goodHealthCheckbox
        .setChecked(true);
    }

    await expect(
      this.goodHealthCheckbox
    ).toBeChecked({
      timeout: 120000
    });

    console.log(
      'Good Health selected: Yes'
    );

    console.log(
      'Remaining questionnaire answers retained as No.'
    );

    console.log(
      'SP Health Questionnaire completed successfully.'
    );
  }

  async clickContinue() {
    console.log(
      'Clicking Questionnaire Continue...'
    );

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

    await this.waitForLoadingToComplete();

    /*
     * Confirm that the questionnaire page
     * closed after clicking Continue.
     */
    await expect(
      this.heading
    ).toBeHidden({
      timeout: 120000
    });

    console.log(
      'Questionnaire Continue clicked successfully.'
    );
  }
}

module.exports = HealthQuestionnairePage;