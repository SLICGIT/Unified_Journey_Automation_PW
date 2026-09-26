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
         * =====================================================
         * CURRENT FLEXI-SHIELD MEDICAL QUESTIONNAIRE
         * =====================================================
         */

        /*
         * 1. Tobacco / Smoke
         */
        this.tobaccoSmoke =
            page.locator('#chkbxSmoke');

        this.tobaccoType =
            page.locator('#typeSmoke');

        this.tobaccoQuantity =
            page.locator('#QtySmoke');


        /*
         * 2. Alcohol
         */
        this.alcohol =
            page.locator('#chkbxAlcohol');

        this.alcoholType =
            page.locator('#typeAlcohol');

        this.alcoholQuantity =
            page.locator('#QtyAlcohol');


        /*
         * 3. Bodily Defect / Deformity
         */
        this.deformity =
            page.locator('#chkbxDeformity');

        this.deformityDescription =
            page.locator('#txtarDeformity');


        /*
         * 4. Narcotics / Harmful Drugs
         */
        this.drugs =
            page.locator('#chkbxDrugs');

        this.drugsDescription =
            page.locator('#txtarDrugsDiv');


        /*
         * 5. Medical Leave
         */
        this.medicalLeave =
            page.locator('#chkbxMedLeave');

        this.medicalLeaveDescription =
            page.locator('#txtarMedLeave');


        /*
         * 6. Accident / Injury
         */
        this.accident =
            page.locator('#chkbxAccident');

        this.accidentDescription =
            page.locator('#txtarAccident');


        /*
         * 7. Weight Loss / Gain
         */
        this.weight =
            page.locator('#chkbxWeight');

        this.weightDescription =
            page.locator('#txtarWeight');


        /*
         * 8. Depression / Stress / Mental Health
         */
        this.flexiSuicide =
            page.locator('#chkbxflexiSuicide');

        this.stressDescription =
            page.locator('#txtarStressFlexi');


        /*
         * 9. Heart / Major Ailment
         */
        this.heartAilment =
            page.locator('#chkHeart');

        this.heartAilmentDescription =
            page.locator('#txtarHeart');


        /*
         * 10. Hepatitis / HIV / AIDS / STD
         */
        this.hivAids =
            page.locator('#chkHivAids');

        this.hivAidsDescription =
            page.locator('#txtarHivAids');


        /*
         * 11. Respiratory Disorders
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
         * 12. Diabetes / BP / Stroke / etc.
         */
        this.diabetes =
            page.locator('#chkbxDiabetes');

        this.diabetesDescription =
            page.locator('#txtarDiabetes');


        /*
         * 13. Adventurous Activities
         */
        this.adventurousActivities =
            page.locator('#chkbxAdv');

        this.adventurousActivitiesDescription =
            page.locator('#txtarAdv');


        /*
         * 14. Criminal Case / Conviction
         */
        this.conviction =
            page.locator('#chkbxConviction');

        this.convictionDescription =
            page.locator('#txtarConviction');


        /*
         * 15. Previous Insurance Rejected /
         *     Rated / Postponed
         */
        this.rejection =
            page.locator('#chkbxRejection');

        this.rejectedPolicyName =
            page.locator('#polNameRej');

        this.rejectedCompanyName =
            page.locator('#CompNameRej');

        this.rejectedSumAssured =
            page.locator('#SARejection');


        /*
         * 16. Existing Life Insurance
         */
        this.existingPolicy =
            page.locator('#chkbxExistingPol');

        this.existingPolicyName =
            page.locator('#polNameExt');

        this.existingCompanyName =
            page.locator('#CompNameExt');

        this.existingSumAssured =
            page.locator('#SAExisting');

        this.existingPolicyIssuedDate =
            page.locator(
                '#txtbxPolIssuedDate'
            );

        this.existingPolicyStatus =
            page.locator(
                '#PolStatusExisting'
            );


        /*
         * Continue Button
         */
        this.continueButton =
            page.locator(
                '#btnContinue'
            );
    }
        /*
     * =====================================================
     * WAIT FOR MEDICAL QUESTIONNAIRE PAGE
     * =====================================================
     */
    async waitForPage() {

        console.log(
            'Waiting for Medical Questionnaire page...'
        );


        /*
         * Wait for Questionnaire heading.
         */
        await expect(
            this.questionnaireHeading
        ).toBeVisible({
            timeout: 120000
        });


        /*
         * The old questionnaire used:
         *
         * #chkbxGoodHealth
         *
         * That locator is NOT used anymore.
         *
         * Current Flexi-Shield questionnaire
         * starts with:
         *
         * #chkbxSmoke
         */
        await expect(
            this.tobaccoSmoke
        ).toBeAttached({
            timeout: 120000
        });


        /*
         * Wait for Continue button.
         */
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
     * =====================================================
     * SET YES / NO CHECKBOX
     * =====================================================
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


        /*
         * Validate Excel value.
         */
        if (
            answer !== 'YES' &&
            answer !== 'NO'
        ) {
            throw new Error(
                `${fieldName} must contain YES or NO in Excel. ` +
                `Received: "${value}".`
            );
        }


        /*
         * Make sure checkbox exists.
         */
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
         * The checkbox input is hidden.
         *
         * Current HTML structure:
         *
         * <label class="switch">
         *     <input type="checkbox">
         *     <div class="slider1 round"></div>
         * </label>
         *
         * Therefore click the visible slider.
         */
        if (
            currentlyChecked !==
            shouldBeChecked
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
             * Allow onchange processing.
             */
            await this.page.waitForTimeout(
                300
            );
        }


        /*
         * Verify final state.
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
     * =====================================================
     * FILL DESCRIPTION
     * =====================================================
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
     * =====================================================
     * TOBACCO DETAILS
     * =====================================================
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
     * =====================================================
     * ALCOHOL DETAILS
     * =====================================================
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
     * =====================================================
     * FILL MEDICAL QUESTIONNAIRE
     * =====================================================
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
         * =================================================
         * 1. TOBACCO
         * =================================================
         */
        const tobaccoYes =
            await this.setYesNo(
                this.tobaccoSmoke,
                medicalData.TobaccoSmoke,
                'Tobacco / Smoke'
            );


        if (tobaccoYes) {

            await this.fillTobaccoDetails(
                medicalData
            );
        }


        /*
         * =================================================
         * 2. ALCOHOL
         * =================================================
         */
        const alcoholYes =
            await this.setYesNo(
                this.alcohol,
                medicalData.Alcohol,
                'Alcohol'
            );


        if (alcoholYes) {

            await this.fillAlcoholDetails(
                medicalData
            );
        }


        /*
         * =================================================
         * 3. BODILY DEFECT
         * =================================================
         */
        const deformityYes =
            await this.setYesNo(
                this.deformity,
                medicalData.BodilyDefect,
                'Bodily Defect / Deformity'
            );


        if (deformityYes) {

            await this.fillDescription(
                this.deformityDescription,
                medicalData.BodilyDefectDescription,
                'Bodily Defect Description'
            );
        }


        /*
         * =================================================
         * 4. NARCOTICS / HARMFUL DRUGS
         * =================================================
         */
        const drugsYes =
            await this.setYesNo(
                this.drugs,
                medicalData.NarcoticsDrugs,
                'Narcotics / Harmful Drugs'
            );


        if (drugsYes) {

            await this.fillDescription(
                this.drugsDescription,
                medicalData.NarcoticsDrugsDescription,
                'Narcotics / Drugs Description'
            );
        }
                /*
         * =================================================
         * 5. MEDICAL LEAVE
         * =================================================
         */
        const medicalLeaveYes =
            await this.setYesNo(
                this.medicalLeave,
                medicalData.MedicalLeave,
                'Medical Leave'
            );


        if (medicalLeaveYes) {

            await this.fillDescription(
                this.medicalLeaveDescription,
                medicalData.MedicalLeaveDescription,
                'Medical Leave Description'
            );
        }


        /*
         * =================================================
         * 6. ACCIDENT / INJURY
         * =================================================
         */
        const accidentYes =
            await this.setYesNo(
                this.accident,
                medicalData.AccidentInjury,
                'Accident / Injury'
            );


        if (accidentYes) {

            await this.fillDescription(
                this.accidentDescription,
                medicalData.AccidentInjuryDescription,
                'Accident / Injury Description'
            );
        }


        /*
         * =================================================
         * 7. WEIGHT LOSS / GAIN
         * =================================================
         */
        const weightYes =
            await this.setYesNo(
                this.weight,
                medicalData.WeightChange,
                'Drastic Weight Loss / Gain'
            );


        if (weightYes) {

            await this.fillDescription(
                this.weightDescription,
                medicalData.WeightChangeDescription,
                'Weight Change Description'
            );
        }


        /*
         * =================================================
         * 8. DEPRESSION / STRESS / MENTAL HEALTH
         * =================================================
         */
        const stressYes =
            await this.setYesNo(
                this.flexiSuicide,
                medicalData.DepressionStressMental,
                'Depression / Stress / Mental Health'
            );


        if (stressYes) {

            await this.fillDescription(
                this.stressDescription,
                medicalData.DepressionStressMentalDescription,
                'Depression / Stress / Mental Health Description'
            );
        }


        /*
         * =================================================
         * 9. HEART / MAJOR AILMENT
         * =================================================
         */
        const heartYes =
            await this.setYesNo(
                this.heartAilment,
                medicalData.HeartAilment,
                'Heart / Major Ailment'
            );


        if (heartYes) {

            await this.fillDescription(
                this.heartAilmentDescription,
                medicalData.HeartAilmentDescription,
                'Heart / Major Ailment Description'
            );
        }


        /*
         * =================================================
         * 10. HEPATITIS / HIV / AIDS / STD
         * =================================================
         */
        const hivAidsYes =
            await this.setYesNo(
                this.hivAids,
                medicalData.HepatitisHIVSTD,
                'Hepatitis / HIV / AIDS / STD'
            );


        if (hivAidsYes) {

            await this.fillDescription(
                this.hivAidsDescription,
                medicalData.HepatitisHIVSTDDescription,
                'Hepatitis / HIV / AIDS / STD Description'
            );
        }


        /*
         * =================================================
         * 11. RESPIRATORY DISORDERS
         * =================================================
         */
        const respiratoryYes =
            await this.setYesNo(
                this.respiratoryDisorder,
                medicalData.RespiratoryDisorders,
                'Respiratory Disorders'
            );


        if (respiratoryYes) {

            await this.fillDescription(
                this.respiratoryDisorderDescription,
                medicalData.RespiratoryDisordersDescription,
                'Respiratory Disorders Description'
            );
        }


        /*
         * =================================================
         * 12. DIABETES / BP / STROKE / ETC.
         * =================================================
         */
        const diabetesYes =
            await this.setYesNo(
                this.diabetes,
                medicalData.DiabetesBPStrokeEtc,
                'Diabetes / BP / Stroke / Other Ailments'
            );


        if (diabetesYes) {

            await this.fillDescription(
                this.diabetesDescription,
                medicalData.DiabetesBPStrokeEtcDescription,
                'Diabetes / BP / Stroke Description'
            );
        }
                /*
         * =================================================
         * 13. ADVENTUROUS ACTIVITIES
         * =================================================
         */
        const adventurousYes =
            await this.setYesNo(
                this.adventurousActivities,
                medicalData.AdventurousActivities,
                'Adventurous Activities'
            );


        if (adventurousYes) {

            await this.fillDescription(
                this.adventurousActivitiesDescription,
                medicalData.AdventurousActivitiesDescription,
                'Adventurous Activities Description'
            );
        }


        /*
         * =================================================
         * 14. CRIMINAL CASE / CONVICTION
         * =================================================
         */
        const convictionYes =
            await this.setYesNo(
                this.conviction,
                medicalData.CriminalCase,
                'Criminal Case / Conviction'
            );


        if (convictionYes) {

            await this.fillDescription(
                this.convictionDescription,
                medicalData.CriminalCaseDescription,
                'Criminal Case / Conviction Description'
            );
        }


        /*
         * =================================================
         * 15. PREVIOUS INSURANCE REJECTED /
         *     RATED / POSTPONED
         * =================================================
         */
        const rejectionYes =
            await this.setYesNo(
                this.rejection,
                medicalData.InsuranceRejectedRatedPostponed,
                'Previous Insurance Rejected / Rated / Postponed'
            );


        if (rejectionYes) {

            await this.fillInsuranceRejectionDetails(
                medicalData
            );
        }


        /*
         * =================================================
         * 16. EXISTING LIFE INSURANCE
         * =================================================
         */
        const existingPolicyYes =
            await this.setYesNo(
                this.existingPolicy,
                medicalData.ExistingLifeInsurance,
                'Existing Life Insurance'
            );


        if (existingPolicyYes) {

            await this.fillExistingPolicyDetails(
                medicalData
            );
        }


        console.log(
            'Medical Questionnaire completed successfully.'
        );
    }


    /*
     * =====================================================
     * PREVIOUS INSURANCE DETAILS
     * =====================================================
     */
    async fillInsuranceRejectionDetails(
        medicalData
    ) {

        const policyName =
            String(
                medicalData.RejectedPolicyName ?? ''
            ).trim();


        const companyName =
            String(
                medicalData.RejectedCompanyName ?? ''
            ).trim();


        const sumAssured =
            String(
                medicalData.RejectedSumAssured ?? ''
            ).trim();


        /*
         * Validate Excel data.
         */
        if (!policyName) {

            throw new Error(
                'RejectedPolicyName is required because ' +
                'InsuranceRejectedRatedPostponed is YES.'
            );
        }


        if (!companyName) {

            throw new Error(
                'RejectedCompanyName is required because ' +
                'InsuranceRejectedRatedPostponed is YES.'
            );
        }


        if (!sumAssured) {

            throw new Error(
                'RejectedSumAssured is required because ' +
                'InsuranceRejectedRatedPostponed is YES.'
            );
        }


        /*
         * Wait for fields.
         */
        await expect(
            this.rejectedPolicyName
        ).toBeVisible({
            timeout: 30000
        });


        await expect(
            this.rejectedCompanyName
        ).toBeVisible({
            timeout: 30000
        });


        await expect(
            this.rejectedSumAssured
        ).toBeVisible({
            timeout: 30000
        });


        /*
         * Fill fields.
         */
        await this.rejectedPolicyName.fill(
            policyName
        );


        await this.rejectedCompanyName.fill(
            companyName
        );


        await this.rejectedSumAssured.fill(
            sumAssured
        );


        console.log(
            `Rejected Policy Name entered: ${policyName}`
        );


        console.log(
            `Rejected Company Name entered: ${companyName}`
        );


        console.log(
            `Rejected Sum Assured entered: ${sumAssured}`
        );
    }
        /*
     * =====================================================
     * EXISTING LIFE INSURANCE DETAILS
     * =====================================================
     */
    async fillExistingPolicyDetails(
        medicalData
    ) {

        const policyName =
            String(
                medicalData.ExistingPolicyName ?? ''
            ).trim();


        const companyName =
            String(
                medicalData.ExistingCompanyName ?? ''
            ).trim();


        const sumAssured =
            String(
                medicalData.ExistingSumAssured ?? ''
            ).trim();


        const issuedDate =
            String(
                medicalData.ExistingPolicyIssuedDate ?? ''
            ).trim();


        const policyStatus =
            String(
                medicalData.ExistingPolicyStatus ?? ''
            ).trim();


        /*
         * Validate mandatory data.
         */
        if (!policyName) {

            throw new Error(
                'ExistingPolicyName is required because ' +
                'ExistingLifeInsurance is YES.'
            );
        }


        if (!companyName) {

            throw new Error(
                'ExistingCompanyName is required because ' +
                'ExistingLifeInsurance is YES.'
            );
        }


        if (!sumAssured) {

            throw new Error(
                'ExistingSumAssured is required because ' +
                'ExistingLifeInsurance is YES.'
            );
        }


        if (!issuedDate) {

            throw new Error(
                'ExistingPolicyIssuedDate is required because ' +
                'ExistingLifeInsurance is YES.'
            );
        }


        if (!policyStatus) {

            throw new Error(
                'ExistingPolicyStatus is required because ' +
                'ExistingLifeInsurance is YES.'
            );
        }


        /*
         * Wait for fields.
         */
        await expect(
            this.existingPolicyName
        ).toBeVisible({
            timeout: 30000
        });


        await expect(
            this.existingCompanyName
        ).toBeVisible({
            timeout: 30000
        });


        await expect(
            this.existingSumAssured
        ).toBeVisible({
            timeout: 30000
        });


        await expect(
            this.existingPolicyIssuedDate
        ).toBeVisible({
            timeout: 30000
        });


        await expect(
            this.existingPolicyStatus
        ).toBeVisible({
            timeout: 30000
        });


        /*
         * Fill policy information.
         */
        await this.existingPolicyName.fill(
            policyName
        );


        await this.existingCompanyName.fill(
            companyName
        );


        await this.existingSumAssured.fill(
            sumAssured
        );


        await this.existingPolicyIssuedDate.fill(
            issuedDate
        );


        /*
         * Existing Policy Status can be either:
         *
         * 1. SELECT dropdown
         * 2. Normal input
         *
         * Handle both.
         */
        const tagName =
            await this.existingPolicyStatus.evaluate(
                element =>
                    element.tagName
            );


        if (
            tagName === 'SELECT'
        ) {

            const options =
                await this.existingPolicyStatus
                    .locator('option')
                    .evaluateAll(
                        elements =>
                            elements.map(
                                option => ({
                                    value:
                                        option.value,

                                    text:
                                        option
                                            .textContent
                                            ?.trim() ||
                                        ''
                                })
                            )
                    );


            const matching =
                options.find(
                    option =>
                        option.text
                            .toLowerCase() ===
                        policyStatus
                            .toLowerCase()
                );


            if (!matching) {

                throw new Error(
                    `ExistingPolicyStatus "${policyStatus}" ` +
                    'was not found. Available options: ' +
                    JSON.stringify(options)
                );
            }


            await this.existingPolicyStatus
                .selectOption(
                    matching.value
                );

        } else {

            await this.existingPolicyStatus
                .fill(
                    policyStatus
                );
        }


        console.log(
            `Existing Policy Name entered: ${policyName}`
        );


        console.log(
            `Existing Company Name entered: ${companyName}`
        );


        console.log(
            `Existing Sum Assured entered: ${sumAssured}`
        );


        console.log(
            `Existing Policy Issued Date entered: ${issuedDate}`
        );


        console.log(
            `Existing Policy Status selected: ${policyStatus}`
        );
    }
        /*
     * =====================================================
     * CLICK CONTINUE
     * =====================================================
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
     * =====================================================
     * COMPLETE MEDICAL QUESTIONNAIRE
     * =====================================================
     */
    async completeMedicalQuestionnaire(
        medicalData
    ) {

        /*
         * Step 1:
         * Wait for Questionnaire page.
         */
        await this.waitForPage();


        /*
         * Step 2:
         * Fill all questionnaire fields.
         */
        await this.fillMedicalQuestionnaire(
            medicalData
        );


        /*
         * Step 3:
         * Continue to next page.
         */
        await this.clickContinue();


        console.log(
            'Medical Questionnaire flow completed successfully.'
        );

       
    }
}


module.exports =
    MedicalQuestionnairePage;