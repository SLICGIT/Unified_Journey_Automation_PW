const { expect } = require('@playwright/test');

class CurrentAddressSection {
    constructor(page) {
        this.page = page;

        this.sameAsPermanentCheckbox =
            page.locator('#chkbxkycsameaddr_1');

        this.address1 =
            page.locator('#txtbxkycaddrline1_2');

        this.address2 =
            page.locator('#txtbxkycaddrline2_2');

        this.pincode =
            page.locator('#txtbxkycpincode_2');

        /*
         * Target only the select elements because
         * the application contains duplicate IDs
         * on some label elements.
         */
        this.gramPanchayatName =
            page.locator(
                'select#ddlkycgrampanchname_2'
            );

        this.gramPanchayatCode =
            page.locator(
                '#txtbxkycgrampanchcode_2'
            );

        this.area =
            page.locator(
                'select#ddlkycarea_2'
            );

        this.city =
            page.locator(
                '#txtbxkyccity_2'
            );

        this.state =
            page.locator(
                '#txtbxkycstate_2'
            );

        this.loadingOverlay =
            page.locator('#loading2');
    }

    async waitForSection() {
        console.log(
            'Waiting for Current Address section...'
        );

        await expect(
            this.sameAsPermanentCheckbox
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.address1
        ).toBeVisible({
            timeout: 120000
        });

        console.log(
            'Current Address section loaded.'
        );
    }

    async waitForLoadingCycle() {
        try {
            await this.loadingOverlay.waitFor({
                state: 'visible',
                timeout: 3000
            });

            console.log(
                'Current Address loading started.'
            );

            await this.loadingOverlay.waitFor({
                state: 'hidden',
                timeout: 120000
            });

            console.log(
                'Current Address loading completed.'
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
                            option.label
                                .toLowerCase() !==
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
                intervals: [
                    500,
                    1000,
                    2000
                ],
                message:
                    `${fieldName} options were not loaded.`
            }
        ).toBeGreaterThan(0);

        console.log(
            `${fieldName} options loaded.`
        );
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

        await expect(
            dropdown
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            dropdown
        ).toBeEnabled({
            timeout: 60000
        });

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
            options.map(
                option => option.label
            )
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
    }

