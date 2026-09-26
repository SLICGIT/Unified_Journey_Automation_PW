const {
    expect
} = require('@playwright/test');

const fs =
    require('fs');

const path =
    require('path');


class ProposalSummaryPage {
    constructor(page) {
        this.page =
            page;

        /*
         * Proposal Summary Continue button.
         */
        this.continueButton =
            page.locator(
                '#btnContinue'
            );

        /*
         * Generated Proposal Number.
         */
        this.proposalNumber =
            page.locator(
                '#quoteID'
            );

        /*
         * Done button.
         */
        this.doneButton =
            page.locator(
                '#btnDone'
            );
    }


    /*
     * Wait for Proposal Summary page.
     */
    async waitForPage() {
        console.log(
            'Waiting for Proposal Summary page...'
        );

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 120000
        });

        await expect(
            this.continueButton
        ).toBeEnabled({
            timeout: 60000
        });

        console.log(
            'Proposal Summary page loaded.'
        );
    }


    /*
     * Click Continue on Proposal Summary.
     *
     * After this click, the final page
     * containing Proposal Number should appear.
     */
    async clickContinue() {
        console.log(
            'Waiting for Proposal Summary Continue button...'
        );

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.continueButton
        ).toBeEnabled({
            timeout: 60000
        });

        await this.continueButton
            .scrollIntoViewIfNeeded();

        const oldUrl =
            this.page.url();

        console.log(
            `URL before Proposal Summary Continue: ${oldUrl}`
        );

        console.log(
            'Clicking Proposal Summary Continue...'
        );

        await this.continueButton.click();

        console.log(
            'Proposal Summary Continue clicked.'
        );

        /*
         * Wait for the generated Proposal Number.
         */
        await expect(
            this.proposalNumber
        ).toBeVisible({
            timeout: 120000
        });

        console.log(
            `URL after Proposal Summary Continue: ` +
            `${this.page.url()}`
        );

        console.log(
            'Proposal Number page opened successfully.'
        );
    }
        /*
     * Get generated Proposal Number.
     */
    async getProposalNumber() {
        await expect(
            this.proposalNumber
        ).toBeVisible({
            timeout: 120000
        });

        const value =
            String(
                await this.proposalNumber
                    .textContent()
            ).trim();

        if (!value) {
            throw new Error(
                'Generated Proposal Number is empty.'
            );
        }

        console.log(
            `Generated Proposal Number: ${value}`
        );

        return value;
    }


    /*
     * Escape values before saving in CSV.
     */
    escapeCsvValue(
        value
    ) {
        const text =
            String(
                value ?? ''
            );

        if (
            text.includes(',') ||
            text.includes('"') ||
            text.includes('\n')
        ) {
            return (
                '"' +
                text.replace(
                    /"/g,
                    '""'
                ) +
                '"'
            );
        }

        return text;
    }


    /*
     * Save Proposal Number.
     *
     * Output:
     *
     * TestResults
     *   └── ProjectName
     *       └── ProposalNumbers.csv
     */
    async saveProposalNumber(
        tcId
    ) {
        const testCaseId =
            String(
                tcId ?? ''
            ).trim();

        if (!testCaseId) {
            throw new Error(
                'tcId is missing while saving Proposal Number.'
            );
        }

        const generatedProposalNumber =
            await this.getProposalNumber();

        const projectName =
            process.env.PROJECT_NAME ||
            'Assured-Income-Plan';

        const resultsFolder =
            path.join(
                process.cwd(),
                'TestResults',
                projectName
            );

        if (
            !fs.existsSync(
                resultsFolder
            )
        ) {
            fs.mkdirSync(
                resultsFolder,
                {
                    recursive: true
                }
            );
        }

        const resultFile =
            path.join(
                resultsFolder,
                'ProposalNumbers.csv'
            );

        const fileExists =
            fs.existsSync(
                resultFile
            );

        if (!fileExists) {
            fs.writeFileSync(
                resultFile,
                'TC_ID,ProposalNumber,DateTime\n',
                {
                    encoding: 'utf8'
                }
            );
        }

        const dateTime =
            new Date()
                .toISOString();

        const row = [
            this.escapeCsvValue(
                testCaseId
            ),

            this.escapeCsvValue(
                generatedProposalNumber
            ),

            this.escapeCsvValue(
                dateTime
            )
        ].join(',');

        fs.appendFileSync(
            resultFile,
            `${row}\n`,
            {
                encoding: 'utf8'
            }
        );

        console.log(
            'Proposal Number saved successfully.'
        );

        console.log(
            `Saved file: ${resultFile}`
        );

        return {
            tcId:
                testCaseId,

            proposalNumber:
                generatedProposalNumber,

            dateTime,

            resultFile
        };
    }
        /*
     * Click Done.
     */
    async clickDone() {
        console.log(
            'Waiting for Done button...'
        );

        await expect(
            this.doneButton
        ).toBeVisible({
            timeout: 60000
        });

        await expect(
            this.doneButton
        ).toBeEnabled({
            timeout: 60000
        });

        await this.doneButton
            .scrollIntoViewIfNeeded();

        console.log(
            'Clicking Done button...'
        );

        await this.doneButton.click();

        console.log(
            'Done button clicked.'
        );
    }


    /*
     * Complete Proposal Summary flow.
     */
    async completeProposalSummary(
        tcId
    ) {
        console.log(
            '===== Starting Proposal Summary flow ====='
        );

        /*
         * UploadDocumentDetailsPage must already
         * have completed document submission and
         * opened this page before we reach here.
         */
        await this.waitForPage();

        /*
         * Continue from Proposal Summary.
         */
        await this.clickContinue();

        /*
         * Read and save Proposal Number.
         */
        const proposalResult =
            await this.saveProposalNumber(
                tcId
            );

        console.log(
            `Proposal Number generated: ` +
            `${proposalResult.proposalNumber}`
        );

        console.log(
            'Proposal Number saved successfully.'
        );

        /*
         * Keep final Proposal Number page
         * open for 10 seconds.
         */
        console.log(
            'Waiting 10 seconds on Proposal Number page...'
        );

        await this.page.waitForTimeout(
            10000
        );

        /*
         * Click Done after 10 seconds.
         */
        await this.clickDone();

        console.log(
            'Proposal Summary completed successfully.'
        );

        return proposalResult;
    }
}


module.exports =
    ProposalSummaryPage;