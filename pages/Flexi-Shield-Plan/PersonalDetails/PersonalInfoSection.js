const { expect } = require('@playwright/test');

class PersonalInfoSection {
    constructor(page) {
        this.page = page;

        this.title =
            page.locator('#ddlkyctitle');

        this.firstName =
            page.locator('#txtbxkycfirstname');

        this.middleName =
            page.locator('#txtbxkycmiddlename');

        this.lastName =
            page.locator('#txtbxkyclastname');

        this.fatherName =
            page.locator('#txtbxkycfathername');

        this.spouseName =
            page.locator('#txtbxkycspousename');

        this.pan =
            page.locator('#txtbxkycPAN');
    }

    async waitForSection() {
        console.log(
            'Waiting for Personal Information section...'
        );

        await expect(
            this.title
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.firstName
        ).toBeVisible({
            timeout: 120000
        });

        console.log(
            'Personal Information section loaded.'
        );
    }

    async selectDropdown(
        locator,
        value,
        fieldName
    ) {
        const expectedValue =
            String(value || '').trim();

        if (!expectedValue) {
            throw new Error(
                `${fieldName} is missing in Excel.`
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
            timeout: 60000
        });

        const options =
            await locator
                .locator('option')
                .allTextContents();

        const cleanedOptions =
            options.map(option =>
                String(option).trim()
            );

        console.log(
            `${fieldName} available options:`,
            cleanedOptions
        );

        const matchingOption =
            cleanedOptions.find(option =>
                option.toLowerCase() ===
                expectedValue.toLowerCase()
            );

        if (!matchingOption) {
            throw new Error(
                `${fieldName} "${expectedValue}" was not found. ` +
                `Available options: ${cleanedOptions.join(', ')}`
            );
        }

        await locator.selectOption({
            label: matchingOption
        });

        await expect.poll(
            async () => {
                return String(
                    await locator
                        .locator('option:checked')
                        .textContent()
                        .catch(() => '')
                ).trim();
            },
            {
                timeout: 30000,
                intervals: [500, 1000, 2000]
            }
        ).toBe(matchingOption);

        console.log(
            `${fieldName} selected: ${matchingOption}`
        );
    }

    async fillAndVerify(
        locator,
        value,
        fieldName,
        required = true
    ) {
        const expectedValue =
            String(value || '').trim();

        if (!expectedValue) {
            if (required) {
                throw new Error(
                    `${fieldName} is missing in Excel.`
                );
            }

            console.log(
                `${fieldName} is empty in Excel. Skipping.`
            );

            return;
        }

        await expect(
            locator
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            locator
        ).toBeEditable({
            timeout: 60000
        });

        await locator.fill('');

        await locator.fill(
            expectedValue
        );

        await expect(
            locator
        ).toHaveValue(
            expectedValue,
            {
                timeout: 30000
            }
        );

        console.log(
            `${fieldName} entered: ${expectedValue}`
        );
    }

    async verifyFirstName() {
        console.log(
            'Verifying auto-populated First Name...'
        );

        await expect(
            this.firstName
        ).not.toHaveValue('', {
            timeout: 60000
        });

        const firstNameValue =
            String(
                await this.firstName.inputValue()
            ).trim();

        if (!firstNameValue) {
            throw new Error(
                'First Name was not auto-populated.'
            );
        }

        console.log(
            `Auto-populated First Name: ${firstNameValue}`
        );
    }

    async fill(data) {
        console.log(
            '===== Filling Personal Information ====='
        );

        if (!data) {
            throw new Error(
                'PersonalInfo Excel data is missing.'
            );
        }

        const title =
            String(
                data.Title || ''
            ).trim();

        const middleName =
            String(
                data.MiddleName || ''
            ).trim();

        const lastName =
            String(
                data.LastName || ''
            ).trim();

        const fatherName =
            String(
                data.FatherName || ''
            ).trim();

        const spouseName =
            String(
                data.SpouseName || ''
            ).trim();

        const pan =
            String(
                data.PAN || ''
            )
                .trim()
                .toUpperCase();

        console.log(
            'Personal Information Excel data:',
            {
                title,
                middleName,
                lastName,
                fatherName,
                spouseName,
                pan
            }
        );

        await this.waitForSection();

        await this.selectDropdown(
            this.title,
            title,
            'Title'
        );

        await this.verifyFirstName();

        await this.fillAndVerify(
            this.middleName,
            middleName,
            'Middle Name',
            false
        );

        await this.fillAndVerify(
            this.lastName,
            lastName,
            'Last Name'
        );

        await this.fillAndVerify(
            this.fatherName,
            fatherName,
            'Father Name'
        );

        await this.fillAndVerify(
            this.spouseName,
            spouseName,
            'Spouse Name',
            false
        );

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
            throw new Error(
                `Invalid PAN format: "${pan}"`
            );
        }

        await this.fillAndVerify(
            this.pan,
            pan,
            'PAN'
        );

        console.log(
            'Personal Information completed successfully.'
        );
    }
}

module.exports = PersonalInfoSection;