const { expect } = require('@playwright/test');

class PermanentAddressSection {
    constructor(page) {
        this.page = page;

        this.address1 =
            page.locator('#txtbxkycaddrline1_1');

        this.address2 =
            page.locator('#txtbxkycaddrline2_1');

        this.pincode =
            page.locator('#txtbxkycpincode_1');

        this.gramPanchayatName =
            page.locator('#ddlkycgrampanchname_1');

        this.gramPanchayatCode =
            page.locator('#txtbxkycgrampanchcode_1');

        this.areaVillage =
            page.locator('#ddlkycarea_1');

        this.city =
            page.locator('#txtbxkyccity_1');

        this.state =
            page.locator('#txtbxkycstate_1');

        this.alternateContact =
            page.locator('#txtbxkycaltcontact_1');

        this.othersCheckbox =
            page.locator('#chkbxkycothers');

        this.loadingOverlay =
            page.locator('#loading2');
    }

    async waitForSection() {
        console.log(
            'Waiting for Permanent Address section...'
        );

        await expect(
            this.address1
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.pincode
        ).toBeVisible({
            timeout: 120000
        });

        console.log(
            'Permanent Address section loaded.'
        );
    }

    async waitForLoadingCycle() {
        try {
            await this.loadingOverlay.waitFor({
                state: 'visible',
                timeout: 3000
            });

            console.log(
                'Permanent Address loading started.'
            );

            await this.loadingOverlay.waitFor({
                state: 'hidden',
                timeout: 120000
            });

            console.log(
                'Permanent Address loading completed.'
            );
        } catch {
            const visible =
                await this.loadingOverlay
                    .isVisible()
                    .catch(() => false);

            if (visible) {
                await this.loadingOverlay.waitFor({
                    state: 'hidden',
                    timeout: 120000
                });
            }
        }
    }

    async fillAndVerify(
        locator,
        value,
        fieldName
    ) {
        const expected =
            String(value || '').trim();

        if (!expected) {
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
        ).toBeEditable({
            timeout: 60000
        });

        await locator.fill('');

        await locator.fill(expected);

        await expect(
            locator
        ).toHaveValue(expected, {
            timeout: 30000
        });

        console.log(
            `${fieldName} entered: ${expected}`
        );
    }

    async getValidOptions(dropdown) {
        return dropdown
            .locator('option')
            .evaluateAll(options => {
                return options
                    .map(option => ({
                        label: String(
                            option.textContent || ''
                        ).trim(),

                        value: String(
                            option.value || ''
                        ).trim()
                    }))
                    .filter(option => {
                        return (
                            option.label &&
                            option.label.toLowerCase() !==
                                'select' &&
                            option.value &&
                            option.value !== '0'
                        );
                    });
            })
            .catch(() => []);
    }

    async waitForDropdownOptions(
        dropdown,
        fieldName
    ) {
        await expect.poll(
            async () => {
                const options =
                    await this.getValidOptions(
                        dropdown
                    );

                return options.length;
            },
            {
                timeout: 120000,
                intervals: [500, 1000, 2000],
                message:
                    `${fieldName} options were not loaded.`
            }
        ).toBeGreaterThan(0);
    }

    async selectExactOption(
        dropdown,
        expectedText,
        fieldName
    ) {
        const expected =
            String(expectedText || '').trim();

        if (!expected) {
            throw new Error(
                `${fieldName} is missing in Excel.`
            );
        }

        await this.waitForDropdownOptions(
            dropdown,
            fieldName
        );

        const options =
            await this.getValidOptions(
                dropdown
            );

        console.log(
            `${fieldName} available options:`,
            options.map(option => option.label)
        );

        const match =
            options.find(option => {
                return (
                    option.label.toLowerCase() ===
                        expected.toLowerCase() ||
                    option.value.toLowerCase() ===
                        expected.toLowerCase()
                );
            });

        if (!match) {
            throw new Error(
                `${fieldName} "${expected}" was not found. ` +
                `Available options: ${options
                    .map(option => option.label)
                    .join(', ')}`
            );
        }

        await dropdown.selectOption({
            value: match.value
        });

        await expect(
            dropdown
        ).toHaveValue(match.value, {
            timeout: 30000
        });

        console.log(
            `${fieldName} selected: ${match.label}`
        );

        return match;
    }

