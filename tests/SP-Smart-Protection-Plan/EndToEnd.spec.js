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
// SP SMART PROTECTION PLAN PAGE OBJECTS
// ============================================================

const {
  BasicDetailsPage,
} = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'BasicDetailsPage'
);

const {
  AccountSelectionPage,
} = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'AccountSelectionPage'
);

const PrePlanPersonalDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'PrePlanPersonalDetailsPage'
);

const HealthQuestionnairePage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'HealthQuestionnairePage'
);

const PlanDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'PlanDetailsPage'
);

const SummaryDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'SummaryDetailsPage'
);

const PaymentSuccessPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'PaymentSuccessPage'
);

const RegisterBankDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'RegisterBankDetailsPage'
);

const AadhaarValidationPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'AadhaarValidationPage'
);

const ENachSuccessPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'ENachSuccessPage'
);

const KYCSelectionPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'KYCSelectionPage'
);

const PersonalDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'PersonalDetails/PersonalDetails'
);

const BankAccountDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'BankAccountDetailsPage'
);

const MedicalQuestionnairePage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'MedicalQuestionnairePage'
);

const UploadDocumentDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'UploadDocumentDetailsPage'
);

const ProposerUploadDocumentDetailsPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
  'ProposerUploadDocumentDetailsPage'
);