    async waitForPincodeFetching() {
    /*
     * The loader may:
     * 1. Appear and disappear normally.
     * 2. Appear very briefly.
     * 3. Not become visible to Playwright,
     *    even though the request is running.
     *
     * Therefore, wait for it when visible,
     * but do not fail only because it was missed.
     */
    const loaderAppeared =
        await this.loadingOverlay
            .waitFor({
                state: 'visible',
                timeout: 5000
            })
            .then(() => true)
            .catch(() => false);

    if (loaderAppeared) {
        console.log(
            'Fetching Details popup displayed.'
        );

        await this.loadingOverlay.waitFor({
            state: 'hidden',
            timeout: 120000
        });

        console.log(
            'Fetching Details popup closed.'
        );
    } else {
        console.log(
            'Fetching popup was not captured. ' +
            'Waiting for fetched Area data directly.'
        );
    }
}

async enterPincode(pincode) {
    const pin =
        String(pincode || '')
            .trim()
            .replace(/\.0$/, '');

    if (!/^\d{6}$/.test(pin)) {
        throw new Error(
            `Invalid Current Pincode: "${pin}"`
        );
    }

    console.log(
        `Entering Current Pincode: ${pin}`
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

    await this.pincode.click();

    await this.pincode.fill('');

    await this.pincode.fill(pin);

    await expect(
        this.pincode
    ).toHaveValue(pin);

    /*
     * Trigger the pincode onfocusout event.
     */
    console.log(
        'Triggering Current Pincode focusout...'
    );

    await this.pincode.press('Tab');

    /*
     * Give the application a moment to start
     * the lookup and display the loader.
     */
    await this.page.waitForTimeout(1000);

    const loaderAppeared =
        await this.loadingOverlay
            .waitFor({
                state: 'visible',
                timeout: 5000
            })
            .then(() => true)
            .catch(() => false);

    if (loaderAppeared) {
        console.log(
            'Current Address fetching popup displayed.'
        );

        await this.loadingOverlay.waitFor({
            state: 'hidden',
            timeout: 120000
        });

        console.log(
            'Current Address fetching popup closed.'
        );
    } else {
        console.log(
            'Fetching popup was not captured. ' +
            'Waiting for Current Area data.'
        );
    }

    /*
     * This is the reliable confirmation that
     * the pincode lookup has completed.
     */
    await this.waitForDropdownOptions(
        this.area,
        'Current Area'
    );

    await expect(
        this.pincode
    ).toHaveValue(pin);

    console.log(
        `Current Pincode fetching completed: ${pin}`
    );
}

    async hasGramPanchayatFlow() {
        const visible =
            await this.gramPanchayatName
                .isVisible()
                .catch(() => false);

        if (!visible) {
            console.log(
                'Current Gram Panchayat field is hidden. ' +
                'Using direct Area flow.'
            );

            return false;
        }

        const options =
            await this.getValidOptions(
                this.gramPanchayatName
            );

        const available =
            options.length > 0;

        console.log(
            `Current Gram Panchayat flow available: ` +
            `${available}`
        );

        return available;
    }

    async verifyCityAndState() {
        console.log(
            'Verifying Current City and State...'
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

                return Boolean(
                    city &&
                    state
                );
            },
            {
                timeout: 60000,
                intervals: [
                    500,
                    1000,
                    2000
                ],
                message:
                    'Current City and State ' +
                    'were not auto-populated.'
            }
        ).toBeTruthy();

        console.log(
            'Current City:',
            await this.city.inputValue()
        );

        console.log(
            'Current State:',
            await this.state.inputValue()
        );
    }
        async handleDirectAreaFlow(area) {
        console.log(
            'Following direct Current Area flow.'
        );

        await this.selectExactOption(
            this.area,
            area,
            'Current Area'
        );

        await this.waitForLoadingCycle();

        await this.verifyCityAndState();
    }

    async handleGramPanchayatFlow(
        gramPanchayatName,
        area
    ) {
        console.log(
            'Following Current Gram Panchayat flow.'
        );

        if (!gramPanchayatName) {
            throw new Error(
                'CurrentGramPanchayatName is required ' +
                'when Gram Panchayat options are displayed.'
            );
        }

        await this.selectExactOption(
            this.gramPanchayatName,
            gramPanchayatName,
            'Current Gram Panchayat'
        );

        await this.waitForLoadingCycle();

        const codeVisible =
            await this.gramPanchayatCode
                .isVisible()
                .catch(() => false);

        if (codeVisible) {
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
                    intervals: [
                        500,
                        1000,
                        2000
                    ],
                    message:
                        'Current Gram Panchayat Code ' +
                        'was not auto-populated.'
                }
            ).not.toBe('');

