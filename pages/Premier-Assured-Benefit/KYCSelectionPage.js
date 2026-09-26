const { expect } = require('@playwright/test');

class KYCSelectionPage {

    constructor(page) {

        this.page = page;

        this.manualKycRadio =
            page.locator('#manualkycRadio');

        this.continueButton =
            page.locator('#btncontinue_1');
    }

    async waitForPage() {

        console.log('Waiting for KYC Selection page...');

        await expect(this.manualKycRadio).toBeVisible({
            timeout: 120000
        });

        console.log('KYC Selection page loaded.');
    }

    async selectManualKYC() {

        console.log('Selecting Manual KYC...');

        await this.manualKycRadio.check();

        await expect(this.manualKycRadio).toBeChecked();

        console.log('Manual KYC selected.');
    }

    async clickContinue() {

    console.log(
        'Clicking KYC Continue...'
    );

    await expect(
        this.continueButton
    ).toBeVisible({
        timeout: 30000
    });

    await expect(
        this.continueButton
    ).toBeEnabled({
        timeout: 30000
    });

    await this.continueButton.click();

    await expect(
        this.manualKycRadio
    ).toBeHidden({
        timeout: 120000
    });

    console.log(
        'KYC Continue clicked.'
    );
}

    async completeKYCSelection() {

    await this.waitForPage();

    await this.selectManualKYC();

    await this.clickContinue();

    return this.page;
}

}

module.exports = KYCSelectionPage;