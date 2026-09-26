const {
  expect
} = require('@playwright/test');


class MedicalQuestionnairePage {

  constructor(page) {

    this.page =
      page;


    // ============================================================
    // MEDICAL QUESTIONNAIRE LOCATORS
    // ============================================================


    // ============================================================
    // 1. HOSPITALIZATION
    // ============================================================

    this.hospitalizationCheckbox =
      page.locator(
        '#chkbxHospitalization'
      );

    this.hospitalizationDescription =
      page.locator(
        '#txtarHospitalization'
      );


    // ============================================================
    // 2. MEDICAL LEAVE
    // ============================================================

    this.medicalLeaveCheckbox =
      page.locator(
        '#chkbxMedLeave'
      );

    this.medicalLeaveDescription =
      page.locator(
        '#txtarMedLeave'
      );


    // ============================================================
    // 3. ACCIDENT
    // ============================================================

    this.accidentCheckbox =
      page.locator(
        '#chkbxAccident'
      );

    this.accidentDescription =
      page.locator(
        '#txtarAccident'
      );


    // ============================================================
    // 4. HEART / STOMACH / LUNGS / LIVER / KIDNEY ETC.
    // ============================================================

    this.heartAilmentCheckbox =
      page.locator(
        '#chkHeart'
      );

    this.heartAilmentDescription =
      page.locator(
        '#txtarHeart'
      );


    // ============================================================
    // 5. HEPATITIS / HIV / AIDS
    // ============================================================

    this.hivAidsCheckbox =
      page.locator(
        '#chkHivAids'
      );

    this.hivAidsDescription =
      page.locator(
        '#txtarHivAids'
      );


    // ============================================================
    // 6. RESPIRATORY DISORDER
    // ============================================================

    this.respiratoryDisorderCheckbox =
      page.locator(
        '#chkbxRespiratoryDis'
      );

    this.respiratoryDisorderDescription =
      page.locator(
        '#txtarRespiratoryDis'
      );


    // ============================================================
    // 7. DISEASE
    // Diabetes / BP / Stroke / Epilepsy / Cancer etc.
    // ============================================================

    this.diseaseCheckbox =
      page.locator(
        '#chkbxDiabetes'
      );

    this.diseaseDescription =
      page.locator(
        '#txtarDiabetes'
      );


    // ============================================================
    // 8. BLOOD DISORDER
    // ============================================================

    this.bloodDisorderCheckbox =
      page.locator(
        '#chkbxBloodDis'
      );

    this.bloodDisorderDescription =
      page.locator(
        '#txtarBloodDis'
      );


    // ============================================================
    // 9. OTHER AILMENT
    // ============================================================

    this.otherAilmentCheckbox =
      page.locator(
        '#chkbxAnyAilment'
      );

    this.otherAilmentDescription =
      page.locator(
        '#txtarAnyAilment'
      );


    // ============================================================
    // 10. EYE / EAR / NOSE / THROAT
    // ============================================================

    this.entDisorderCheckbox =
      page.locator(
        '#chkbxEarDis'
      );

    this.entDisorderDescription =
      page.locator(
        '#txtarEarDis'
      );


    // ============================================================
    // 11. ADVENTURE ACTIVITIES
    // ============================================================

    this.adventureActivitiesCheckbox =
      page.locator(
        '#chkbxAdv'
      );

    this.adventureActivityDescription =
      page.locator(
        '#txtarAdv'
      );


    // ============================================================
    // 12. CRIMINAL CASE
    // ============================================================

    this.criminalCaseCheckbox =
      page.locator(
        '#chkbxConviction'
      );

    this.criminalCaseDescription =
      page.locator(
        '#txtarConviction'
      );


    // ============================================================
    // 13. INSURANCE REJECTED
    // ============================================================

    this.insuranceRejectedCheckbox =
      page.locator(
        '#chkbxRejection'
      );

    this.rejectedPolicyName =
      page.locator(
        '#polNameRej'
      );

    this.rejectedCompanyName =
      page.locator(
        '#CompNameRej'
      );

    this.rejectedSumAssured =
      page.locator(
        '#SARejection'
      );


    // ============================================================
    // 14. EXISTING LIFE INSURANCE
    // ============================================================

    this.existingLifeInsuranceCheckbox =
      page.locator(
        '#chkbxExistingPol'
      );

    this.existingPolicyName =
      page.locator(
        '#polNameExt'
      );

    this.existingCompanyName =
      page.locator(
        '#CompNameExt'
      );

    this.existingSumAssured =
      page.locator(
        '#SAExisting'
      );

    this.existingPolicyIssueDate =
      page.locator(
        '#txtbxPolIssuedDate'
      );

    this.existingPolicyStatus =
      page.locator(
        '#PolStatusExisting'
      );


    // ============================================================
    // FAMILY HISTORY
    // ============================================================

    /*
     * Existing Family Member 1 field.
     * Used as one of the Medical Questionnaire page markers.
     */
    this.familyMember1Name =
      page.locator(
        '#txtFM1Name'
      );


    // ============================================================
    // CONTINUE
    // ============================================================

    this.continueButton =
      page.locator(
        '#btnContinue'
      );


    // ============================================================
    // LOADING OVERLAY
    // ============================================================

    this.loadingOverlay =
      page.locator(
        '#loading2'
      );
  }


