const {
    expect
} = require('@playwright/test');


class MedicalQuestionnairePage {

    constructor(page) {
        this.page =
            page;


        /*
         * Page Heading.
         */
        this.questionnaireHeading =
            page.getByText(
                'Questionnaire',
                {
                    exact: true
                }
            );


        /*
         * Are you of Good Health?
         */
        this.goodHealth =
            page.locator(
                '#chkbxGoodHealth'
            );


        /*
         * Hospitalized.
         */
        this.hospitalized =
            page.locator(
                '#chkbxHospitalized'
            );

        this.hospitalizedDescription =
            page.locator(
                '#txtarHospitalized'
            );


        /*
         * Deformity.
         */
        this.deformity =
            page.locator(
                '#chkbxDeformity'
            );

        this.deformityDescription =
            page.locator(
                '#txtarDeformity'
            );


        /*
         * Tobacco / Smoke.
         */
        this.tobaccoSmoke =
            page.locator(
                '#chkbxSmoke'
            );

        this.tobaccoType =
            page.locator(
                '#typeSmoke'
            );

        this.tobaccoQuantity =
            page.locator(
                '#QtySmoke'
            );


        /*
         * Alcohol.
         */
        this.alcohol =
            page.locator(
                '#chkbxAlcohol'
            );

        this.alcoholType =
            page.locator(
                '#typeAlcohol'
            );

        this.alcoholQuantity =
            page.locator(
                '#QtyAlcohol'
            );


        /*
         * Heart Dysfunction.
         */
        this.heartDysfunction =
            page.locator(
                '#chkbxHeartDysfunc'
            );

        this.heartDysfunctionDescription =
            page.locator(
                '#txtarHeartDysfunc'
            );


        /*
         * Respiratory Disorder.
         */
        this.respiratoryDisorder =
            page.locator(
                '#chkbxRespiratoryDis'
            );

        this.respiratoryDisorderDescription =
            page.locator(
                '#txtarRespiratoryDis'
            );


        /*
         * Ear / Nose / Throat Disorder.
         */
        this.earNoseThroatDisorder =
            page.locator(
                '#chkbxDisorderEar'
            );

        this.earNoseThroatDescription =
            page.locator(
                '#txtarDisorderEar'
            );


        /*
         * Blood Disorders.
         */
        this.bloodDisorders =
            page.locator(
                '#chkbxBloodDis'
            );

        this.bloodDisordersDescription =
            page.locator(
                '#txtarBloodDis'
            );


        /*
         * Any Other Ailment.
         */
        this.otherAilment =
            page.locator(
                '#chkbxAnyAliment'
            );

        this.otherAilmentDescription =
            page.locator(
                '#txtarAnyAliment'
            );


        /*
         * Blood Abnormality.
         */
        this.bloodAbnormality =
            page.locator(
                '#chkbxBloodAbnormal'
            );

        this.bloodAbnormalityDescription =
            page.locator(
                '#txtarBloodAbnormal'
            );


        /*
         * HIV.
         */
        this.hiv =
            page.locator(
                '#chkbxHiv'
            );

        this.hivDescription =
            page.locator(
                '#txtarHiv'
            );


        /*
         * Cancer.
         */
        this.cancer =
            page.locator(
                '#chkbxCancer'
            );

        this.cancerDescription =
            page.locator(
                '#txtarCancer'
            );

        /*
        * =====================================================
        * ADDITIONAL INFORMATION
        * =====================================================
        */

        /*
        * Previous insurance application rejected /
        * postponed / rated / cancelled etc.
        */
        this.additionalRejected =
            page.locator(
                '#chkbxaddnRejected'
            );

        this.additionalRejectedDescription =
            page.locator(
                '#txtarAddnRejected'
            );


        /*
        * Major Health condition in self /
        * immediate family members.
        */
        this.additionalMajorHealth =
            page.locator(
                '#chkbxAddnMajorHealth'
            );

        this.additionalMajorHealthDescription =
            page.locator(
                '#txtarAddnMajorHealth'
            );


        /*
        * Hazardous occupation / hobbies /
        * legal violation.
        */
        this.additionalHazardOccupation =
            page.locator(
                '#chkbxAddnHazardOccu'
            );

        this.additionalHazardOccupationDescription =
            page.locator(
                '#txtarAddnHazardOccu'
            );


        /*
         * Continue Button.
         */
        this.continueButton =
            page.locator(
                '#btnContinue'
            );
    }


