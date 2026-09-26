const {
    defineConfig,
    devices
} = require('@playwright/test');

const path = require('path');


/*
 * Project name comes from package.json command.
 *
 * PROJECT_NAME=Assured-Income-Plan
 */
const projectName =
    process.env.PROJECT_NAME ||
    'Assured-Income-Plan';


/*
 * All Playwright-generated results for the
 * selected project will be stored here.
 */
const projectResultFolder =
    path.join(
        'TestResults',
        projectName
    );


module.exports = defineConfig({
    /*
     * Folder containing test files.
     */
    testDir:
        './tests',


    /*
     * Maximum time for one complete test.
     */
    timeout:
        10 * 60 * 1000,


    /*
     * Maximum time for Playwright assertions.
     */
    expect: {
        timeout:
            60000
    },


    /*
     * Keep parallel execution disabled for now.
     *
     * Your current flow uses:
     * - Manual OTP
     * - Shared Excel data
     * - Shared document files
     */
    fullyParallel:
        true,


    /*
     * Prevent accidental test.only usage in CI.
     */
    forbidOnly:
        Boolean(
            process.env.CI
        ),


    /*
     * Local:
     * No retry.
     *
     * CI:
     * Retry failed tests twice.
     */
    retries:
        process.env.CI
            ? 2
            : 0,


    /*
     * Use one worker for the current framework.
     */
    workers:
        4,


    /*
     * Create:
     *
     * 1. Terminal list report
     * 2. Project-specific HTML report
     */
    reporter: [
        [
            'list'
        ],

        [
            'html',
            {
                outputFolder:
                    path.join(
                        projectResultFolder,
                        'HTMLReport'
                    ),

                open:
                    'never'
            }
        ]
    ],


    /*
     * Common browser and test-artifact settings.
     */
    use: {
        /*
         * Display the browser during execution.
         */
        headless:
            false,


        /*
         * Save screenshot only when a test fails.
         */
        screenshot:
            'only-on-failure',


        /*
         * Save video only when a test fails.
         */
        video:
            'retain-on-failure',


        /*
         * Generate trace for every execution.
         *
         * Later, to reduce disk usage, change to:
         *
         * trace: 'retain-on-failure'
         */
        trace:
            'off',


        /*
         * Allow file downloads.
         */
        acceptDownloads:
            true,


        /*
         * Slow execution for observation.
         */
        launchOptions: {
            slowMo:
                150
        },


        /*
         * Default page navigation timeout.
         */
        navigationTimeout:
            120000,


        /*
         * Default click, fill, and select timeout.
         */
        actionTimeout:
            60000
    },


    /*
     * Playwright-generated artifacts:
     *
     * - trace.zip
     * - video.webm
     * - failure screenshot
     * - error-context.md
     *
     * Example:
     *
     * TestResults/
     * └── Assured-Income-Plan/
     *     └── PlaywrightArtifacts/
     */
    outputDir:
        path.join(
            projectResultFolder,
            'PlaywrightArtifacts'
        ),


    /*
     * Browser projects.
     */
    projects: [
        {
            name:
                'chromium',

            use: {
                ...devices[
                    'Desktop Chrome'
                ]
            }
        }
    ]
});