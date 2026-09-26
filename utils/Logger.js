const fs = require('fs');
const path = require('path');

class Logger {
    constructor(
        testCaseId = 'UnknownTest'
    ) {
        this.testCaseId =
            String(
                testCaseId || 'UnknownTest'
            ).trim();

        const projectName =
    process.env.PROJECT_NAME ||
    'Assured-Income-Plan';

        this.logsFolder =
            path.join(
                process.cwd(),
                'TestResults',
                projectName,
                'Logs'
            );

        if (
            !fs.existsSync(
                this.logsFolder
            )
        ) {
            fs.mkdirSync(
                this.logsFolder,
                {
                    recursive: true
                }
            );
        }

        const timestamp =
            this.getFileTimestamp();

        this.logFile =
            path.join(
                this.logsFolder,
                `${this.testCaseId}_${timestamp}.log`
            );

        this.info(
            `Logger started for ${this.testCaseId}`
        );
    }

    /*
     * Timestamp for console and file messages.
     */
    getTimestamp() {
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
     * Safe timestamp for the filename.
     */
    getFileTimestamp() {
        return new Date()
            .toISOString()
            .replace(
                /[:.]/g,
                '-'
            );
    }

    /*
     * Convert objects and arrays to readable text.
     */
    formatMessage(
        message
    ) {
        if (
            typeof message ===
            'string'
        ) {
            return message;
        }

        try {
            return JSON.stringify(
                message,
                null,
                2
            );
        } catch {
            return String(
                message
            );
        }
    }

    /*
     * Write one log line to the file.
     */
    writeToFile(
        logLine
    ) {
        fs.appendFileSync(
            this.logFile,
            `${logLine}\n`,
            {
                encoding:
                    'utf8'
            }
        );
    }

    /*
     * General log writer.
     */
    log(
        level,
        message
    ) {
        const text =
            this.formatMessage(
                message
            );

        const logLine =
            `[${this.getTimestamp()}] ` +
            `[${level}] ` +
            `${text}`;

        console.log(
            logLine
        );

        this.writeToFile(
            logLine
        );
    }

    info(
        message
    ) {
        this.log(
            'INFO',
            message
        );
    }

    success(
        message
    ) {
        this.log(
            'SUCCESS',
            message
        );
    }

    warn(
        message
    ) {
        this.log(
            'WARN',
            message
        );
    }

    error(
        message
    ) {
        this.log(
            'ERROR',
            message
        );
    }

    step(
        stepNumber,
        message
    ) {
        this.log(
            `STEP ${stepNumber}`,
            message
        );
    }

    data(
        label,
        value
    ) {
        const formattedValue =
            this.formatMessage(
                value
            );

        this.log(
            'DATA',
            `${label}:\n${formattedValue}`
        );
    }

    getLogFilePath() {
        return this.logFile;
    }
}

module.exports =
    Logger;