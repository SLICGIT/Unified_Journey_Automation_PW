const { expect } = require('@playwright/test');

class AdditionalDetailsSection {
    constructor(page) {
        this.page = page;

        this.height =
            page.locator('#ddlkycheights');

        this.weight =
            page.locator('#txtbxkycweight');

        this.maritalStatus =
            page.locator('#ddlkycmartialsts');

        this.education =
            page.locator('#ddlkyceducation');

        this.occupation =
            page.locator('#ddlkycoccupdation');

        this.subOccupation =
            page.locator('#ddlkycsuboccupdation');

        this.annualIncome =
            page.locator('#txtbxkycincome');

        this.loadingOverlay =
            page.locator('#loading2');
    }

    async waitForSection() {

        console.log(
            'Waiting for Additional Details section...'
        );

        await expect(
            this.height
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Additional Details section loaded.'
        );
    }

    async selectDropdown(locator, value, fieldName) {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ''
        ) {
            console.log(
                `${fieldName} is empty in Excel. Skipping.`
            );
            return;
        }

        const text = String(value).trim();

        await locator.selectOption({
            label: text
        });

        console.log(
            `${fieldName} selected: ${text}`
        );
    }

    async fill(data) {

        console.log(
            '===== Filling Additional Details ====='
        );

        await this.waitForSection();

        await this.selectDropdown(
            this.height,
            data.Height,
            'Height'
        );

        if (
            data.Weight &&
            String(data.Weight).trim() !== ''
        ) {

            await this.weight.fill(
                String(data.Weight).trim()
            );

            console.log(
                `Weight entered: ${data.Weight}`
            );
        }

        await this.selectDropdown(
            this.maritalStatus,
            data.MaritalStatus,
            'Marital Status'
        );

        await this.selectDropdown(
            this.education,
            data.Education,
            'Education'
        );

        await this.selectDropdown(
            this.occupation,
            data.Occupation,
            'Occupation'
        );

        /*
         * Sub Occupation becomes enabled
         * after Occupation is selected.
         */

        if (
            data.SubOccupation &&
            String(data.SubOccupation).trim() !== ''
        ) {

            await this.subOccupation.waitFor({
                state: 'visible',
                timeout: 30000
            });

            await this.subOccupation.selectOption({
                label: String(
                    data.SubOccupation
                ).trim()
            });

            console.log(
                `Sub Occupation selected: ${data.SubOccupation}`
            );
        }

        if (
            data.AnnualIncome &&
            String(data.AnnualIncome).trim() !== ''
        ) {

            await this.annualIncome.fill(
                String(
                    data.AnnualIncome
                ).trim()
            );

            console.log(
                `Annual Income entered: ${data.AnnualIncome}`
            );
        }

        console.log(
            'Additional Details completed successfully.'
        );
    }
}

module.exports = AdditionalDetailsSection;