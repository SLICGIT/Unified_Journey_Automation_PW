const {
    expect
} = require('@playwright/test');

class NomineeDetailsSection {

    // ========================================================
    // PART 1: CONSTRUCTOR AND LOCATORS
    // ========================================================

    constructor(page) {
        this.page = page;

        /*
         * Nominee heading/add-button container.
         *
         * Important:
         * The actual nominee fields are not inside this
         * container, so field locators must use this.page.
         */
        this.nomineeContainer =
            page.locator(
                '#kycnomineemaindiv'
            );

        this.nomineeHeading =
            this.nomineeContainer
                .locator('p')
                .first();

        this.addButton =
            this.nomineeContainer
                .getByRole(
                    'button',
                    {
                        name: /Add/i
                    }
                );

        this.continueButton =
            page.locator(
                '#btnkyccontinue'
            );
    }

    /*
     * Dynamic nominee locators.
     *
     * These locators search the complete page.
     */
    getNomineeLocators(
        nomineeNumber
    ) {
        return {
            title:
                this.page.locator(
                    `#ddlkycnomineetitle${nomineeNumber}`
                ),

            firstName:
                this.page.locator(
                    `#txtbxkycnomineefirstname${nomineeNumber}`
                ),

            middleName:
                this.page.locator(
                    `#txtbxkycnomineemiddlename${nomineeNumber}`
                ),

            lastName:
                this.page.locator(
                    `#txtbxkycnomineelastname${nomineeNumber}`
                ),

            dob:
                this.page.locator(
                    `#txtbxkycnomineedob${nomineeNumber}`
                ),

            gender:
                this.page.locator(
                    `#ddlkycnomineegender${nomineeNumber}`
                ),

            relationship:
                this.page.locator(
                    `#ddlkycnomineereltoassured${nomineeNumber}`
                ),

            nomineeShare:
                this.page.locator(
                    `#txtbxkycnomineeshare${nomineeNumber}`
                ),

            deleteButton:
                this.page.locator(
                    `#kycnomineedelete${nomineeNumber}`
                )
        };
    }


    // ========================================================
    // PART 2: AGE CALCULATION AND SECTION WAIT
    // ========================================================