const ProposalSummaryPage = require(
  '../../pages/SP-Smart-Protection-Plan/' +
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
// SP SMART PROTECTION PLAN EXCEL
// ============================================================

const filePath = path.join(
  __dirname,
  '../../test_data/SP-Smart-Protection-Plan/' +
  'SP-TestData.xlsx'
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
    String(
      tcId || ''
    )
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
// PART 2: READ ALL EXCEL SHEETS
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

const prePlanPersonalDetailsRows =
  readExcel(
    filePath,
    'PrePlanPersonalDetails'
  );

const healthQuestionnaireRows =
  readExcel(
    filePath,
    'HealthQuestionnaire'
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


const familyHistory1Rows =
  readExcel(
    filePath,
    'FamilyHistory1'
  );

const familyHistory2Rows =
  readExcel(
    filePath,
    'FamilyHistory2'
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
  'Selected SP SPP Test Cases:',
  selectedTestCases.map(
    row =>
      String(
        row.tc_id || ''
      ).trim()
  )
);


// ============================================================
// CREATE ONE TEST FOR EACH Run = YES ROW
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
          'SP-Smart-Protection-Plan';

        const logger =
          new Logger(
            tcId
          );

        const startTime =
          Date.now();

        let testStatus =
          'FAIL';

        let generatedProposalNumber =
          '';

        let testErrorMessage =
          '';

        try {

          logger.info(
            '================================'
          );

          logger.info(
            `Starting SP SPP test case: ${tcId}`
          );

          logger.info(
            '================================'
          );


          // ======================================================
          // GET CURRENT TEST CASE DATA
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

          const prePlanPersonalDetailsData =
            getTestDataById(
              prePlanPersonalDetailsRows,
              tcId,
              'PrePlanPersonalDetails'
            );


          // ======================================================
          // HEALTH QUESTIONNAIRE DATA
          // ======================================================

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
          
          const medicalQuestionnaireData =
            getTestDataById(
              medicalQuestionnaireRows,
              tcId,
              'MedicalQuestionnaire'
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


          // ======================================================
          // BASIC DATA COMPATIBILITY
          // ======================================================

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


          // ======================================================
          // LOG EXCEL DATA
          // ======================================================

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


          // ======================================================
          // ACCOUNT ACTION
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
            `SP SPP Account Action: ${accountAction}`
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

          const prePlanPersonalDetailsPage =
            new PrePlanPersonalDetailsPage(
              page
            );

          const healthQuestionnairePage =
            new HealthQuestionnairePage(
              page
            );

          const planDetailsPage =
            new PlanDetailsPage(
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
          // STEP 1: OPEN SP SMART PROTECTION PLAN
          // ======================================================

          logger.step(
            1,
            'Opening SP-Smart-Protection-Plan application'
          );

          await page.goto(
            'https://slicuata.shriramlife.in/' +
            'OnlineInsurance/Protection-Plans/' +
            'Shriram-Life-SP-Smart-Protection-Plan/' +
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
            'SP-Smart-Protection-Plan application opened'
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

          await verifyOtpButton
            .click();

          await expect(
            otpModal
          ).toBeHidden({
            timeout:
              60000,
          });

          logger.success(
            'OTP verification completed'
          );


          // ======================================================
          // STEP 4: ACCOUNT SELECTION
          // ======================================================

          logger.step(
            4,
            'Completing Account Selection'
          );

          const makeNewProposal =
            page.locator(
              '#newprpslbtn'
            );

          await expect(
            makeNewProposal
          ).toBeVisible({
            timeout:
              120000,
          });

          logger.info(
            'Account Selection page displayed'
          );

          logger.info(
            `Action from Excel: ${accountAction}`
          );

          await accountSelectionPage
            .handleSelection(
              accountAction
            );

          logger.success(
            'Account Selection completed'
          );


          // ======================================================
          // STEP 5: PRE-PLAN PERSONAL DETAILS
          // ======================================================

          logger.step(
            5,
            'Completing SP Pre-Plan Personal Details'
          );

          await prePlanPersonalDetailsPage
            .fillPersonalDetails(
              prePlanPersonalDetailsData
            );

          logger.success(
            'SP Pre-Plan Personal Details fields completed'
          );

          await prePlanPersonalDetailsPage
            .clickContinue();

          logger.success(
            'SP Pre-Plan Personal Details completed'
          );


          // ======================================================
          // STEP 6: HEALTH QUESTIONNAIRE
          // ======================================================

          logger.step(
            6,
            'Completing SP Health Questionnaire'
          );

          await healthQuestionnairePage
            .completeQuestionnaire(
              healthQuestionnaireData
            );

          await healthQuestionnairePage
            .clickContinue();

          logger.success(
            'SP Health Questionnaire completed'
          );


          // ======================================================
          // STEP 7: PLAN DETAILS
          // ======================================================

          logger.step(
            7,
            'Filling SP SPP Plan Details'
          );

          await planDetailsPage
            .waitForPage();

          logger.success(
            'SP Plan Details page displayed'
          );

          await planDetailsPage
            .fillPlanDetails(
              planData
            );

          logger.success(
            'SP Plan Details completed'
          );


          // ======================================================
          // STEP 8: BUY NOW AND BENEFIT PAYOUT
          // ======================================================

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
                    // ======================================================
          // SUMMARY DETAILS
          // ======================================================

          logger.info(
            'Completing Summary Details'
          );

          const autoDebitSelected =
            await summaryDetailsPage
              .completeSummaryDetails(
                basicData,
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
          // STEP 9: PAYMENT SUCCESS
          // ======================================================

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
            `Payment Next Flow: ` +
            `${paymentNextFlow}`
          );


          // ======================================================
          // STEPS 10–12: PAYMENT FLOW
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
            // STEP 10: REGISTER BANK DETAILS
            // ====================================================

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

            logger.info(
              `Aadhaar page URL: ` +
              `${aadhaarPage.url()}`
            );


            // ====================================================
            // STEP 11: AADHAAR VALIDATION
            // ====================================================

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


            // ====================================================
            // STEP 12: ENACH SUCCESS
            // ====================================================

            logger.step(
              12,
              'Completing eNACH Success page'
            );

            await eNachSuccessPage
              .completeSuccessPage();

            logger.success(
              'eNACH Success page completed'
            );

          } else if (
            paymentNextFlow ===
            'DIRECT_KYC'
          ) {

            const paymentType =
              String(
                planData.PaymentType ||
                planData['Payment Type'] ||
                ''
              ).trim();

            logger.info(
              `Non-Monthly Payment Type: ` +
              `${paymentType}`
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

          } else {

            throw new Error(
              `Unexpected Payment Success flow: ` +
              `"${paymentNextFlow}".`
            );
          }


          // ======================================================
          // STEP 13: KYC SELECTION
          // ======================================================

          logger.step(
            13,
            'Completing KYC Selection'
          );

          await kycSelectionPage
            .completeKYCSelection();

          logger.success(
            'KYC Selection completed'
          );


          // ======================================================
          // STEP 14: PERSONAL DETAILS
          // ======================================================

          logger.step(
            14,
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


          // ======================================================
          // STEP 15: BANK ACCOUNT DETAILS
          // ======================================================

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
            // ======================================================
            // STEP 16: MEDICAL QUESTIONNAIRE
            // ======================================================

            if (
              bankNextPage ===
              'QUESTIONNAIRE'
            ) {

              logger.step(
                16,
                'Completing Medical Questionnaire'
              );


              console.log(
                'Medical Questionnaire Excel data:',
                medicalQuestionnaireData
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

                  medicalQuestionnaireData,

                  familyHistory1Data,

                  familyHistory2Data

                });


              logger.success(
                'SP Medical Questionnaire completed'
              );

            } else if (
              bankNextPage ===
              'UPLOAD_DOCUMENTS'
            ) {

              logger.info(
                'Medical Questionnaire page skipped'
              );

              logger.info(
                'Upload Document Details page opened directly'
              );

            } else {

              throw new Error(
                `Unexpected page after Bank Account Details: ` +
                `"${bankNextPage}".`
              );
            }

          // ======================================================
          // STEP 17: UPLOAD DOCUMENT DETAILS
          // ======================================================

          logger.step(
            17,
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
          // STEP 18: PROPOSAL SUMMARY
          // ======================================================

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

          if (
            !generatedProposalNumber
          ) {

            throw new Error(
              'Proposal Number was not generated.'
            );
          }

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
            `SP SPP test completed successfully: ` +
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
            String(
              error
            );

          logger.error(
            `SP SPP test failed: ${tcId}`
          );

          logger.error(
            testErrorMessage
          );

          throw error;
        }
                // ========================================================
        // FINALLY
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