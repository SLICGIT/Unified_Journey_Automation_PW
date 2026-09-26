const {
    expect
} = require('@playwright/test');

const fs = require('fs');
const path = require('path');


class UploadDocumentDetailsPage {
    constructor(page) {
        this.page = page;

        /*
         * Proof type dropdowns.
         */
        this.idProofType =
            page.locator(
                '#ddlkycfile_S_1'
            );

        this.ageProofType =
            page.locator(
                '#ddlkycfile_S_2'
            );

        /*
        * Income Proof
        */
        this.incomeProofType =
            page.locator(
                '#ddlkycfile_S_4'
            );

        this.incomeProofFile =
            page.locator(
                '#kycfileup_S_4'
            );

        this.addressProofType =
            page.locator(
                '#ddlkycfile_S_3'
            );

        this.bankProofType =
            page.locator(
                '#ddlkycfile_S_7'
            );

        /*
         * Hidden file input controls.
         *
         * Playwright uploads documents directly
         * to these input elements using setInputFiles().
         */
        this.idProofFile =
            page.locator(
                '#kycfileup_S_1'
            );

        this.ageProofFile =
            page.locator(
                '#kycfileup_S_2'
            );

        this.addressProofFile =
            page.locator(
                '#kycfileup_S_3'
            );

        this.recentPhotographFile =
            page.locator(
                '#kycfileup_S_5'
            );

        this.signatureFile =
            page.locator(
                '#kycfileup_S_6'
            );

        this.bankProofFile =
            page.locator(
                '#kycfileup_S_7'
            );

        this.panFile =
            page.locator(
                '#kycfileup_S_9'
            );

        this.otherDocumentFile =
            page.locator(
                '#kycfileup_S_10'
            );

        /*
         * NACH Auto Debit Date.
         */
        this.autoDebitDate =
            page.locator(
                '#ddlENachDebitDate_S'
            );

        /*
         * Upload Document Details Continue button.
         */
        this.continueButton =
            page.locator(
                'button#btnkyccontinue.btnContinue1'
            );
    }


   /*
 * Wait for Upload Document Details page.
 */
async waitForPage() {
    console.log(
        'Waiting for Upload Document Details page...'
    );

    await expect(
        this.idProofType
    ).toBeVisible({
        timeout: 120000
    });

    await expect(
        this.ageProofType
    ).toBeVisible({
        timeout: 120000
    });

    await expect(
        this.addressProofType
    ).toBeVisible({
        timeout: 120000
    });

    await expect(
        this.bankProofType
    ).toBeVisible({
        timeout: 120000
    });

    /*
     * Do not wait for Auto Debit Date here.
     *
     * Monthly:
     * Auto Debit Date is visible.
     *
     * Quarterly / Half Yearly / Yearly:
     * Auto Debit Date is hidden.
     */
    await expect(
        this.continueButton
    ).toBeVisible({
        timeout: 120000
    });

    console.log(
        'Upload Document Details page loaded.'
    );
}
    /*
     * Convert relative or absolute Excel path
     * into a valid absolute file path.
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
     * Select one proof type from dropdown.
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
                'UploadDocumentDetails Excel sheet.'
            );
        }

        await expect(
            locator
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            locator
        ).toBeEnabled({
            timeout: 30000
        });

        const availableOptions =
            await locator
                .locator('option')
                .allTextContents();

        const cleanedOptions =
            availableOptions.map(
                option =>
                    option.trim()
            );

        console.log(
            `${fieldName} available options:`,
            cleanedOptions
        );

       await locator.selectOption({
            label: optionText
        });

        await expect(
            locator
        ).not.toHaveValue(
            '0'
        );

        /*
        * Wait for the application's DDLChange
        * JavaScript processing.
        */
        await this.page.waitForTimeout(
            500
        );

