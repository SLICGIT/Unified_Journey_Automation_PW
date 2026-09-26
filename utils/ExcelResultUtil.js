const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

class ExcelResultUtil {
    /*
     * Create and return the project-specific
     * ExecutionResults.xlsx file path.
     *
     * Examples:
     *
     * TestResults/Assured-Income-Plan/ExecutionResults.xlsx
     * TestResults/New-Shri-Life-Plan/ExecutionResults.xlsx
     */
    static getResultFilePath(
        projectName
    ) {
        const safeProjectName =
            String(
                projectName || ''
            ).trim();

        if (!safeProjectName) {
            throw new Error(
                'Project name is missing while creating ' +
                'the Excel result path.'
            );
        }

        /*
         * Prevent invalid Windows filename characters.
         */
        const sanitizedProjectName =
            safeProjectName.replace(
                /[<>:"/\\|?*]/g,
                '-'
            );

        const resultFolder =
            path.join(
                process.cwd(),
                'TestResults',
                sanitizedProjectName
            );

        if (
            !fs.existsSync(
                resultFolder
            )
        ) {
            fs.mkdirSync(
                resultFolder,
                {
                    recursive: true
                }
            );
        }

        return path.join(
            resultFolder,
            'ExecutionResults.xlsx'
        );
    }


    /*
     * Create a unique Run ID.
     */
    static createRunId() {
        return new Date()
            .toISOString()
            .replace(
                /[-:.TZ]/g,
                ''
            );
    }


    /*
     * Format execution date and time
     * using Indian Standard Time.
     */
    static formatExecutedOn() {
        return new Date()
            .toLocaleString(
                'en-IN',
                {
                    timeZone:
                        'Asia/Kolkata',

                    year:
                        'numeric',

                    month:
                        '2-digit',

                    day:
                        '2-digit',

                    hour:
                        '2-digit',

                    minute:
                        '2-digit',

                    second:
                        '2-digit',

                    hour12:
                        false
                }
            );
    }


    /*
     * Save one execution result.
     */
    static saveResult({
        projectName,
        tcId,
        status,
        proposalNumber = '',
        executionTimeSeconds = '',
        errorMessage = '',
        logFile = ''
    }) {
        const safeProjectName =
            String(
                projectName || ''
            ).trim();

        if (!safeProjectName) {
            throw new Error(
                'projectName is required in ' +
                'ExcelResultUtil.saveResult().'
            );
        }

        const resultFile =
            this.getResultFilePath(
                safeProjectName
            );

        const resultRow = {
            ProjectName:
                safeProjectName,

            RunID:
                this.createRunId(),

            tc_id:
                String(
                    tcId || ''
                ).trim(),

            Status:
                String(
                    status || ''
                )
                    .trim()
                    .toUpperCase(),

            ProposalNumber:
                String(
                    proposalNumber || ''
                ).trim(),

            ExecutionTimeSeconds:
                Number(
                    executionTimeSeconds || 0
                ),

            ExecutedOn:
                this.formatExecutedOn(),

            ErrorMessage:
                String(
                    errorMessage || ''
                )
                    .replace(
                        /\r?\n/g,
                        ' '
                    )
                    .trim(),

            LogFile:
                String(
                    logFile || ''
                ).trim()
        };

        let workbook;
        let existingRows = [];

        if (
            fs.existsSync(
                resultFile
            )
        ) {
            workbook =
                XLSX.readFile(
                    resultFile
                );

            const existingSheet =
                workbook.Sheets[
                    'ExecutionResults'
                ];

            if (existingSheet) {
                existingRows =
                    XLSX.utils
                        .sheet_to_json(
                            existingSheet,
                            {
                                defval: ''
                            }
                        );
            }
        } else {
            workbook =
                XLSX.utils.book_new();
        }

        existingRows.push(
            resultRow
        );

        const resultSheet =
            XLSX.utils.json_to_sheet(
                existingRows,
                {
                    header: [
                        'ProjectName',
                        'RunID',
                        'tc_id',
                        'Status',
                        'ProposalNumber',
                        'ExecutionTimeSeconds',
                        'ExecutedOn',
                        'ErrorMessage',
                        'LogFile'
                    ]
                }
            );

        /*
         * Set readable Excel column widths.
         */
        resultSheet['!cols'] = [
            { wch: 28 }, // ProjectName
            { wch: 24 }, // RunID
            { wch: 12 }, // tc_id
            { wch: 10 }, // Status
            { wch: 20 }, // ProposalNumber
            { wch: 22 }, // ExecutionTimeSeconds
            { wch: 24 }, // ExecutedOn
            { wch: 70 }, // ErrorMessage
            { wch: 70 }  // LogFile
        ];

        /*
         * Replace the old result sheet
         * when it already exists.
         */
        if (
            workbook.SheetNames.includes(
                'ExecutionResults'
            )
        ) {
            workbook.Sheets[
                'ExecutionResults'
            ] = resultSheet;
        } else {
            XLSX.utils.book_append_sheet(
                workbook,
                resultSheet,
                'ExecutionResults'
            );
        }

        try {
            XLSX.writeFile(
                workbook,
                resultFile
            );
        } catch (error) {
            throw new Error(
                `Unable to update "${resultFile}". ` +
                'Make sure the Excel file is closed. ' +
                `Original error: ${error.message}`
            );
        }

        console.log(
            `Excel result saved: ${resultFile}`
        );

        console.log(
            `Project: ${safeProjectName}`
        );

        console.log(
            `Result: ${resultRow.tc_id} - ` +
            `${resultRow.Status}`
        );

        return {
            projectName:
                safeProjectName,

            resultFile,

            resultRow
        };
    }
}

module.exports = ExcelResultUtil;