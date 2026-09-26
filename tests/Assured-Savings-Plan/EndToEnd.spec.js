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
// ASSURED SAVINGS PLAN PAGE OBJECTS
// ============================================================

const {
  BasicDetailsPage,
} = require(
  '../../pages/Assured-Savings-Plan/BasicDetailsPage'
);

const {
  AccountSelectionPage,
} = require(
  '../../pages/Assured-Savings-Plan/AccountSelectionPage'
);

const { PlanDetailsPage } = require(
  '../../pages/Assured-Savings-Plan/PlanDetailsPage'
);

const SuitabilityAnalysisPage = require(
  '../../pages/Assured-Savings-Plan/SuitabilityAnalysisPage'
);

const SummaryDetailsPage = require(
  '../../pages/Assured-Savings-Plan/SummaryDetailsPage'
);

const PaymentSuccessPage = require(
  '../../pages/Assured-Savings-Plan/PaymentSuccessPage'
);

const RegisterBankDetailsPage = require(
  '../../pages/Assured-Savings-Plan/RegisterBankDetailsPage'
);

const AadhaarValidationPage = require(
  '../../pages/Assured-Savings-Plan/AadhaarValidationPage'
);

const ENachSuccessPage = require(
  '../../pages/Assured-Savings-Plan/ENachSuccessPage'
);

const KYCSelectionPage = require(
  '../../pages/Assured-Savings-Plan/KYCSelectionPage'
);

const PersonalDetailsPage = require(
  '../../pages/Assured-Savings-Plan/' +
  'PersonalDetails/PersonalDetails'
);

const BankAccountDetailsPage = require(
  '../../pages/Assured-Savings-Plan/' +
  'BankAccountDetailsPage'
);

const MedicalQuestionnairePage = require(
  '../../pages/Assured-Savings-Plan/' +
  'MedicalQuestionnairePage'
);

const UploadDocumentDetailsPage = require(
  '../../pages/Assured-Savings-Plan/' +
  'UploadDocumentDetailsPage'
);

const ProposerUploadDocumentDetailsPage = require(
  '../../pages/Assured-Savings-Plan/' +
  'ProposerUploadDocumentDetailsPage'
);

const ProposalSummaryPage = require(
  '../../pages/Assured-Savings-Plan/' +
  'ProposalSummaryPage'
);


// ============================================================
// TEST CONFIGURATION
// ============================================================

/*
 * Maximum time for complete End-to-End execution.
 */
test.setTimeout(
  10 * 60 * 1000
);


/*
 * Execute slowly in headed mode.
 */
test.use({
  launchOptions: {
    slowMo: 150,
  },
});


// ============================================================
// ASSURED SAVINGS PLAN EXCEL
// ============================================================

const filePath = path.join(
  __dirname,
  '../../test_data/Assured-Savings-Plan/ASP-TestData.xlsx'
);


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
      .trim()
      .toUpperCase();

  const row =
    sheetData.find(
      item =>
        String(
          item.tc_id || ''
        )
          .trim()
          .toUpperCase() ===
        requiredTcId
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
// PART 3: SELECT TEST CASES WHERE Run = YES
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
  'Selected ASP Test Cases:',
  selectedTestCases.map(
    row =>
      String(
        row.tc_id || ''
      ).trim()
  )
);


// ============================================================
// PART 4: CREATE ONE TEST FOR EACH Run = YES ROW
// ============================================================

