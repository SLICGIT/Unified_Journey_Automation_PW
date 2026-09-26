const {
    expect
} = require('@playwright/test');

class NomineeBankDetailsSection {
    constructor(page) {
        this.page = page;

        /*
         * Nominee Bank Account Details fields.
         * These locators are for Nominee 1.
         */
        this.accountNumber =
            page.locator(
                '#txtbxkycaccno1'
            );

        this.ifscCode =
            page.locator(
                '#txtbxkycifsccode1'
            );

        this.bankName =
            page.locator(
                '#txtbxkycbankname1'
            );
    }

    /*
     * Wait for Nominee Bank Details section.
     */
    async waitForSection() {
        console.log(
            'Waiting for Nominee Bank Account Details section...'
        );

        await expect(
            this.accountNumber
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.ifscCode
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Nominee Bank Account Details section loaded.'
        );
    }

    /*
     * Fill a mandatory text field.
     */
    async fillMandatoryText(
        locator,
        value,
        fieldName
    ) {
        const text =
            String(
                value ?? ''
            ).trim();

        if (!text) {
            throw new Error(
                `${fieldName} is empty in ` +
                'NomineeBankDetails Excel sheet.'
            );
        }

        await expect(
            locator
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            locator
        ).toBeEditable({
            timeout: 30000
        });

        await locator.fill(
            text
        );

        await expect(
            locator
        ).toHaveValue(
            text
        );

        console.log(
            `${fieldName} entered: ${text}`
        );
    }

    /*
     * Fill account number.
     */
    async fillAccountNumber(
        accountNumber
    ) {
        const accountValue =
            String(
                accountNumber ?? ''
            )
                .replace(/\s+/g, '')
                .trim();

        if (
            accountValue.length < 9 ||
            accountValue.length > 18
        ) {
            throw new Error(
                'Nominee Account Number must contain ' +
                'between 9 and 18 digits.'
            );
        }

        if (
            !/^\d+$/.test(
                accountValue
            )
        ) {
            throw new Error(
                'Nominee Account Number must contain ' +
                'digits only.'
            );
        }

        await this.fillMandatoryText(
            this.accountNumber,
            accountValue,
            'Nominee Account Number'
        );
    }

    /*
     * Fill IFSC and trigger Bank Name lookup.
     */
    async fillIfscCode(
        ifscCode
    ) {
        const ifscValue =
            String(
                ifscCode ?? ''
            )
                .replace(/\s+/g, '')
                .trim()
                .toUpperCase();

        if (
            !/^[A-Z]{4}0[A-Z0-9]{6}$/
                .test(ifscValue)
        ) {
            throw new Error(
                `Invalid Nominee IFSC Code: ` +
                `"${ifscCode}".`
            );
        }

        await expect(
            this.ifscCode
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.ifscCode
        ).toBeEditable({
            timeout: 30000
        });

        await this.ifscCode.fill(
            ifscValue
        );

        await expect(
            this.ifscCode
        ).toHaveValue(
            ifscValue
        );

        console.log(
            `Nominee IFSC Code entered: ${ifscValue}`
        );

        /*
         * Trigger onfocusout:
         * getBanKAndBranch(...)
         */
        await this.ifscCode.press(
            'Tab'
        );

        console.log(
            'Waiting for Nominee Bank Name auto-population...'
        );

        await expect(
            this.bankName
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.bankName
        ).not.toHaveValue('', {
            timeout: 60000
        });

        console.log(
            'Nominee Bank Name auto-populated:',
            await this.bankName.inputValue()
        );
    }

    /*
     * Complete Nominee Bank Details.
     */
    async fill(
        nomineeBankData
    ) {
        if (!nomineeBankData) {
            throw new Error(
                'NomineeBankDetails Excel data is missing.'
            );
        }

        console.log(
            '===== Filling Nominee Bank Account Details ====='
        );

        console.log(
            'Nominee Bank Excel data:',
            nomineeBankData
        );

        await this.waitForSection();

        await this.fillAccountNumber(
            nomineeBankData.AccountNumber
        );

        await this.fillIfscCode(
            nomineeBankData.IFSCCode
        );

        /*
         * Bank Name is auto-populated and disabled.
         * Do not use fill() on it.
         */
        const populatedBankName =
            String(
                await this.bankName.inputValue()
            ).trim();

        if (!populatedBankName) {
            throw new Error(
                'Nominee Bank Name was not auto-populated.'
            );
        }

        /*
         * Optional verification when BankName
         * is provided in Excel.
         */
        const expectedBankName =
            String(
                nomineeBankData.BankName || ''
            )
                .trim()
                .toUpperCase();

        if (expectedBankName) {
            expect(
                populatedBankName.toUpperCase()
            ).toContain(
                expectedBankName
            );

            console.log(
                `Nominee Bank Name verified: ` +
                `${populatedBankName}`
            );
        }

        console.log(
            'Nominee Bank Account Details completed successfully.'
        );
    }
}

module.exports =
    NomineeBankDetailsSection;