const { expect } = require('@playwright/test');

class KYCSelectionPage {

    constructor(page) {

        this.page = page;

        // Main KYC selection container
        this.kycSelectionContainer = page.locator(
            'text=Do you wish to proceed with?'
        );

        // KYC Radio Buttons
        this.eKycRadio = page.locator(
            '#ekycRadio'
        );

        this.cKycRadio = page.locator(
            '#ckycRadio'
        );

        this.manualKycRadio = page.locator(
            '#manualkycRadio'
        );

        // Labels
        this.manualKycLabel = page.locator(
            'label[for="manualkycRadio"]'
        );

        // Continue button
        this.continueButton = page.getByRole(
            'button',
            {
                name: 'Continue',
                exact: true
            }
        );
    }


    // ============================================================
    // WAIT FOR KYC SELECTION PAGE
    // ============================================================

    async waitForPage() {

        console.log(
            'Waiting for KYC Selection page...'
        );

        await this.manualKycRadio.waitFor({
            state: 'attached',
            timeout: 60000
        });

        await this.page.waitForTimeout(1000);

        console.log(
            'KYC Selection page loaded.'
        );
    }


    // ============================================================
    // SELECT MANUAL KYC
    // ============================================================

    async selectManualKYC() {

        console.log(
            'Selecting Manual KYC...'
        );

        await this.manualKycRadio.waitFor({
            state: 'attached',
            timeout: 60000
        });


        // --------------------------------------------------------
        // Check whether Manual KYC is already selected
        // --------------------------------------------------------

        const isChecked =
            await this.manualKycRadio.isChecked()
                .catch(() => false);

        if (isChecked) {

            console.log(
                'Manual KYC is already selected.'
            );

            return;
        }


        // --------------------------------------------------------
        // METHOD 1:
        // Click associated label
        // --------------------------------------------------------

        const labelCount =
            await this.manualKycLabel.count();

        if (labelCount > 0) {

            console.log(
                'Clicking Manual KYC label...'
            );

            await this.manualKycLabel.click({
                force: true
            });

            await this.page.waitForTimeout(500);
        }


        // --------------------------------------------------------
        // METHOD 2:
        // Click radio using JavaScript if still not selected
        // --------------------------------------------------------

        let selected =
            await this.manualKycRadio.isChecked()
                .catch(() => false);

        if (!selected) {

            console.log(
                'Manual KYC not selected through label. Clicking radio directly...'
            );

            await this.manualKycRadio.evaluate(
                element => element.click()
            );

            await this.page.waitForTimeout(500);
        }


        // --------------------------------------------------------
        // METHOD 3:
        // Click nearest clickable parent/container
        // --------------------------------------------------------

        selected =
            await this.manualKycRadio.isChecked()
                .catch(() => false);

        if (!selected) {

            console.log(
                'Trying Manual KYC parent container...'
            );

            await this.manualKycRadio.evaluate(
                element => {

                    const parent =
                        element.closest(
                            'label, .form-check, div'
                        );

                    if (parent) {
                        parent.click();
                    }

                }
            );

            await this.page.waitForTimeout(500);
        }


        // --------------------------------------------------------
        // FINAL VERIFICATION
        // --------------------------------------------------------

        await expect(
            this.manualKycRadio
        ).toBeChecked({
            timeout: 10000
        });

        console.log(
            'Manual KYC selected successfully.'
        );
    }


    // ============================================================
    // CLICK CONTINUE
    // ============================================================

    async clickContinue() {

        console.log(
            'Clicking Continue after selecting Manual KYC...'
        );

        await this.continueButton.waitFor({
            state: 'visible',
            timeout: 60000
        });

        await expect(
            this.continueButton
        ).toBeEnabled({
            timeout: 30000
        });

        await this.continueButton.click();

        console.log(
            'Continue clicked successfully.'
        );

        await this.page.waitForTimeout(1500);
    }


    // ============================================================
    // COMPLETE KYC SELECTION
    // ============================================================

    async completeKYCSelection() {

        console.log(
            '===== Starting KYC Selection ====='
        );

        await this.waitForPage();

        await this.selectManualKYC();

        await this.clickContinue();

        console.log(
            '===== KYC Selection completed successfully ====='
        );
    }

}


module.exports = KYCSelectionPage;