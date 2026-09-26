const { expect } = require('@playwright/test');

class ENachSuccessPage {

    constructor(page) {

        this.page = page;

        // eNACH Success heading
        this.successHeading =
            page.getByText(
                'eNACH Registration Successful',
                {
                    exact: true
                }
            );

        // eNACH Continue button
        this.continueButton =
            page.locator('#btnContinue');
    }


    // ======================================================
    // WAIT FOR eNACH SUCCESS PAGE
    // ======================================================

    async waitForPage() {

        console.log(
            'Waiting for eNACH Registration Successful page...'
        );

        await expect(
            this.successHeading
        ).toBeVisible({
            timeout: 180000
        });

        console.log(
            'eNACH Registration Successful page loaded.'
        );
    }


    // ======================================================
    // CLICK CONTINUE
    // ======================================================

    async clickContinue() {

        console.log(
            'Clicking Continue...'
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

        await this.continueButton.scrollIntoViewIfNeeded();

        await this.continueButton.click();

        console.log(
            'eNACH Continue clicked.'
        );
    }


    // ======================================================
    // COMPLETE eNACH SUCCESS PAGE
    // ======================================================

    async completeSuccessPage() {

        await this.waitForPage();

        await this.clickContinue();

        return this.page;
    }

}

module.exports = ENachSuccessPage;