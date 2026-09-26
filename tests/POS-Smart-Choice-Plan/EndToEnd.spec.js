// ============================================================
// POS SMART CHOICE PLAN - END TO END TEST
// ============================================================

const {
  test,
  expect,
} = require('@playwright/test');

const path = require('path');
const fs = require('fs');

const Logger = require('../../utils/Logger');
const ExcelResultUtil = require('../../utils/ExcelResultUtil');

const {
  readExcel,
} = require('../../utils/readExcelUtils');


// ============================================================
// POS SMART CHOICE PLAN PAGE OBJECTS
// ============================================================

const {
  BasicDetailsPage,
} = require(
  '../../pages/POS-Smart-Choice-Plan/BasicDetailsPage'
);

const {
  AccountSelectionPage,
} = require(
  '../../pages/POS-Smart-Choice-Plan/AccountSelectionPage'
);

const PrePlanPersonalDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/PrePlanPersonalDetailsPage'
  );

const HealthQuestionnairePage =
  require(
    '../../pages/POS-Smart-Choice-Plan/HealthQuestionnairePage'
  );

const PlanDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/PlanDetailsPage'
  );

const SummaryDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/SummaryDetailsPage'
  );

const PaymentSuccessPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/PaymentSuccessPage'
  );

const RegisterBankDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/RegisterBankDetailsPage'
  );

const AadhaarValidationPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/AadhaarValidationPage'
  );

const ENachSuccessPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/ENachSuccessPage'
  );

const KYCSelectionPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/KYCSelectionPage'
  );

const PersonalDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/PersonalDetails/PersonalDetails'
  );

const BankAccountDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/BankAccountDetailsPage'
  );

const MedicalQuestionnairePage =
  require(
    '../../pages/POS-Smart-Choice-Plan/MedicalQuestionnairePage'
  );

const UploadDocumentDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/UploadDocumentDetailsPage'
  );

const ProposerUploadDocumentDetailsPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/ProposerUploadDocumentDetailsPage'
  );

const ProposalSummaryPage =
  require(
    '../../pages/POS-Smart-Choice-Plan/ProposalSummaryPage'
  );


// ============================================================
// TEST CONFIGURATION
// ============================================================

test.setTimeout(10 * 60 * 1000);

test.use({
  launchOptions: {
    slowMo: 150,
  },
});


// ============================================================
// PROJECT NAME
// ============================================================

const projectName =
  process.env.PROJECT_NAME ||
  'POS-Smart-Choice-Plan';


// ============================================================
// POS SMART CHOICE EXCEL FILE
// ============================================================

const filePath = path.join(
  __dirname,
  '../../test_data/POS-Smart-Choice-Plan/',
  'POS-Smart-Choice-Plan-TestData.xlsx'
);


// ============================================================
// VERIFY EXCEL FILE EXISTS
// ============================================================

console.log('==============================================');
console.log('POS SMART CHOICE PLAN EXCEL');
console.log('==============================================');
console.log('Excel file:', filePath);

if (!fs.existsSync(filePath)) {
  throw new Error(
    `POS Smart Choice Excel file not found:\n${filePath}`
  );
}

console.log('Excel file exists: YES');
console.log('==============================================');


// ============================================================
// GET ONE EXCEL ROW USING tc_id
// ============================================================

function getTestDataById(
  sheetData,
  tcId,
  sheetName
) {

  if (
    !Array.isArray(sheetData) ||
    sheetData.length === 0
  ) {

    throw new Error(
      `No data found in "${sheetName}" sheet.`
    );
  }

  const requiredTcId =
    String(tcId || '')
      .replace(/^\uFEFF/, '')
      .trim()
      .toUpperCase();

  const row =
    sheetData.find(
      item =>
        String(item.tc_id || '')
          .replace(/^\uFEFF/, '')
          .trim()
          .toUpperCase() === requiredTcId
    );

  if (!row) {

    const availableIds =
      sheetData
        .map(
          item =>
            String(item.tc_id || '')
              .replace(/^\uFEFF/, '')
              .trim()
        )
        .filter(Boolean);

    throw new Error(
      `Test case "${tcId}" was not found in "${sheetName}" sheet.\n` +
      `Available tc_id values: ${availableIds.join(', ')}`
    );
  }

  return row;
}


// ============================================================
// READ ALL REQUIRED EXCEL SHEETS
// ============================================================

console.log(
  'Reading POS Smart Choice Excel sheets...'
);


