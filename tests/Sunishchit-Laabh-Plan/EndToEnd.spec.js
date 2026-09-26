// ============================================================
// PART 1: IMPORTS, CONFIGURATION AND EXCEL HELPER
// ============================================================

const {
  test,
  expect,
} = require('@playwright/test');

const path = require('path');

const Logger = require(
  '../../utils/Logger'
);

const ExcelResultUtil = require(
  '../../utils/ExcelResultUtil'
);

const {
  readExcel,
} = require(
  '../../utils/readExcelUtils'
);


// ============================================================
// SUNISHCHIT LAABH PLAN PAGE OBJECTS
// ============================================================

const {
  BasicDetailsPage,
} = require(
  '../../pages/Sunishchit-Laabh-Plan/BasicDetailsPage'
);

const {
  AccountSelectionPage,
} = require(
  '../../pages/Sunishchit-Laabh-Plan/AccountSelectionPage'
);

const PlanDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/PlanDetailsPage'
);

const {
  SuitabilityAnalysisPage,
} = require(
  '../../pages/Sunishchit-Laabh-Plan/SuitabilityAnalysisPage'
);

const SummaryDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/SummaryDetailsPage'
);

const PaymentSuccessPage = require(
  '../../pages/Sunishchit-Laabh-Plan/PaymentSuccessPage'
);

const RegisterBankDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/RegisterBankDetailsPage'
);

const AadhaarValidationPage = require(
  '../../pages/Sunishchit-Laabh-Plan/AadhaarValidationPage'
);

const ENachSuccessPage = require(
  '../../pages/Sunishchit-Laabh-Plan/ENachSuccessPage'
);

const KYCSelectionPage = require(
  '../../pages/Sunishchit-Laabh-Plan/KYCSelectionPage'
);

const PersonalDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/' +
  'PersonalDetails/PersonalDetails'
);

const BankAccountDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/' +
  'BankAccountDetailsPage'
);

const MedicalQuestionnairePage = require(
  '../../pages/Sunishchit-Laabh-Plan/' +
  'MedicalQuestionnairePage'
);

const UploadDocumentDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/' +
  'UploadDocumentDetailsPage'
);

const ProposerUploadDocumentDetailsPage = require(
  '../../pages/Sunishchit-Laabh-Plan/' +
  'ProposerUploadDocumentDetailsPage'
);

const ProposalSummaryPage = require(
  '../../pages/Sunishchit-Laabh-Plan/' +
  'ProposalSummaryPage'
);


// ============================================================
// TEST CONFIGURATION
// ============================================================

test.setTimeout(
  10 * 60 * 1000
);

test.use({
  launchOptions: {
    slowMo: 150,
  },
});


// ============================================================
// EXCEL FILE PATH
// ============================================================

const filePath = path.join(
  __dirname,
  '../../test_data/Sunishchit-Laabh-Plan/' +
  'Sunishchit-Laabh-TestData.xlsx'
);


// ============================================================
// GET TEST DATA BY TC ID
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
      .trim()
      .toUpperCase();

  const row =
    sheetData.find(
      item =>
        String(
          item.tc_id || ''
        )
          .trim()
          .toUpperCase() === requiredTcId
    );

  if (!row) {

    throw new Error(
      `Test case "${tcId}" was not found ` +
      `in "${sheetName}" sheet.`
    );

  }

  return row;

}


// ============================================================
// PART 2: READ EXCEL SHEETS
// ============================================================

const basicSheetData =
  readExcel(
    filePath,
    'BasicDetails'
  );

const existingAccountSheetData =
  readExcel(
    filePath,
    'ExistingAccount'
  );

const planSheetData =
  readExcel(
    filePath,
    'PlanDetails'
  );

const bankSheetData =
  readExcel(
    filePath,
    'BankDetails'
  );

const aadhaarSheetData =
  readExcel(
    filePath,
    'AadhaarDetails'
  );

const personalInfoRows =
  readExcel(
    filePath,
    'PersonalInfo'
  );