    async selectOthersCheckbox() {
        console.log(
            'Selecting Others checkbox...'
        );

        await expect(
            this.othersCheckbox
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.othersCheckbox
        ).toBeEnabled({
            timeout: 60000
        });

        await this.othersCheckbox
            .scrollIntoViewIfNeeded();

        if (
            !await this.othersCheckbox.isChecked()
        ) {
            await this.othersCheckbox.check({
                force: true
            });
        }

        await expect(
            this.othersCheckbox
        ).toBeChecked({
            timeout: 30000
        });

        /*
         * OthersCheckToggle may reset address fields.
         * Therefore, check Others before entering Pincode.
         */
        await this.waitForLoadingCycle();

        console.log(
            'Others checkbox selected.'
        );
    }

    async enterPincode(pincode) {
        const pin =
            String(pincode || '')
                .trim()
                .replace(/\.0$/, '');

        if (!/^\d{6}$/.test(pin)) {
            throw new Error(
                `Invalid Permanent Pincode: "${pin}"`
            );
        }

        console.log(
            `Entering Permanent Pincode: ${pin}`
        );

        await expect(
            this.pincode
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.pincode
        ).toBeEditable({
            timeout: 60000
        });

        await this.pincode.fill('');

        await this.pincode.fill(pin);

        await expect(
            this.pincode
        ).toHaveValue(pin);

        /*
         * Pincode lookup runs on focusout.
         */
        console.log(
            'Clicking outside Permanent Pincode...'
        );

        await this.address1.click();

        await expect(
            this.pincode
        ).toHaveValue(pin);

        await this.waitForLoadingCycle();

        console.log(
            `Permanent Pincode lookup completed: ${pin}`
        );
    }

    async hasGramPanchayatFlow() {
    const gramVisible =
        await this.gramPanchayatName
            .isVisible()
            .catch(() => false);

    if (!gramVisible) {
        console.log(
            'Gram Panchayat field is not displayed. ' +
            'Using direct Area/Village flow.'
        );

        return false;
    }

    const gramOptions =
        await this.getValidOptions(
            this.gramPanchayatName
        );

    const hasGramFlow =
        gramOptions.length > 0;

    console.log(
        `Gram Panchayat flow available: ${hasGramFlow}`
    );

    return hasGramFlow;
}

    async handleDirectAreaFlow(area) {
    console.log(
        'Following direct Permanent Area/Village flow.'
    );

    await this.selectExactOption(
        this.areaVillage,
        area,
        'Permanent Area/Village'
    );

    await this.waitForLoadingCycle();

    await this.verifyCityAndState();
}

    async handleRuralAddress(
        gramPanchayatName,
        area
    ) {
        console.log(
            'Following Rural Permanent Address flow.'
        );

        if (!gramPanchayatName) {
            throw new Error(
                'GramPanchayatName is required ' +
                'for a Rural Permanent Address.'
            );
        }

        /*
         * Rural:
         * Pincode → Gram Panchayat →
         * Gram Panchayat Code →
         * Area/Village → City/State
         */
        await this.selectExactOption(
            this.gramPanchayatName,
            gramPanchayatName,
            'Permanent Gram Panchayat'
        );

        await this.waitForLoadingCycle();

        /*
         * Gram Panchayat Code is auto-populated.
         */
        await expect.poll(
            async () => {
                return String(
                    await this.gramPanchayatCode
                        .inputValue()
                        .catch(() => '')
                ).trim();
            },
            {
                timeout: 60000,
                intervals: [500, 1000, 2000],
                message:
                    'Permanent Gram Panchayat Code ' +
                    'was not auto-populated.'
            }
        ).not.toBe('');

        console.log(
            'Permanent Gram Panchayat Code:',
            await this.gramPanchayatCode
                .inputValue()
        );

        await this.selectExactOption(
            this.areaVillage,
            area,
            'Permanent Rural Area/Village'
        );

        await this.waitForLoadingCycle();

        await this.verifyCityAndState();
    }

