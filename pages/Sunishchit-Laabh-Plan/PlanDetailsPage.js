const { expect } = require('@playwright/test');

class PlanDetailsPage {

    constructor(page) {

        this.page = page;

        // ======================================================
        // PLAN DETAILS
        // ======================================================

        this.investmentAmount = page.locator(
            '#txtInvestment_dsktp'
        );

        // Payment Type
        this.paymentTypeHeader = page.locator(
            '#navHdr4_dsktp'
        );

        this.paymentTypeOptions = page.locator(
            '#navPaymentType_dsktp nav'
        );

        // Life Cover
        this.lifeCover = page.locator(
            '#SelLifeCoverOption_213'
        );

        // Maturity Benefit
        this.maturityBenefit = page.locator(
            '#SelMaturityBenefit_213'
        );

        // Maturity Payout Mode
        this.maturityPayoutMode = page.locator(
            '#SelMatPayoutMode_213'
        );

        // Maturity Payout Period
        this.maturityPayoutPeriod = page.locator(
            '#SelMatPayoutPeriod_213'
        );

        // Death Benefit
        this.deathBenefit = page.locator(
            '#SelDeathBenefit_213'
        );

        // Death Payout Mode
        this.deathPayoutMode = page.locator(
            '#SelPayoutMode_213'
        );

        // SA Multiplier
        this.saMultiplier = page.locator(
            '#SelSAMultiplier_213'
        );

        // Policy Term
        this.policyTerm = page.locator(
            '#SelPolicyTerm_213'
        );

        // Premium Paying Term
        this.premiumPayingTerm = page.locator(
            '#SelPayfor_213'
        );


        // ======================================================
        // RIDERS
        // ======================================================

        this.familyIncomeBenefitRider = page.locator(
            '#ChkBxAddons_1_213'
        );

        this.extraInsuranceCoverRider = page.locator(
            '#ChkBxAddons_2_213'
        );

        this.criticalIllnessWomanRider = page.locator(
            '#ChkBxAddons_3_213'
        );

        this.criticalIllnessPlusRider = page.locator(
            '#ChkBxAddons_4_213'
        );

        this.stepUpRider = page.locator(
            '#ChkBxAddons_5_213'
        );


        // ======================================================
        // SUITABILITY ANALYSIS
        // DO NOT CHANGE
        // ======================================================

        this.suitabilityAnalysisButton = page.getByRole(
            'button',
            {
                name: /Suitability Analysis/i
            }
        );


        // ======================================================
        // BUY NOW
        // DO NOT CHANGE
        // ======================================================

        this.buyNowButton = page.getByRole(
            'button',
            {
                name: 'Buy Now',
                exact: true
            }
        ).first();

    }


    // ==========================================================
    // WAIT FOR PLAN DETAILS PAGE
    // ==========================================================

    async waitForPage() {

        console.log(
            'Waiting for Sunishchit Laabh Plan Details page...'
        );

        await expect(
            this.investmentAmount
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Sunishchit Laabh Plan Details page loaded.'
        );
    }


    // ==========================================================
    // WAIT FOR LOADER
    // ==========================================================

    async waitForLoaderToDisappear() {

        const loader = this.page.locator(
            '#loading'
        );

        try {

            await loader.waitFor({
                state: 'hidden',
                timeout: 30000
            });

        } catch (error) {

            console.log(
                'Loader was not displayed or already disappeared.'
            );

        }

    }


    // ==========================================================
    // GET AVAILABLE OPTIONS
    // ==========================================================

    async getAvailableOptions(locator) {

        return await locator.locator(
            'option'
        ).allTextContents();

    }


    // ==========================================================
    // SELECT DROPDOWN OPTION
    // ==========================================================

    async selectDropdownOption(
        locator,
        value,
        fieldName
    ) {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ''
        ) {

            console.log(
                `${fieldName}: No value provided. Skipping.`
            );

            return;
        }

        const expectedValue = String(
            value
        ).trim();

        await locator.waitFor({
            state: 'visible',
            timeout: 60000
        });

        await expect(
            locator
        ).toBeEnabled({
            timeout: 60000
        });

        const options =
            await this.getAvailableOptions(
                locator
            );

        console.log(
            `${fieldName} available options:`,
            options
        );

        await expect
            .poll(
                async () => {

                    const currentOptions =
                        await this.getAvailableOptions(
                            locator
                        );

                    return currentOptions.some(
                        option =>
                            option.trim() === expectedValue
                    );

                },
                {
                    timeout: 60000
                }
            )
            .toBeTruthy();

        await locator.selectOption({
            label: expectedValue
        });

