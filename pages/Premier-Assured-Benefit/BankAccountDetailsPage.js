const {
    expect
} = require('@playwright/test');


class BankAccountDetailsPage {
    constructor(page) {
        this.page = page;

        /*
         * Account Details fields.
         */
        this.accountNumber =
            page.locator(
                '#txtbxBDAccNumber'
            );

        this.confirmAccountNumber =
            page.locator(
                '#txtbxBDCnfAccNumber'
            );

        this.ifscCode =
            page.locator(
                '#txtbxBDIFSCCode'
            );

        /*
         * Auto-populated Account Information.
         */
        this.branch =
            page.locator(
                '#txtbxBDBranch'
            );

        this.bank =
            page.locator(
                '#txtbxBDBank'
            );

        this.accountType =
            page.locator(
                '#selAccountType'
            );

        this.accountHolderName =
            page.locator(
                '#txtbxBDAccHolderName'
            );

        /*
         * Action buttons.
         */
        this.validateButton =
            page.locator(
                '#btnValidation_1'
            );

        this.proceedButton =
            page.locator(
                '#btnProceed_1'
            );

        /*
         * Bank validation failure message.
         *
         * This message is allowed in UAT.
         */
        this.validationFailureMessage =
            page.getByText(
                'Failed to validate your account.',
                {
                    exact: true
                }
            );

        /*
         * Possible next pages.
         */
        this.questionnaireHeading =
            page.getByText(
                'Questionnaire',
                {
                    exact: true
                }
            );

        this.uploadDocumentsPage =
            page.locator(
                '#ddlkycfile_S_1'
            );
    }


    /*
     * Wait for Bank Account Details page.
     */
    async waitForPage() {
        console.log(
            'Waiting for Bank Account Details page...'
        );

        await expect(
            this.accountNumber
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.confirmAccountNumber
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.ifscCode
        ).toBeVisible({
            timeout: 120000
        });

        console.log(
            'Bank Account Details page loaded.'
        );
    }


    /*
     * Validate Account Number format.
     */
    normalizeAccountNumber(
        accountNumber
    ) {
        const value =
            String(
                accountNumber ?? ''
            )
                .replace(/\s+/g, '')
                .trim();

        if (!value) {
            throw new Error(
                'AccountNumber is empty in ' +
                'BankAccountDetails Excel sheet.'
            );
        }

        if (
            !/^\d{9,18}$/.test(
                value
            )
        ) {
            throw new Error(
                'AccountNumber must contain ' +
                'between 9 and 18 digits.'
            );
        }

        return value;
    }


    /*
     * Validate IFSC format.
     */
    normalizeIfscCode(
        ifscCode
    ) {
        const value =
            String(
                ifscCode ?? ''
            )
                .replace(/\s+/g, '')
                .trim()
                .toUpperCase();

        if (!value) {
            throw new Error(
                'IFSCCode is empty in ' +
                'BankAccountDetails Excel sheet.'
            );
        }

        if (
            !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
                value
            )
        ) {
            throw new Error(
                `Invalid IFSC Code: "${ifscCode}".`
            );
        }

