const { expect } = require('@playwright/test');

class AadhaarValidationPage {
  constructor(page) {
    this.page = page;

    this.languageDropdown =
      page.getByRole('combobox').first();

    this.termsCheckbox =
      page.getByRole('checkbox', {
        name: /I hereby authorize Protean/i,
      });

    this.aadhaarTextbox =
      page.getByRole('textbox', {
        name: /Enter VID\/Aadhaar/i,
      });

    this.sendOtpButton =
      page.getByRole('button', {
        name: /SEND OTP/i,
      });

    /*
     * OTP control appears only after SEND OTP.
     * Multiple possible selectors are included.
     */
    this.otpInput = page.locator(
      [
        '#otpInput',
        'input[name*="otp" i]',
        'input[id*="otp" i]',
        'input[placeholder*="OTP" i]',
      ].join(', ')
    ).first();

    this.verifyOtpButton =
      page.getByRole('button', {
        name: /Verify OTP|Submit OTP|Submit/i,
      }).first();

    this.resendOtpButton =
      page.getByRole('button', {
        name: /Resend OTP/i,
      }).first();

    this.registrationSuccessMessage =
      page.getByText(
        /eNACH Registration Successful/i
      ).first();
  }

  async waitForPage() {
    console.log(
      'Waiting for Aadhaar authentication page...'
    );

    await expect(
      this.languageDropdown
    ).toBeVisible({
      timeout: 120000,
    });

    await expect(
      this.termsCheckbox
    ).toBeVisible({
      timeout: 120000,
    });

    await expect(
      this.aadhaarTextbox
    ).toBeVisible({
      timeout: 120000,
    });

    console.log(
      'Aadhaar authentication page loaded.'
    );
  }

  async selectLanguage(language) {
    const requiredLanguage = String(
      language || ''
    ).trim();

    if (!requiredLanguage) {
      throw new Error(
        'Language is empty in AadhaarDetails sheet.'
      );
    }

    console.log(
      `Selecting language: ${requiredLanguage}`
    );

    await expect(
      this.languageDropdown
    ).toBeEnabled({
      timeout: 30000,
    });

    const options =
      await this.languageDropdown
        .locator('option')
        .allTextContents();

    const matchingLanguage = options.find(
      option =>
        option.trim().toUpperCase() ===
        requiredLanguage.toUpperCase()
    );

    if (!matchingLanguage) {
      throw new Error(
        `Language "${requiredLanguage}" was not found. ` +
        `Available options: ${options.join(', ')}`
      );
    }

    await this.languageDropdown.selectOption({
      label: matchingLanguage.trim(),
    });

    await expect(
      this.languageDropdown
    ).not.toHaveValue('');

    console.log(
      `Language "${matchingLanguage.trim()}" selected.`
    );
  }

  async acceptTerms() {
    console.log(
      'Selecting Aadhaar consent checkbox...'
    );

    await expect(
      this.termsCheckbox
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.termsCheckbox
    ).toBeEnabled({
      timeout: 30000,
    });

    if (
      !(await this.termsCheckbox.isChecked())
    ) {
      await this.termsCheckbox.check();
    }

    await expect(
      this.termsCheckbox
    ).toBeChecked();

    console.log(
      'Aadhaar consent checkbox selected.'
    );
  }

  async enterAadhaarNumber(aadhaarNumber) {
    const aadhaar = String(
      aadhaarNumber || ''
    )
      .trim()
      .replace(/\s/g, '');

    if (!/^\d{12}$|^\d{16}$/.test(aadhaar)) {
      throw new Error(
        `Invalid Aadhaar/VID value: "${aadhaar}". ` +
        'Aadhaar must contain 12 digits, or VID must contain 16 digits.'
      );
    }

    await expect(
      this.termsCheckbox
    ).toBeChecked();

    console.log(
      'Entering Aadhaar/VID number...'
    );

    await expect(
      this.aadhaarTextbox
    ).toBeEditable({
      timeout: 30000,
    });

    await this.aadhaarTextbox.click();

    await this.aadhaarTextbox.fill('');

    await this.aadhaarTextbox
      .pressSequentially(
        aadhaar,
        {
          delay: 100,
        }
      );

    await this.aadhaarTextbox.press('Tab');

    await expect(
      this.aadhaarTextbox
    ).toHaveValue(aadhaar, {
      timeout: 10000,
    });

    console.log(
      'Aadhaar/VID number entered successfully.'
    );
  }

  async clickSendOtp() {
    console.log(
      'Waiting for SEND OTP button...'
    );

    await expect(
      this.sendOtpButton
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.sendOtpButton
    ).toBeEnabled({
      timeout: 30000,
    });

    await this.sendOtpButton
      .scrollIntoViewIfNeeded();

    await this.sendOtpButton.click();

    console.log(
      'SEND OTP button clicked.'
    );
  }

  async handleManualOtp() {
    console.log(
      'Waiting for Aadhaar OTP field...'
    );

    await expect(
      this.otpInput
    ).toBeVisible({
      timeout: 60000,
    });

    await expect(
      this.otpInput
    ).toBeEditable({
      timeout: 30000,
    });

    console.log(
      'Enter the Aadhaar OTP manually in the browser.'
    );

    /*
     * Wait for the user to enter the OTP manually.
     */
    await expect(
      this.otpInput
    ).toHaveValue(/\d+/, {
      timeout: 180000,
    });

    const enteredOtp =
      await this.otpInput.inputValue();

    console.log(
      `OTP entered. Length: ${enteredOtp.length}`
    );

    await expect(
      this.verifyOtpButton
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.verifyOtpButton
    ).toBeEnabled({
      timeout: 30000,
    });

    console.log(
      'Clicking OTP Submit/Verify button...'
    );

    await this.verifyOtpButton.click();

    console.log(
      'OTP Submit/Verify button clicked.'
    );
  }

  async resendOtp() {
    await expect(
      this.resendOtpButton
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.resendOtpButton
    ).toBeEnabled({
      timeout: 30000,
    });

    await this.resendOtpButton.click();

    console.log(
      'Resend OTP button clicked.'
    );
  }

  async waitForRegistrationSuccess() {
    console.log(
      'Waiting for eNACH Registration Successful page...'
    );

    await expect(
      this.registrationSuccessMessage
    ).toBeVisible({
      timeout: 180000,
    });

    console.log(
      'eNACH Registration Successful page loaded.'
    );
  }

  async completeAadhaarValidation(
    aadhaarData
  ) {
    if (!aadhaarData) {
      throw new Error(
        'AadhaarDetails Excel data was not found.'
      );
    }

    console.log(
      'Aadhaar Details Excel data:',
      aadhaarData
    );

    await this.waitForPage();

    console.log(
      'Step 1: Selecting language...'
    );

    await this.selectLanguage(
      aadhaarData.Language
    );

    console.log(
      'Step 2: Accepting Aadhaar terms...'
    );

    await this.acceptTerms();

    console.log(
      'Step 3: Entering Aadhaar number...'
    );

    await this.enterAadhaarNumber(
      aadhaarData.AadhaarNumber
    );

    console.log(
      'Step 4: Clicking SEND OTP...'
    );

    await this.clickSendOtp();

    console.log(
      'Step 5: Waiting for manual Aadhaar OTP...'
    );

    await this.handleManualOtp();

    console.log(
      'Step 6: Waiting for registration success...'
    );

    await this.waitForRegistrationSuccess();

    console.log(
      'Aadhaar Validation completed successfully.'
    );
  }
}

module.exports = AadhaarValidationPage;