// ------------------------------------------------------------
// Basic Details
// ------------------------------------------------------------

const basicSheetData =
  readExcel(
    filePath,
    'BasicDetails'
  );


// ------------------------------------------------------------
// Existing Account
// ------------------------------------------------------------

const existingAccountSheetData =
  readExcel(
    filePath,
    'ExistingAccount'
  );


// ------------------------------------------------------------
// Pre Plan Personal Details
// ------------------------------------------------------------

const prePlanPersonalDetailsRows =
  readExcel(
    filePath,
    'PrePlanPersonalDetails'
  );


// ------------------------------------------------------------
// Health Questionnaire
// ------------------------------------------------------------

const healthQuestionnaireRows =
  readExcel(
    filePath,
    'HealthQuestionnaire'
  );


// ------------------------------------------------------------
// Plan Details
// ------------------------------------------------------------

const planSheetData =
  readExcel(
    filePath,
    'PlanDetails'
  );


// ------------------------------------------------------------
// Bank Details
// ------------------------------------------------------------

const bankSheetData =
  readExcel(
    filePath,
    'BankDetails'
  );


// ------------------------------------------------------------
// Aadhaar Details
// ------------------------------------------------------------

const aadhaarSheetData =
  readExcel(
    filePath,
    'AadhaarDetails'
  );


// ------------------------------------------------------------
// Personal Info
// ------------------------------------------------------------

const personalInfoRows =
  readExcel(
    filePath,
    'PersonalInfo'
  );


// ------------------------------------------------------------
// Permanent Address
// ------------------------------------------------------------

const permanentAddressRows =
  readExcel(
    filePath,
    'PermanentAddress'
  );


// ------------------------------------------------------------
// Current Address
// ------------------------------------------------------------

const currentAddressRows =
  readExcel(
    filePath,
    'CurrentAddress'
  );


// ------------------------------------------------------------
// Additional Details
// ------------------------------------------------------------

const additionalDetailsRows =
  readExcel(
    filePath,
    'AdditionalDetails'
  );


// ------------------------------------------------------------
// Proposer Details
// ------------------------------------------------------------

const proposerDetailsRows =
  readExcel(
    filePath,
    'ProposerDetails'
  );


// ------------------------------------------------------------
// Nominee Details
// ------------------------------------------------------------

const nomineeDetailsRows =
  readExcel(
    filePath,
    'NomineeDetails'
  );


// ------------------------------------------------------------
// Nominee Address
// ------------------------------------------------------------

const nomineeAddressRows =
  readExcel(
    filePath,
    'NomineeAddress'
  );


// ------------------------------------------------------------
// Nominee Bank Details
// ------------------------------------------------------------

const nomineeBankDetailsRows =
  readExcel(
    filePath,
    'NomineeBankDetails'
  );


// ------------------------------------------------------------
// Appointee Details
// ------------------------------------------------------------

const appointeeDetailsRows =
  readExcel(
    filePath,
    'AppointeeDetails'
  );


// ------------------------------------------------------------
// Bank Account Details
// ------------------------------------------------------------

const bankAccountDetailsRows =
  readExcel(
    filePath,
    'BankAccountDetails'
  );


// ------------------------------------------------------------
// Family History 1
// ------------------------------------------------------------

const familyHistory1Rows =
  readExcel(
    filePath,
    'FamilyHistory1'
  );


// ------------------------------------------------------------
// Family History 2
// ------------------------------------------------------------

const familyHistory2Rows =
  readExcel(
    filePath,
    'FamilyHistory2'
  );


// ------------------------------------------------------------
// Upload Document Details
// ------------------------------------------------------------

const uploadDocumentDetailsRows =
  readExcel(
    filePath,
    'UploadDocumentDetails'
  );


// ------------------------------------------------------------
// Proposer Upload Document Details
// ------------------------------------------------------------

const proposerUploadDocumentRows =
  readExcel(
    filePath,
    'ProposerUploadDocumentDetails'
  );


console.log(
  'All POS Smart Choice Excel sheets loaded successfully.'
);


// ============================================================
// SELECT TEST CASES
// ============================================================
//
// If Run column exists:
//     Run = YES
//
// If Run column does not exist:
//     execute all rows having tc_id
//
// ============================================================

const hasRunColumn =
  basicSheetData.some(
    row =>
      Object.prototype.hasOwnProperty.call(
        row,
        'Run'
      )
  );