  // ============================================================
  // NORMALIZE TEXT
  // ============================================================

  normalizeText(value) {

    return String(
      value || ''
    )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()
      .toLowerCase();
  }


  // ============================================================
  // GET REQUIRED VALUE
  // Used by Family History
  // ============================================================

  getRequiredValue(
    row,
    columnName,
    sheetName
  ) {

    const value =
      String(
        row?.[columnName] ?? ''
      ).trim();


    if (!value) {

      throw new Error(
        `${columnName} is missing in ` +
        `the ${sheetName} sheet.`
      );
    }


    return value;
  }


  // ============================================================
  // GET OPTIONAL VALUE
  // ============================================================

  getOptionalValue(
    row,
    columnName
  ) {

    return String(
      row?.[columnName] ?? ''
    ).trim();
  }


  // ============================================================
  // WAIT FOR LOADING
  // ============================================================

  async waitForLoadingToComplete() {

    const overlayVisible =
      await this.loadingOverlay
        .isVisible()
        .catch(
          () => false
        );


    if (
      overlayVisible
    ) {

      console.log(
        'Waiting for loading overlay...'
      );


      await this.loadingOverlay
        .waitFor({
          state: 'hidden',
          timeout: 120000
        });
    }
  }


  // ============================================================
  // WAIT FOR PAGE
  // ============================================================