            console.log(
                'Current Gram Panchayat Code:',
                await this.gramPanchayatCode
                    .inputValue()
            );
        }

        await this.waitForDropdownOptions(
            this.area,
            'Current Area'
        );

        await this.selectExactOption(
            this.area,
            area,
            'Current Area'
        );

        await this.waitForLoadingCycle();

        await this.verifyCityAndState();
    }

    async verifyCopiedAddress() {
        console.log(
            'Verifying copied Current Address...'
        );

        await expect.poll(
            async () => {
                const address1 =
                    String(
                        await this.address1
                            .inputValue()
                            .catch(() => '')
                    ).trim();

                const pincode =
                    String(
                        await this.pincode
                            .inputValue()
                            .catch(() => '')
                    ).trim();

                const selectedArea =
                    String(
                        await this.area
                            .locator(
                                'option:checked'
                            )
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

                return Boolean(
                    address1 &&
                    pincode &&
                    selectedArea &&
                    selectedArea.toLowerCase() !==
                        'select' &&
                    city &&
                    state
                );
            },
            {
                timeout: 60000,
                intervals: [
                    500,
                    1000,
                    2000
                ],
                message:
                    'Current Address was not copied ' +
                    'from Permanent Address.'
            }
        ).toBeTruthy();

        console.log(
            'Current Address copied successfully.'
        );
    }

    async selectSameAsPermanent() {
        await expect(
            this.sameAsPermanentCheckbox
        ).toBeVisible({
            timeout: 60000
        });

        const checked =
            await this.sameAsPermanentCheckbox
                .isChecked()
                .catch(() => false);

        if (!checked) {
            console.log(
                'Selecting Same as Permanent checkbox...'
            );

            await this.sameAsPermanentCheckbox
                .check({
                    force: true
                });
        }

        await expect(
            this.sameAsPermanentCheckbox
        ).toBeChecked({
            timeout: 30000
        });

        await this.page.waitForTimeout(
            2000
        );

        await this.waitForLoadingCycle();

        await this.verifyCopiedAddress();
    }

    async uncheckSameAsPermanent() {
        const checked =
            await this.sameAsPermanentCheckbox
                .isChecked()
                .catch(() => false);

        if (checked) {
            console.log(
                'Unchecking Same as Permanent checkbox...'
            );

            await this.sameAsPermanentCheckbox
                .uncheck({
                    force: true
                });

            await expect(
                this.sameAsPermanentCheckbox
            ).not.toBeChecked({
                timeout: 30000
            });

            await this.page.waitForTimeout(
                2000
            );

            await this.waitForLoadingCycle();
        }
    }

        async fillManualAddress(data) {
        const address1 =
            String(
                data['CurrentAddress 1'] || ''
            ).trim();

        const address2 =
            String(
                data['CurrentAddress 2'] || ''
            ).trim();

        const pincode =
            String(
                data.CurrentPinCode || ''
            )
                .trim()
                .replace(/\.0$/, '');

        const gramPanchayatName =
            String(
                data.CurrentGramPanchayatName || ''
            ).trim();

        const area =
            String(
                data.CurrentArea || ''
            ).trim();

        await this.uncheckSameAsPermanent();

        await this.fillAndVerify(
            this.address1,
            address1,
            'Current Address 1'
        );

        await this.fillAndVerify(
            this.address2,
            address2,
            'Current Address 2'
        );

        await this.enterPincode(
            pincode
        );

       /*
 * Gram Panchayat flow is required only when
 * Excel contains CurrentGramPanchayatName
 * and the dropdown has valid options.
 */
if (gramPanchayatName) {
    const hasGramFlow =
        await this.hasGramPanchayatFlow();

    if (!hasGramFlow) {
        throw new Error(
            `Current Gram Panchayat "${gramPanchayatName}" ` +
            'was provided in Excel, but dropdown options were not loaded.'
        );
    }

    console.log(
        'Following Rural Current Address flow.'
    );

    await this.handleGramPanchayatFlow(
        gramPanchayatName,
        area
    );
} else {
    console.log(
        'Following Urban Current Address flow. ' +
        'Gram Panchayat will be ignored.'
    );

    await this.handleDirectAreaFlow(
        area
    );
}
    }

    async fill(data) {
        console.log(
            '===== Filling Current Address ====='
        );

        if (!data) {
            throw new Error(
                'CurrentAddress Excel data is missing.'
            );
        }

        await this.waitForSection();

        const sameAsPermanent =
            String(
                data.SameAsPermanent || ''
            )
                .trim()
                .toUpperCase();

        if (
            sameAsPermanent !== 'YES' &&
            sameAsPermanent !== 'NO'
        ) {
            throw new Error(
                `Invalid SameAsPermanent value: ` +
                `"${data.SameAsPermanent}". ` +
                'Use Yes or No.'
            );
        }

        console.log(
            `SameAsPermanent: ${sameAsPermanent}`
        );

        if (
            sameAsPermanent === 'YES'
        ) {
            await this.selectSameAsPermanent();
        } else {
            await this.fillManualAddress(
                data
            );
        }

        console.log(
            'Current Address completed successfully.'
        );
    }
}

module.exports = CurrentAddressSection;