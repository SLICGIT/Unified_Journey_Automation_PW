class OtpPage {
  constructor(page) {
    this.page = page;

    this.otpInputs = [
      '#txtBxOtpFirst',
      '#txtBxOtpSecond',
      '#txtBxOtpThird',
      '#txtBxOtpFourth'
    ];

    this.verifyBtn = '#btnBDOtpVerify';
  }

  async waitForOtpFields() {
    await this.page.locator(this.otpInputs[0]).waitFor({ state: 'visible' });
  }

  async enterOtpManually() {
    console.log("👉 Please enter OTP manually...");

    await this.page.waitForFunction((ids) => {
      return ids.every(id => {
        const el = document.querySelector(id);
        return el && el.value.length === 1;
      });
    }, this.otpInputs);
  }

  async clickVerify() {
    await this.page.locator(this.verifyBtn).click();
  }

  async completeOtpFlow() {
    await this.waitForOtpFields();
    await this.enterOtpManually();
    await this.page.keyboard.press('Tab'); // move focus if needed
    await this.clickVerify();
  }
}

module.exports = { OtpPage };