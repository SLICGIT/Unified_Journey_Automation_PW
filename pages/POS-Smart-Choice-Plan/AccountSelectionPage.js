const {
  expect,
} = require('@playwright/test');

class AccountSelectionPage {
  constructor(page) {
    this.page = page;

    this.existingAccountHeading =
      page.getByText(
        'Select an Existing Account',
        {
          exact: true,
        }
      );

    this.makeNewProposal =
      page.locator(
        '#newprpslbtn'
      );

    this.proceedWithSelection =
      page.getByText(
        'Proceed with Selection',
        {
          exact: true,
        }
      );

    this.planDetailsHeading =
      page.getByText(
        'Plan Details',
        {
          exact: true,
        }
      );

    this.investmentAmount =
      page.locator(
        '#txtInvestment_dsktp'
      );
  }

  /*
   * Used when EndToEnd.spec.js already confirmed
   * that the Existing Account page is displayed.
   *
   * flowType:
   * NEW      -> Make a New Proposal
   * EXISTING -> Proceed with Selection
   */
  async handleSelection(flowType) {
    const action = String(
      flowType || ''
    )
      .trim()
      .toUpperCase();

    console.log(
      `Account Selection action: ${action}`
    );

    await expect(
      this.existingAccountHeading
    ).toBeVisible({
      timeout: 30000,
    });

    if (action === 'NEW') {
      await expect(
        this.makeNewProposal
      ).toBeVisible({
        timeout: 30000,
      });

      await expect(
        this.makeNewProposal
      ).toBeEnabled({
        timeout: 30000,
      });

      await this.makeNewProposal
        .scrollIntoViewIfNeeded();

      await this.makeNewProposal
        .click();

      console.log(
        'Make a New Proposal clicked'
      );
    } else if (action === 'EXISTING') {
      await expect(
        this.proceedWithSelection
      ).toBeVisible({
        timeout: 30000,
      });

      await expect(
        this.proceedWithSelection
      ).toBeEnabled({
        timeout: 30000,
      });

      await this.proceedWithSelection
        .scrollIntoViewIfNeeded();

      await this.proceedWithSelection
        .click();

      console.log(
        'Proceed with Selection clicked'
      );
    } else {
      throw new Error(
        `Invalid Existing Account FlowType: ` +
        `"${flowType}". ` +
        'Allowed values are NEW or EXISTING.'
      );
    }
  }

  /*
   * Optional method.
   * Use this only when another test wants this page object
   * to check whether the Existing Account page appeared.
   */
  async handleExistingAccount(
    existingAccountData
  ) {
    if (!existingAccountData) {
      throw new Error(
        'Existing Account Excel data is undefined.'
      );
    }

    const existingAccountPageDisplayed =
      await this.existingAccountHeading
        .waitFor({
          state: 'visible',
          timeout: 10000,
        })
        .then(() => true)
        .catch(() => false);

    if (existingAccountPageDisplayed) {
      await this.handleSelection(
        existingAccountData.FlowType
      );
    } else {
      console.log(
        'Existing Account page not displayed'
      );

      console.log(
        'Continuing directly to Plan Details'
      );
    }

    await this.waitForPlanDetails();
  }

  async waitForPlanDetails() {
    await Promise.any([
      this.planDetailsHeading.waitFor({
        state: 'visible',
        timeout: 60000,
      }),

      this.investmentAmount.waitFor({
        state: 'visible',
        timeout: 60000,
      }),
    ]);

    console.log(
      'Plan Details page displayed'
    );
  }
}

module.exports = {
  AccountSelectionPage,
};