let selectedTestCases;


if (hasRunColumn) {

  selectedTestCases =
    basicSheetData.filter(
      row =>
        String(row.Run || '')
          .trim()
          .toUpperCase() === 'YES'
    );

} else {

  console.log(
    'Run column not found in BasicDetails. ' +
    'Running all test cases having tc_id.'
  );

  selectedTestCases =
    basicSheetData.filter(
      row =>
        String(row.tc_id || '')
          .trim() !== ''
    );
}


if (
  selectedTestCases.length === 0
) {

  throw new Error(
    'No POS Smart Choice test cases available to execute.'
  );
}


console.log(
  'Selected POS Smart Choice Test Cases:',
  selectedTestCases.map(
    row =>
      String(row.tc_id || '')
        .trim()
  )
);


// ============================================================
// CREATE ONE TEST FOR EACH SELECTED TEST CASE
// ============================================================

selectedTestCases.forEach(
  selectedBasicData => {

    const tcId =
      String(
        selectedBasicData.tc_id || ''
      ).trim();


    if (!tcId) {

      throw new Error(
        'tc_id is empty in BasicDetails sheet.'
      );
    }


    test(
      `End to End Flow - ${tcId}`,

      async ({ page }) => {

        const logger =
          new Logger(tcId);

        const startTime =
          Date.now();

        let testStatus =
          'FAIL';

        let generatedProposalNumber =
          '';

        let testErrorMessage =
          '';


        try {

          // ==================================================
          // TEST START
          // ==================================================

          logger.info(
            '=============================================='
          );

          logger.info(
            `Starting POS Smart Choice test case: ${tcId}`
          );

          logger.info(
            '=============================================='
          );


          // ==================================================
          // BASIC DETAILS DATA
          // ==================================================

          const basicData = {
            ...selectedBasicData,
          };


          // ==================================================
          // GET OTHER TEST CASE DATA
          // ==================================================

          const existingAccountData =
            getTestDataById(
              existingAccountSheetData,
              tcId,
              'ExistingAccount'
            );


          const prePlanPersonalDetailsData =
            getTestDataById(
              prePlanPersonalDetailsRows,
              tcId,
              'PrePlanPersonalDetails'
            );


          const healthQuestionnaireData =
            getTestDataById(
              healthQuestionnaireRows,
              tcId,
              'HealthQuestionnaire'
            );


          const planData =
            getTestDataById(
              planSheetData,
              tcId,
              'PlanDetails'
            );


          const bankData =
            getTestDataById(
              bankSheetData,
              tcId,
              'BankDetails'
            );


          const aadhaarData =
            getTestDataById(
              aadhaarSheetData,
              tcId,
              'AadhaarDetails'
            );


          const personalInfoData =
            getTestDataById(
              personalInfoRows,
              tcId,
              'PersonalInfo'
            );


          const permanentAddressData =
            getTestDataById(
              permanentAddressRows,
              tcId,
              'PermanentAddress'
            );


          const currentAddressData =
            getTestDataById(
              currentAddressRows,
              tcId,
              'CurrentAddress'
            );


          const additionalDetailsData =
            getTestDataById(
              additionalDetailsRows,
              tcId,
              'AdditionalDetails'
            );


          const proposerDetailsData =
            getTestDataById(
              proposerDetailsRows,
              tcId,
              'ProposerDetails'
            );


          const nomineeDetailsData =
            getTestDataById(
              nomineeDetailsRows,
              tcId,
              'NomineeDetails'
            );


          const nomineeAddressData =
            getTestDataById(
              nomineeAddressRows,
              tcId,
              'NomineeAddress'
            );


          const nomineeBankDetailsData =
            getTestDataById(
              nomineeBankDetailsRows,
              tcId,
              'NomineeBankDetails'
            );


          const appointeeDetailsData =
            getTestDataById(
              appointeeDetailsRows,
              tcId,
              'AppointeeDetails'
            );


          const bankAccountDetailsData =
            getTestDataById(
              bankAccountDetailsRows,
              tcId,
              'BankAccountDetails'
            );


          const familyHistory1Data =
            getTestDataById(
              familyHistory1Rows,
              tcId,
              'FamilyHistory1'
            );


          const familyHistory2Data =
            getTestDataById(
              familyHistory2Rows,
              tcId,
              'FamilyHistory2'
            );


          const uploadDocumentDetailsData =
            getTestDataById(
              uploadDocumentDetailsRows,
              tcId,
              'UploadDocumentDetails'
            );


          const proposerUploadDocumentData =
            getTestDataById(
              proposerUploadDocumentRows,
              tcId,
              'ProposerUploadDocumentDetails'
            );


          // ==================================================
          // BASIC DATA COMPATIBILITY OBJECT
          // ==================================================

          const compatibleBasicData = {

            ...basicData,

            InsureFor:
              basicData.InsureFor,

            FullName:
              basicData.FullName,

            Mobile:
              basicData.Mobile,

            Email:
              basicData.Email,

            DOB:
              basicData.DOB,

            Income:
              basicData.Income,

            Gender:
              basicData.Gender,
          };


          // ==================================================
          // LOG EXCEL DATA
          // ==================================================

          logger.data(
            'Basic Details Excel data',
            basicData
          );


          logger.data(
            'Existing Account Excel data',
            existingAccountData
          );


          logger.data(
            'Pre Plan Personal Details Excel data',
            prePlanPersonalDetailsData
          );


          logger.data(
            'Health Questionnaire Excel data',
            healthQuestionnaireData
          );


          logger.data(
            'Plan Details Excel data',
            planData
          );


          logger.data(
            'Bank Details Excel data',
            bankData
          );


          logger.data(
            'Aadhaar Details Excel data',
            aadhaarData
          );


          logger.data(
            'Personal Info Excel data',
            personalInfoData
          );


          logger.data(
            'Permanent Address Excel data',
            permanentAddressData
          );


          logger.data(
            'Current Address Excel data',
            currentAddressData
          );


          // ==================================================
          // ACCOUNT ACTION
          // ==================================================

          const accountAction =
            String(
              existingAccountData.FlowType ||
              basicData.FlowType ||
              ''
            )
              .trim()
              .toUpperCase();


          if (
            accountAction !== 'NEW' &&
            accountAction !== 'EXISTING' &&
            accountAction !== 'DIRECT'
          ) {

            throw new Error(
              `Invalid FlowType: "${accountAction}". ` +
              'Use NEW, EXISTING or DIRECT.'
            );
          }


          logger.info(
            `POS Smart Choice Account Action: ${accountAction}`
          );


          // ==================================================
          // CREATE PAGE OBJECTS
          // ==================================================

          const basicDetailsPage =
            new BasicDetailsPage(page);


          const accountSelectionPage =
            new AccountSelectionPage(page);


          const prePlanPersonalDetailsPage =
            new PrePlanPersonalDetailsPage(page);


          const healthQuestionnairePage =
            new HealthQuestionnairePage(page);


          const planDetailsPage =
            new PlanDetailsPage(page);


          const summaryDetailsPage =
            new SummaryDetailsPage(page);


          const paymentSuccessPage =
            new PaymentSuccessPage(page);


          const registerBankDetailsPage =
            new RegisterBankDetailsPage(page);


          const eNachSuccessPage =
            new ENachSuccessPage(page);


          const kycSelectionPage =
            new KYCSelectionPage(page);


          const personalDetailsPage =
            new PersonalDetailsPage(page);


          const bankAccountDetailsPage =
            new BankAccountDetailsPage(page);


          const medicalQuestionnairePage =
            new MedicalQuestionnairePage(page);


          const uploadDocumentDetailsPage =
            new UploadDocumentDetailsPage(page);


          const proposerUploadDocumentDetailsPage =
            new ProposerUploadDocumentDetailsPage(page);


          const proposalSummaryPage =
            new ProposalSummaryPage(page);


          // ==================================================
          // STEP 1
          // OPEN APPLICATION
          // ==================================================

          logger.step(
            1,
            'Opening POS Smart Choice Plan application'
          );


          await page.goto(
            'https://slicuatc.shriramlife.in/' +
            'OnlineInsurance/Protection-Plans/' +
            'Shriram-Life-POS-Smart-Choice-Plan/' +
            'Buy-Now/Basic-details?' +
            'r=tR4vwgYwYs6qLwHRf7pNhg%3D%3D',
            {
              waitUntil:
                'domcontentloaded',

              timeout:
                60000,
            }
          );


          await page.waitForLoadState(
            'domcontentloaded'
          );


          logger.success(
            'POS Smart Choice Plan application opened'
          );


          // ==================================================
          // STEP 2
          // BASIC DETAILS
          // ==================================================

          logger.step(
            2,
            'Filling Basic Details'
          );


          await basicDetailsPage
            .fillBasicDetails(
              compatibleBasicData
            );


          logger.success(
            'Basic Details fields completed'
          );


          await basicDetailsPage
            .clickGetOtp();


          logger.success(
            'Get OTP clicked'
          );


          // ==================================================
          // STEP 3
          // MANUAL OTP
          // ==================================================

          logger.step(
            3,
            'Waiting for OTP screen'
          );


          const otpModal =
            page.locator(
              '#bdOtpVerify'
            );


          await expect(
            otpModal
          ).toBeVisible({
            timeout:
              60000,
          });


          logger.info(
            'OTP screen displayed'
          );


          const otp1 =
            page.locator(
              '#txtBxOtpFirst'
            );


          const otp2 =
            page.locator(
              '#txtBxOtpSecond'
            );


          const otp3 =
            page.locator(
              '#txtBxOtpThird'
            );


          const otp4 =
            page.locator(
              '#txtBxOtpFourth'
            );


          logger.info(
            'Enter OTP manually in the browser'
          );


          await expect(
            otp1
          ).toHaveValue(
            /\d/,
            {
              timeout:
                120000,
            }
          );


          await expect(
            otp2
          ).toHaveValue(
            /\d/,
            {
              timeout:
                120000,
            }
          );


          await expect(
            otp3
          ).toHaveValue(
            /\d/,
            {
              timeout:
                120000,
            }
          );


          await expect(
            otp4
          ).toHaveValue(
            /\d/,
            {
              timeout:
                120000,
            }
          );


          logger.success(
            'OTP entered'
          );


          const verifyOtpButton =
            page.locator(
              '#btnBDOtpVerify'
            );


          await expect(
            verifyOtpButton
          ).toBeVisible({
            timeout:
              30000,
          });


          await expect(
            verifyOtpButton
          ).toBeEnabled({
            timeout:
              30000,
          });


          await verifyOtpButton.click();


          await expect(
            otpModal
          ).toBeHidden({
            timeout:
              60000,
          });


          logger.success(
            'OTP verification completed'
          );


          // ==================================================
          // STEP 4
          // ACCOUNT SELECTION
          // ==================================================

          logger.step(
            4,
            'Completing Account Selection'
          );


          logger.info(
            `[INFO] Account Action from Excel: ${accountAction}`
          );


          logger.info(
            `[INFO] URL immediately after OTP: ${page.url()}`
          );


          // ==================================================
          // DIRECT FLOW
          // ==================================================

          if (
            accountAction === 'DIRECT'
          ) {

            logger.info(
              '[INFO] DIRECT flow detected.'
            );


            logger.info(
              '[INFO] Waiting for application to navigate to Personal Details...'
            );


            try {

              if (
                page.url().includes(
                  '/Buy-Now/Personal-Details'
                )
              ) {

                logger.info(
                  '[INFO] Already on Personal Details page.'
                );

              } else {

                await page.waitForURL(
                  '**/Buy-Now/Personal-Details**',
                  {
                    timeout:
                      120000,

                    waitUntil:
                      'domcontentloaded',
                  }
                );

              }


              logger.info(
                `[INFO] Current URL: ${page.url()}`
              );


              logger.success(
                '[SUCCESS] DIRECT flow navigated to Personal Details.'
              );

            } catch (error) {

              logger.error(
                '[ERROR] DIRECT flow did not navigate to Personal Details.'
              );


              logger.error(
                `Current URL: ${page.url()}`
              );


              throw error;
            }

          }


          // ==================================================
          // NEW / EXISTING FLOW
          // ==================================================

          else {

            logger.info(
              `[INFO] ${accountAction} flow detected.`
            );


            const makeNewProposal =
              page.locator(
                '#newprpslbtn'
              );


            const accountSelectionResult =
              await Promise.race([

                page
                  .waitForURL(
                    '**/Buy-Now/Personal-Details**',
                    {
                      timeout:
                        120000,

                      waitUntil:
                        'domcontentloaded',
                    }
                  )
                  .then(
                    () =>
                      'PERSONAL_DETAILS'
                  ),


                makeNewProposal
                  .waitFor({
                    state:
                      'visible',

                    timeout:
                      120000,
                  })
                  .then(
                    () =>
                      'ACCOUNT_SELECTION'
                  ),

              ]).catch(
                async error => {

                  logger.error(
                    '[ERROR] Neither Account Selection nor Personal Details became available.'
                  );


                  logger.error(
                    `Current URL: ${page.url()}`
                  );


                  throw error;
                }
              );


            logger.info(
              `Account Selection result: ${accountSelectionResult}`
            );


            if (
              accountSelectionResult ===
              'PERSONAL_DETAILS'
            ) {

              logger.success(
                '[SUCCESS] Application navigated directly to Personal Details.'
              );

            }


            else if (
              accountSelectionResult ===
              'ACCOUNT_SELECTION'
            ) {

              logger.info(
                '[INFO] Account Selection page displayed.'
              );


              logger.info(
                `[INFO] Executing Account Selection: ${accountAction}`
              );


              await accountSelectionPage
                .handleSelection(
                  accountAction
                );


              logger.success(
                '[SUCCESS] Account Selection completed.'
              );


              if (
                !page.url().includes(
                  '/Buy-Now/Personal-Details'
                )
              ) {

                await page.waitForURL(
                  '**/Buy-Now/Personal-Details**',
                  {
                    timeout:
                      120000,

                    waitUntil:
                      'domcontentloaded',
                  }
                );

              }


              logger.success(
                '[SUCCESS] Personal Details page navigation confirmed.'
              );
            }
          }


          // ==================================================
          // FINAL ACCOUNT SELECTION URL CHECK
          // ==================================================

          await page.waitForLoadState(
            'domcontentloaded'
          ).catch(() => {});


          const finalAccountUrl =
            page.url();


          logger.info(
            `[INFO] URL before Pre-Plan Personal Details: ${finalAccountUrl}`
          );


          if (
            !finalAccountUrl.includes(
              '/Buy-Now/Personal-Details'
            )
          ) {

            await page.waitForURL(
              '**/Buy-Now/Personal-Details**',
              {
                timeout:
                  120000,

                waitUntil:
                  'domcontentloaded',
              }
            );

          }


          logger.success(
            '[SUCCESS] Personal Details page navigation confirmed.'
          );


          logger.success(
            'Account Selection completed'
          );


          // ==================================================
          // STEP 5
          // PRE-PLAN PERSONAL DETAILS
          // ==================================================

          logger.step(
            5,
            'Completing Pre-Plan Personal Details'
          );


          await prePlanPersonalDetailsPage
            .fillPersonalDetails(
              prePlanPersonalDetailsData
            );


          logger.success(
            'Pre-Plan Personal Details fields completed'
          );


          await prePlanPersonalDetailsPage
            .clickContinue();


          logger.success(
            'Pre-Plan Personal Details completed'
          );


          // ==================================================
          // STEP 6
          // HEALTH QUESTIONNAIRE
          // ==================================================

          logger.step(
            6,
            'Completing Health Questionnaire'
          );


          await healthQuestionnairePage
            .completeQuestionnaire(
              healthQuestionnaireData
            );


          await healthQuestionnairePage
            .clickContinue();


          logger.success(
            'Health Questionnaire completed'
          );


          // ==================================================
          // STEP 7
          // PLAN DETAILS
          // ==================================================

          logger.step(
            7,
            'Filling POS Smart Choice Plan Details'
          );


          await planDetailsPage
            .waitForPage();


          logger.success(
            'POS Smart Choice Plan Details page displayed'
          );


          await planDetailsPage
            .fillPlanDetails(
              planData
            );


          logger.success(
            'Plan Details completed'
          );


          // ==================================================
          // STEP 8
          // BUY NOW
          // ==================================================

          logger.step(
            8,
            'Completing Buy Now and Benefit Payout'
          );


          await planDetailsPage
            .clickBuyNow(
              planData
            );


          logger.success(
            'Buy Now and Benefit Payout completed'
          );


          // ==================================================
          // STEP 9
          // SUMMARY DETAILS
          // ==================================================

          logger.step(
            9,
            'Completing Summary Details'
          );


          const autoDebitSelected =
            await summaryDetailsPage
              .completeSummaryDetails(
                compatibleBasicData,
                planData
              );


          logger.success(
            'Summary Details completed successfully'
          );


          logger.info(
            `Auto Debit selected: ${autoDebitSelected}`
          );


          // ==================================================
          // STEP 10
          // PAYMENT SUCCESS
          // ==================================================

          logger.step(
            10,
            'Completing Payment Success flow'
          );


          const paymentResult =
            await paymentSuccessPage
              .completePaymentSuccess(
                planData,
                autoDebitSelected
              );


          const quoteId =
            paymentResult?.quoteId ||
            '';


          const paymentNextFlow =
            String(
              paymentResult?.paymentNextFlow ||
              ''
            )
              .trim()
              .toUpperCase();


          logger.success(
            `Payment Success completed. Quote ID: ${quoteId}`
          );


          logger.info(
            `Payment Next Flow: ${paymentNextFlow}`
          );


          // ==================================================
          // STEPS 11-13
          // PAYMENT FLOW
          // ==================================================

          if (
            paymentNextFlow ===
            'AUTO_PAY'
          ) {

            logger.info(
              'Auto Pay flow detected.'
            );


            // ------------------------------------------------
            // STEP 11
            // REGISTER BANK DETAILS
            // ------------------------------------------------

            logger.step(
              11,
              'Starting Register Bank Details'
            );


            const aadhaarPage =
              await registerBankDetailsPage
                .completeRegisterBankDetails(
                  bankData
                );


            logger.success(
              'Register Bank Details completed'
            );


            logger.info(
              `Aadhaar page URL: ${aadhaarPage.url()}`
            );


            // ------------------------------------------------
            // STEP 12
            // AADHAAR VALIDATION
            // ------------------------------------------------

            logger.step(
              12,
              'Starting Aadhaar Validation'
            );


            const aadhaarValidationPage =
              new AadhaarValidationPage(
                aadhaarPage
              );


            await aadhaarValidationPage
              .completeAadhaarValidation(
                aadhaarData
              );


            logger.success(
              'Aadhaar Validation completed'
            );


            // ------------------------------------------------
            // STEP 13
            // ENACH SUCCESS
            // ------------------------------------------------

            logger.step(
              13,
              'Completing eNACH Success page'
            );


            await eNachSuccessPage
              .completeSuccessPage();


            logger.success(
              'eNACH Success page completed'
            );

          }


          else if (
            paymentNextFlow ===
            'DIRECT_KYC'
          ) {

            logger.info(
              'DIRECT_KYC flow detected.'
            );


            const paymentType =
              String(
                planData.PaymentType ||
                planData['Payment Type'] ||
                ''
              ).trim();


            logger.info(
              `Payment Type: ${paymentType}`
            );


            logger.info(
              'Register Bank Details skipped.'
            );


            logger.info(
              'Aadhaar Validation skipped.'
            );


            logger.info(
              'eNACH Success skipped.'
            );

          }


          else {

            throw new Error(
              `Unexpected Payment Success flow: "${paymentNextFlow}".`
            );
          }


          // ==================================================
          // STEP 14
          // KYC SELECTION
          // ==================================================

          logger.step(
            14,
            'Completing KYC Selection'
          );


          await kycSelectionPage
            .completeKYCSelection();


          logger.success(
            'KYC Selection completed'
          );


          // ==================================================
          // STEP 15
          // PERSONAL DETAILS
          // ==================================================

          logger.step(
            15,
            'Completing Personal Details'
          );


          console.log(
            'Passing Pre-Plan Personal Details data:',
            prePlanPersonalDetailsData
          );


          await personalDetailsPage
            .completePersonalDetails({

              basicData:
                compatibleBasicData,

              personalInfoData,

              permanentAddressData,

              currentAddressData,

              additionalDetailsData,

              prePlanPersonalDetailsData,

              proposerDetailsData,

              nomineeDetailsData,

              nomineeAddressData,

              nomineeBankDetailsData,

              appointeeDetailsData,

            });


          logger.success(
            'Personal Details completed'
          );


          // ==================================================
          // STEP 16
          // BANK ACCOUNT DETAILS
          // ==================================================

          logger.step(
            16,
            'Completing Bank Account Details'
          );


          const bankNextPage =
            await bankAccountDetailsPage
              .completeBankAccountDetails(
                bankAccountDetailsData
              );


          logger.success(
            `Bank Account Details completed. ` +
            `Next page: ${bankNextPage}`
          );


          // ==================================================
          // STEP 17
          // MEDICAL QUESTIONNAIRE
          // ==================================================

          if (
            bankNextPage ===
            'QUESTIONNAIRE'
          ) {

            logger.step(
              17,
              'Completing Medical Questionnaire'
            );


            console.log(
              'Health Questionnaire Excel data:',
              healthQuestionnaireData
            );


            console.log(
              'Family History 1 Excel data:',
              familyHistory1Data
            );


            console.log(
              'Family History 2 Excel data:',
              familyHistory2Data
            );


            await medicalQuestionnairePage
              .completeMedicalQuestionnaire({

                medicalQuestionnaireData:
                  healthQuestionnaireData,

                familyHistory1Data,

                familyHistory2Data,

              });


            logger.success(
              'Medical Questionnaire completed'
            );

          }


          else if (
            bankNextPage ===
            'UPLOAD_DOCUMENTS'
          ) {

            logger.info(
              'Medical Questionnaire page skipped.'
            );


            logger.info(
              'Upload Document Details page opened directly.'
            );

          }


          else {

            throw new Error(
              `Unexpected page after Bank Account Details: ` +
              `"${bankNextPage}".`
            );
          }


          // ==================================================
          // STEP 18
          // UPLOAD DOCUMENT DETAILS
          // ==================================================

          logger.step(
            18,
            'Completing Upload Document Details'
          );


          const insureFor =
            String(
              basicData.InsureFor ||
              ''
            )
              .trim()
              .toUpperCase();


          const proposerUploadRequired =
            [
              'SPOUSE',
              'CHILD',
              'GRAND CHILD',
            ].includes(
              insureFor
            );


          if (
            proposerUploadRequired
          ) {

            logger.info(
              `${insureFor} flow detected. ` +
              'Using Proposer Upload Document page.'
            );


            await proposerUploadDocumentDetailsPage
              .completeUploadDocumentDetails(
                proposerUploadDocumentData,
                autoDebitSelected
              );

          }


          else {

            logger.info(
              'SELF flow detected. ' +
              'Using normal Upload Document page.'
            );


            await uploadDocumentDetailsPage
              .completeUploadDocumentDetails(
                uploadDocumentDetailsData,
                autoDebitSelected
              );
          }


          logger.success(
            'Upload Document Details completed'
          );


          // ==================================================
          // STEP 19
          // PROPOSAL SUMMARY
          // ==================================================

          logger.step(
            19,
            'Completing Proposal Summary'
          );


          const proposalResult =
            await proposalSummaryPage
              .completeProposalSummary(
                tcId
              );


          generatedProposalNumber =
            String(
              proposalResult?.proposalNumber ||
              ''
            ).trim();


          if (
            !generatedProposalNumber
          ) {

            throw new Error(
              'Proposal Number was not generated.'
            );
          }


          logger.success(
            `Saved Proposal Number: ${generatedProposalNumber}`
          );


          // ==================================================
          // TEST PASS
          // ==================================================

          testStatus =
            'PASS';


          logger.info(
            '=============================================='
          );


          logger.success(
            `POS Smart Choice test completed successfully: ${tcId}`
          );


          logger.info(
            '=============================================='
          );

        }


        // ====================================================
        // ERROR HANDLING
        // ====================================================

        catch (error) {

          testStatus =
            'FAIL';


          testErrorMessage =
            error?.stack ||
            error?.message ||
            String(error);


          logger.error(
            `POS Smart Choice test failed: ${tcId}`
          );


          logger.error(
            testErrorMessage
          );


          throw error;
        }


        // ====================================================
        // FINALLY
        // ====================================================

        finally {

          const executionTimeMs =
            Date.now() -
            startTime;


          const executionTimeSeconds =
            (
              executionTimeMs /
              1000
            ).toFixed(2);


          const executionTimeMinutes =
            (
              executionTimeMs /
              60000
            ).toFixed(2);


          logger.info(
            `Execution Time: ` +
            `${executionTimeSeconds} seconds ` +
            `(${executionTimeMinutes} minutes)`
          );


          logger.info(
            `Log File: ${logger.getLogFilePath()}`
          );


          // ==================================================
          // SAVE EXECUTION RESULT
          // ==================================================

          try {

            const excelResult =
              ExcelResultUtil.saveResult({

                projectName,

                tcId,

                status:
                  testStatus,

                proposalNumber:
                  generatedProposalNumber,

                executionTimeSeconds,

                errorMessage:
                  testErrorMessage,

                logFile:
                  logger.getLogFilePath(),

              });


            logger.success(
              `Execution result saved to Excel: ` +
              `${excelResult.resultFile}`
            );

          } catch (
            excelError
          ) {

            logger.error(
              `Unable to save Excel result: ` +
              `${
                excelError?.message ||
                excelError
              }`
            );
          }
        }
      }
    );
  }
);