        console.log(
            `${fieldName} selected: ${optionText}`
        );
    }


    /*
 * Upload mandatory document and wait until
 * the application finishes processing it.
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
            `${fieldName} file path is empty in ` +
            'UploadDocumentDetails Excel sheet.'
        );
    }

    if (
        !fs.existsSync(
            resolvedPath
        )
    ) {
        throw new Error(
            `${fieldName} file was not found: ` +
            `${resolvedPath}`
        );
    }

    await expect(
        locator
    ).toBeAttached({
        timeout: 30000
    });

    const inputType =
        await locator.getAttribute(
            'type'
        );

    if (
        inputType !== 'file'
    ) {
        throw new Error(
            `${fieldName} locator is not a file input. ` +
            `Actual type: ${inputType}`
        );
    }

    /*
     * Get file input ID.
     *
     * Example:
     * kycfileup_S_1
     */
    const inputId =
        await locator.getAttribute(
            'id'
        );

    if (!inputId) {
        throw new Error(
            `${fieldName} file input has no ID.`
        );
    }

    /*
     * Corresponding visible Upload label.
     *
     * Example:
     * <label for="kycfileup_S_1">
     */
    const uploadLabel =
        this.page.locator(
            `label[for="${inputId}"]`
        );

    await expect(
        uploadLabel
    ).toBeVisible({
        timeout: 30000
    });

    console.log(
        `Uploading ${fieldName}...`
    );

    /*
     * This fires the input/change events,
     * which the application uses to process
     * the selected document.
     */
    await locator.setInputFiles(
        resolvedPath
    );

    /*
     * Verify browser received the file.
     */
    const uploadedFiles =
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
        uploadedFiles.length === 0
    ) {
        throw new Error(
            `${fieldName} upload failed.`
        );
    }

    console.log(
        `${fieldName} selected:`,
        uploadedFiles
    );

    /*
     * Very important:
     * allow DDLChange/file processing and
     * document payload generation to finish.
     */
    await this.page.waitForTimeout(
        500
    );

    /*
     * The page contains a tick span inside
     * each Upload label.
     *
     * Wait for it when the application
     * exposes it after processing.
     */
    const tick =
        uploadLabel.locator(
            'span#tickimg'
        );

    const tickExists =
        await tick.count() > 0;

    if (tickExists) {
        try {
            await expect(
                tick
            ).not.toHaveClass(
                /dnone/,
                {
                    timeout: 10000
                }
            );

            console.log(
                `${fieldName} processing completed.`
            );

        } catch {
            /*
             * Some page versions do not remove
             * dnone from the tick even though
             * processing has completed.
             */
            console.log(
                `${fieldName} tick confirmation ` +
                'was not available. Continuing after wait.'
            );
        }
    }

    /*
     * Extra stabilization before selecting
     * the next document.
     */
    await this.page.waitForTimeout(
        500
    );

    console.log(
        `${fieldName} uploaded successfully:`,
        uploadedFiles
    );
}
    /*
     * Upload an optional document only when
     * Excel contains a file path.
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
            `${fieldName} file path is empty. Skipping.`
        );

        return false;
    }

    try {
        await this.uploadFile(
            locator,
            value,
            fieldName
        );

        return true;
    } catch (error) {
        console.log(
            `${fieldName} upload was skipped.`
        );

        console.log(
            `${fieldName} upload reason: ${error.message}`
        );

        return false;
    }
}

    /*
     * Select Auto Debit Date.
     */
    async selectAutoDebitDate(
    value,
    autoDebitSelected
) {
    if (!autoDebitSelected) {
        console.log(
            'Auto Debit is not selected. ' +
            'Skipping Auto Debit Date.'
        );

        return;
    }

    const debitDate =
        String(
            value ?? ''
        ).trim();

    if (!debitDate) {
        throw new Error(
            'AutoDebitDate is empty in Excel.'
        );
    }

    await expect(
        this.autoDebitDate
    ).toBeVisible({
        timeout: 30000
    });

    await expect(
        this.autoDebitDate
    ).toBeEnabled({
        timeout: 30000
    });

    await this.autoDebitDate.selectOption({
        value: debitDate
    });

    await expect(
        this.autoDebitDate
    ).toHaveValue(
        debitDate
    );

    console.log(
        `Auto Debit Date selected: ${debitDate}`
    );
}


    /*
     * Fill all Upload Document Details fields.
     */
    async fillUploadDocumentDetails(
        uploadDocumentData,
        autoDebitSelected
)
    {
        if (!uploadDocumentData) {
            throw new Error(
                'UploadDocumentDetails Excel data is missing.'
            );
        }

        console.log(
            '===== Filling Upload Document Details ====='
        );

        console.log(
            'Upload Document Excel data:',
            uploadDocumentData
        );

        await this.waitForPage();

        /*
         * ID Proof.
         */
        await this.selectProofType(
            this.idProofType,
            uploadDocumentData.IDProofType,
            'ID Proof'
        );

        await this.uploadFile(
            this.idProofFile,
            uploadDocumentData.IDProofFile,
            'ID Proof'
        );

        /*
         * Age Proof.
         */
        await this.selectProofType(
            this.ageProofType,
            uploadDocumentData.AgeProofType,
            'Age Proof'
        );

        await this.uploadFile(
            this.ageProofFile,
            uploadDocumentData.AgeProofFile,
            'Age Proof'
        );

        /*
         * Address Proof.
         */
        await this.selectProofType(
            this.addressProofType,
            uploadDocumentData.AddressProofType,
            'Address Proof'
        );

        await this.uploadFile(
            this.addressProofFile,
            uploadDocumentData.AddressProofFile,
            'Address Proof'
        );

        const incomeProofVisible =
    await this.incomeProofType
        .isVisible()
        .catch(() => false);

if (incomeProofVisible) {

    await this.selectProofType(
        this.incomeProofType,
        uploadDocumentData.IncomeProofType,
        'Income Proof'
    );

    await this.uploadFile(
        this.incomeProofFile,
        uploadDocumentData.IncomeProofFile,
        'Income Proof'
    );

    console.log(
        'Income Proof uploaded successfully.'
    );

} else {

    console.log(
        'Income Proof not displayed. Skipping.'
    );
}

        /*
         * Bank Proof.
         */
        await this.selectProofType(
            this.bankProofType,
            uploadDocumentData.BankProofType,
            'Bank Proof'
        );

        await this.uploadFile(
            this.bankProofFile,
            uploadDocumentData.BankProofFile,
            'Bank Proof'
        );

        /*
         * Recent Photograph.
         */
        await this.uploadFile(
            this.recentPhotographFile,
            uploadDocumentData.RecentPhotographFile,
            'Recent Photograph'
        );

        /*
         * Signature.
         */
        await this.uploadFile(
            this.signatureFile,
            uploadDocumentData.SignatureFile,
            'Signature'
        );

        /*
         * Auto Debit Date.
         */
       await this.selectAutoDebitDate(
    uploadDocumentData.AutoDebitDate,
    autoDebitSelected
);
        /*
         * PAN document.
         */
        await this.uploadOptionalFile(
            this.panFile,
            uploadDocumentData.PANFile,
            'PAN Document'
        );

        /*
         * Other document.
         */
        await this.uploadOptionalFile(
            this.otherDocumentFile,
            uploadDocumentData.OtherDocumentFile,
            'Other Document'
        );

        console.log(
            'Upload Document Details completed successfully.'
        );

        console.log(
            'Waiting for all document processing to settle...'
        );

        await this.page.waitForTimeout(
            500
        );
    }


    /*
     * Click Upload Document Continue.
     */
    /*
 * Click Upload Document Continue and verify
 * navigation to Proposal Summary.
 */