    /*
     * Calculate age using DD/MM/YYYY or DD-MM-YYYY.
     */
    calculateAge(
        dateOfBirth
    ) {
        const dobText =
            String(
                dateOfBirth || ''
            ).trim();

        const parts =
            dobText.split(/[/-]/);

        if (
            parts.length !== 3
        ) {
            throw new Error(
                `Invalid nominee DOB format: ` +
                `"${dateOfBirth}". ` +
                'Use DD/MM/YYYY or DD-MM-YYYY.'
            );
        }

        const day =
            Number(parts[0]);

        const month =
            Number(parts[1]) - 1;

        let year =
            Number(parts[2]);

        /*
         * Optional support for two-digit years.
         */
        if (
            year < 100
        ) {
            year +=
                year <= 30
                    ? 2000
                    : 1900;
        }

        const dob =
            new Date(
                year,
                month,
                day
            );

        if (
            Number.isNaN(
                dob.getTime()
            ) ||
            dob.getDate() !== day ||
            dob.getMonth() !== month ||
            dob.getFullYear() !== year
        ) {
            throw new Error(
                `Invalid nominee DOB: ` +
                `"${dateOfBirth}".`
            );
        }

        const today =
            new Date();

        if (
            dob > today
        ) {
            throw new Error(
                `Nominee DOB cannot be in the future: ` +
                `"${dateOfBirth}".`
            );
        }

        let age =
            today.getFullYear() -
            dob.getFullYear();

        const monthDifference =
            today.getMonth() -
            dob.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() <
                dob.getDate()
            )
        ) {
            age -= 1;
        }

        return age;
    }

    async waitForSection() {
        console.log(
            'Waiting for Nominee Details section...'
        );

        await expect(
            this.nomineeContainer
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.nomineeHeading
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Nominee container displayed.'
        );

        const firstNominee =
            this.getNomineeLocators(1);

        await expect(
            firstNominee.firstName
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            firstNominee.title
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Nominee Details section loaded.'
        );
    }


    // ========================================================
    // PART 3: COMMON FIELD METHODS
    // ========================================================

    async selectDropdown(
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
                'NomineeDetails Excel sheet.'
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

        console.log(
            `${fieldName} available options:`,
            availableOptions.map(
                option =>
                    option.trim()
            )
        );

        await locator.selectOption({
            label: optionText
        });

        await expect(
            locator
        ).not.toHaveValue('0');

        console.log(
            `${fieldName} selected: ${optionText}`
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
                'NomineeDetails Excel sheet.'
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

    async fillDob(
        locator,
        value,
        nomineeNumber
    ) {
        const dobValue =
            String(
                value ?? ''
            ).trim();

        if (!dobValue) {
            throw new Error(
                `Nominee ${nomineeNumber} DOB is empty.`
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

        /*
         * Field blocks keyboard input.
         * Set the value and trigger application events.
         */
        await locator.evaluate(
            (
                element,
                dob
            ) => {
                element.value = dob;

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
                        'blur',
                        {
                            bubbles: true
                        }
                    )
                );
            },
            dobValue
        );

        await expect(
            locator
        ).toHaveValue(
            dobValue
        );

        console.log(
            `Nominee ${nomineeNumber} DOB entered: ` +
            `${dobValue}`
        );
    }


    // ========================================================
    // PART 4: FILL ONE NOMINEE
    // ========================================================

    async fillNominee(
        nomineeData,
        nomineeNumber = 1
    ) {
        if (!nomineeData) {
            throw new Error(
                `Nominee ${nomineeNumber} ` +
                'Excel data is missing.'
            );
        }

        console.log(
            `===== Filling Nominee ${nomineeNumber} =====`
        );

        const nominee =
            this.getNomineeLocators(
                nomineeNumber
            );

        await this.selectDropdown(
            nominee.title,
            nomineeData.Title,
            `Nominee ${nomineeNumber} Title`
        );

        await this.fillMandatoryText(
            nominee.firstName,
            nomineeData.FirstName,
            `Nominee ${nomineeNumber} First Name`
        );

        await this.fillOptionalText(
            nominee.middleName,
            nomineeData.MiddleName,
            `Nominee ${nomineeNumber} Middle Name`
        );

        await this.fillMandatoryText(
            nominee.lastName,
            nomineeData.LastName,
            `Nominee ${nomineeNumber} Last Name`
        );

        await this.fillDob(
            nominee.dob,
            nomineeData.DateOfBirth,
            nomineeNumber
        );

        await this.selectDropdown(
            nominee.gender,
            nomineeData.Gender,
            `Nominee ${nomineeNumber} Gender`
        );

        await this.selectDropdown(
            nominee.relationship,
            nomineeData.Relationship,
            `Nominee ${nomineeNumber} Relationship`
        );

        await this.fillMandatoryText(
            nominee.nomineeShare,
            nomineeData['NomineeShare(%)'],
            `Nominee ${nomineeNumber} Share`
        );

        const nomineeAge =
            this.calculateAge(
                nomineeData.DateOfBirth
            );

        const isMinor =
            nomineeAge < 18;

        console.log(
            `Nominee ${nomineeNumber} Age: ` +
            `${nomineeAge}`
        );

        console.log(
            `Nominee ${nomineeNumber} is Minor: ` +
            `${isMinor}`
        );

        console.log(
            `Nominee ${nomineeNumber} ` +
            'basic details completed.'
        );

        return {
            nomineeNumber,
            nomineeAge,
            isMinor,
            dateOfBirth:
                nomineeData.DateOfBirth
        };
    }


    // ========================================================
    // PART 5: ADD, DELETE AND COMPLETE NOMINEES
    // ========================================================

    async addNominee() {
        await expect(
            this.addButton
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.addButton
        ).toBeEnabled({
            timeout: 30000
        });

        await this.addButton
            .scrollIntoViewIfNeeded();

        await this.addButton.click();

        console.log(
            'Add Nominee button clicked.'
        );
    }

    async deleteNominee(
        nomineeNumber
    ) {
        const nominee =
            this.getNomineeLocators(
                nomineeNumber
            );

        await expect(
            nominee.deleteButton
        ).toBeVisible({
            timeout: 30000
        });

        await nominee.deleteButton
            .scrollIntoViewIfNeeded();

        await nominee.deleteButton.click();

        console.log(
            `Nominee ${nomineeNumber} deleted.`
        );
    }

    async fill(
        nomineeRows
    ) {
        await this.waitForSection();

        if (
            !Array.isArray(
                nomineeRows
            ) ||
            nomineeRows.length === 0
        ) {
            throw new Error(
                'NomineeDetails Excel data is missing.'
            );
        }

        const nomineeResults = [];

        for (
            let index = 0;
            index < nomineeRows.length;
            index += 1
        ) {
            const nomineeNumber =
                index + 1;

            if (
                nomineeNumber > 1
            ) {
                await this.addNominee();

                const nominee =
                    this.getNomineeLocators(
                        nomineeNumber
                    );

                await expect(
                    nominee.firstName
                ).toBeVisible({
                    timeout: 30000
                });
            }

            const nomineeResult =
                await this.fillNominee(
                    nomineeRows[index],
                    nomineeNumber
                );

            nomineeResults.push(
                nomineeResult
            );
        }

        /*
         * Total nominee share must equal 100.
         */
        const totalShare =
            nomineeRows.reduce(
                (
                    total,
                    nominee
                ) => {
                    const share =
                        Number(
                            String(
                                nominee[
                                    'NomineeShare(%)'
                                ] ?? ''
                            )
                                .replace('%', '')
                                .trim()
                        );

                    return total + (
                        Number.isNaN(
                            share
                        )
                            ? 0
                            : share
                    );
                },
                0
            );

        console.log(
            'Total Nominee Share:',
            totalShare
        );

        if (
            totalShare !== 100
        ) {
            throw new Error(
                `Total Nominee Share must be 100. ` +
                `Current total: ${totalShare}`
            );
        }

        console.log(
            `Total Nominee Share verified: ` +
            `${totalShare}%`
        );

        console.log(
            'Nominee Details completed successfully.'
        );

        return nomineeResults;
    }
}

module.exports =
    NomineeDetailsSection;