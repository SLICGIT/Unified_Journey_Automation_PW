
const { expect } = require('@playwright/test');

class BasicDetailsPage {
  constructor(page) {
    this.page = page;

    this.insureFor = page.getByRole(
      'combobox',
      { name: 'Insure For *' }
    );

    this.fullName = page.locator(
      '#txtbxBDName'
    );

    this.mobileNumber = page.getByRole(
      'textbox',
      { name: 'Mobile Number' }
    );

    this.email = page.getByRole(
      'textbox',
      { name: 'E-mail ID' }
    );

    // Preferred Language
    this.preferredLanguage = page.locator(
      '#selBDLang'
    );

    this.dob = page.getByPlaceholder(
      'DD-MM-YYYY'
    );

    this.gender = page.getByRole(
      'combobox',
      { name: 'Gender' }
    );

    this.annualIncome = page.locator(
      '#selAnnIncome'
    );

    this.consentCheckbox = page.locator(
      '#chkbxBDChecked'
    );

    this.getOtpButton = page.locator(
      '#btnBDgetotp'
    );
  }

  async fillBasicDetails(row) {
    if (!row) {
      throw new Error(
        'Basic Details Excel data is undefined.'
      );
    }

    await this.insureFor.selectOption({
      label: String(
        row.AI_insureFor
      ).trim()
    });

    await this.fullName.fill(
      String(
        row.AI_FullName
      ).trim()
    );

    await this.mobileNumber.fill(
      String(
        row.AI_Mobile
      ).trim()
    );

    await this.email.fill(
      String(
        row.AI_Email
      ).trim()
    );

    // Select Preferred Language
    const preferredLanguage = String(
      row.AI_preferredLanguage
    ).trim();

    await this.preferredLanguage.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.preferredLanguage.selectOption({
      label: preferredLanguage
    });

    await expect(
      this.preferredLanguage.locator('option:checked')
    ).toHaveText(
      preferredLanguage
    );

    console.log(
      `Preferred Language selected: ${preferredLanguage}`
    );

    const dobValue = String(
      row.AI_dob
    ).trim();

    await this.dob.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.dob.evaluate(
      (element, value) => {
        element.value = value;

        element.dispatchEvent(
          new Event('input', {
            bubbles: true
          })
        );

        element.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );

        element.dispatchEvent(
          new Event('blur', {
            bubbles: true
          })
        );
      },
      dobValue
    );

    await this.gender.selectOption({
      label: String(
        row.AI_gender
      ).trim()
    });

    await this.annualIncome.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.annualIncome.selectOption({
      label: String(
        row.AI_income
      ).trim()
    });

    await expect(
      this.annualIncome.locator('option:checked')
    ).toHaveText(
      String(
        row.AI_income
      ).trim()
    );

    console.log(
      `Annual Income selected: ${row.AI_income}`
    );

    if (
      !(await this.consentCheckbox.isChecked())
    ) {
      await this.consentCheckbox.check();
    }

    await expect(
      this.consentCheckbox
    ).toBeChecked();

    console.log(
      'Basic Details fields completed'
    );
  }

  async clickGetOtp() {
    await expect(
      this.getOtpButton
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.getOtpButton
    ).toBeEnabled({
      timeout: 30000
    });

    await this.getOtpButton
      .scrollIntoViewIfNeeded();

    await this.getOtpButton.click();

    console.log(
      'Get OTP clicked'
    );
  }
}

module.exports = {
  BasicDetailsPage
};

