const {
    expect
} = require('@playwright/test');

class NomineeAddressSection {
    constructor(page) {
        this.page = page;

        /*
         * Address selection controls.
         * Update these only if your actual IDs differ.
         */
        this.currentAddressRadio =
            page.getByRole(
                'radio',
                {
                    name: 'Current Address',
                    exact: true
                }
            );

        this.permanentAddressRadio =
            page.getByRole(
                'radio',
                {
                    name: 'Permanent Address',
                    exact: true
                }
            );

        this.sameAsAccountHolder =
            page.getByRole(
                'checkbox',
                {
                    name: 'Same as Account Holder',
                    exact: true
                }
            );

        /*
         * Same locators are used for Current Address
         * and Permanent Address.
         */
        this.address1 =
            page.locator(
                '#txtbxkycaddrline1_31'
            );

        this.address2 =
            page.locator(
                '#txtbxkycaddrline2_31'
            );

        this.pincode =
            page.locator(
                '#txtbxkycpincode_31'
            );

        this.area =
            page.locator(
                '#ddlkycarea_31'
            );

        this.city =
            page.locator(
                '#txtbxkyccity_31'
            );

        this.state =
            page.locator(
                '#txtbxkycstate_31'
            );

        this.mobileNumber =
            page.locator(
                '#txtbxkycnomineemobile1'
            );

        this.gramPanchayat =
             page.locator(
                '#ddlkycgrampanchname_2'
    );
    }

    async waitForSection() {
        console.log(
            'Waiting for Nominee Address section...'
        );

        await expect(
            this.mobileNumber
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Nominee Address section loaded.'
        );
    }

