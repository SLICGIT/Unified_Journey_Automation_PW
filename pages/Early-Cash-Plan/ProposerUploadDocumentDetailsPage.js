const {
    expect
} = require('@playwright/test');

const fs =
    require('fs');

const path =
    require('path');


class ProposerUploadDocumentDetailsPage {

    constructor(page) {
        this.page =
            page;


        /*
         * =====================================================
         * PRIMARY SECTION
         * PROPOSER DOCUMENTS
         * =====================================================
         */

        /*
         * Primary ID Proof.
         */
        this.primaryIDProofType =
            page.locator(
                '#ddlkycfile_O_1'
            );

        this.primaryIDProofFile =
            page.locator(
                '#kycfileup_O_1'
            );


        /*
         * Primary Address Proof.
         */
        this.primaryAddressProofType =
            page.locator(
                '#ddlkycfile_O_2'
            );

        this.primaryAddressProofFile =
            page.locator(
                '#kycfileup_O_2'
            );


        /*
         * Primary Bank Proof.
         */
        this.primaryBankProofType =
            page.locator(
                '#ddlkycfile_O_3'
            );

        this.primaryBankProofFile =
            page.locator(
                '#kycfileup_O_3'
            );


        /*
         * Primary Income Proof.
         * Conditional field.
         */
        this.primaryIncomeProofType =
            page.locator(
                '#ddlkycfile_O_4'
            );

        this.primaryIncomeProofFile =
            page.locator(
                '#kycfileup_O_4'
            );


        /*
         * Primary Recent Photograph.
         *
         * Visible label:
         * #kyclblfile_O_5
         *
         * Actual file input:
         * #kycfileup_O_5
         */
        this.primaryPhotographLabel =
            page.locator(
                '#kyclblfile_O_5'
            );

        this.primaryPhotographFile =
            page.locator(
                '#kycfileup_O_5'
            );


        /*
         * Primary Other Document.
         *
         * Visible label:
         * #kyclblfile_O_10
         *
         * Actual file input:
         * #kycfileup_O_10
         */
        this.otherDocumentLabel =
        page.locator(
            '#kyclblfile_O_10'
        ).first();

        this.otherDocumentFile =
        page.locator(
            '#kycfileup_O_10'
        ).first();


        /*
         * =====================================================
         * NACH SECTION
         * MONTHLY ONLY
         * =====================================================
         */
        this.autoDebitDate =
            page.locator(
                '#ddlENachDebitDate_O'
            );


        /*
         * =====================================================
         * SECONDARY SECTION
         * LIFE ASSURED DOCUMENTS
         * =====================================================
         */

        /*
         * Secondary ID Proof.
         */
        this.secondaryIDProofType =
            page.locator(
                '#ddlkycfile_O_6'
            );

        this.secondaryIDProofFile =
            page.locator(
                '#kycfileup_O_6'
            );


        /*
         * Secondary Age Proof.
         */
        this.secondaryAgeProofType =
            page.locator(
                '#ddlkycfile_O_7'
            );

        this.secondaryAgeProofFile =
            page.locator(
                '#kycfileup_O_7'
            );


        /*
         * Secondary Recent Photograph.
         */
        this.secondaryPhotographFile =
            page.locator(
                '#kycfileup_O_8'
            );


        /*
         * Secondary Signature.
         */
        this.secondarySignatureFile =
            page.locator(
                '#kycfileup_O_9'
            );


        /*
         * Continue.
         */
        this.continueButton =
            page.locator(
                '#btnkyccontinue2'
            );


        /*
         * Proposal Summary indicator.
         */
        this.proposalSummaryContinue =
            page.locator(
                '#btnContinue'
            );
    }
    /*
     * Resolve Excel file path.
     */

    resolveFilePath(filePath) {
    const value =
        String(
            filePath ?? ''
        ).trim();

    if (!value) {
        return '';
    }

    // If Excel contains an absolute path,
    // use it as-is.
    if (path.isAbsolute(value)) {
        return value;
    }

    // Excel contains: Documents\Aadhaar.jpg
    // Resolve from the project root.
    return path.resolve(
        process.cwd(),
        'test_data',
        value
    );
}