    /*
     * Wait for Medical Questionnaire Page.
     */
    async waitForPage() {
        console.log(
            'Waiting for Medical Questionnaire page...'
        );

        await expect(
            this.questionnaireHeading
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.goodHealth
        ).toBeAttached({
            timeout: 60000
        });

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.continueButton
        ).toBeEnabled({
            timeout: 120000
        });

        console.log(
            'Medical Questionnaire page loaded.'
        );
    }


    /*
     * Convert Excel YES / NO into checkbox state.
     */
    async setYesNo(
    locator,
    value,
    fieldName
) {
    const answer =
        String(
            value ?? ''
        )
            .trim()
            .toUpperCase();

    if (
        answer !== 'YES' &&
        answer !== 'NO'
    ) {
        throw new Error(
            `${fieldName} must contain YES or NO in Excel. ` +
            `Received: "${value}".`
        );
    }

    await expect(
        locator
    ).toBeAttached({
        timeout: 30000
    });

    const shouldBeChecked =
        answer === 'YES';

    const currentlyChecked =
        await locator.isChecked();

    console.log(
        `${fieldName} current value: ` +
        `${currentlyChecked ? 'YES' : 'NO'}`
    );


    /*
     * The actual checkbox input is hidden.
     *
     * HTML structure:
     *
     * <label class="switch">
     *     <input type="checkbox" ...>
     *     <div class="slider1 round"></div>
     * </label>
     *
     * Therefore click the visible slider
     * instead of locator.check().
     */
    if (
        currentlyChecked !== shouldBeChecked
    ) {
        const switchSlider =
            locator
                .locator('xpath=..')
                .locator('.slider1');

        await expect(
            switchSlider
        ).toBeVisible({
            timeout: 30000
        });

        console.log(
            `Changing ${fieldName} to ${answer}...`
        );

        await switchSlider.click();

        /*
         * Wait for application onchange/event
         * processing.
         */
        await this.page.waitForTimeout(
            300
        );
    }


    /*
     * Verify final checkbox state.
     */
    if (
        shouldBeChecked
    ) {
        await expect(
            locator
        ).toBeChecked({
            timeout: 10000
        });
    } else {
        await expect(
            locator
        ).not.toBeChecked({
            timeout: 10000
        });
    }


    console.log(
        `${fieldName} selected: ${answer}`
    );

    return shouldBeChecked;
}
    /*
     * Fill a dependent Description field.
     */
    async fillDescription(
        locator,
        value,
        fieldName
    ) {
        const description =
            String(
                value ?? ''
            ).trim();

        if (!description) {
            throw new Error(
                `${fieldName} is required because ` +
                'the corresponding answer is YES.'
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

        await locator.fill(
            description
        );

        await expect(
            locator
        ).toHaveValue(
            description
        );

        console.log(
            `${fieldName} entered: "${description}"`
        );
    }


    /*
     * Fill Tobacco Type / Quantity.
     */
    async fillTobaccoDetails(
        medicalData
    ) {
        const tobaccoType =
            String(
                medicalData.TobaccoType ?? ''
            ).trim();

        const tobaccoQuantity =
            String(
                medicalData.TobaccoQuantity ?? ''
            ).trim();

        if (!tobaccoType) {
            throw new Error(
                'TobaccoType is required because ' +
                'TobaccoSmoke is YES.'
            );
        }

        if (!tobaccoQuantity) {
            throw new Error(
                'TobaccoQuantity is required because ' +
                'TobaccoSmoke is YES.'
            );
        }

        await expect(
            this.tobaccoType
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.tobaccoQuantity
        ).toBeVisible({
            timeout: 30000
        });

        await this.tobaccoType.fill(
            tobaccoType
        );

        await this.tobaccoQuantity.fill(
            tobaccoQuantity
        );

        console.log(
            `Tobacco Type entered: ${tobaccoType}`
        );

        console.log(
            `Tobacco Quantity entered: ${tobaccoQuantity}`
        );
    }


    /*
     * Fill Alcohol Type / Quantity.
     */
    async fillAlcoholDetails(
        medicalData
    ) {
        const alcoholType =
            String(
                medicalData.AlcoholType ?? ''
            ).trim();

        const alcoholQuantity =
            String(
                medicalData.AlcoholQuantity ?? ''
            ).trim();

        if (!alcoholType) {
            throw new Error(
                'AlcoholType is required because ' +
                'Alcohol is YES.'
            );
        }

        if (!alcoholQuantity) {
            throw new Error(
                'AlcoholQuantity is required because ' +
                'Alcohol is YES.'
            );
        }

        await expect(
            this.alcoholType
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.alcoholQuantity
        ).toBeVisible({
            timeout: 30000
        });

        await this.alcoholType.fill(
            alcoholType
        );

        await this.alcoholQuantity.fill(
            alcoholQuantity
        );

        console.log(
            `Alcohol Type entered: ${alcoholType}`
        );

        console.log(
            `Alcohol Quantity entered: ${alcoholQuantity}`
        );
    }


    /*
     * Fill all Medical Questionnaire answers.
     */
    async fillMedicalQuestionnaire(
        medicalData
    ) {
        if (!medicalData) {
            throw new Error(
                'MedicalQuestionnaire Excel data is missing.'
            );
        }


        console.log(
            '===== Filling Medical Questionnaire ====='
        );

        console.log(
            'Medical Questionnaire Excel data:',
            medicalData
        );


        /*
         * 1. Good Health.
         */
        await this.setYesNo(
            this.goodHealth,
            medicalData.GoodHealth,
            'Good Health'
        );


        /*
         * 2. Hospitalized.
         */
        const hospitalizedYes =
            await this.setYesNo(
                this.hospitalized,
                medicalData.Hospitalized,
                'Hospitalized'
            );

        if (
            hospitalizedYes
        ) {
            await this.fillDescription(
                this.hospitalizedDescription,
                medicalData.HospitalizedDescription,
                'Hospitalized Description'
            );
        }


        /*
         * 3. Deformity.
         */
        const deformityYes =
            await this.setYesNo(
                this.deformity,
                medicalData.Deformity,
                'Deformity'
            );

        if (
            deformityYes
        ) {
            await this.fillDescription(
                this.deformityDescription,
                medicalData.DeformityDescription,
                'Deformity Description'
            );
        }


        /*
         * 4. Tobacco / Smoke.
         */
        const tobaccoYes =
            await this.setYesNo(
                this.tobaccoSmoke,
                medicalData.TobaccoSmoke,
                'Tobacco / Smoke'
            );

        if (
            tobaccoYes
        ) {
            await this.fillTobaccoDetails(
                medicalData
            );
        }


        /*
         * 5. Alcohol.
         */
        const alcoholYes =
            await this.setYesNo(
                this.alcohol,
                medicalData.Alcohol,
                'Alcohol'
            );

        if (
            alcoholYes
        ) {
            await this.fillAlcoholDetails(
                medicalData
            );
        }


        /*
         * 6. Heart Dysfunction.
         */
        const heartYes =
            await this.setYesNo(
                this.heartDysfunction,
                medicalData.HeartDysfunction,
                'Heart Dysfunction'
            );

        if (
            heartYes
        ) {
            await this.fillDescription(
                this.heartDysfunctionDescription,
                medicalData
                    .HeartDysfunctionDescription,
                'Heart Dysfunction Description'
            );
        }


        /*
         * 7. Respiratory Disorder.
         */
        const respiratoryYes =
            await this.setYesNo(
                this.respiratoryDisorder,
                medicalData.RespiratoryDisorder,
                'Respiratory Disorder'
            );

        if (
            respiratoryYes
        ) {
            await this.fillDescription(
                this.respiratoryDisorderDescription,
                medicalData
                    .RespiratoryDisorderDescription,
                'Respiratory Disorder Description'
            );
        }


        /*
         * 8. Ear / Nose / Throat Disorder.
         */
        const entYes =
            await this.setYesNo(
                this.earNoseThroatDisorder,
                medicalData.EarNoseThroatDisorder,
                'Ear / Nose / Throat Disorder'
            );

        if (
            entYes
        ) {
            await this.fillDescription(
                this.earNoseThroatDescription,
                medicalData
                    .EarNoseThroatDescription,
                'Ear / Nose / Throat Description'
            );
        }


        /*
         * 9. Blood Disorders.
         */
        const bloodDisordersYes =
            await this.setYesNo(
                this.bloodDisorders,
                medicalData.BloodDisorders,
                'Blood Disorders'
            );

        if (
            bloodDisordersYes
        ) {
            await this.fillDescription(
                this.bloodDisordersDescription,
                medicalData
                    .BloodDisordersDescription,
                'Blood Disorders Description'
            );
        }


        /*
         * 10. Any Other Ailment.
         */
        const otherAilmentYes =
            await this.setYesNo(
                this.otherAilment,
                medicalData.OtherAilment,
                'Other Ailment'
            );

        if (
            otherAilmentYes
        ) {
            await this.fillDescription(
                this.otherAilmentDescription,
                medicalData
                    .OtherAilmentDescription,
                'Other Ailment Description'
            );
        }


        /*
         * 11. Blood Abnormality.
         */
        const bloodAbnormalityYes =
            await this.setYesNo(
                this.bloodAbnormality,
                medicalData.BloodAbnormality,
                'Blood Abnormality'
            );

        if (
            bloodAbnormalityYes
        ) {
            await this.fillDescription(
                this.bloodAbnormalityDescription,
                medicalData
                    .BloodAbnormalityDescription,
                'Blood Abnormality Description'
            );
        }


        /*
         * 12. HIV.
         */
        const hivYes =
            await this.setYesNo(
                this.hiv,
                medicalData.HIV,
                'HIV'
            );

        if (
            hivYes
        ) {
            await this.fillDescription(
                this.hivDescription,
                medicalData.HIVDescription,
                'HIV Description'
            );
        }


        /*
         * 13. Cancer.
         */
        const cancerYes =
            await this.setYesNo(
                this.cancer,
                medicalData.Cancer,
                'Cancer'
            );

        if (
            cancerYes
        ) {
            await this.fillDescription(
                this.cancerDescription,
                medicalData.CancerDescription,
                'Cancer Description'
            );
        }

            /*
            * =====================================================
            * ADDITIONAL INFORMATION
            * =====================================================
            *
            * This section is not displayed for every plan / flow.
            *
            * If the first Additional Information question is hidden,
            * skip the complete Additional Information section and
            * continue with the Medical Questionnaire.
            */

            const additionalInformationVisible =
                await this.additionalRejected
                    .locator('xpath=..')
                    .locator('.slider1')
                    .isVisible()
                    .catch(
                        () => false
                    );


            if (
                !additionalInformationVisible
            ) {
                console.log(
                    'Additional Information section is not displayed.'
                );

                console.log(
                    'Skipping Additional Information questions.'
                );

            } else {

                console.log(
                    'Additional Information section displayed.'
                );


                /*
                * 14. Previous Insurance Application
                * Rejected / Postponed / Rated / Cancelled.
                */
                const additionalRejectedYes =
                    await this.setYesNo(
                        this.additionalRejected,
                        medicalData.AdditionalRejected,
                        'Previous Insurance Application Rejected / Postponed'
                    );

                if (
                    additionalRejectedYes
                ) {
                    await this.fillDescription(
                        this.additionalRejectedDescription,
                        medicalData.AdditionalRejectedDescription,
                        'Previous Insurance Application Description'
                    );
                }


                /*
                * 15. Major Health condition in
                * self / immediate family.
                */
                const additionalMajorHealthYes =
                    await this.setYesNo(
                        this.additionalMajorHealth,
                        medicalData.AdditionalMajorHealth,
                        'Major Health Condition'
                    );

                if (
                    additionalMajorHealthYes
                ) {
                    await this.fillDescription(
                        this.additionalMajorHealthDescription,
                        medicalData.AdditionalMajorHealthDescription,
                        'Major Health Condition Description'
                    );
                }


                /*
                * 16. Hazardous Occupation / Hobby /
                * Legal Violation.
                */
                const additionalHazardYes =
                    await this.setYesNo(
                        this.additionalHazardOccupation,
                        medicalData.AdditionalHazardOccupation,
                        'Hazardous Occupation / Hobby / Legal Violation'
                    );

                if (
                    additionalHazardYes
                ) {
                    await this.fillDescription(
                        this.additionalHazardOccupationDescription,
                        medicalData.AdditionalHazardOccupationDescription,
                        'Hazardous Occupation Description'
                    );
                }
            }


            console.log(
                'Medical Questionnaire completed successfully.'
            );
    }


    /*
     * Click Continue.
     */
    async clickContinue() {
        console.log(
            'Waiting for Medical Questionnaire Continue button...'
        );

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.continueButton
        ).toBeEnabled({
            timeout: 30000
        });

        await this.continueButton
            .scrollIntoViewIfNeeded();

        console.log(
            'Clicking Medical Questionnaire Continue...'
        );

        await this.continueButton.click();

        console.log(
            'Medical Questionnaire Continue clicked.'
        );
    }


    /*
     * Complete Medical Questionnaire.
     */
    async completeMedicalQuestionnaire(
        medicalData
    ) {
        await this.waitForPage();

        await this.fillMedicalQuestionnaire(
            medicalData
        );

        await this.clickContinue();

        console.log(
            'Medical Questionnaire flow completed successfully.'
        );
    }
}


module.exports =
    MedicalQuestionnairePage;