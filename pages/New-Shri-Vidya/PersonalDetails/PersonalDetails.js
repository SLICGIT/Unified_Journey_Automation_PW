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


    const continueButton =
        this.page.getByRole(
            'button',
            {
                name: 'Continue',
                exact: true
            }
        );


    await expect(
        continueButton
    ).toBeVisible({
        timeout: 60000
    });


    await expect(
        continueButton
    ).toBeEnabled({
        timeout: 30000
    });


    await continueButton
        .scrollIntoViewIfNeeded();


    const oldUrl =
        this.page.url();


    console.log(
        `URL before Continue: ${oldUrl}`
    );


    /*
     * Capture SaveProposalTransaction.
     */
    const saveProposalPromise =
        this.page.waitForResponse(
            response => {

                return (
                    response.url()
                        .includes(
                            'SaveProposalTransaction'
                        ) &&

                    response.request()
                        .method() ===
                    'POST'
                );

            },
            {
                timeout: 120000
            }
        )
        .catch(
            () => null
        );


    console.log(
        'Clicking Personal Details Continue...'
    );


    await continueButton.click();


    console.log(
        'Continue button clicked.'
    );


    /*
     * Wait for backend save response.
     */
    const saveProposalResponse =
        await saveProposalPromise;


    if (saveProposalResponse) {

        console.log(
            `SaveProposalTransaction HTTP Status: ` +
            `${saveProposalResponse.status()}`
        );


        let responseBody =
            null;


        try {

            responseBody =
                await saveProposalResponse.json();

        } catch {

            responseBody =
                await saveProposalResponse.text()
                    .catch(
                        () => ''
                    );
        }


        console.log(
            'SaveProposalTransaction response:',
            responseBody
        );


        /*
         * HTTP 200 doesn't necessarily mean
         * business transaction succeeded.
         */
        if (
            responseBody &&
            typeof responseBody === 'object'
        ) {

            const errorCode =
                String(
                    responseBody.ErrorCode ??
                    ''
                ).trim();


            const errorMessage =
                String(
                    responseBody.ErrorMsg ??
                    ''
                ).trim();


            const responseCode =
                String(
                    responseBody
                        ?.ResultSet
                        ?.ResponseCode ??
                    ''
                ).trim();


            const responseMessage =
                String(
                    responseBody
                        ?.ResultSet
                        ?.ResponseMsg ??
                    ''
                ).trim();


            const trackingId =
                String(
                    responseBody
                        ?.ResultSet
                        ?.TrackingID ??
                    ''
                ).trim();


            console.log(
                `SaveProposalTransaction ErrorCode: ` +
                `${errorCode || 'N/A'}`
            );


            console.log(
                `SaveProposalTransaction ErrorMsg: ` +
                `${errorMessage || 'N/A'}`
            );


            console.log(
                `SaveProposalTransaction ResponseCode: ` +
                `${responseCode || 'N/A'}`
            );


            console.log(
                `SaveProposalTransaction ResponseMsg: ` +
                `${responseMessage || 'N/A'}`
            );


            console.log(
                `SaveProposalTransaction TrackingID: ` +
                `${trackingId || 'N/A'}`
            );


            /*
             * Your current NSV response:
             *
             * ErrorCode = 205
             * ErrorMsg  = Failure
             */
            if (
                errorCode &&
                errorCode !== '0' &&
                errorCode !== '200'
            ) {

                throw new Error(
                    `SaveProposalTransaction failed. ` +
                    `ErrorCode: "${errorCode}", ` +
                    `ErrorMsg: "${errorMessage}", ` +
                    `ResponseCode: "${responseCode}", ` +
                    `ResponseMsg: "${responseMessage}", ` +
                    `TrackingID: "${trackingId}".`
                );
            }
        }
    }


    /*
     * Wait for Bank Account Details page.
     */
    const bankPageIndicator =
        this.page.locator(
            '#txtBankAccountNumber'
        );


    const navigated =
        await Promise.race([

            this.page.waitForURL(
                url =>
                    url.toString() !==
                    oldUrl,
                {
                    timeout: 60000
                }
            )
            .then(
                () => true
            )
            .catch(
                () => false
            ),


            bankPageIndicator.waitFor({
                state: 'visible',
                timeout: 60000
            })
            .then(
                () => true
            )
            .catch(
                () => false
            )

        ]);


    console.log(
        `URL after Continue: ` +
        `${this.page.url()}`
    );


    if (!navigated) {

        throw new Error(
            'Personal Details Save succeeded, ' +
            'but Bank Account Details page ' +
            'was not displayed.'
        );
    }


    console.log(
        'Personal Details submitted successfully.'
    );

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
        basicData?.InsureFor || ''
    )
        .trim()
        .toUpperCase();


if (
    ![
        'SELF',
        'SPOUSE',
        'CHILD',
        'GRAND CHILD'
    ].includes(
        insureFor
    )
) {
    throw new Error(
        `Invalid InsureFor value: ` +
        `"${basicData?.InsureFor}".`
    );
}


console.log(
    `Insure For: ${insureFor}`
);


        /*
        * Proposer Details are required when
        * Life Assured is not SELF.
        */
        const proposerRequired =
            [
                'SPOUSE',
                'CHILD',
                'GRAND CHILD'
            ].includes(
                insureFor
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
            `when insureFor is "${insureFor}".`
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