selectedTestCases.forEach(
  selectedBasicData => {

    const tcId =
      String(
        selectedBasicData.tc_id || ''
      ).trim();

    if (!tcId) {
      throw new Error(
        'tc_id is empty for a row marked ' +
        'Run = YES in BasicDetails sheet.'
      );
    }


    test(
      `End to End Flow - ${tcId}`,

      async ({ page }) => {

        const projectName =
          process.env.PROJECT_NAME ||
          'Assured-Savings-Plan';

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

          // ======================================================
          // PART 5: GET CURRENT TEST CASE DATA
          // ======================================================

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


          // ======================================================
          // BASIC DATA COMPATIBILITY
          // ======================================================

          /*
           * ASP Excel headers:
           *
           * InsureFor
           * FullName
           * Mobile
           * Email
           * DOB
           * Income
           * Gender
           *
           * Some Personal/Summary page objects still use
           * old AI_ property names.
           */

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


          // ======================================================
          // LOG EXCEL DATA
          // ======================================================

          logger.info(
            '================================'
          );

          logger.info(
            `Starting ASP test case: ${tcId}`
          );

          logger.info(
            '================================'
          );


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


          // ======================================================
          // EXISTING ACCOUNT ACTION
          // ======================================================

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
              `Invalid FlowType: ` +
              `"${accountAction}". ` +
              'Use NEW or EXISTING.'
            );
          }


          logger.info(
            `ASP Account Action: ${accountAction}`
          );


          // ======================================================
          // CREATE PAGE OBJECTS
          // ======================================================

          const basicDetailsPage =
            new BasicDetailsPage(
              page
            );


          const accountSelectionPage =
            new AccountSelectionPage(
              page
            );


          const planDetailsPage =
            new PlanDetailsPage(
              page
            );


          const suitabilityAnalysisPage =
            new SuitabilityAnalysisPage(
              page
            );


          const summaryDetailsPage =
            new SummaryDetailsPage(
              page
            );


          const paymentSuccessPage =
            new PaymentSuccessPage(
              page
            );


          const registerBankDetailsPage =
            new RegisterBankDetailsPage(
              page
            );


          const eNachSuccessPage =
            new ENachSuccessPage(
              page
            );


          const kycSelectionPage =
            new KYCSelectionPage(
              page
            );


          const personalDetailsPage =
            new PersonalDetailsPage(
              page
            );


          const bankAccountDetailsPage =
            new BankAccountDetailsPage(
              page
            );


          const medicalQuestionnairePage =
            new MedicalQuestionnairePage(
              page
            );


          const uploadDocumentDetailsPage =
            new UploadDocumentDetailsPage(
              page
            );
                      const proposerUploadDocumentDetailsPage =
            new ProposerUploadDocumentDetailsPage(
              page
            );


          const proposalSummaryPage =
            new ProposalSummaryPage(
              page
            );


          // ======================================================
          // STEP 1: OPEN ASSURED SAVINGS PLAN
          // ======================================================

          logger.step(
            1,
            'Opening Assured Savings Plan application'
          );


          await page.goto(
            'https://slicuata.shriramlife.in/' +
            'OnlineInsurance/Savings-Plans/' +
            'Shriram-Life-Assured-Savings-Plan/' +
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
            'Assured Savings Plan application opened'
          );


          // ======================================================
          // STEP 2: BASIC DETAILS
          // ======================================================

          logger.step(
            2,
            'Filling Basic Details'
          );


          await basicDetailsPage
            .fillBasicDetails(
              basicData
            );


          logger.success(
            'Basic Details fields completed'
          );


          await basicDetailsPage
            .clickGetOtp();


          logger.success(
            'Get OTP clicked'
          );


          // ======================================================
          // STEP 3: MANUAL OTP
          // ======================================================

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
            timeout: 60000,
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
              timeout: 120000,
            }
          );


          await expect(
            otp2
          ).toHaveValue(
            /\d/,
            {
              timeout: 120000,
            }
          );


          await expect(
            otp3
          ).toHaveValue(
            /\d/,
            {
              timeout: 120000,
            }
          );


          await expect(
            otp4
          ).toHaveValue(
            /\d/,
            {
              timeout: 120000,
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
            timeout: 30000,
          });


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


          // ======================================================
          // STEP 4: ACCOUNT SELECTION / PLAN DETAILS
          // ======================================================

          logger.step(
            4,
            'Checking page after OTP verification'
          );


          const makeNewProposal =
            page.locator(
              '#newprpslbtn'
            );


          const aspPlanDetailsField =
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
                  () =>
                    'ACCOUNT_SELECTION'
                )
                .catch(
                  () =>
                    null
                ),


              aspPlanDetailsField
                .waitFor({
                  state: 'visible',
                  timeout: 60000,
                })
                .then(
                  () =>
                    'PLAN_DETAILS'
                )
                .catch(
                  () =>
                    null
                ),

            ]);


          if (!pageAfterOtp) {
            throw new Error(
              'Neither Account Selection page nor ' +
              'ASP Plan Details page was displayed.'
            );
          }


          if (
            pageAfterOtp ===
            'ACCOUNT_SELECTION'
          ) {

            logger.info(
              'Account Selection page displayed'
            );


            logger.info(
              `Action from Excel: ` +
              `${accountAction}`
            );


            await accountSelectionPage
              .handleSelection(
                accountAction
              );


            logger.success(
              'Account Selection completed'
            );

          } else {

            logger.info(
              'Account Selection page not displayed'
            );


            logger.info(
              'Continuing directly to Plan Details'
            );
          }


          await planDetailsPage
            .waitForPlanDetailsPage();


          logger.success(
            'Assured Savings Plan Details page displayed'
          );


          // ======================================================
          // STEP 5: PLAN DETAILS
          // ======================================================

          logger.step(
            5,
            'Filling Plan Details'
          );


          await planDetailsPage
            .fillPlanDetails(
              planData
            );


          logger.success(
            'Plan Details completed'
          );


          // ======================================================
          // STEP 6: SUITABILITY ANALYSIS / SUMMARY DETAILS
          // ======================================================

          logger.step(
            6,
            'Opening Suitability Analysis'
          );


          await planDetailsPage
            .clickSuitabilityAnalysis();


          logger.success(
            'Suitability Analysis opened'
          );


          await suitabilityAnalysisPage
            .completeSuitabilityAnalysis(
              planData
            );


          logger.success(
            'Suitability Analysis completed'
          );


          logger.info(
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
            `Auto Debit selected: ` +
            `${autoDebitSelected}`
          );


          // ======================================================
          // STEP 7: PAYMENT SUCCESS
          // ======================================================

          logger.step(
            7,
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
            `Payment Next Flow: ` +
            `${paymentNextFlow}`
          );


          // ======================================================
          // STEP 8 - 10
          //
          // MONTHLY:
          // Register Bank → Aadhaar → eNACH
          //
          // NON-MONTHLY:
          // Skip those pages
          // ======================================================

          if (
            paymentNextFlow ===
            'AUTO_PAY'
          ) {

            logger.info(
              'Monthly payment detected. ' +
              'Executing Auto Pay flow.'
            );


            // ====================================================
            // STEP 8: REGISTER BANK DETAILS
            // ====================================================

            logger.step(
              8,
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
              `Aadhaar page URL: ` +
              `${aadhaarPage.url()}`
            );
                        // ====================================================
            // STEP 9: AADHAAR VALIDATION
            // ====================================================

            logger.step(
              9,
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


            // ====================================================
            // STEP 10: ENACH SUCCESS
            // ====================================================

            logger.step(
              10,
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


          // ======================================================
          // STEP 11: KYC SELECTION
          // ======================================================

          logger.step(
            11,
            'Completing KYC Selection'
          );


          await kycSelectionPage
            .completeKYCSelection();


          logger.success(
            'KYC Selection completed'
          );


          // ======================================================
          // STEP 12: PERSONAL DETAILS
          // ======================================================

          logger.step(
            12,
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


          // ======================================================
          // STEP 13: BANK ACCOUNT DETAILS
          // ======================================================

          logger.step(
            13,
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


          // ======================================================
          // STEP 14: MEDICAL QUESTIONNAIRE
          // ======================================================

          if (
            bankNextPage ===
            'QUESTIONNAIRE'
          ) {

            logger.step(
              14,
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
            bankNextPage ===
            'UPLOAD_DOCUMENTS'
          ) {

            logger.info(
              'Medical Questionnaire page skipped'
            );


            logger.info(
              'Upload Document Details page opened directly'
            );

          }


          else {

            throw new Error(
              `Unexpected page after Bank Account Details: ` +
              `"${bankNextPage}".`
            );
          }


          // ======================================================
          // STEP 15: UPLOAD DOCUMENT DETAILS
          // ======================================================

          logger.step(
            15,
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

          } else {

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


          // ======================================================
          // STEP 16: PROPOSAL SUMMARY
          // ======================================================

          logger.step(
            16,
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


          // ======================================================
          // TEST PASS
          // ======================================================

          testStatus =
            'PASS';


          logger.info(
            '================================'
          );


          logger.success(
            `ASP test completed successfully: ` +
            `${tcId}`
          );


          logger.info(
            '================================'
          );

        }


        // ========================================================
        // ERROR HANDLING
        // ========================================================

        catch (error) {

          testStatus =
            'FAIL';


          testErrorMessage =
            error?.stack ||
            error?.message ||
            String(error);


          logger.error(
            `ASP test failed: ${tcId}`
          );


          logger.error(
            testErrorMessage
          );


          throw error;
        }


        // ========================================================
        // FINALLY - EXECUTION RESULT
        // ========================================================

        finally {

          const executionTimeMs =
            Date.now() -
            startTime;


          const executionTimeSeconds =
            (
              executionTimeMs /
              1000
            ).toFixed(
              2
            );


          const executionTimeMinutes =
            (
              executionTimeMs /
              60000
            ).toFixed(
              2
            );


          logger.info(
            `Execution Time: ` +
            `${executionTimeSeconds} seconds ` +
            `(${executionTimeMinutes} minutes)`
          );


          logger.info(
            `Log File: ` +
            `${logger.getLogFilePath()}`
          );


          // ======================================================
          // SAVE EXECUTION RESULT
          // ======================================================

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