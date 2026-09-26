const { expect } = require('@playwright/test');

class AccountSelectionPage {
  constructor(page) {
    this.page = page;

    this.existingHeading =
      page.getByText(
        'Select an Existing Account',
        { exact: true }
      );

    this.records =
      page.locator('.proposaldiv');

    this.proceedButton =
      page.locator('#proceedbtn');

    this.makeNewProposalButton =
      page.locator('#newprpslbtn');

    this.loaderText =
      page.getByText(
        'Fetching Details',
        { exact: true }
      );

    this.planDetailsHeading =
      page.getByText(
        'Plan Details',
        { exact: true }
      );
  }

  async waitForLoaderToDisappear() {
    const loaderVisible =
      await this.loaderText
        .isVisible()
        .catch(() => false);

    if (loaderVisible) {
      console.log(
        'Waiting for Fetching Details loader...'
      );

      await this.loaderText.waitFor({
        state: 'hidden',
        timeout: 60000
      });

      console.log(
        'Fetching Details loader closed.'
      );
    }
  }

  async waitForPage() {
    await this.waitForLoaderToDisappear();

    console.log(
      'Checking page displayed after OTP verification...'
    );

    const pageType =
      await Promise.race([
        this.existingHeading
          .waitFor({
            state: 'visible',
            timeout: 60000
          })
          .then(() => 'ACCOUNT_SELECTION'),

        this.makeNewProposalButton
          .waitFor({
            state: 'visible',
            timeout: 60000
          })
          .then(() => 'ACCOUNT_SELECTION'),

        this.planDetailsHeading
          .waitFor({
            state: 'visible',
            timeout: 60000
          })
          .then(() => 'PLAN_DETAILS')
      ]);

    if (
      pageType === 'PLAN_DETAILS' ||
      await this.planDetailsHeading
        .isVisible()
        .catch(() => false)
    ) {
      console.log(
        'Directly reached Plan Details page.'
      );

      return 'PLAN_DETAILS';
    }

    if (
      await this.existingHeading
        .isVisible()
        .catch(() => false) ||
      await this.makeNewProposalButton
        .isVisible()
        .catch(() => false)
    ) {
      console.log(
        'Account Selection page displayed.'
      );

      return 'ACCOUNT_SELECTION';
    }

    throw new Error(
      'Unable to identify the page displayed ' +
      'after OTP verification.'
    );
  }

  async selectExistingAccount() {
    console.log(
      'Selecting existing proposal...'
    );

    await expect(
      this.records.first()
    ).toBeVisible({
      timeout: 60000
    });

    await this.records
      .first()
      .scrollIntoViewIfNeeded();

    await this.records
      .first()
      .click();

    await expect(
      this.proceedButton
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.proceedButton
    ).toBeEnabled({
      timeout: 30000
    });

    await this.proceedButton.click();

    console.log(
      'Proceed with Selection clicked.'
    );

    await this.waitForLoaderToDisappear();
  }

  async clickMakeNewProposal() {
    console.log(
      'Waiting for Make a New Proposal button...'
    );

    await expect(
      this.makeNewProposalButton
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.makeNewProposalButton
    ).toBeEnabled({
      timeout: 60000
    });

    await this.makeNewProposalButton
      .scrollIntoViewIfNeeded();

    await this.makeNewProposalButton.click();

    console.log(
      'Make a New Proposal button clicked.'
    );

    await this.waitForLoaderToDisappear();
  }

  /*
   * Kept for backward compatibility.
   */
  async createNewAccount() {
    await this.clickMakeNewProposal();
  }

  async handleSelection(flowType) {
    const normalizedFlowType =
      String(flowType || '')
        .trim()
        .toUpperCase();

    const pageType =
      await this.waitForPage();

    if (pageType === 'PLAN_DETAILS') {
      console.log(
        'Account Selection skipped because ' +
        'Plan Details is already displayed.'
      );

      return 'PLAN_DETAILS';
    }

    if (
      normalizedFlowType === 'EXISTING'
    ) {
      await this.selectExistingAccount();
    } else if (
      normalizedFlowType === 'NEW'
    ) {
      await this.clickMakeNewProposal();
    } else {
      throw new Error(
        `Invalid FlowType: "${flowType}". ` +
        'Use NEW or EXISTING.'
      );
    }

    return 'ACCOUNT_SELECTION';
  }
}

module.exports = {
  AccountSelectionPage
};