    async verifyCityAndState() {
        console.log(
            'Verifying Permanent City and State...'
        );

        await expect.poll(
            async () => {
                const city =
                    String(
                        await this.city
                            .inputValue()
                            .catch(() => '')
                    ).trim();

                const state =
                    String(
                        await this.state
                            .inputValue()
                            .catch(() => '')
                    ).trim();

                return Boolean(city && state);
            },
            {
                timeout: 60000,
                intervals: [500, 1000, 2000],
                message:
                    'Permanent City and State ' +
                    'were not auto-populated.'
            }
        ).toBeTruthy();

        console.log(
            'Permanent City:',
            await this.city.inputValue()
        );

        console.log(
            'Permanent State:',
            await this.state.inputValue()
        );
    }

    async verifyFinalAddress(expectedArea) {
        const area =
            String(expectedArea || '').trim();

        await expect.poll(
            async () => {
                const selectedArea =
                    String(
                        await this.areaVillage
                            .locator('option:checked')
                            .textContent()
                            .catch(() => '')
                    ).trim();

                const city =
                    String(
                        await this.city
                            .inputValue()
                            .catch(() => '')
                    ).trim();

                const state =
                    String(
                        await this.state
                            .inputValue()
                            .catch(() => '')
                    ).trim();

                return (
                    selectedArea.toLowerCase() ===
                        area.toLowerCase() &&
                    city !== '' &&
                    state !== ''
                );
            },
            {
                timeout: 60000,
                intervals: [500, 1000, 2000],
                message:
                    'Permanent Address did not remain stable.'
            }
        ).toBeTruthy();

        console.log(
            'Permanent Address verified successfully.'
        );
    }

    async fill(data) {
        console.log(
            '===== Filling Permanent Address ====='
        );

        if (!data) {
            throw new Error(
                'PermanentAddress Excel data is missing.'
            );
        }

        const address1 =
            String(
                data['Address 1'] || ''
            ).trim();

        const address2 =
            String(
                data['Address 2'] || ''
            ).trim();

        const pincode =
            String(
                data.PinCode || ''
            )
                .trim()
                .replace(/\.0$/, '');

        const gramPanchayatName =
            String(
                data.GramPanchayatName || ''
            ).trim();

        const area =
            String(
                data['Area/Village'] || ''
            ).trim();

        const alternateContact =
            String(
                data.AltContactNo || ''
            )
                .trim()
                .replace(/\.0$/, '');

        if (
            !/^\d{10}$/.test(
                alternateContact
            )
        ) {
            throw new Error(
                `Invalid Alternate Contact Number: ` +
                `"${alternateContact}"`
            );
        }

        await this.waitForSection();

        await this.fillAndVerify(
            this.address1,
            address1,
            'Permanent Address 1'
        );

        /*
         * Address 2 is treated as mandatory.
         */
        await this.fillAndVerify(
            this.address2,
            address2,
            'Permanent Address 2'
        );

        /*
         * Enter alternate contact before
         * pincode-dependent fields.
         */
        await this.fillAndVerify(
            this.alternateContact,
            alternateContact,
            'Alternate Contact Number'
        );

        /*
         * Check Others before entering Pincode,
         * because its onclick may reset address data.
         */
        await this.selectOthersCheckbox();

        await this.enterPincode(
            pincode
        );

       const hasGramFlow =
    await this.hasGramPanchayatFlow();

if (hasGramFlow) {
    /*
     * Pincode
     * → Gram Panchayat
     * → Area/Village
     * → City/State
     */
    await this.handleRuralAddress(
        gramPanchayatName,
        area
    );
} else {
    /*
     * Pincode
     * → Area/Village directly
     * → City/State
     *
     * This may happen for Urban or Rural data.
     */
    await this.handleDirectAreaFlow(
        area
    );
}
        await this.verifyFinalAddress(
            area
        );

        console.log(
            'Permanent Address completed successfully.'
        );
    }
}

module.exports = PermanentAddressSection;