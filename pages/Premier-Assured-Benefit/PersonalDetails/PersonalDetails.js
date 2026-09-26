// ============================================================
// PART 1: IMPORTS
// ============================================================

const {
    expect
} = require('@playwright/test');

const PersonalInfoSection =
    require('./PersonalInfoSection');

const PermanentAddressSection =
    require('./PermanentAddressSection');

const CurrentAddressSection =
    require('./CurrentAddressSection');

const AdditionalDetailsSection =
    require('./AdditionalDetailsSection');

const NomineeDetailsSection =
    require('./NomineeDetailsSection');

const NomineeAddressSection =
    require('./NomineeAddressSection');

const NomineeBankDetailsSection =
    require('./NomineeBankDetailsSection');

const AppointeeDetailsSection =
    require('./AppointeeDetailsSection.js');

const ProposerDetailsSection =
    require('./ProposerDetailsSection');


// ============================================================
// PART 2: CONSTRUCTOR AND PAGE OBJECTS
// ============================================================

class PersonalDetailsPage {
    constructor(page) {
        this.page = page;

        this.personalInfo =
            new PersonalInfoSection(page);

        this.permanentAddress =
            new PermanentAddressSection(page);

        this.currentAddress =
            new CurrentAddressSection(page);

        this.additionalDetails =
            new AdditionalDetailsSection(page);

        this.nomineeDetails =
            new NomineeDetailsSection(page);

        this.nomineeAddress =
            new NomineeAddressSection(page);

        this.nomineeBankDetails =
            new NomineeBankDetailsSection(page);

        this.appointeeDetails =
            new AppointeeDetailsSection(page);
        
        this.proposerDetails =
            new ProposerDetailsSection(page);

        

        /*
         * Personal Details page locators.
         */
        this.pageContainer =
            page.locator(
                '#KYCdtsmaincontainer'
            );

        this.firstName =
            page.locator(
                '#txtbxkycfirstname'
            );

        this.continueButton =
            page.locator(
                '#btnkyccontinue'
            );

        /*
         * First field on Bank Account Details page.
         */
        this.bankAccountNumber =
            page.locator(
                '#txtbxBDAccNumber'
            );
    }


    // ========================================================
    // PART 3: WAIT FOR PERSONAL DETAILS PAGE
    // ========================================================

    async waitForPage() {
        console.log(
            'Waiting for Personal Details page...'
        );

        await expect(
            this.pageContainer
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.firstName
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.firstName
        ).not.toHaveValue('', {
            timeout: 60000
        });

        console.log(
            'Personal Details page loaded.'
        );

        console.log(
            'Auto-populated First Name:',
            await this.firstName.inputValue()
        );
    }


    // ========================================================
    // PART 4: VALIDATE EXCEL DATA
    // ========================================================

    validatePersonalDetailsData({
        basicData,
        personalInfoData,
        permanentAddressData,
        currentAddressData,
        additionalDetailsData,
        nomineeDetailsData,
        nomineeAddressData,
        nomineeBankDetailsData
    }) {
        if (!basicData) {
            throw new Error(
                'BasicDetails Excel data is missing.'
            );
        }

        if (!personalInfoData) {
            throw new Error(
                'PersonalInfo Excel data is missing.'
            );
        }

        if (!permanentAddressData) {
            throw new Error(
                'PermanentAddress Excel data is missing.'
            );
        }

        if (!currentAddressData) {
            throw new Error(
                'CurrentAddress Excel data is missing.'
            );
        }

        if (!additionalDetailsData) {
            throw new Error(
                'AdditionalDetails Excel data is missing.'
            );
        }

        if (!nomineeDetailsData) {
            throw new Error(
                'NomineeDetails Excel data is missing.'
            );
        }

        if (!nomineeAddressData) {
            throw new Error(
                'NomineeAddress Excel data is missing.'
            );
        }

        if (!nomineeBankDetailsData) {
            throw new Error(
                'NomineeBankDetails Excel data is missing.'
            );
        }
    }


    // ========================================================
    // PART 5: CONTINUE AND NAVIGATION
    // ========================================================