        console.log(
            `${fieldName} selected: ${expectedValue}`
        );

        await this.page.waitForTimeout(
            1000
        );

        await this.waitForLoaderToDisappear();

    }


    // ==========================================================
    // ENTER INVESTMENT AMOUNT
    // ==========================================================

    async enterInvestmentAmount(
        amount
    ) {

        if (
            amount === undefined ||
            amount === null ||
            String(amount).trim() === ''
        ) {

            console.log(
                'Investment Amount is empty. Skipping.'
            );

            return;
        }

        const investmentAmount =
            String(amount).trim();

        console.log(
            `Entering Investment Amount: ${investmentAmount}`
        );

        await this.investmentAmount.waitFor({
            state: 'visible',
            timeout: 60000
        });

        await this.investmentAmount.click();

        await this.investmentAmount.fill(
            ''
        );

        await this.investmentAmount.fill(
            investmentAmount
        );

        // Trigger focusout / calculation
        await this.investmentAmount.press(
            'Tab'
        );

        await this.page.waitForTimeout(
            1000
        );

        await this.waitForLoaderToDisappear();

        console.log(
            'Investment Amount entered successfully.'
        );

    }


    // ==========================================================
    // SELECT PAYMENT TYPE
    // ==========================================================

    async selectPaymentType(
        paymentType
    ) {

        if (
            paymentType === undefined ||
            paymentType === null ||
            String(paymentType).trim() === ''
        ) {

            console.log(
                'Payment Type is empty. Skipping.'
            );

            return;
        }

        const expectedPaymentType =
            String(paymentType).trim();

        console.log(
            `Selecting Payment Type: ${expectedPaymentType}`
        );

        await this.paymentTypeHeader.waitFor({
            state: 'visible',
            timeout: 60000
        });

        await this.paymentTypeHeader.click();

        const options =
            await this.paymentTypeOptions.allTextContents();

        console.log(
            'Payment Type available options:',
            options
        );

        const paymentOption =
            this.paymentTypeOptions.filter({
                hasText: new RegExp(
                    `^${expectedPaymentType}$`,
                    'i'
                )
            });

        await expect(
            paymentOption
        ).toBeVisible({
            timeout: 60000
        });

        await paymentOption.click();

        console.log(
            `Payment Type selected: ${expectedPaymentType}`
        );

        await this.page.waitForTimeout(
            1000
        );

        await this.waitForLoaderToDisappear();

    }


    // ==========================================================
    // HANDLE RIDER
    // ==========================================================

    async handleRider(
        locator,
        value,
        riderName
    ) {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ''
        ) {

            console.log(
                `${riderName}: No value provided. Skipping.`
            );

            return;
        }

        const requiredValue =
            String(value)
                .trim()
                .toLowerCase();

        const shouldSelect =
            requiredValue === 'yes' ||
            requiredValue === 'true';

        await locator.waitFor({
            state: 'attached',
            timeout: 60000
        });

        const isChecked =
            await locator.isChecked();

        if (
            shouldSelect &&
            !isChecked
        ) {

            await locator.check();

            console.log(
                `${riderName}: Selected`
            );

            await this.page.waitForTimeout(
                1000
            );

            await this.waitForLoaderToDisappear();

        }

        else if (
            !shouldSelect &&
            isChecked
        ) {

            await locator.uncheck();

            console.log(
                `${riderName}: Deselected`
            );

            await this.page.waitForTimeout(
                1000
            );

            await this.waitForLoaderToDisappear();

        }

        else {

            console.log(
                `${riderName}: Already in required state`
            );

        }

    }


    // ==========================================================
    // FILL PLAN DETAILS
    // ==========================================================

    async fillPlanDetails(
        planData
    ) {

        console.log(
            '========================================'
        );

        console.log(
            'Starting Sunishchit Laabh Plan Details'
        );

        console.log(
            'Plan Details data:',
            planData
        );

        console.log(
            '========================================'
        );


        // ------------------------------------------------------
        // WAIT FOR PAGE
        // ------------------------------------------------------

        await this.waitForPage();


        // ------------------------------------------------------
        // INVESTMENT AMOUNT
        // ------------------------------------------------------

        await this.enterInvestmentAmount(
            planData.InvestmentAmount
        );


        // ------------------------------------------------------
        // PAYMENT TYPE
        // ------------------------------------------------------

        await this.selectPaymentType(
            planData.PaymentType
        );


        // ------------------------------------------------------
        // LIFE COVER
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.lifeCover,
            planData.LifeCover,
            'Life Cover'
        );


        // ------------------------------------------------------
        // MATURITY BENEFIT
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.maturityBenefit,
            planData.MaturityBenefit,
            'Maturity Benefit'
        );


        // ------------------------------------------------------
        // MATURITY PAYOUT MODE
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.maturityPayoutMode,
            planData.MaturityPayoutMode,
            'Maturity Payout Mode'
        );


        // ------------------------------------------------------
        // MATURITY PAYOUT PERIOD
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.maturityPayoutPeriod,
            planData.MaturityPayoutPeriod,
            'Maturity Payout Period'
        );


        // ------------------------------------------------------
        // DEATH BENEFIT
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.deathBenefit,
            planData.DeathBenefit,
            'Death Benefit'
        );


        // ------------------------------------------------------
        // DEATH PAYOUT MODE
        //
        // Only applicable for:
        // Life Plus Option
        // ------------------------------------------------------

        const deathBenefit =
            String(
                planData.DeathBenefit || ''
            ).trim();

        console.log(
            `Death Benefit: ${deathBenefit}`
        );

        if (
            deathBenefit ===
            'Life Plus Option (with in-built Waiver of Premium)-Installments'
        ) {

            console.log(
                'Death Payout Mode is applicable.'
            );

            await this.selectDropdownOption(
                this.deathPayoutMode,
                planData.DeathPayoutMode,
                'Death Payout Mode'
            );

        }

        else {

            console.log(
                'Death Payout Mode is not applicable. Skipping.'
            );

        }


        // ------------------------------------------------------
        // SA MULTIPLIER
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.saMultiplier,
            planData.SAMultiplier,
            'SA Multiplier'
        );


        // ------------------------------------------------------
        // POLICY TERM
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.policyTerm,
            planData.PolicyTerm,
            'Policy Term'
        );


        // ------------------------------------------------------
        // PREMIUM PAYING TERM
        // ------------------------------------------------------

        await this.selectDropdownOption(
            this.premiumPayingTerm,
            planData.PremiumPayingTerm,
            'Premium Paying Term'
        );


        // ------------------------------------------------------
        // RIDERS
        // ------------------------------------------------------

        console.log(
            '===== Handling Riders ====='
        );

        await this.handleRider(
            this.familyIncomeBenefitRider,
            planData.FamilyIncomeBenefitRider,
            'Shriram Family Income Benefit Rider V04'
        );

        await this.handleRider(
            this.extraInsuranceCoverRider,
            planData.ExtraInsuranceCoverRider,
            'Shriram Extra Insurance Cover Rider V03'
        );

        await this.handleRider(
            this.criticalIllnessWomanRider,
            planData.CriticalIllnessWomanRider,
            'Shriram Life Critical Illness Woman Rider'
        );

        await this.handleRider(
            this.criticalIllnessPlusRider,
            planData.CriticalIllnessPlusRider,
            'Shriram Life Critical Illness Plus Rider V02'
        );

        await this.handleRider(
            this.stepUpRider,
            planData.StepUpRider,
            'Shriram Life Step Up Rider'
        );

        console.log(
            '===== Riders completed ====='
        );


        console.log(
            '========================================'
        );

        console.log(
            'Sunishchit Laabh Plan Details completed successfully.'
        );

        console.log(
            '========================================'
        );

    }


    // ==========================================================
    // SUITABILITY ANALYSIS
    // KEEP THIS FUNCTION
    // ==========================================================

    async clickSuitabilityAnalysis() {

        console.log(
            'Waiting for Suitability Analysis button...'
        );

        await this.waitForLoaderToDisappear();

        await expect(
            this.suitabilityAnalysisButton
        ).toBeVisible({
            timeout: 60000
        });

        console.log(
            'Clicking Suitability Analysis...'
        );

        await this.suitabilityAnalysisButton.click();

        console.log(
            'Suitability Analysis clicked successfully.'
        );

    }


    // ==========================================================
    // BUY NOW
    // KEEP THIS FUNCTION
    // ==========================================================

    async clickBuyNow() {

        console.log(
            'Waiting for Buy Now button...'
        );

        // Wait for loader before clicking
        await this.waitForLoaderToDisappear();

        await expect(
            this.buyNowButton
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.buyNowButton
        ).toBeEnabled({
            timeout: 60000
        });

        await this.buyNowButton.scrollIntoViewIfNeeded();

        // Check loader again because premium calculation
        // may start after scrolling or previous actions
        await this.waitForLoaderToDisappear();

        console.log(
            'Clicking Buy Now...'
        );

        await this.buyNowButton.click({
            timeout: 60000
        });

        console.log(
            'Buy Now clicked successfully.'
        );

    }

}

module.exports = PlanDetailsPage;