async clickContinue() {
    console.log(
        'Waiting for Upload Document Continue button...'
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

    const oldUrl =
        this.page.url();

    console.log(
        `URL before Upload Continue: ${oldUrl}`
    );

    /*
     * Capture document-submission responses.
     */
    const submissionResponses = [];

    const responseHandler =
        async response => {
            const request =
                response.request();

            const url =
                response.url();

            if (
                request.method() === 'POST' &&
                (
                    url.includes('DocumentSubmission') ||
                    url.includes('SaveProposalTransaction') ||
                    url.includes('KYC')
                )
            ) {
                let body = '';

                try {
                    body =
                        await response.text();
                } catch {
                    body = '';
                }

                submissionResponses.push({
                    status:
                        response.status(),

                    url,

                    body:
                        body.slice(
                            0,
                            2000
                        )
                });
            }
        };

    this.page.on(
        'response',
        responseHandler
    );

    try {
        console.log(
            'Clicking Upload Document Continue...'
        );

        await this.continueButton.click();

        console.log(
            'Upload Document Continue clicked.'
        );

        const proposalSummaryContinue =
            this.page.locator(
                '#btnContinue'
            );

        const proposalNumber =
            this.page.locator(
                '#quoteID'
            );

        /*
         * Wait for Proposal Summary indicators.
         */
        const proposalOpened =
            await Promise.race([
                proposalSummaryContinue
                    .waitFor({
                        state: 'visible',
                        timeout: 120000
                    })
                    .then(() => true)
                    .catch(() => false),

                proposalNumber
                    .waitFor({
                        state: 'visible',
                        timeout: 120000
                    })
                    .then(() => true)
                    .catch(() => false),

                this.page
                    .waitForURL(
                        url =>
                            url.toString() !== oldUrl,
                        {
                            timeout: 120000
                        }
                    )
                    .then(() => true)
                    .catch(() => false)
            ]);

        /*
         * Give the new page a moment to render.
         */
        await this.page.waitForTimeout(
            500
        );

        const summaryVisible =
            await proposalSummaryContinue
                .isVisible()
                .catch(() => false);

        const proposalNumberVisible =
            await proposalNumber
                .isVisible()
                .catch(() => false);

        if (
            proposalOpened &&
            (
                summaryVisible ||
                proposalNumberVisible
            )
        ) {
            console.log(
                'Proposal Summary page opened successfully.'
            );

            console.log(
                `URL after Upload Continue: ${this.page.url()}`
            );

            return;
        }

        /*
         * Still on Upload Documents page:
         * collect visible validation messages.
         */
        const validationMessages =
            await this.page
                .locator(
                    [
                        '.field-validation-error',
                        '.text-danger',
                        '.error',
                        '[id*="lblerr"]'
                    ].join(',')
                )
                .evaluateAll(
                    elements =>
                        elements
                            .filter(element => {
                                const style =
                                    window.getComputedStyle(
                                        element
                                    );

                                return (
                                    style.display !== 'none' &&
                                    style.visibility !== 'hidden'
                                );
                            })
                            .map(element =>
                                String(
                                    element.textContent || ''
                                ).trim()
                            )
                            .filter(Boolean)
                )
                .catch(() => []);

        console.log(
            `Current URL after Continue: ${this.page.url()}`
        );

        console.log(
            'Visible upload validation messages:',
            validationMessages
        );

        console.log(
            'Document submission responses:',
            submissionResponses
        );

        await this.page.screenshot({
            path:
                `TestResults/UploadContinueFailure-${Date.now()}.png`,

            fullPage:
                true
        });

        throw new Error(
            'Upload Document page did not navigate to ' +
            'Proposal Summary. ' +
            (
                validationMessages.length > 0
                    ? `Validation messages: ${validationMessages.join(' | ')}`
                    : 'No visible validation message was found.'
            )
        );
    } finally {
        this.page.off(
            'response',
            responseHandler
        );
    }
}
    /*
     * Complete Upload Document Details page.
     */
        async completeUploadDocumentDetails(
            uploadDocumentData,
            autoDebitSelected
        ) {
            await this.fillUploadDocumentDetails(
                uploadDocumentData,
                autoDebitSelected
            );

            await this.clickContinue();
        }
}


module.exports =
    UploadDocumentDetailsPage;