const permanentAddressRows =
  readExcel(
    filePath,
    'PermanentAddress'
  );

const currentAddressRows =
  readExcel(
    filePath,
    'CurrentAddress'
  );

const additionalDetailsRows =
  readExcel(
    filePath,
    'AdditionalDetails'
  );

const proposerDetailsRows =
  readExcel(
    filePath,
    'ProposerDetails'
  );

const nomineeDetailsRows =
  readExcel(
    filePath,
    'NomineeDetails'
  );

const nomineeAddressRows =
  readExcel(
    filePath,
    'NomineeAddress'
  );

const nomineeBankDetailsRows =
  readExcel(
    filePath,
    'NomineeBankDetails'
  );

const appointeeDetailsRows =
  readExcel(
    filePath,
    'AppointeeDetails'
  );

const bankAccountDetailsRows =
  readExcel(
    filePath,
    'BankAccountDetails'
  );

const medicalQuestionnaireRows =
  readExcel(
    filePath,
    'MedicalQuestionnaire'
  );

const uploadDocumentDetailsRows =
  readExcel(
    filePath,
    'UploadDocumentDetails'
  );

const proposerUploadDocumentRows =
  readExcel(
    filePath,
    'ProposerUploadDocumentDetails'
  );


// ============================================================
// PART 3: SELECT TEST CASES WHERE RUN = YES
// ============================================================

const selectedTestCases =
  basicSheetData.filter(
    row =>
      String(
        row.Run || ''
      )
        .trim()
        .toUpperCase() === 'YES'
  );

if (
  selectedTestCases.length === 0
) {

  throw new Error(
    'No test cases are marked Run = YES ' +
    'in BasicDetails sheet.'
  );

}

console.log(
  'Selected NSLP Test Cases:',
  selectedTestCases.map(
    row =>
      String(
        row.tc_id || ''
      ).trim()
  )
);


// ============================================================
// PART 4: CREATE TEST FOR EACH SELECTED TC
// ============================================================

