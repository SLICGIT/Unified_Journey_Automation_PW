const fs = require('fs');
const path = require('path');

class ScreenshotUtil {

    static async capture(
        page,
        stepName
    ) {

       const projectName =
    process.env.PROJECT_NAME ||
    'Assured-Income-Plan';

        const folder =
            path.join(
                process.cwd(),
                'TestResults',
                projectName,
                'Screenshots'
            );

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        const date =
            new Date()
                .toISOString()
                .replace(/:/g,'-')
                .replace(/\./g,'-');

        const file =
            path.join(
                folder,
                `${date}_${stepName}.png`
            );

        await page.screenshot({

            path:file,

            fullPage:true

        });

        console.log(
            `Screenshot saved : ${file}`
        );

        return file;
    }

}

module.exports = ScreenshotUtil;