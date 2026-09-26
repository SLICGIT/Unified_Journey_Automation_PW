const {
    expect
} = require('@playwright/test');

class AppointeeDetailsSection {
    constructor(page) {
        this.page = page;

        this.firstName =
            page.locator(
                '#txtbxkycappointeefirstname1'
            );

        this.middleName =
            page.locator(
                '#txtbxkycappointeemiddlename1'
            );

        this.lastName =
            page.locator(
                '#txtbxkycappointeelastname1'
            );

        /*
         * The application contains a duplicate ID,
         * so select only the <select> element.
         */
        this.relationship =
            page.locator(
                'select#ddlkycappointeereltonominee1'
            );

        this.dob =
            page.locator(
                '#txtbxkycappointeedob1'
            );

        this.mobileNumber =
            page.locator(
                '#txtbxkycappointeemobile1'
            );
    }

    /*
     * Used for the major nominee flow.
     */
    async isDisplayed() {
        return await this.firstName
            .isVisible()
            .catch(() => false);
    }

    /*
     * Wait for Appointee Details.
     */
    async waitForSection() {
        console.log(
            'Waiting for Appointee Details section...'
        );

        await expect(
            this.firstName
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.lastName
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Appointee Details section displayed.'
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
                'AppointeeDetails Excel sheet.'
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
     * Fill an optional text field.
     */
    async fillOptionalText(
        locator,
        value,
        fieldName
    ) {
        const text =
            String(
                value ?? ''
            ).trim();

        if (!text) {
            console.log(
                `${fieldName} is empty. Skipping.`
            );

            return;
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
     * Select Appointee relationship.
     */
    async selectRelationship(
        relationshipValue
    ) {
        const relationship =
            String(
                relationshipValue ?? ''
            ).trim();

        if (!relationship) {
            throw new Error(
                'RelationshipWithNominee is empty in ' +
                'AppointeeDetails Excel sheet.'
            );
        }

        await expect(
            this.relationship
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.relationship
        ).toBeEnabled({
            timeout: 30000
        });

        const availableOptions =
            await this.relationship
                .locator('option')
                .allTextContents();

        console.log(
            'Appointee Relationship available options:',
            availableOptions.map(
                option => option.trim()
            )
        );

        await this.relationship.selectOption({
            label: relationship
        });

        await expect(
            this.relationship
        ).not.toHaveValue('0');

        console.log(
            `Appointee Relationship selected: ` +
            `${relationship}`
        );
    }

    /*
     * Fill Appointee DOB and trigger the
     * application's validation events.
     */
    async fillDob(
        dobValue
    ) {
        const dob =
            String(
                dobValue ?? ''
            ).trim();

        if (!dob) {
            throw new Error(
                'Appointee DOB is empty in ' +
                'AppointeeDetails Excel sheet.'
            );
        }

        if (
            !/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(
                dob
            )
        ) {
            throw new Error(
                `Invalid Appointee DOB "${dob}". ` +
                'Use DD/MM/YYYY.'
            );
        }

        await expect(
            this.dob
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.dob
        ).toBeEditable({
            timeout: 30000
        });

        await this.dob.evaluate(
            (
                element,
                value
            ) => {
                element.focus();
                element.value = value;

                element.dispatchEvent(
                    new Event(
                        'input',
                        {
                            bubbles: true
                        }
                    )
                );

                element.dispatchEvent(
                    new Event(
                        'change',
                        {
                            bubbles: true
                        }
                    )
                );

                element.dispatchEvent(
                    new Event(
                        'focusout',
                        {
                            bubbles: true
                        }
                    )
                );

                element.blur();
            },
            dob
        );

        await expect(
            this.dob
        ).toHaveValue(
            dob
        );

        /*
         * Click another control so any pending
         * DOB validation finishes.
         */
        await this.lastName.click();

        await this.page.waitForTimeout(
            500
        );

        console.log(
            `Appointee DOB entered: ${dob}`
        );
    }

    /*
     * Complete Appointee Details.
     */
    async fill(
        appointeeDetailsData
    ) {
        if (!appointeeDetailsData) {
            throw new Error(
                'AppointeeDetails Excel data is missing.'
            );
        }

        console.log(
            '===== Filling Appointee Details ====='
        );

        console.log(
            'Appointee Details Excel data:',
            appointeeDetailsData
        );

        await this.waitForSection();

        await this.fillMandatoryText(
            this.firstName,
            appointeeDetailsData.FirstName,
            'Appointee First Name'
        );

        await this.fillOptionalText(
            this.middleName,
            appointeeDetailsData.MiddleName,
            'Appointee Middle Name'
        );

        await this.fillMandatoryText(
            this.lastName,
            appointeeDetailsData.LastName,
            'Appointee Last Name'
        );

        await this.selectRelationship(
            appointeeDetailsData
                .RelationshipWithNominee
        );

        await this.fillDob(
            appointeeDetailsData.DateOfBirth
        );

        await this.fillMandatoryText(
            this.mobileNumber,
            appointeeDetailsData.MobileNumber,
            'Appointee Mobile Number'
        );

        /*
         * Trigger mobile focusout validation.
         */
        await this.mobileNumber.press(
            'Tab'
        );

        await this.page.waitForTimeout(
            500
        );

        await expect(
            this.firstName
        ).toHaveValue(
            String(
                appointeeDetailsData.FirstName
            ).trim()
        );

        await expect(
            this.lastName
        ).toHaveValue(
            String(
                appointeeDetailsData.LastName
            ).trim()
        );

        await expect(
            this.relationship
        ).not.toHaveValue('0');

        await expect(
            this.dob
        ).toHaveValue(
            String(
                appointeeDetailsData.DateOfBirth
            ).trim()
        );

        await expect(
            this.mobileNumber
        ).toHaveValue(
            String(
                appointeeDetailsData.MobileNumber
            ).trim()
        );

        console.log(
            'Appointee Details completed successfully.'
        );
    }
}

module.exports =
    AppointeeDetailsSection;