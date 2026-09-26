const { expect } = require('@playwright/test');

class ENachSuccessPage {

    constructor(page) {

        this.page = page;

        this.successHeading =
            page.getByText('eNACH Registration Successful');

        this.continueButton =
            page.locator('#btnContinue');
    }

    async waitForPage() {

        console.log('Waiting for eNACH Registration Successful page...');

        await expect(this.successHeading).toBeVisible({
            timeout: 180000
        });

        console.log('eNACH Registration Successful page loaded.');
    }

    async clickContinue() {

    console.log('Clicking Continue...');

    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();

    await Promise.all([
        this.page.waitForLoadState('domcontentloaded'),
        this.continueButton.click()
    ]);

    console.log('Continue clicked.');
}

    async completeSuccessPage() {

        await this.waitForPage();

        await this.clickContinue();

        return this.page;
    }

}

module.exports = ENachSuccessPage;