    async fillText(
        locator,
        value,
        fieldName
    ) {
        const text =
            String(value ?? '').trim();

        if (!text) {
            throw new Error(
                `${fieldName} is empty in NomineeAddress Excel sheet.`
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

        await locator.fill(text);

        await expect(
            locator
        ).toHaveValue(text);

        console.log(
            `${fieldName} entered: ${text}`
        );
    }

    async triggerPincodeLookup(
        pincodeValue
    ) {
        const pincode =
            String(pincodeValue ?? '').trim();

        if (!pincode) {
            throw new Error(
                'Nominee Address Pincode is empty.'
            );
        }

        await expect(
            this.pincode
        ).toBeEditable({
            timeout: 30000
        });

        await this.pincode.fill(
            pincode
        );

        console.log(
            `Nominee Address Pincode entered: ${pincode}`
        );

        /*
         * Trigger the field onfocusout event.
         */
        await this.pincode.press(
            'Tab'
        );

        await expect
            .poll(
                async () => {
                    return await this.area
                        .locator('option')
                        .count();
                },
                {
                    timeout: 60000,
                    message:
                        'Waiting for Nominee Area options'
                }
            )
            .toBeGreaterThan(0);

        console.log(
            'Nominee Address Area options loaded.'
        );
    }

    async selectArea(
        areaValue
    ) {
        const areaText =
            String(areaValue ?? '').trim();

        if (!areaText) {
            throw new Error(
                'Nominee Address Area is empty.'
            );
        }

        await expect(
            this.area
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.area
        ).toBeEnabled({
            timeout: 30000
        });

        const options =
            await this.area
                .locator('option')
                .allTextContents();

        console.log(
            'Nominee Address Area options:',
            options.map(
                option => option.trim()
            )
        );

        await this.area.selectOption({
            label: areaText
        });

        console.log(
            `Nominee Address Area selected: ${areaText}`
        );
    }

    async verifyAutoPopulatedAddress() {
        await expect(
            this.address1
        ).not.toHaveValue('', {
            timeout: 30000
        });

        await expect(
            this.address2
        ).not.toHaveValue('', {
            timeout: 30000
        });

        await expect(
            this.pincode
        ).not.toHaveValue('', {
            timeout: 30000
        });

        await expect(
            this.area
        ).not.toHaveValue('', {
            timeout: 30000
        });

        await expect(
            this.city
        ).not.toHaveValue('', {
            timeout: 30000
        });

        await expect(
            this.state
        ).not.toHaveValue('', {
            timeout: 30000
        });

        console.log(
            'Nominee Address auto-populated successfully.'
        );

        console.log(
            'Address 1:',
            await this.address1.inputValue()
        );

        console.log(
            'Address 2:',
            await this.address2.inputValue()
        );

        console.log(
            'Pincode:',
            await this.pincode.inputValue()
        );

        console.log(
            'Area:',
            await this.area.inputValue()
        );

        console.log(
            'City:',
            await this.city.inputValue()
        );

        console.log(
            'State:',
            await this.state.inputValue()
        );
    }

    async fillManualAddress(
        data
    ) {
        await this.fillText(
            this.address1,
            data.Address1,
            'Nominee Address 1'
        );

        await this.fillText(
            this.address2,
            data.Address2,
            'Nominee Address 2'
        );

        await this.triggerPincodeLookup(
            data.Pincode
        );

        await this.selectArea(
            data.Area
        );

        await expect(
            this.city
        ).not.toHaveValue('', {
            timeout: 30000
        });

        await expect(
            this.state
        ).not.toHaveValue('', {
            timeout: 30000
        });

        console.log(
            'Nominee City:',
            await this.city.inputValue()
        );

        console.log(
            'Nominee State:',
            await this.state.inputValue()
        );
    }

    async fill(
        nomineeAddressData
    ) {
        if (!nomineeAddressData) {
            throw new Error(
                'NomineeAddress Excel data is missing.'
            );
        }

        await this.waitForSection();

        const addressType =
            String(
                nomineeAddressData.AddressType || ''
            )
                .trim()
                .toUpperCase();

        console.log(
            `Nominee Address Type: ${addressType}`
        );

        if (
            addressType ===
            'SAME_AS_ACCOUNT_HOLDER'
        ) {
            if (
                !await this.sameAsAccountHolder
                    .isChecked()
            ) {
                await this.sameAsAccountHolder
                    .check();
            }

            await expect(
                this.sameAsAccountHolder
            ).toBeChecked();

            console.log(
                'Same as Account Holder selected.'
            );

            /*
             * Permanent address should be
             * auto-populated and disabled.
             */
            await this.verifyAutoPopulatedAddress();
        } else if (
            addressType ===
            'CURRENT_ADDRESS'
        ) {
            await this.currentAddressRadio
                .check();

            await expect(
                this.currentAddressRadio
            ).toBeChecked();

            console.log(
                'Current Address selected.'
            );

            await this.fillManualAddress(
                nomineeAddressData
            );
        } else if (
            addressType ===
            'PERMANENT_ADDRESS'
        ) {
            await this.permanentAddressRadio
                .check();

            await expect(
                this.permanentAddressRadio
            ).toBeChecked();

            console.log(
                'Permanent Address selected.'
            );

            await this.fillManualAddress(
                nomineeAddressData
            );
        } else {
            throw new Error(
                `Invalid Nominee AddressType: ` +
                `"${nomineeAddressData.AddressType}". ` +
                'Use CURRENT_ADDRESS, ' +
                'PERMANENT_ADDRESS, or ' +
                'SAME_AS_ACCOUNT_HOLDER.'
            );
        }


  /*
 * Nominee Gram Panchayat.
 *
 * Some addresses auto-populate all fields
 * except Gram Panchayat.
 */
const gramPanchayatVisible =
    await this.gramPanchayat
        .isVisible()
        .catch(() => false);

if (gramPanchayatVisible) {

    console.log(
        'Nominee Gram Panchayat field displayed.'
    );

    await expect(
        this.gramPanchayat
    ).toBeEnabled({
        timeout: 30000
    });


    /*
     * Wait for valid options to load.
     */
    await expect.poll(
        async () => {

            const options =
                await this.gramPanchayat
                    .locator('option')
                    .evaluateAll(options =>
                        options.filter(option =>
                            option.value &&
                            option.value !== '0'
                        ).length
                    );

            return options;

        },
        {
            timeout: 60000,
            intervals: [
                500,
                1000,
                2000
            ],
            message:
                'Nominee Gram Panchayat options were not loaded.'
        }
    ).toBeGreaterThan(0);


    const options =
        await this.gramPanchayat
            .locator('option')
            .evaluateAll(options =>
                options.map(option => ({
                    text: String(
                        option.textContent || ''
                    )
                        .replace(/\s+/g, ' ')
                        .trim(),

                    value: String(
                        option.value || ''
                    ).trim()
                }))
            );


    console.log(
        'Nominee Gram Panchayat available options:',
        options
            .filter(option =>
                option.value &&
                option.value !== '0'
            )
            .map(option =>
                option.text
            )
    );


    /*
     * If Excel contains GramPanchayatName,
     * select that value.
     */
    const expectedGramPanchayat =
        String(
            data.GramPanchayatName || ''
        ).trim();


    if (expectedGramPanchayat) {

        const matchedOption =
            options.find(option =>
                option.text
                    .toLowerCase() ===
                expectedGramPanchayat
                    .toLowerCase()
            );


        if (!matchedOption) {

            throw new Error(
                `Nominee Gram Panchayat ` +
                `"${expectedGramPanchayat}" ` +
                `was not found. Available options: ` +
                `${options
                    .filter(option =>
                        option.value &&
                        option.value !== '0'
                    )
                    .map(option =>
                        option.text
                    )
                    .join(', ')}`
            );
        }


        await this.gramPanchayat
            .selectOption({
                value:
                    matchedOption.value
            });


        console.log(
            `Nominee Gram Panchayat selected: ` +
            `${matchedOption.text}`
        );
    }

    else {

        /*
         * Same-as-account-holder flow:
         * if Excel does not contain a separate
         * Gram Panchayat value, select the first
         * valid populated option.
         */
        const firstValidOption =
            options.find(option =>
                option.value &&
                option.value !== '0'
            );


        if (!firstValidOption) {
            throw new Error(
                'No valid Nominee Gram Panchayat option available.'
            );
        }


        await this.gramPanchayat
            .selectOption({
                value:
                    firstValidOption.value
            });


        console.log(
            `Nominee Gram Panchayat selected: ` +
            `${firstValidOption.text}`
        );
    }


    await expect(
        this.gramPanchayat
    ).not.toHaveValue(
        '0'
    );
}
else {

    console.log(
        'Nominee Gram Panchayat field is not displayed. Skipping.'
    );
}
        /*
         * Mobile number is mandatory in all flows.
         */
        await this.fillText(
            this.mobileNumber,
            nomineeAddressData.MobileNumber,
            'Nominee Mobile Number'
        );

        console.log(
            'Nominee Address completed successfully.'
        );
    }
}

module.exports =
    NomineeAddressSection;