const { test, expect } = require('@playwright/test');
const path = require('path');

const { BasicDetailsPage } = require('../pages/BasicDetailsPage');
const { readExcel } = require('../utils/readExcelUtils');

const filePath = path.join(__dirname, '../BasicDetails.xlsx');
const data = readExcel(filePath);

test.describe('Basic Details Tests', () => {

  data.forEach(row => {

    test(`Test - ${row.tc_id}`, async ({ page }) => {

      const basic = new BasicDetailsPage(page);

      await page.goto('YOUR_URL');

      await basic.fillBasicDetails(row);
      await basic.clickGetOtp();

      await expect(page.locator('#btnBDOtpVerify')).toBeVisible();

    });

  });

});