    /*
     * Wait for Proposer Upload Document page.
     */
    async waitForPage() {
        console.log(
            'Waiting for Proposer Upload Document page...'
        );

        await expect(
            this.primaryIDProofType
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.primaryAddressProofType
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.primaryBankProofType
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.secondaryIDProofType
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.secondaryAgeProofType
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 120000
        });

        console.log(
            'Proposer Upload Document page loaded.'
        );
    }


    /*
     * Select dropdown by visible label.
     */
    async selectProofType(
        locator,
        value,
        fieldName
    ) {
        const optionText =
            String(
                value ?? ''
            ).trim();

        if (!optionText) {
            throw new Error(
                `${fieldName} is empty in ` +
                'ProposerUploadDocumentDetails Excel sheet.'
            );
        }

        await expect(
            locator
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            locator
        ).toBeEnabled({
            timeout: 30000
        });

        const options =
            await locator
                .locator(
                    'option'
                )
                .allTextContents();

        console.log(
            `${fieldName} available options:`,
            options.map(
                option =>
                    option.trim()
            )
        );

        await locator.selectOption({
            label:
                optionText
        });

        await expect(
            locator
        ).not.toHaveValue(
            '0'
        );

        /*
         * Allow DDLChange(...) to complete.
         */
        await this.page.waitForTimeout(
            300
        );

        console.log(
            `${fieldName} selected: ${optionText}`
        );
    }
        /*
     * Upload document.
     *
     * Wait after setInputFiles so application-side
     * JavaScript can build the Documents payload.
     */
    async uploadFile(
        locator,
        filePath,
        fieldName
    ) {
        const resolvedPath =
            this.resolveFilePath(
                filePath
            );

        if (!resolvedPath) {
            throw new Error(
                `${fieldName} file path is empty.`
            );
        }

        if (
            !fs.existsSync(
                resolvedPath
            )
        ) {
            throw new Error(
                `${fieldName} file does not exist: ` +
                `${resolvedPath}`
            );
        }

        /*
         * Ensure a valid locator was supplied.
         */
        if (!locator) {
            throw new Error(
                `${fieldName} locator is undefined.`
            );
        }

        await expect(
            locator
        ).toBeAttached({
            timeout: 60000
        });

        const type =
            await locator.getAttribute(
                'type'
            );

        if (
            type !== 'file'
        ) {
            throw new Error(
                `${fieldName} locator is not a file input. ` +
                `Actual type: ${type}`
            );
        }

        const inputId =
            await locator.getAttribute(
                'id'
            );

        console.log(
            `Uploading ${fieldName}...`
        );

        await locator.setInputFiles(
            resolvedPath
        );

        const files =
            await locator.evaluate(
                element =>
                    Array.from(
                        element.files || []
                    ).map(
                        file =>
                            file.name
                    )
            );

        if (
            files.length === 0
        ) {
            throw new Error(
                `${fieldName} upload failed.`
            );
        }

        console.log(
            `${fieldName} selected:`,
            files
        );

        /*
         * Application processing wait.
         */
        await this.page.waitForTimeout(
            500
        );

        /*
         * Check Upload tick when available.
         */
        if (inputId) {
            const label =
                this.page.locator(
                    `label[for="${inputId}"]`
                );

            if (
                await label
                    .count()
                    .catch(
                        () => 0
                    ) > 0
            ) {
                const tick =
                    label.locator(
                        'span#tickimg'
                    );

                if (
                    await tick
                        .count()
                        .catch(
                            () => 0
                        ) > 0
                ) {
                    try {
                        await expect(
                            tick
                        ).not.toHaveClass(
                            /dnone/,
                            {
                                timeout:
                                    10000
                            }
                        );

                        console.log(
                            `${fieldName} processing completed.`
                        );

                    } catch {
                        console.log(
                            `${fieldName} tick did not become visible. ` +
                            'Continuing after processing wait.'
                        );
                    }
                }
            }
        }

        await this.page.waitForTimeout(
            300
        );

        console.log(
            `${fieldName} uploaded successfully:`,
            files
        );
    }


    /*
     * Optional upload.
     *
     * IMPORTANT:
     * Do not use locator.isAttached().
     */
    async uploadOptionalFile(
        locator,
        filePath,
        fieldName
    ) {
        const value =
            String(
                filePath ?? ''
            ).trim();

        if (!value) {
            console.log(
                `${fieldName} path is empty. Skipping.`
            );

            return false;
        }

        if (!locator) {
            console.log(
                `${fieldName} locator is undefined. Skipping.`
            );

            return false;
        }

        const exists =
            await locator
                .count()
                .catch(
                    () => 0
                );

        if (
            exists === 0
        ) {
            console.log(
                `${fieldName} control is not available. Skipping.`
            );

            return false;
        }

        try {
            await expect(
                locator
            ).toBeAttached({
                timeout: 30000
            });

            await this.uploadFile(
                locator,
                value,
                fieldName
            );

            return true;

        } catch (error) {
            console.log(
                `${fieldName} upload skipped.`
            );

            console.log(
                `${fieldName} reason: ${error.message}`
            );

            return false;
        }
    }
        /*
     * Conditional Income Proof.
     */
    async fillPrimaryIncomeProof(
        data
    ) {
        const displayed =
            await this.primaryIncomeProofType
                .isVisible()
                .catch(
                    () => false
                );

        if (!displayed) {
            console.log(
                'Primary Income Proof not displayed. Skipping.'
            );

            return;
        }

        console.log(
            'Primary Income Proof displayed.'
        );

        if (
            !data.PrimaryIncomeProofType
        ) {
            throw new Error(
                'PrimaryIncomeProofType is required because ' +
                'Primary Income Proof is displayed.'
            );
        }

        if (
            !data.PrimaryIncomeProofFile
        ) {
            throw new Error(
                'PrimaryIncomeProofFile is required because ' +
                'Primary Income Proof is displayed.'
            );
        }

        await this.selectProofType(
            this.primaryIncomeProofType,
            data.PrimaryIncomeProofType,
            'Primary Income Proof'
        );

        await this.uploadFile(
            this.primaryIncomeProofFile,
            data.PrimaryIncomeProofFile,
            'Primary Income Proof'
        );
    }


    /*
     * Monthly Auto Debit Date.
     */
    async selectAutoDebitDate(
        value,
        isMonthly
    ) {
        console.log(
            `Monthly proposer flow: ${isMonthly}`
        );

        if (
            isMonthly === false
        ) {
            console.log(
                'Non-monthly proposer flow. ' +
                'Skipping Auto Debit Date.'
            );

            return;
        }

        if (
            isMonthly !== true
        ) {
            throw new Error(
                `Invalid isMonthly value: "${isMonthly}".`
            );
        }

        const debitDate =
            String(
                value ?? ''
            ).trim();

        if (!debitDate) {
            throw new Error(
                'AutoDebitDate is empty for Monthly flow.'
            );
        }

        await expect(
            this.autoDebitDate
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.autoDebitDate
        ).toBeEnabled({
            timeout: 30000
        });

        const options =
            await this.autoDebitDate
                .locator(
                    'option'
                )
                .allTextContents();

        console.log(
            'Auto Debit Date options:',
            options.map(
                option =>
                    option.trim()
            )
        );

        await this.autoDebitDate
            .selectOption({
                value:
                    debitDate
            });

        await expect(
            this.autoDebitDate
        ).toHaveValue(
            debitDate
        );

        await this.page.waitForTimeout(
            1000
        );

        console.log(
            `Auto Debit Date selected: ${debitDate}`
        );
    }
        /*
     * =====================================================
     * PRIMARY / PROPOSER DOCUMENTS
     * =====================================================
     */
    async fillPrimaryDocuments(
    data,
    isMonthly
) {
    console.log(
        '===== Filling Primary / Proposer Documents ====='
    );


    /*
     * Primary ID Proof.
     */
    await this.selectProofType(
        this.primaryIDProofType,
        data.PrimaryIDProofType,
        'Primary ID Proof'
    );

    await this.uploadFile(
        this.primaryIDProofFile,
        data.PrimaryIDProofFile,
        'Primary ID Proof'
    );


    /*
     * Primary Address Proof.
     */
    await this.selectProofType(
        this.primaryAddressProofType,
        data.PrimaryAddressProofType,
        'Primary Address Proof'
    );

    await this.uploadFile(
        this.primaryAddressProofFile,
        data.PrimaryAddressProofFile,
        'Primary Address Proof'
    );


    /*
     * Primary Bank Proof.
     */
    await this.selectProofType(
        this.primaryBankProofType,
        data.PrimaryBankProofType,
        'Primary Bank Proof'
    );

    await this.uploadFile(
        this.primaryBankProofFile,
        data.PrimaryBankProofFile,
        'Primary Bank Proof'
    );


    /*
     * NON-MONTHLY:
     * Income Proof + Primary Photograph are required.
     */
    if (
        isMonthly === false
    ) {
        /*
         * Primary Income Proof.
         */
        await this.fillPrimaryIncomeProof(
            data
        );


        /*
         * Primary Recent Photograph.
         */
        console.log(
            'Uploading Primary Recent Photograph...'
        );

        await expect(
            this.primaryPhotographLabel
        ).toBeVisible({
            timeout: 30000
        });

        await this.uploadFile(
            this.primaryPhotographFile,
            data.PrimaryPhotographFile,
            'Primary Recent Photograph'
        );
    } else {
        /*
         * MONTHLY:
         * Income Proof and Primary Photograph
         * are not displayed.
         */
        console.log(
            'Monthly flow detected.'
        );

        console.log(
            'Skipping Primary Income Proof.'
        );

        console.log(
            'Skipping Primary Recent Photograph.'
        );
    }


    /*
     * Other Document is required in both
     * Monthly and Non-monthly proposer flows.
     */
    console.log(
        'Checking Primary Other Document...'
    );

    await expect(
        this.otherDocumentLabel
    ).toBeVisible({
        timeout: 30000
    });

    await this.uploadOptionalFile(
        this.otherDocumentFile,
        data.OtherDocumentFile,
        'Primary Other Document'
    );


    console.log(
        'Primary / Proposer Documents completed.'
    );
}

    /*
     * =====================================================
     * SECONDARY / LIFE ASSURED DOCUMENTS
     * =====================================================
     */
    async fillSecondaryDocuments(
        data
    ) {
        console.log(
            '===== Filling Secondary / Life Assured Documents ====='
        );


        /*
         * Secondary ID Proof.
         */
        await this.selectProofType(
            this.secondaryIDProofType,
            data.SecondaryIDProofType,
            'Secondary ID Proof'
        );

        await this.uploadFile(
            this.secondaryIDProofFile,
            data.SecondaryIDProofFile,
            'Secondary ID Proof'
        );


        /*
         * Secondary Age Proof.
         */
        await this.selectProofType(
            this.secondaryAgeProofType,
            data.SecondaryAgeProofType,
            'Secondary Age Proof'
        );

        await this.uploadFile(
            this.secondaryAgeProofFile,
            data.SecondaryAgeProofFile,
            'Secondary Age Proof'
        );


        /*
         * Secondary Recent Photograph.
         */
        await this.uploadFile(
            this.secondaryPhotographFile,
            data.SecondaryPhotographFile,
            'Secondary Recent Photograph'
        );


        /*
         * Secondary Signature.
         */
        await this.uploadFile(
            this.secondarySignatureFile,
            data.SecondarySignatureFile,
            'Secondary Signature'
        );


        console.log(
            'Secondary / Life Assured Documents completed.'
        );
    }
        /*
     * Fill complete Proposer Upload page.
     */
    async fillUploadDocumentDetails(
        data,
        isMonthly
    ) {
        if (!data) {
            throw new Error(
                'ProposerUploadDocumentDetails Excel data is missing.'
            );
        }

        console.log(
            '===== Filling Proposer Upload Document Details ====='
        );

        console.log(
            'Proposer Upload Excel data:',
            data
        );

        console.log(
            `Payment flow: ` +
            `${isMonthly ? 'MONTHLY' : 'NON-MONTHLY'}`
        );

        await this.waitForPage();


        /*
         * 1. Proposer documents.
         */
        await this.fillPrimaryDocuments(
            data,
            isMonthly
        );


        /*
         * 2. NACH Auto Debit Date.
         *
         * Monthly only.
         */
        await this.selectAutoDebitDate(
            data.AutoDebitDate,
            isMonthly
        );


        /*
         * 3. Life Assured documents.
         */
        await this.fillSecondaryDocuments(
            data
        );


        /*
         * Give all browser-side document conversion
         * and payload processing time to finish.
         */
        console.log(
            'Waiting for all Proposer document processing to settle...'
        );

        await this.page.waitForTimeout(
            1000
        );

        console.log(
            'Proposer Upload Document Details completed successfully.'
        );
    }


    /*
     * Click Continue and wait for Proposal Summary.
     */
    async clickContinue() {
        console.log(
            'Waiting for Proposer Upload Continue button...'
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

        await this.continueButton
            .scrollIntoViewIfNeeded();


        /*
         * Final processing wait.
         */
        await this.page.waitForTimeout(
            1000
        );

        const oldUrl =
            this.page.url();

        console.log(
            `URL before Proposer Upload Continue: ${oldUrl}`
        );


        /*
         * Register listener BEFORE click.
         */
        const saveResponsePromise =
            this.page.waitForResponse(
                response =>
                    response.url().includes(
                        'SaveProposalDocuments'
                    ) &&
                    response.request().method() ===
                        'POST',
                {
                    timeout:
                        120000
                }
            );


        console.log(
            'Clicking Proposer Upload Continue...'
        );

        await this.continueButton.click();

        console.log(
            'Proposer Upload Continue clicked.'
        );


        /*
         * Wait for backend SaveProposalDocuments.
         */
        const saveResponse =
            await saveResponsePromise;

        let responseText =
            '';

        try {
            responseText =
                await saveResponse.text();

        } catch {
            responseText =
                '';
        }


        console.log(
            'SaveProposalDocuments status:',
            saveResponse.status()
        );

        console.log(
            'SaveProposalDocuments response:',
            responseText
        );


        /*
         * Parse response.
         */
        let saveResult =
            null;

        try {
            saveResult =
                JSON.parse(
                    responseText
                );

        } catch {
            saveResult =
                null;
        }


        /*
         * Backend must return success.
         */
        if (
            saveResult &&
            String(
                saveResult.ErrorCode || ''
            ).trim() !== '200'
        ) {
            throw new Error(
                'Proposer SaveProposalDocuments failed. ' +
                `ErrorCode: ${saveResult.ErrorCode}. ` +
                `ErrorMsg: ${saveResult.ErrorMsg}.`
            );
        }
                /*
         * Wait for Fetching Details loader
         * if it appears.
         */
        const fetchingLoader =
            this.page.getByText(
                'Fetching Details',
                {
                    exact:
                        true
                }
            );

        await fetchingLoader
            .waitFor({
                state:
                    'visible',

                timeout:
                    5000
            })
            .catch(
                () => {
                    console.log(
                        'Fetching Details loader did not become visible.'
                    );
                }
            );


        await fetchingLoader
            .waitFor({
                state:
                    'hidden',

                timeout:
                    120000
            })
            .catch(
                () => {
                    console.log(
                        'Fetching Details loader already disappeared.'
                    );
                }
            );


        /*
         * Wait for Proposal Summary.
         */
        console.log(
            'Waiting for Proposal Summary page...'
        );

        await expect(
            this.proposalSummaryContinue
        ).toBeVisible({
            timeout: 120000
        });


        console.log(
            `URL after Proposer Upload Continue: ` +
            `${this.page.url()}`
        );

        console.log(
            'Proposal Summary page opened successfully.'
        );
    }


    /*
     * Complete Proposer Upload page.
     */
    async completeUploadDocumentDetails(
        data,
        isMonthly
    ) {
        await this.fillUploadDocumentDetails(
            data,
            isMonthly
        );

        await this.clickContinue();

        console.log(
            'Proposer Upload Document flow completed successfully.'
        );
    }
}


module.exports = ProposerUploadDocumentDetailsPage;