selectedTestCases.forEach(
  selectedBasicData => {

    const tcId =
      String(
        selectedBasicData.tc_id || ''
      ).trim();

    if (!tcId) {

      throw new Error(
        'tc_id is empty for a row marked Run = YES.'
      );

    }


    test(
      `End to End Flow - ${tcId}`,

      async ({ page }) => {

        const projectName =
          process.env.PROJECT_NAME ||
          'Sunishchit-Laabh-Plan';

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

          // ====================================================
          // START LOGGING
          // ====================================================

          logger.info(
            '================================'
          );

          logger.info(
            `Starting NSLP test case: ${tcId}`
          );

          logger.info(
            '================================'
          );


          // ====================================================
          // GET TEST DATA
          // ====================================================

          const basicData =
            getTestDataById(
              basicSheetData,
              tcId,
              'BasicDetails'
            );

          const existingAccountData =
            getTestDataById(
              existingAccountSheetData,
              tcId,
              'ExistingAccount'
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

          const medicalQuestionnaireData =
            getTestDataById(
              medicalQuestionnaireRows,
              tcId,
              'MedicalQuestionnaire'
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


          // ====================================================
          // BASIC DATA COMPATIBILITY
          // ====================================================

          const compatibleBasicData = {
            ...basicData,

            AI_insureFor:
              basicData.InsureFor,

            AI_FullName:
              basicData.FullName,

            AI_Mobile:
              basicData.Mobile,

            AI_Email:
              basicData.Email,

            AI_dob:
              basicData.DOB,

            AI_income:
              basicData.Income,

            AI_gender:
              basicData.Gender,
          };


          // ====================================================
          // LOG EXCEL DATA
          // ====================================================

          logger.data(
            'Basic Details Excel data',
            basicData
          );

          logger.data(
            'Existing Account Excel data',
            existingAccountData
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


          // ====================================================
          // FLOW TYPE
          // ====================================================

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
            accountAction !== 'EXISTING'
          ) {

            throw new Error(
              `Invalid FlowType: "${accountAction}". ` +
              'Use NEW or EXISTING.'
            );

          }

          logger.info(
            `NSLP Account Action: ${accountAction}`
          );


          // ====================================================
          // CREATE PAGE OBJECTS
          // ====================================================

          const basicDetailsPage =
            new BasicDetailsPage(page);

          const accountSelectionPage =
            new AccountSelectionPage(page);

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


          // ====================================================
          // STEP 1: OPEN APPLICATION
          // ====================================================

          logger.step(
            1,
            'Opening Sunishchit Laabh Plan application'
          );

          await page.goto(
            'https://slicuata.shriramlife.in/' +
            'OnlineInsurance/Savings-Plans/' +
            'Shriram-Life-Sunishchit-Laabh-Plan/' +
            'Buy-Now/Basic-details?' +
            'r=tR4vwgYwYs6qLwHRf7pNhg%3D%3D',
            {
              waitUntil: 'domcontentloaded',
              timeout: 60000,
            }
          );

          await page.waitForLoadState(
            'domcontentloaded'
          );

          logger.success(
            'Sunishchit Laabh Plan application opened'
          );


          // ====================================================
          // STEP 2: BASIC DETAILS
          // ====================================================

          logger.step(
            2,
            'Filling Basic Details'
          );

          await basicDetailsPage.fillBasicDetails(
            basicData
          );

          logger.success(
            'Basic Details fields completed'
          );

          await basicDetailsPage.clickGetOtp();

          logger.success(
            'Get OTP clicked'
          );


          // ====================================================
          // STEP 3: MANUAL OTP
          // ====================================================

          logger.step(
            3,
            'Waiting for OTP screen'
          );

          const otpModal =
            page.locator('#bdOtpVerify');

          await expect(
            otpModal
          ).toBeVisible({
            timeout: 60000,
          });

          const otp1 =
            page.locator('#txtBxOtpFirst');

          const otp2 =
            page.locator('#txtBxOtpSecond');

          const otp3 =
            page.locator('#txtBxOtpThird');

          const otp4 =
            page.locator('#txtBxOtpFourth');

          logger.info(
            'Enter OTP manually in the browser'
          );

          await expect(
            otp1
          ).toHaveValue(/\d/, {
            timeout: 120000,
          });

          await expect(
            otp2
          ).toHaveValue(/\d/, {
            timeout: 120000,
          });

          await expect(
            otp3
          ).toHaveValue(/\d/, {
            timeout: 120000,
          });

          await expect(
            otp4
          ).toHaveValue(/\d/, {
            timeout: 120000,
          });

          const verifyOtpButton =
            page.locator('#btnBDOtpVerify');

          await expect(
            verifyOtpButton
          ).toBeEnabled({
            timeout: 30000,
          });

          await verifyOtpButton.click();

          await expect(
            otpModal
          ).toBeHidden({
            timeout: 60000,
          });

          logger.success(
            'OTP verification completed'
          );


          // ====================================================
          // STEP 4: ACCOUNT SELECTION / PLAN DETAILS
          // ====================================================

          logger.step(
            4,
            'Checking page after OTP verification'
          );

          const makeNewProposal =
            page.locator('#newprpslbtn');

          const nslpPlanDetailsField =
            page
              .locator(
                'select[id^="SelLifeCoverOption_"]'
              )
              .first();

          const pageAfterOtp =
            await Promise.race([

              makeNewProposal
                .waitFor({
                  state: 'visible',
                  timeout: 60000,
                })
                .then(
                  () => 'ACCOUNT_SELECTION'
                )
                .catch(
                  () => null
                ),

              nslpPlanDetailsField
                .waitFor({
                  state: 'visible',
                  timeout: 60000,
                })
                .then(
                  () => 'PLAN_DETAILS'
                )
                .catch(
                  () => null
                ),

            ]);

          if (!pageAfterOtp) {

            throw new Error(
              'Neither Account Selection page nor ' +
              'Plan Details page was displayed.'
            );

          }

          if (
            pageAfterOtp === 'ACCOUNT_SELECTION'
          ) {

            logger.info(
              'Account Selection page displayed'
            );

            await accountSelectionPage.handleSelection(
              accountAction
            );

            logger.success(
              'Account Selection completed'
            );

          }

          await planDetailsPage.waitForPage();

          logger.success(
            'Sunishchit Laabh Plan Details page displayed'
          );


          // ====================================================
          // STEP 5: PLAN DETAILS
          // ====================================================

          logger.step(
            5,
            'Filling Plan Details'
          );

          await planDetailsPage.fillPlanDetails(
            planData
          );

          logger.success(
            'Plan Details completed'
          );


          // ====================================================
          // STEP 6: SUITABILITY ANALYSIS
          // ====================================================

          logger.step(
            6,
            'Opening Suitability Analysis'
          );

          await planDetailsPage.clickSuitabilityAnalysis();

          logger.success(
            'Suitability Analysis opened'
          );

          const suitabilityAnalysisPage =
            new SuitabilityAnalysisPage(page);

          await suitabilityAnalysisPage
            .completeSuitabilityAnalysis(
              planData
            );

          logger.success(
            'Suitability Analysis completed'
          );


          // ====================================================
          // STEP 7: BUY NOW
          // ====================================================

          logger.step(
            7,
            'Clicking Buy Now'
          );

          await planDetailsPage.clickBuyNow();

          logger.success(
            'Buy Now clicked successfully'
          );


          // ====================================================
          // STEP 8: SUMMARY DETAILS
          // ====================================================

          logger.step(
            8,
            'Completing Summary Details'
          );

          await page.waitForLoadState(
            'domcontentloaded'
          ).catch(() => {});

          await page.waitForTimeout(2000);

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


          // ====================================================
          // STEP 9: PAYMENT SUCCESS
          // ====================================================

          logger.step(
            9,
            'Completing Payment Success flow'
          );

          const paymentResult =
            await paymentSuccessPage
              .completePaymentSuccess(
                planData,
                autoDebitSelected
              );

          const quoteId =
            paymentResult.quoteId;

          const paymentNextFlow =
            paymentResult.paymentNextFlow;

          logger.success(
            `Payment Success completed. ` +
            `Quote ID: ${quoteId}`
          );

          logger.info(
            `Payment Next Flow: ${paymentNextFlow}`
          );


          // ====================================================
          // STEP 10 - 12: PAYMENT BASED FLOW
          //
          // AUTO_PAY:
          // Register Bank → Aadhaar → eNACH
          //
          // DIRECT_KYC:
          // Skip Auto Pay pages
          // ====================================================

          if (
            paymentNextFlow === 'AUTO_PAY'
          ) {

            logger.info(
              'Monthly payment detected. ' +
              'Executing Auto Pay flow.'
            );


            // ================================================
            // STEP 10: REGISTER BANK DETAILS
            // ================================================

            logger.step(
              10,
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


            // ================================================
            // STEP 11: AADHAAR VALIDATION
            // ================================================

            logger.step(
              11,
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


            // ================================================
            // STEP 12: eNACH SUCCESS
            // ================================================

            logger.step(
              12,
              'Completing eNACH Success page'
            );

            await eNachSuccessPage
              .completeSuccessPage();

            logger.success(
              'eNACH Success page completed'
            );

          }

          else if (
            paymentNextFlow === 'DIRECT_KYC'
          ) {

            logger.info(
              `Non-Monthly Payment Type: ` +
              `${planData.PaymentType}`
            );

            logger.info(
              'Skipping Register Bank Details.'
            );

            logger.info(
              'Skipping Aadhaar Validation.'
            );

            logger.info(
              'Skipping eNACH Success.'
            );

          }

          else {

            throw new Error(
              `Unexpected Payment Success flow: ` +
              `"${paymentNextFlow}".`
            );

          }


          // ====================================================
          // STEP 13: KYC SELECTION
          // ====================================================

          logger.step(
            13,
            'Selecting Manual KYC'
          );

          await kycSelectionPage.waitForPage();

          await kycSelectionPage.selectManualKYC();

          logger.success(
            'Manual KYC selected'
          );

          await kycSelectionPage.clickContinue();

          logger.success(
            'Manual KYC Continue clicked'
          );

          await page.waitForLoadState(
            'domcontentloaded'
          ).catch(() => {});


          // ====================================================
          // STEP 14: PERSONAL DETAILS
          // ====================================================

          logger.step(
            14,
            'Completing Personal Details'
          );

          await personalDetailsPage
            .completePersonalDetails({

              basicData:
                compatibleBasicData,

              personalInfoData,

              permanentAddressData,

              currentAddressData,

              additionalDetailsData,

              proposerDetailsData,

              nomineeDetailsData,

              nomineeAddressData,

              nomineeBankDetailsData,

              appointeeDetailsData,

            });

          logger.success(
            'Personal Details completed'
          );


          // ====================================================
          // STEP 15: BANK ACCOUNT DETAILS
          // ====================================================

          logger.step(
            15,
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


          // ====================================================
          // STEP 16: MEDICAL QUESTIONNAIRE
          // ====================================================

          if (
            bankNextPage === 'QUESTIONNAIRE'
          ) {

            logger.step(
              16,
              'Completing Medical Questionnaire'
            );

            await medicalQuestionnairePage
              .completeMedicalQuestionnaire(
                medicalQuestionnaireData
              );

            logger.success(
              'Medical Questionnaire completed'
            );

          }

          else if (
            bankNextPage === 'UPLOAD_DOCUMENTS'
          ) {

            logger.info(
              'Medical Questionnaire page skipped'
            );

          }

          else {

            throw new Error(
              `Unexpected page after Bank Account Details: ` +
              `"${bankNextPage}".`
            );

          }


          // ====================================================
          // STEP 17: UPLOAD DOCUMENT DETAILS
          // ====================================================

          logger.step(
            17,
            'Completing Upload Document Details'
          );

          const insureFor =
            String(
              basicData.InsureFor || ''
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


          // ====================================================
          // STEP 18: PROPOSAL SUMMARY
          // ====================================================

          logger.step(
            18,
            'Completing Proposal Summary'
          );

          const proposalResult =
            await proposalSummaryPage
              .completeProposalSummary(
                tcId
              );

          generatedProposalNumber =
            String(
              proposalResult
                ?.proposalNumber ||
              ''
            ).trim();

          logger.success(
            `Saved Proposal Number: ` +
            `${generatedProposalNumber}`
          );


          // ====================================================
          // TEST PASS
          // ====================================================

          testStatus = 'PASS';

          logger.info(
            '================================'
          );

          logger.success(
            `NSLP test completed successfully: ${tcId}`
          );

          logger.info(
            '================================'
          );

        }


        // ====================================================
        // ERROR HANDLING
        // ====================================================

        catch (error) {

          testStatus = 'FAIL';

          testErrorMessage =
            error?.stack ||
            error?.message ||
            String(error);

          logger.error(
            `NSLP test failed: ${tcId}`
          );

          logger.error(
            testErrorMessage
          );

          throw error;

        }


        // ====================================================
        // FINALLY - SAVE EXECUTION RESULT
        // ====================================================

        finally {

          const executionTimeMs =
            Date.now() - startTime;

          const executionTimeSeconds =
            (
              executionTimeMs / 1000
            ).toFixed(2);

          const executionTimeMinutes =
            (
              executionTimeMs / 60000
            ).toFixed(2);

          logger.info(
            `Execution Time: ` +
            `${executionTimeSeconds} seconds ` +
            `(${executionTimeMinutes} minutes)`
          );

          logger.info(
            `Log File: ` +
            `${logger.getLogFilePath()}`
          );

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

          }

          catch (excelError) {

            logger.error(
              `Unable to save Excel result: ` +
              `${excelError?.message || excelError}`
            );

          }

        }

      }

    );

  }

);