        return value;
    }


    /*
     * Fill mandatory text field.
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
                'BankAccountDetails Excel sheet.'
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
     * Enter Account Number and Confirm Account Number.
     */
    async fillAccountNumbers(
        bankAccountData
    ) {
        const accountNumber =
            this.normalizeAccountNumber(
                bankAccountData.AccountNumber
            );

        const confirmAccountNumber =
            this.normalizeAccountNumber(
                bankAccountData.ConfirmAccountNumber ||
                bankAccountData.AccountNumber
            );

        if (
            accountNumber !==
            confirmAccountNumber
        ) {
            throw new Error(
                'AccountNumber and ConfirmAccountNumber ' +
                'do not match in Excel.'
            );
        }

        await this.fillMandatoryText(
            this.accountNumber,
            accountNumber,
            'Account Number'
        );

        await this.fillMandatoryText(
            this.confirmAccountNumber,
            confirmAccountNumber,
            'Confirm Account Number'
        );
    }


    /*
     * Enter IFSC Code and wait for
     * Bank and Branch auto-population.
     */
    async fillIfscCode(
        ifscCode
    ) {
        const ifscValue =
            this.normalizeIfscCode(
                ifscCode
            );

        await this.fillMandatoryText(
            this.ifscCode,
            ifscValue,
            'IFSC Code'
        );

        /*
         * Trigger onfocusout:
         * getBanKAndBranch(this)
         */
        await this.ifscCode.press(
            'Tab'
        );

        console.log(
            'Waiting for Bank and Branch auto-population...'
        );

        const branchExists =
            await this.branch.count() > 0;

        const bankExists =
            await this.bank.count() > 0;

        if (branchExists) {
            await expect(
                this.branch
            ).not.toHaveValue('', {
                timeout: 60000
            });

            console.log(
                'Branch auto-populated:',
                await this.branch.inputValue()
            );
        }

        if (bankExists) {
            await expect(
                this.bank
            ).not.toHaveValue('', {
                timeout: 60000
            });

            console.log(
                'Bank auto-populated:',
                await this.bank.inputValue()
            );
        }

        if (
            !branchExists &&
            !bankExists
        ) {
            console.log(
                'Bank and Branch locators were not found.'
            );

            await this.page.waitForTimeout(
                2000
            );
        }
    }


    /*
     * Select Account Type.
     */
    async selectAccountType(
        accountTypeValue
    ) {
        const accountType =
            String(
                accountTypeValue ?? ''
            ).trim();

        if (!accountType) {
            throw new Error(
                'AccountType is empty in ' +
                'BankAccountDetails Excel sheet.'
            );
        }

        await expect(
            this.accountType
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.accountType
        ).toBeEnabled({
            timeout: 30000
        });

        const availableOptions =
            await this.accountType
                .locator('option')
                .allTextContents();

        console.log(
            'Account Type available options:',
            availableOptions.map(
                option => option.trim()
            )
        );

        await this.accountType.selectOption({
            label: accountType
        });

        await expect(
            this.accountType
        ).not.toHaveValue('Select');

        console.log(
            `Account Type selected: ${accountType}`
        );
    }


    /*
     * Click Validate.
     *
     * Validation failure is allowed in UAT.
     * The test should still continue to Proceed.
     */
    async clickValidate() {
        console.log(
            'Waiting for Validate button...'
        );

        await expect(
            this.validateButton
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.validateButton
        ).toBeEnabled({
            timeout: 60000
        });

        await this.validateButton
            .scrollIntoViewIfNeeded();

        await this.validateButton.click();

        console.log(
            'Validate button clicked.'
        );

        /*
         * Wait for the validation response
         * to update the page.
         */
        await this.page.waitForTimeout(
            3000
        );

        const validationFailed =
            await this.validationFailureMessage
                .isVisible()
                .catch(() => false);

        if (validationFailed) {
            const message =
                String(
                    await this.validationFailureMessage
                        .textContent()
                ).trim();

            console.log(
                `Bank validation result: ${message}`
            );

            console.log(
                'Validation failure is allowed in UAT.'
            );

            console.log(
                'Continuing to Proceed button.'
            );

            return false;
        }

        console.log(
            'Bank account validation completed successfully.'
        );

        return true;
    }


    /*
     * Click Proceed and identify the next page.
     */
    async clickProceed() {
        console.log(
            'Waiting for Proceed button...'
        );

        await expect(
            this.proceedButton
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.proceedButton
        ).toBeEnabled({
            timeout: 60000
        });

        await this.proceedButton
            .scrollIntoViewIfNeeded();

        console.log(
            'Clicking Proceed button...'
        );

        await this.proceedButton.click();

        console.log(
            'Proceed button clicked.'
        );

        /*
         * Wait for either possible next page:
         *
         * 1. Medical Questionnaire
         * 2. Upload Document Details
         */
        const nextPage =
            await Promise.race([
                this.questionnaireHeading
                    .waitFor({
                        state: 'visible',
                        timeout: 120000
                    })
                    .then(
                        () => 'QUESTIONNAIRE'
                    )
                    .catch(
                        () => null
                    ),

                this.uploadDocumentsPage
                    .waitFor({
                        state: 'visible',
                        timeout: 120000
                    })
                    .then(
                        () => 'UPLOAD_DOCUMENTS'
                    )
                    .catch(
                        () => null
                    )
            ]);

        if (
            nextPage === 'QUESTIONNAIRE'
        ) {
            console.log(
                'Medical Questionnaire page opened.'
            );

            return nextPage;
        }

        if (
            nextPage === 'UPLOAD_DOCUMENTS'
        ) {
            console.log(
                'Upload Document Details page opened.'
            );

            return nextPage;
        }

        throw new Error(
            'Proceed was clicked, but neither ' +
            'Medical Questionnaire nor Upload ' +
            'Document Details page opened.'
        );
    }


    /*
     * Complete Bank Account Details.
     */
    async completeBankAccountDetails(
        bankAccountData
    ) {
        if (!bankAccountData) {
            throw new Error(
                'BankAccountDetails Excel data is missing.'
            );
        }

        console.log(
            '===== Filling Bank Account Details ====='
        );

        console.log(
            'Bank Account Excel data:',
            bankAccountData
        );

        await this.waitForPage();

        await this.fillAccountNumbers(
            bankAccountData
        );

        await this.fillIfscCode(
            bankAccountData.IFSCCode
        );

        await this.selectAccountType(
            bankAccountData.AccountType
        );

        await this.fillMandatoryText(
            this.accountHolderName,
            bankAccountData.AccountHolderName,
            'Account Holder Name'
        );

        /*
         * Validate the account.
         *
         * Whether validation succeeds or fails,
         * continue to Proceed in the UAT flow.
         */
        const validationSuccessful =
            await this.clickValidate();

        console.log(
            `Bank validation successful: ` +
            `${validationSuccessful}`
        );

        /*
         * Always click Proceed.
         */
        const nextPage =
            await this.clickProceed();

        console.log(
            `Bank Account Details completed. ` +
            `Next page: ${nextPage}`
        );

        return nextPage;
    }
}


module.exports =
    BankAccountDetailsPage;