    async clickContinueAndWaitForBankPage() {
        console.log(
            'Waiting for Personal Details Continue button...'
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
         * Remove focus from the last entered field.
         */
        await this.continueButton.focus();

        const browserErrors = [];
        const failedRequests = [];
        const submissionResponses = [];

        const pageErrorHandler =
            error => {
                browserErrors.push(
                    error.message
                );

                console.log(
                    'Browser page error:',
                    error.message
                );
            };

        const requestFailedHandler =
            request => {
                const failure =
                    request.failure();

                failedRequests.push({
                    method:
                        request.method(),

                    url:
                        request.url(),

                    error:
                        failure?.errorText || ''
                });
            };

        const responseHandler =
            async response => {
                const request =
                    response.request();

                const resourceType =
                    request.resourceType();

                const method =
                    request.method();

                if (
                    method === 'GET' ||
                    ![
                        'xhr',
                        'fetch',
                        'document'
                    ].includes(resourceType)
                ) {
                    return;
                }

                const item = {
                    status:
                        response.status(),

                    method,

                    resourceType,

                    url:
                        response.url(),

                    body:
                        ''
                };

                try {
                    const contentType =
                        response.headers()[
                            'content-type'
                        ] || '';

                    if (
                        contentType.includes(
                            'application/json'
                        ) ||
                        contentType.includes(
                            'text/'
                        )
                    ) {
                        item.body =
                            (
                                await response.text()
                            ).slice(
                                0,
                                1000
                            );
                    }
                } catch {
                    /*
                     * Some response bodies cannot be read.
                     */
                }

                submissionResponses.push(
                    item
                );
            };

        this.page.on(
            'pageerror',
            pageErrorHandler
        );

        this.page.on(
            'requestfailed',
            requestFailedHandler
        );

        this.page.on(
            'response',
            responseHandler
        );

        try {
            console.log(
                'URL before Continue:',
                this.page.url()
            );

            console.log(
                'Clicking Personal Details Continue...'
            );

            await this.continueButton.click();

            console.log(
                'Continue button clicked.'
            );

            /*
             * Wait for the actual next-page field.
             * Do not use networkidle for AJAX pages.
             */
            const bankPageOpened =
                await this.bankAccountNumber
                    .waitFor({
                        state: 'visible',
                        timeout: 30000
                    })
                    .then(() => true)
                    .catch(() => false);

            if (bankPageOpened) {
                console.log(
                    'Bank Account Details page opened successfully.'
                );

                return;
            }

            console.log(
                'URL after Continue:',
                this.page.url()
            );

            /*
             * Collect visible field validation.
             */
            const visibleValidationMessages =
                await this.page
                    .locator(
                        [
                            '[id^="lblerr"]:visible',
                            '.text-danger:visible',
                            '.validation-summary-errors:visible',
                            '.error:visible',
                            '.toast-message:visible',
                            '.swal2-html-container:visible'
                        ].join(', ')
                    )
                    .allTextContents();

            const cleanedValidationMessages =
                visibleValidationMessages
                    .map(
                        message =>
                            message.trim()
                    )
                    .filter(Boolean);

            /*
             * Collect controls marked invalid.
             */
            const invalidFields =
                await this.page
                    .locator(
                        [
                            '.borderredcls:visible',
                            '[aria-invalid="true"]:visible',
                            'input:invalid:visible',
                            'select:invalid:visible'
                        ].join(', ')
                    )
                    .evaluateAll(
                        elements =>
                            elements.map(
                                element => ({
                                    id:
                                        element.id || '',

                                    name:
                                        element.name || '',

                                    tag:
                                        element.tagName,

                                    type:
                                        element.type || '',

                                    value:
                                        element.value || ''
                                })
                            )
                    );

            /*
             * Collect mandatory visible fields that are empty.
             */
            const emptyMandatoryFields =
                await this.page
                    .locator(
                        [
                            'input.mandatorycls:visible',
                            'select.mandatorycls:visible',
                            'textarea.mandatorycls:visible'
                        ].join(', ')
                    )
                    .evaluateAll(
                        elements =>
                            elements
                                .filter(
                                    element => {
                                        if (
                                            element.disabled
                                        ) {
                                            return false;
                                        }

                                        if (
                                            element.tagName ===
                                            'SELECT'
                                        ) {
                                            return (
                                                !element.value ||
                                                element.value ===
                                                '0' ||
                                                element.value ===
                                                'Select'
                                            );
                                        }

                                        return !String(
                                            element.value || ''
                                        ).trim();
                                    }
                                )
                                .map(
                                    element => ({
                                        id:
                                            element.id || '',

                                        name:
                                            element.name || '',

                                        tag:
                                            element.tagName,

                                        type:
                                            element.type || '',

                                        value:
                                            element.value || ''
                                    })
                                )
                    );

            console.log(
                'Visible validation messages:',
                cleanedValidationMessages
            );

            console.log(
                'Invalid fields:',
                invalidFields
            );

            console.log(
                'Empty mandatory fields:',
                emptyMandatoryFields
            );

            console.log(
                'Failed requests:',
                failedRequests
            );

            console.log(
                'Submission responses:',
                submissionResponses
            );

            console.log(
                'Browser errors:',
                browserErrors
            );

            let reason =
                'Personal Details page did not navigate.';

            if (
                cleanedValidationMessages.length > 0
            ) {
                reason =
                    'Personal Details validation failed: ' +
                    cleanedValidationMessages.join(
                        ' | '
                    );
            } else if (
                emptyMandatoryFields.length > 0
            ) {
                reason =
                    'Mandatory Personal Details fields are empty: ' +
                    emptyMandatoryFields
                        .map(
                            field =>
                                field.id ||
                                field.name ||
                                field.tag
                        )
                        .join(', ');
            } else if (
                failedRequests.length > 0
            ) {
                reason =
                    'Personal Details request failed: ' +
                    failedRequests
                        .map(
                            request =>
                                `${request.method} ` +
                                `${request.url} ` +
                                `${request.error}`
                        )
                        .join(' | ');
            } else if (
                browserErrors.length > 0
            ) {
                reason =
                    'Personal Details browser error: ' +
                    browserErrors.join(' | ');
            } else if (
                submissionResponses.some(
                    response =>
                        response.status >= 400
                )
            ) {
                reason =
                    'Personal Details server request returned an error.';
            }

            throw new Error(
                reason
            );
        } finally {
            /*
             * Prevent duplicate listeners during later actions.
             */
            this.page.off(
                'pageerror',
                pageErrorHandler
            );

            this.page.off(
                'requestfailed',
                requestFailedHandler
            );

            this.page.off(
                'response',
                responseHandler
            );
        }
    }


    // ========================================================
    // PART 6: COMPLETE PERSONAL DETAILS FLOW
    // ========================================================

    async completePersonalDetails({
        basicData,
        personalInfoData,
        permanentAddressData,
        currentAddressData,
        additionalDetailsData,
        proposerDetailsData,
        nomineeDetailsData,
        nomineeAddressData,
        nomineeBankDetailsData,
        appointeeDetailsData
    }) {
        console.log(
            '===== Starting Personal Details flow ====='
        );

        this.validatePersonalDetailsData({
            basicData,
            personalInfoData,
            permanentAddressData,
            currentAddressData,
            additionalDetailsData,
            nomineeDetailsData,
            nomineeAddressData,
            nomineeBankDetailsData
        });

        await this.waitForPage();

        const insureFor =
            String(
                basicData.AI_insureFor || ''
            )
                .trim()
                .toUpperCase();

        const validInsureFor = [
            'SELF',
            'SPOUSE',
            'CHILD',
            'GRAND CHILD'
        ];

        if (
            !validInsureFor.includes(
                insureFor
            )
        ) {
            throw new Error(
                `Invalid AI_insureFor value: ` +
                `"${basicData.AI_insureFor}".`
            );
        }

        const proposerRequired = [
            'SPOUSE',
            'CHILD',
            'GRAND CHILD'
        ].includes(
            insureFor
        );

        console.log(
            `Insure For: ${insureFor}`
        );

        console.log(
            `Proposer Details required: ` +
            `${proposerRequired}`
        );

        /*
         * SECTION 1: Personal Information.
         */
        console.log(
            '===== Filling Personal Information ====='
        );

        await this.personalInfo.fill(
            personalInfoData
        );

        console.log(
            'Personal Information section completed.'
        );

        /*
         * SECTION 2: Permanent Address.
         */
        console.log(
            '===== Filling Permanent Address ====='
        );

        await this.permanentAddress.fill(
            permanentAddressData
        );

        console.log(
            'Permanent Address section completed.'
        );

        /*
         * SECTION 3: Current Address.
         */
        console.log(
            '===== Filling Current Address ====='
        );

        await this.currentAddress.fill(
            currentAddressData
        );

        console.log(
            'Current Address section completed.'
        );

        /*
         * SECTION 4: Additional Details.
         */
        console.log(
            '===== Filling Additional Details ====='
        );

        await this.additionalDetails.fill(
            additionalDetailsData
        );

        console.log(
            'Additional Details section completed.'
        );

        /*
 * Conditional Proposer Details.
 */
/*
 * Conditional flow:
 *
 * SELF:
 *   Nominee Details
 *   Nominee Address
 *   Nominee Bank Details
 *   Appointee when nominee is minor
 *
 * SPOUSE / CHILD / GRAND CHILD:
 *   Proposer Details only
 *   Nominee sections are not displayed on this page
 */
let nomineeResults = [];

let firstNomineeIsMinor = false;

if (proposerRequired) {
    console.log(
        `${insureFor} flow detected. ` +
        'Proposer Details are required.'
    );

    if (!proposerDetailsData) {
        throw new Error(
            'ProposerDetails Excel data is required ' +
            `when AI_insureFor is "${insureFor}".`
        );
    }

    await this.proposerDetails.fill(
        proposerDetailsData
    );

    console.log(
        'Proposer Details section completed.'
    );

    console.log(
        'Nominee Details are not displayed ' +
        `for ${insureFor} flow. Skipping Nominee sections.`
    );
} else {
    console.log(
        'SELF flow detected. ' +
        'Proposer Details are not required.'
    );

    const proposerDisplayed =
        await this.proposerDetails
            .isDisplayed();

    if (proposerDisplayed) {
        throw new Error(
            'Proposer Details are displayed for SELF flow.'
        );
    }

    console.log(
        'Proposer Details correctly not displayed.'
    );

    /*
     * SECTION 5: Nominee Details.
     */
    const nomineeRows =
        Array.isArray(
            nomineeDetailsData
        )
            ? nomineeDetailsData
            : [nomineeDetailsData];

    if (
        nomineeRows.length === 0 ||
        !nomineeRows[0]
    ) {
        throw new Error(
            'NomineeDetails Excel data is empty.'
        );
    }

    console.log(
        'Nominee Details Excel data:',
        nomineeRows
    );

    nomineeResults =
        await this.nomineeDetails.fill(
            nomineeRows
        );

    if (
        !Array.isArray(
            nomineeResults
        ) ||
        nomineeResults.length === 0
    ) {
        throw new Error(
            'Nominee age results are missing.'
        );
    }

    console.log(
        'Nominee Details section completed.'
    );

    console.log(
        'Nominee age results:',
        nomineeResults
    );

    /*
     * SECTION 6: Nominee Address.
     */
    if (!nomineeAddressData) {
        throw new Error(
            'NomineeAddress Excel data is missing.'
        );
    }

    console.log(
        '===== Filling Nominee Address ====='
    );

    await this.nomineeAddress.fill(
        nomineeAddressData
    );

    console.log(
        'Nominee Address section completed.'
    );

    /*
     * SECTION 7: Nominee Bank Account Details.
     */
    if (!nomineeBankDetailsData) {
        throw new Error(
            'NomineeBankDetails Excel data is missing.'
        );
    }

    console.log(
        '===== Filling Nominee Bank Account Details ====='
    );

    await this.nomineeBankDetails.fill(
        nomineeBankDetailsData
    );

    console.log(
        'Nominee Bank Account Details section completed.'
    );

    /*
     * SECTION 8: Conditional Appointee Details.
     */
    const firstNominee =
        nomineeResults[0];

    if (!firstNominee) {
        throw new Error(
            'Nominee 1 age result is missing.'
        );
    }

    firstNomineeIsMinor =
        Boolean(
            firstNominee.isMinor
        );

    console.log(
        `Nominee 1 Age: ` +
        `${firstNominee.nomineeAge}`
    );

    console.log(
        `Nominee 1 Minor Status: ` +
        `${firstNomineeIsMinor}`
    );

    if (firstNomineeIsMinor) {
        console.log(
            'Nominee 1 is a minor. ' +
            'Appointee Details are required.'
        );

        if (!appointeeDetailsData) {
            throw new Error(
                'AppointeeDetails Excel data is required ' +
                'because Nominee 1 is a minor.'
            );
        }

        await this.appointeeDetails.fill(
            appointeeDetailsData
        );

        console.log(
            'Appointee Details section completed.'
        );
    } else {
        console.log(
            'Nominee 1 is a major. ' +
            'Appointee Details are not required.'
        );

        const appointeeDisplayed =
            await this.appointeeDetails
                .isDisplayed();

        if (appointeeDisplayed) {
            throw new Error(
                'Appointee Details are displayed even though ' +
                'Nominee 1 is a major.'
            );
        }

        console.log(
            'Appointee Details correctly not displayed.'
        );
    }
}

/*
 * Common Continue button for both flows:
 *
 * SELF
 * SPOUSE
 * CHILD
 * GRAND CHILD
 */
console.log(
    'Submitting Personal Details...'
);

await this.clickContinueAndWaitForBankPage();

console.log(
    'Personal Details submitted successfully.'
);

return {
    insureFor,
    proposerRequired,
    nomineeResults,
    firstNomineeIsMinor
};
    }
}

module.exports =
    PersonalDetailsPage;