  async waitForPage() {

    console.log(
      'Waiting for SP Medical Questionnaire page...'
    );


    await expect(
      this.hospitalizationCheckbox
    ).toBeAttached({
      timeout: 120000
    });


    await expect(
      this.familyMember1Name
    ).toBeVisible({
      timeout: 120000
    });


    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 120000
    });


    await expect(
      this.continueButton
    ).toBeEnabled({
      timeout: 120000
    });


    await this.waitForLoadingToComplete();


    console.log(
      'SP Medical Questionnaire page loaded.'
    );
  }


  // ============================================================
  // YES / NO HELPER
  // ============================================================

  async setYesNo(
    checkboxLocator,
    value,
    fieldName
  ) {

    const answer =
      String(
        value ?? ''
      )
        .trim()
        .toUpperCase();


    if (
      answer !== 'YES' &&
      answer !== 'NO'
    ) {

      throw new Error(
        `${fieldName} must contain YES or NO ` +
        `in MedicalQuestionnaire Excel sheet. ` +
        `Received: "${value}".`
      );
    }


    await expect(
      checkboxLocator
    ).toBeAttached({
      timeout: 30000
    });


    const shouldBeChecked =
      answer === 'YES';


    const currentlyChecked =
      await checkboxLocator
        .isChecked()
        .catch(
          () => false
        );


    console.log(
      `${fieldName} current value: ` +
      `${currentlyChecked ? 'YES' : 'NO'}`
    );


    if (
      currentlyChecked !==
      shouldBeChecked
    ) {

      /*
       * Checkbox itself is hidden.
       * Application uses visible custom slider.
       */
      const slider =
        checkboxLocator
          .locator(
            'xpath=..'
          )
          .locator(
            '.slider1'
          );


      await expect(
        slider
      ).toBeVisible({
        timeout: 30000
      });


      console.log(
        `Changing ${fieldName} to ${answer}...`
      );


      await slider.click();


      /*
       * Small delay for dependent controls
       * to appear after switch selection.
       */
      await this.page.waitForTimeout(
        300
      );
    }


    if (
      shouldBeChecked
    ) {

      await expect(
        checkboxLocator
      ).toBeChecked({
        timeout: 10000
      });

    } else {

      await expect(
        checkboxLocator
      ).not.toBeChecked({
        timeout: 10000
      });
    }


    console.log(
      `${fieldName} selected: ${answer}`
    );


    return shouldBeChecked;
  }


  // ============================================================
  // FILL REQUIRED MEDICAL FIELD
  // ============================================================

  async fillRequiredMedicalField(
    locator,
    value,
    fieldName
  ) {

    const expectedValue =
      String(
        value ?? ''
      ).trim();


    if (
      !expectedValue
    ) {

      throw new Error(
        `${fieldName} is required because ` +
        'the related Medical Questionnaire answer is YES.'
      );
    }


    await expect(
      locator
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      locator
    ).toBeEnabled({
      timeout: 30000
    });


    const tagName =
      await locator.evaluate(
        element =>
          element.tagName
            .toLowerCase()
      );


    /*
     * Support both input and select controls.
     */
    if (
      tagName ===
      'select'
    ) {

      const options =
        await locator
          .locator(
            'option'
          )
          .allTextContents();


      const matchingOption =
        options.find(
          option =>
            this.normalizeText(
              option
            ) ===
            this.normalizeText(
              expectedValue
            )
        );


      if (
        matchingOption
      ) {

        await locator.selectOption({
          label:
            matchingOption
        });

      } else {

        await locator.selectOption(
          expectedValue
        );
      }

    } else {

      await expect(
        locator
      ).toBeEditable({
        timeout: 30000
      });


      await locator.fill(
        expectedValue
      );
    }


    console.log(
      `${fieldName} entered: "${expectedValue}"`
    );
  }


  // ============================================================
  // POLICY ISSUED DATE
  // ============================================================

  async fillPolicyIssuedDate(
    value
  ) {

    const enteredValue =
      String(
        value ?? ''
      ).trim();


    if (
      !enteredValue
    ) {

      throw new Error(
        'ExistingPolicyIssueDate is required ' +
        'because ExistingLifeInsurance = YES.'
      );
    }


    await expect(
      this.existingPolicyIssueDate
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      this.existingPolicyIssueDate
    ).toBeEditable({
      timeout: 30000
    });


    const inputType =
      String(
        await this.existingPolicyIssueDate
          .getAttribute(
            'type'
          ) || ''
      )
        .trim()
        .toLowerCase();


    let valueToEnter =
      enteredValue;


    /*
     * If HTML input type=date,
     * Playwright expects YYYY-MM-DD.
     *
     * Excel:
     * 10/05/2020
     *
     * becomes:
     * 2020-05-10
     */
    if (
      inputType ===
      'date'
    ) {

      const dateMatch =
        enteredValue.match(
          /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/
        );


      if (
        !dateMatch
      ) {

        throw new Error(
          `Invalid ExistingPolicyIssueDate: ` +
          `"${enteredValue}". ` +
          'Use DD/MM/YYYY.'
        );
      }


      valueToEnter =
        `${dateMatch[3]}-` +
        `${dateMatch[2]}-` +
        `${dateMatch[1]}`;
    }


    await this.existingPolicyIssueDate
      .fill(
        valueToEnter
      );


    console.log(
      `Existing Policy Issue Date entered: ` +
      `${enteredValue}`
    );
  }


  // ============================================================
  // FILL MEDICAL QUESTIONS
  // ============================================================

  async fillMedicalQuestions(
    data
  ) {

    console.log(
      '===== Filling SP Medical Questions ====='
    );


    if (
      !data
    ) {

      throw new Error(
        'MedicalQuestionnaire Excel data is undefined.'
      );
    }


    console.log(
      'Medical Questionnaire Excel data:',
      data
    );


    // ==========================================================
    // 1. HOSPITALIZED
    // Excel:
    // Hospitalized
    // HospitalizedDescription
    // ==========================================================

    const hospitalizedYes =
      await this.setYesNo(
        this.hospitalizationCheckbox,
        data.Hospitalized,
        'Hospitalized'
      );


    if (
      hospitalizedYes
    ) {

      await this.fillRequiredMedicalField(
        this.hospitalizationDescription,
        data.HospitalizedDescription,
        'Hospitalized Description'
      );
    }


    // ==========================================================
    // 2. MEDICAL LEAVE
    // ==========================================================

    const medicalLeaveYes =
      await this.setYesNo(
        this.medicalLeaveCheckbox,
        data.MedicalLeave,
        'Medical Leave'
      );


    if (
      medicalLeaveYes
    ) {

      await this.fillRequiredMedicalField(
        this.medicalLeaveDescription,
        data.MedicalLeaveDescription,
        'Medical Leave Description'
      );
    }


    // ==========================================================
    // 3. ACCIDENT
    // ==========================================================

    const accidentYes =
      await this.setYesNo(
        this.accidentCheckbox,
        data.Accident,
        'Accident'
      );


    if (
      accidentYes
    ) {

      await this.fillRequiredMedicalField(
        this.accidentDescription,
        data.AccidentDescription,
        'Accident Description'
      );
    }


    // ==========================================================
    // 4. HEART AILMENT
    // ==========================================================

    const heartAilmentYes =
      await this.setYesNo(
        this.heartAilmentCheckbox,
        data.HeartAilment,
        'Heart Ailment'
      );


    if (
      heartAilmentYes
    ) {

      await this.fillRequiredMedicalField(
        this.heartAilmentDescription,
        data.HeartAilmentDescription,
        'Heart Ailment Description'
      );
    }


    // ==========================================================
    // 5. HIV / AIDS
    // ==========================================================

    const hivAidsYes =
      await this.setYesNo(
        this.hivAidsCheckbox,
        data.HivAids,
        'HIV / AIDS'
      );


    if (
      hivAidsYes
    ) {

      await this.fillRequiredMedicalField(
        this.hivAidsDescription,
        data.HivAidsDescription,
        'HIV / AIDS Description'
      );
    }


    // ==========================================================
    // 6. RESPIRATORY DISORDER
    // ==========================================================

    const respiratoryYes =
      await this.setYesNo(
        this.respiratoryDisorderCheckbox,
        data.RespiratoryDisorder,
        'Respiratory Disorder'
      );


    if (
      respiratoryYes
    ) {

      await this.fillRequiredMedicalField(
        this.respiratoryDisorderDescription,
        data.RespiratoryDisorderDescription,
        'Respiratory Disorder Description'
      );
    }


    // ==========================================================
    // 7. DISEASE
    //
    // IMPORTANT:
    // Your Excel column is "Disease"
    // not "Diabetes".
    // ==========================================================

    const diseaseYes =
      await this.setYesNo(
        this.diseaseCheckbox,
        data.Disease,
        'Disease'
      );


    if (
      diseaseYes
    ) {

      await this.fillRequiredMedicalField(
        this.diseaseDescription,
        data.DiseaseDescription,
        'Disease Description'
      );
    }


    // ==========================================================
    // 8. BLOOD DISORDER
    // ==========================================================

    const bloodDisorderYes =
      await this.setYesNo(
        this.bloodDisorderCheckbox,
        data.BloodDisorder,
        'Blood Disorder'
      );


    if (
      bloodDisorderYes
    ) {

      await this.fillRequiredMedicalField(
        this.bloodDisorderDescription,
        data.BloodDisorderDescription,
        'Blood Disorder Description'
      );
    }


    // ==========================================================
    // 9. OTHER AILMENT
    // ==========================================================

    const otherAilmentYes =
      await this.setYesNo(
        this.otherAilmentCheckbox,
        data.OtherAilment,
        'Other Ailment'
      );


    if (
      otherAilmentYes
    ) {

      await this.fillRequiredMedicalField(
        this.otherAilmentDescription,
        data.OtherAilmentDescription,
        'Other Ailment Description'
      );
    }


    // ==========================================================
    // 10. ENT DISORDER
    // ==========================================================

    const entDisorderYes =
      await this.setYesNo(
        this.entDisorderCheckbox,
        data.ENTDisorder,
        'ENT Disorder'
      );


    if (
      entDisorderYes
    ) {

      await this.fillRequiredMedicalField(
        this.entDisorderDescription,
        data.ENTDisorderDescription,
        'ENT Disorder Description'
      );
    }


    // ==========================================================
    // 11. ADVENTURE ACTIVITIES
    //
    // Excel:
    // AdventureActivities
    // AdventureActivityDescription
    // ==========================================================

    const adventureYes =
      await this.setYesNo(
        this.adventureActivitiesCheckbox,
        data.AdventureActivities,
        'Adventure Activities'
      );


    if (
      adventureYes
    ) {

      await this.fillRequiredMedicalField(
        this.adventureActivityDescription,
        data.AdventureActivityDescription,
        'Adventure Activity Description'
      );
    }


    // ==========================================================
    // 12. CRIMINAL CASE
    // ==========================================================

    const criminalCaseYes =
      await this.setYesNo(
        this.criminalCaseCheckbox,
        data.CriminalCase,
        'Criminal Case'
      );


    if (
      criminalCaseYes
    ) {

      await this.fillRequiredMedicalField(
        this.criminalCaseDescription,
        data.CriminalCaseDescription,
        'Criminal Case Description'
      );
    }


    // ==========================================================
    // 13. INSURANCE REJECTED
    // ==========================================================

    const insuranceRejectedYes =
      await this.setYesNo(
        this.insuranceRejectedCheckbox,
        data.InsuranceRejected,
        'Insurance Rejected'
      );


    if (
      insuranceRejectedYes
    ) {

      await this.fillRequiredMedicalField(
        this.rejectedPolicyName,
        data.RejectedPolicyName,
        'Rejected Policy Name'
      );


      await this.fillRequiredMedicalField(
        this.rejectedCompanyName,
        data.RejectedCompanyName,
        'Rejected Company Name'
      );


      await this.fillRequiredMedicalField(
        this.rejectedSumAssured,
        data.RejectedSumAssured,
        'Rejected Sum Assured'
      );
    }


    // ==========================================================
    // 14. EXISTING LIFE INSURANCE
    // ==========================================================

    const existingLifeInsuranceYes =
      await this.setYesNo(
        this.existingLifeInsuranceCheckbox,
        data.ExistingLifeInsurance,
        'Existing Life Insurance'
      );


    if (
      existingLifeInsuranceYes
    ) {

      await this.fillRequiredMedicalField(
        this.existingPolicyName,
        data.ExistingPolicyName,
        'Existing Policy Name'
      );


      await this.fillRequiredMedicalField(
        this.existingCompanyName,
        data.ExistingCompanyName,
        'Existing Company Name'
      );


      await this.fillRequiredMedicalField(
        this.existingSumAssured,
        data.ExistingSumAssured,
        'Existing Sum Assured'
      );


      await this.fillPolicyIssuedDate(
        data.ExistingPolicyIssueDate
      );


      await this.fillRequiredMedicalField(
        this.existingPolicyStatus,
        data.ExistingPolicyStatus,
        'Existing Policy Status'
      );
    }


    console.log(
      'SP Medical Yes/No Questions completed successfully.'
    );
  }


  // ============================================================
  // EXISTING FAMILY HISTORY LOCATOR GENERATOR
  // ============================================================

  getFamilyMemberLocators(
    memberNumber
  ) {

    return {

      fullName:
        this.page.locator(
          `#txtFM${memberNumber}Name`
        ),

      status:
        this.page.locator(
          `#selFM${memberNumber}Status`
        ),

      age:
        this.page.locator(
          `#txtFM${memberNumber}Age`
        ),

      healthStatus:
        this.page.locator(
          `#txtFM${memberNumber}HealthStatus`
        ),

      dateOfDeath:
        this.page.locator(
          `#txtFM${memberNumber}DeathDt`
        ),

      reasonOfDeath:
        this.page.locator(
          `#txtFM${memberNumber}DthReason`
        )
    };
  }


  // ============================================================
  // EXISTING FAMILY HISTORY TEXT FILL
  // ============================================================

  async fillAndVerify(
    locator,
    value,
    fieldName
  ) {

    const expectedValue =
      String(
        value || ''
      ).trim();


    if (
      !expectedValue
    ) {

      throw new Error(
        `${fieldName} is missing in Excel.`
      );
    }


    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      locator
    ).toBeEditable({
      timeout: 60000
    });


    await locator.fill(
      ''
    );


    await locator.fill(
      expectedValue
    );


    await locator.press(
      'Tab'
    );


    await expect(
      locator
    ).toHaveValue(
      expectedValue,
      {
        timeout: 30000
      }
    );


    console.log(
      `${fieldName} entered: ` +
      `${expectedValue}`
    );
  }


  // ============================================================
  // FAMILY MEMBER STATUS
  // ============================================================

  async selectStatus(
    locator,
    status,
    memberNumber
  ) {

    let expectedStatus =
      String(
        status || ''
      ).trim();


    /*
     * Excel may contain Died,
     * while application displays Dead.
     */
    if (
      this.normalizeText(
        expectedStatus
      ) ===
      'died'
    ) {

      expectedStatus =
        'Dead';
    }


    if (
      ![
        'alive',
        'dead'
      ].includes(
        this.normalizeText(
          expectedStatus
        )
      )
    ) {

      throw new Error(
        `Invalid Status for Family Member ` +
        `${memberNumber}: "${status}". ` +
        'Use Alive or Dead.'
      );
    }


    await expect(
      locator
    ).toBeVisible({
      timeout: 60000
    });


    await expect(
      locator
    ).toBeEnabled({
      timeout: 60000
    });


    const availableOptions =
      await locator
        .locator(
          'option'
        )
        .allTextContents()
        .then(
          options => {

            return options.map(
              option => {

                return String(
                  option || ''
                )
                  .replace(
                    /\s+/g,
                    ' '
                  )
                  .trim();
              }
            );
          }
        );


    console.log(
      `Family Member ${memberNumber} ` +
      'Status available options:',
      availableOptions
    );


    const matchingOption =
      availableOptions.find(
        option => {

          return (
            this.normalizeText(
              option
            ) ===
            this.normalizeText(
              expectedStatus
            )
          );
        }
      );


    if (
      !matchingOption
    ) {

      throw new Error(
        `Status "${expectedStatus}" was not found ` +
        `for Family Member ${memberNumber}.`
      );
    }


    await locator.selectOption({
      label:
        matchingOption
    });


    await expect.poll(
      async () => {

        return String(
          await locator
            .locator(
              'option:checked'
            )
            .textContent()
            .catch(
              () => ''
            )
        )
          .replace(
            /\s+/g,
            ' '
          )
          .trim();
      },
      {
        timeout: 30000
      }
    ).toBe(
      matchingOption
    );


    console.log(
      `Family Member ${memberNumber} ` +
      `Status selected: ${matchingOption}`
    );


    await this.waitForLoadingToComplete();


    return this.normalizeText(
      matchingOption
    );
  }


  // ============================================================
  // FAMILY MEMBER DATE OF DEATH
  // ============================================================

  async enterDateOfDeath(
  locator,
  dateOfDeath,
  memberNumber
) {

  const value =
    String(
      dateOfDeath || ''
    )
      .trim();

  if (
    !value
  ) {

    throw new Error(
      `DateOfDeath is required for ` +
      `Family Member ${memberNumber} ` +
      'when Status is Dead.'
    );
  }


  /*
   * Required format:
   * DD/MM/YYYY
   *
   * Example:
   * 10/05/2020
   */
  if (
    !/^\d{2}\/\d{2}\/\d{4}$/.test(
      value
    )
  ) {

    throw new Error(
      `Invalid DateOfDeath for Family Member ` +
      `${memberNumber}: "${value}". ` +
      'Use DD/MM/YYYY format. Example: 10/05/2020'
    );
  }


  await expect(
    locator
  ).toBeVisible({
    timeout: 60000
  });


  await expect(
    locator
  ).toBeEditable({
    timeout: 60000
  });


  /*
   * Clear existing value.
   */
  await locator.fill('');


  /*
   * Enter date exactly as Excel:
   * 10/05/2020
   */
  await locator.fill(
    value
  );


  await locator.press(
    'Tab'
  );


  await expect(
    locator
  ).toHaveValue(
    value,
    {
      timeout: 30000
    }
  );


  console.log(
    `Family Member ${memberNumber} ` +
    `Date of Death entered: ${value}`
  );
}


  // ============================================================
  // FILL FAMILY MEMBER
  // ============================================================

  async fillFamilyMember(
    memberNumber,
    data,
    sheetName
  ) {

    console.log(
      `===== Filling Family Member ` +
      `${memberNumber} =====`
    );


    if (
      !data
    ) {

      throw new Error(
        `${sheetName} Excel data is undefined.`
      );
    }


    const fullName =
      this.getRequiredValue(
        data,
        'FullName',
        sheetName
      );


    const status =
      this.getRequiredValue(
        data,
        'Status',
        sheetName
      );


    const age =
      this.getRequiredValue(
        data,
        'Age',
        sheetName
      )
        .replace(
          /\.0$/,
          ''
        );


    const healthStatus =
      this.getOptionalValue(
        data,
        'HealthStatus'
      );


    const dateOfDeath =
      this.getOptionalValue(
        data,
        'DateOfDeath'
      );


    const reasonOfDeath =
      this.getOptionalValue(
        data,
        'ReasonOfDeath'
      );


    if (
      !/^\d{1,3}$/.test(
        age
      )
    ) {

      throw new Error(
        `Invalid Age for Family Member ` +
        `${memberNumber}: "${age}".`
      );
    }


    const locators =
      this.getFamilyMemberLocators(
        memberNumber
      );


    await expect(
      locators.fullName
    ).toBeVisible({
      timeout: 60000
    });


    await this.fillAndVerify(
      locators.fullName,
      fullName,
      `Family Member ${memberNumber} Full Name`
    );


    const selectedStatus =
      await this.selectStatus(
        locators.status,
        status,
        memberNumber
      );


    /*
     * Alive -> Age
     * Dead  -> Age at Death
     */
    await this.fillAndVerify(
      locators.age,
      age,
      selectedStatus ===
      'dead'
        ?
        `Family Member ${memberNumber} Age at Death`
        :
        `Family Member ${memberNumber} Age`
    );


    if (
      selectedStatus ===
      'alive'
    ) {

      if (
        !healthStatus
      ) {

        throw new Error(
          `HealthStatus is required for ` +
          `Family Member ${memberNumber} ` +
          'when Status is Alive.'
        );
      }


      await this.fillAndVerify(
        locators.healthStatus,
        healthStatus,
        `Family Member ${memberNumber} Health Status`
      );


      console.log(
        `Family Member ${memberNumber} ` +
        'Alive condition completed.'
      );

    } else {

      await this.enterDateOfDeath(
        locators.dateOfDeath,
        dateOfDeath,
        memberNumber
      );


      if (
        !reasonOfDeath
      ) {

        throw new Error(
          `ReasonOfDeath is required for ` +
          `Family Member ${memberNumber} ` +
          'when Status is Dead.'
        );
      }


      await this.fillAndVerify(
        locators.reasonOfDeath,
        reasonOfDeath,
        `Family Member ${memberNumber} Reason of Death`
      );


      console.log(
        `Family Member ${memberNumber} ` +
        'Dead condition completed.'
      );
    }


    console.log(
      `Family Member ${memberNumber} ` +
      'completed successfully.'
    );
  }


  // ============================================================
  // COMPLETE MEDICAL QUESTIONNAIRE
  // ============================================================

  async completeMedicalQuestionnaire({

    medicalQuestionnaireData,

    familyHistory1Data,

    familyHistory2Data

  }) {

    console.log(
      '===== Completing SP Medical Questionnaire ====='
    );


    await this.waitForPage();


    // ==========================================================
    // MEDICAL QUESTIONNAIRE YES / NO
    // ==========================================================

    await this.fillMedicalQuestions(
      medicalQuestionnaireData
    );


    // ==========================================================
    // FAMILY HISTORY 1
    // ==========================================================

    await this.fillFamilyMember(
      1,
      familyHistory1Data,
      'FamilyHistory1'
    );


    // ==========================================================
    // FAMILY HISTORY 2
    // ==========================================================

    await this.fillFamilyMember(
      2,
      familyHistory2Data,
      'FamilyHistory2'
    );


    // ==========================================================
    // CONTINUE
    // ==========================================================

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


    console.log(
      'Clicking Medical Questionnaire Continue...'
    );


    await this.continueButton
      .click();


    await this.waitForLoadingToComplete();


    console.log(
      'Medical Questionnaire Continue clicked.'
    );


    console.log(
      'SP Medical Questionnaire completed successfully.'
    );
  }
}


module.exports = MedicalQuestionnairePage;