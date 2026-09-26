const {
    expect
} = require('@playwright/test');


class ProposerDetailsSection {
    constructor(page) {
        this.page = page;

        this.title =
            page.locator(
                '#ddlkycproposertitle'
            );

        this.firstName =
            page.locator(
                '#txtbxkycproposerfirstname'
            );

        this.middleName =
            page.locator(
                '#txtbxkycproposermiddlename'
            );

        this.lastName =
            page.locator(
                '#txtbxkycproposerlastname'
            );

        this.gender =
            page.locator(
                '#ddlkycproposergender'
            );

        this.dateOfBirth =
            page.locator(
                '#txtbxkycproposerdob'
            );

        this.relationship =
            page.locator(
                '#ddlkycproposerreltoassured'
            );

        this.occupation =
            page.locator(
                '#ddlkycproposerjob'
            );

        this.annualIncome =
            page.locator(
                '#txtbxkycproposerincome'
            );

        this.mobileNumber =
            page.locator(
                '#txtbxkycproposermblno'
            );

        this.alternateMobileNumber =
            page.locator(
                '#txtbxkycproposeraltermblno'
            );

        this.email =
            page.locator(
                '#txtbxkycproposeremail'
            );

        this.fatherName =
            page.locator(
                '#txtbxkycproposerfathername'
            );

        this.pan =
            page.locator(
                '#txtbxkycproposerPAN'
            );

        this.aadhaarLast4Digits =
            page.locator(
                '#txtbxkycproposerAadhar'
            );
    }


    async isDisplayed() {
        return await this.firstName
            .isVisible()
            .catch(() => false);
    }


    async waitForSection() {
        console.log(
            'Waiting for Proposer Details section...'
        );

        await expect(
            this.title
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.firstName
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Proposer Details section displayed.'
        );
    }


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
                'ProposerDetails Excel sheet.'
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


    async selectDropdown(
        locator,
        value,
        fieldName
    ) {
        const label =
            String(
                value ?? ''
            ).trim();

        if (!label) {
            throw new Error(
                `${fieldName} is empty in ` +
                'ProposerDetails Excel sheet.'
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

        const options =
            await locator
                .locator('option')
                .allTextContents();

        console.log(
            `${fieldName} available options:`,
            options.map(
                option => option.trim()
            )
        );

        await locator.selectOption({
            label
        });

        await expect(
            locator
        ).not.toHaveValue('0');

        console.log(
            `${fieldName} selected: ${label}`
        );
    }


    async fillDateOfBirth(
        dobValue
    ) {
        const dob =
            String(
                dobValue ?? ''
            ).trim();

        if (!dob) {
            throw new Error(
                'Proposer DateOfBirth is empty in Excel.'
            );
        }

        if (
            !/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(
                dob
            )
        ) {
            throw new Error(
                `Invalid Proposer DateOfBirth: "${dob}". ` +
                'Use DD/MM/YYYY.'
            );
        }

        await expect(
            this.dateOfBirth
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.dateOfBirth
        ).toBeEditable({
            timeout: 30000
        });

        /*
         * The DOB field blocks normal keyboard input,
         * so set the value and dispatch application events.
         */
        await this.dateOfBirth.evaluate(
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
            this.dateOfBirth
        ).toHaveValue(
            dob
        );

        await this.lastName.click();

        await this.page.waitForTimeout(
            500
        );

        console.log(
            `Proposer Date of Birth entered: ${dob}`
        );
    }


    async fillAnnualIncome(
        value
    ) {
        const income =
            String(
                value ?? ''
            )
                .replace(/,/g, '')
                .trim();

        if (!income) {
            throw new Error(
                'Proposer AnnualIncome is empty in Excel.'
            );
        }

        if (!/^\d+$/.test(income)) {
            throw new Error(
                `Invalid Proposer AnnualIncome: "${value}".`
            );
        }

        await expect(
            this.annualIncome
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.annualIncome
        ).toBeEditable({
            timeout: 30000
        });

        await this.annualIncome.fill(
            income
        );

        await this.annualIncome.press(
            'Tab'
        );

        await this.page.waitForTimeout(
            500
        );

        console.log(
            `Proposer Annual Income entered: ${income}`
        );
    }


    async fill(
        proposerDetailsData
    ) {
        if (!proposerDetailsData) {
            throw new Error(
                'ProposerDetails Excel data is missing.'
            );
        }

        console.log(
            '===== Filling Proposer Details ====='
        );

        console.log(
            'Proposer Details Excel data:',
            proposerDetailsData
        );

        await this.waitForSection();

        await this.selectDropdown(
            this.title,
            proposerDetailsData.Title,
            'Proposer Title'
        );

        await this.fillMandatoryText(
            this.firstName,
            proposerDetailsData.FirstName,
            'Proposer First Name'
        );

        await this.fillOptionalText(
            this.middleName,
            proposerDetailsData.MiddleName,
            'Proposer Middle Name'
        );

        await this.fillMandatoryText(
            this.lastName,
            proposerDetailsData.LastName,
            'Proposer Last Name'
        );

        await this.selectDropdown(
            this.gender,
            proposerDetailsData.Gender,
            'Proposer Gender'
        );

        await this.fillDateOfBirth(
            proposerDetailsData.DateOfBirth
        );

        await this.selectDropdown(
            this.relationship,
            proposerDetailsData.Relationship,
            'Relationship with Assured'
        );

        await this.selectDropdown(
            this.occupation,
            proposerDetailsData.Occupation,
            'Proposer Occupation'
        );

        await this.fillAnnualIncome(
            proposerDetailsData.AnnualIncome
        );

        await this.fillMandatoryText(
            this.mobileNumber,
            proposerDetailsData.MobileNumber,
            'Proposer Mobile Number'
        );

        await this.fillOptionalText(
            this.alternateMobileNumber,
            proposerDetailsData.AlternateMobileNumber,
            'Proposer Alternate Mobile Number'
        );

        await this.fillMandatoryText(
            this.email,
            proposerDetailsData.Email,
            'Proposer Email'
        );

        await this.fillMandatoryText(
            this.fatherName,
            proposerDetailsData.FatherName,
            'Proposer Father Name'
        );

        await this.fillOptionalText(
            this.pan,
            proposerDetailsData.PAN,
            'Proposer PAN'
        );

        await this.fillOptionalText(
            this.aadhaarLast4Digits,
            proposerDetailsData.AadhaarLast4Digits,
            'Proposer Aadhaar Last 4 Digits'
        );

        /*
         * Trigger validation for the final field.
         */
        if (
            String(
                proposerDetailsData.AadhaarLast4Digits || ''
            ).trim()
        ) {
            await this.aadhaarLast4Digits.press(
                'Tab'
            );
        } else {
            await this.fatherName.press(
                'Tab'
            );
        }

        await this.page.waitForTimeout(
            500
        );

        console.log(
            'Proposer Details completed successfully.'
        );
    }
}


module.exports =
    ProposerDetailsSection;