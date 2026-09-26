const {
  expect
} = require('@playwright/test');


class HealthQuestionnairePage {

  constructor(page) {

    this.page =
      page;


    // ============================================================
    // PAGE HEADING
    // ============================================================

    this.heading =
      page.getByText(
        'Questionnaire',
        {
          exact: true
        }
      );


    // ============================================================
    // 1. GOOD HEALTH
    // ============================================================

    this.goodHealthCheckbox =
      page.locator(
        '#chkbxGoodHealth'
      );

    this.goodHealthDescription =
      page.locator(
        '#txtarGoodHealth'
      );


    // ============================================================
    // 2. TOBACCO
    // ============================================================

    this.tobaccoCheckbox =
      page.locator(
        '#chkbxSmoke'
      );

    this.tobaccoType =
      page.locator(
        '#typeSmoke'
      );

    this.tobaccoQuantity =
      page.locator(
        '#QtySmoke'
      );


    // ============================================================
    // 3. ALCOHOL
    // ============================================================

    this.alcoholCheckbox =
      page.locator(
        '#chkbxAlcohol'
      );

    this.alcoholType =
      page.locator(
        '#typeAlcohol'
      );

    this.alcoholQuantity =
      page.locator(
        '#QtyAlcohol'
      );


    // ============================================================
    // 4. DEFORMITY
    // ============================================================

    this.deformityCheckbox =
      page.locator(
        '#chkbxDeformity'
      );

    this.deformityDescription =
      page.locator(
        '#txtarDeformity'
      );


    // ============================================================
    // 5. MAJOR HEALTH CONDITION
    // ============================================================

    this.majorHealthCheckbox =
      page.locator(
        '#chkHeartKidney'
      );

    this.majorHealthDescription =
      page.locator(
        '#txtarHeartKidney'
      );


    // ============================================================
    // 6. HARMFUL DRUGS
    // ============================================================

    this.harmfulDrugsCheckbox =
      page.locator(
        '#chkbxDrugs'
      );

    this.harmfulDrugsDescription =
      page.locator(
        '#txtarDrugsDiv'
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
      'Waiting for SP Health Questionnaire page...'
    );


    await expect(
      this.goodHealthCheckbox
    ).toBeAttached({
      timeout: 120000
    });


    await expect(
      this.continueButton
    ).toBeVisible({
      timeout: 120000
    });


    await this.waitForLoadingToComplete();


    console.log(
      'SP Health Questionnaire page loaded.'
    );
  }


  // ============================================================
  // NORMALIZE YES / NO VALUE
  // ============================================================

  normalizeYesNo(
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
        `${fieldName} must contain YES or NO in Excel. ` +
        `Received: "${value}".`
      );
    }


    return answer;
  }


  // ============================================================
  // SET CUSTOM SWITCH YES / NO
  // ============================================================

  async setYesNo(
    checkboxLocator,
    value,
    fieldName
  ) {

    const answer =
      this.normalizeYesNo(
        value,
        fieldName
      );


    await expect(
      checkboxLocator
    ).toBeAttached({
      timeout: 30000
    });


    const shouldBeChecked =
      answer === 'YES';


    const currentlyChecked =
      await checkboxLocator
        .isChecked();


    console.log(
      `${fieldName} current value: ` +
      `${currentlyChecked ? 'YES' : 'NO'}`
    );


    if (
      currentlyChecked !==
      shouldBeChecked
    ) {

      /*
       * Checkbox input is hidden because
       * application uses custom switch UI.
       *
       * Click visible slider instead.
       */
      const switchSlider =
        checkboxLocator
          .locator(
            'xpath=..'
          )
          .locator(
            '.slider1'
          );


      await expect(
        switchSlider
      ).toBeVisible({
        timeout: 30000
      });


      console.log(
        `Changing ${fieldName} to ${answer}...`
      );


      await switchSlider.click();


      /*
       * Allow UI dependent fields
       * to appear / disappear.
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
  // FILL REQUIRED TEXT FIELD
  // ============================================================

  async fillRequiredField(
    locator,
    value,
    fieldName
  ) {

    const enteredValue =
      String(
        value ?? ''
      ).trim();


    if (
      !enteredValue
    ) {

      throw new Error(
        `${fieldName} is required based on the selected answer.`
      );
    }


    await expect(
      locator
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      locator
    ).toBeEditable({
      timeout: 30000
    });


    await locator.fill(
      enteredValue
    );


    await expect(
      locator
    ).toHaveValue(
      enteredValue
    );


    console.log(
      `${fieldName} entered: "${enteredValue}"`
    );
  }


  // ============================================================
  // FILL TOBACCO DETAILS
  // ============================================================

  async fillTobaccoDetails(
    data
  ) {

    const tobaccoType =
      String(
        data.TobaccoType ?? ''
      ).trim();


    const tobaccoQuantity =
      String(
        data.TobaccoQuantity ?? ''
      ).trim();


    if (
      !tobaccoType
    ) {

      throw new Error(
        'TobaccoType is required because Tobacco = YES.'
      );
    }


    if (
      !tobaccoQuantity
    ) {

      throw new Error(
        'TobaccoQuantity is required because Tobacco = YES.'
      );
    }


    await expect(
      this.tobaccoType
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      this.tobaccoQuantity
    ).toBeVisible({
      timeout: 30000
    });


    await this.tobaccoType.fill(
      tobaccoType
    );


    await this.tobaccoQuantity.fill(
      tobaccoQuantity
    );


    await expect(
      this.tobaccoType
    ).toHaveValue(
      tobaccoType
    );


    await expect(
      this.tobaccoQuantity
    ).toHaveValue(
      tobaccoQuantity
    );


    console.log(
      `Tobacco Type entered: ${tobaccoType}`
    );


    console.log(
      `Tobacco Quantity entered: ${tobaccoQuantity}`
    );
  }


  // ============================================================
  // FILL ALCOHOL DETAILS
  // ============================================================

  async fillAlcoholDetails(
    data
  ) {

    const alcoholType =
      String(
        data.AlcoholType ?? ''
      ).trim();


    const alcoholQuantity =
      String(
        data.AlcoholQuantity ?? ''
      ).trim();


    if (
      !alcoholType
    ) {

      throw new Error(
        'AlcoholType is required because Alcohol = YES.'
      );
    }


    if (
      !alcoholQuantity
    ) {

      throw new Error(
        'AlcoholQuantity is required because Alcohol = YES.'
      );
    }


    await expect(
      this.alcoholType
    ).toBeVisible({
      timeout: 30000
    });


    await expect(
      this.alcoholQuantity
    ).toBeVisible({
      timeout: 30000
    });


    await this.alcoholType.fill(
      alcoholType
    );


    await this.alcoholQuantity.fill(
      alcoholQuantity
    );


    await expect(
      this.alcoholType
    ).toHaveValue(
      alcoholType
    );


    await expect(
      this.alcoholQuantity
    ).toHaveValue(
      alcoholQuantity
    );


    console.log(
      `Alcohol Type entered: ${alcoholType}`
    );


    console.log(
      `Alcohol Quantity entered: ${alcoholQuantity}`
    );
  }


  // ============================================================
  // COMPLETE HEALTH QUESTIONNAIRE
  // ============================================================

  async completeQuestionnaire(
    healthQuestionnaireData
  ) {

    console.log(
      '===== Completing SP Health Questionnaire ====='
    );


    if (
      !healthQuestionnaireData
    ) {

      throw new Error(
        'HealthQuestionnaire Excel data is missing.'
      );
    }


    await this.waitForPage();


    console.log(
      'Health Questionnaire Excel data:',
      healthQuestionnaireData
    );


    // ==========================================================
    // 1. GOOD HEALTH
    //
    // YES -> No Description
    // NO  -> Description required
    // ==========================================================

    const goodHealthYes =
      await this.setYesNo(
        this.goodHealthCheckbox,
        healthQuestionnaireData.GoodHealth,
        'Good Health'
      );


    if (
      !goodHealthYes
    ) {

      await this.fillRequiredField(
        this.goodHealthDescription,
        healthQuestionnaireData
          .GoodHealthDescription,
        'Good Health Description'
      );
    }


    // ==========================================================
    // 2. TOBACCO
    //
    // YES -> Type + Quantity
    // NO  -> Skip
    // ==========================================================

    const tobaccoYes =
      await this.setYesNo(
        this.tobaccoCheckbox,
        healthQuestionnaireData.Tobacco,
        'Tobacco'
      );


    if (
      tobaccoYes
    ) {

      await this.fillTobaccoDetails(
        healthQuestionnaireData
      );
    }


    // ==========================================================
    // 3. ALCOHOL
    //
    // YES -> Type + Quantity
    // NO  -> Skip
    // ==========================================================

    const alcoholYes =
      await this.setYesNo(
        this.alcoholCheckbox,
        healthQuestionnaireData.Alcohol,
        'Alcohol'
      );


    if (
      alcoholYes
    ) {

      await this.fillAlcoholDetails(
        healthQuestionnaireData
      );
    }


    // ==========================================================
    // 4. DEFORMITY
    //
    // YES -> Description
    // NO  -> Skip
    // ==========================================================

    const deformityYes =
      await this.setYesNo(
        this.deformityCheckbox,
        healthQuestionnaireData.Deformity,
        'Deformity'
      );


    if (
      deformityYes
    ) {

      await this.fillRequiredField(
        this.deformityDescription,
        healthQuestionnaireData
          .DeformityDescription,
        'Deformity Description'
      );
    }


    // ==========================================================
    // 5. MAJOR HEALTH CONDITION
    //
    // YES -> Description
    // NO  -> Skip
    // ==========================================================

    const majorHealthYes =
      await this.setYesNo(
        this.majorHealthCheckbox,
        healthQuestionnaireData
          .MajorHealthCondition,
        'Major Health Condition'
      );


    if (
      majorHealthYes
    ) {

      await this.fillRequiredField(
        this.majorHealthDescription,
        healthQuestionnaireData
          .MajorHealthConditionDescription,
        'Major Health Condition Description'
      );
    }


    // ==========================================================
    // 6. HARMFUL DRUGS
    //
    // YES -> Description
    // NO  -> Skip
    // ==========================================================

    const harmfulDrugsYes =
      await this.setYesNo(
        this.harmfulDrugsCheckbox,
        healthQuestionnaireData
          .HarmfulDrugs,
        'Harmful Drugs'
      );


    if (
      harmfulDrugsYes
    ) {

      await this.fillRequiredField(
        this.harmfulDrugsDescription,
        healthQuestionnaireData
          .HarmfulDrugsDescription,
        'Harmful Drugs Description'
      );
    }


    console.log(
      'SP Health Questionnaire completed successfully.'
    );
  }


  // ============================================================
  // CLICK CONTINUE
  // ============================================================

  async clickContinue() {

    console.log(
      'Clicking Questionnaire Continue...'
    );


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


    await this.continueButton.click();


    await this.waitForLoadingToComplete();


    /*
     * Confirm questionnaire page
     * closed after Continue.
     */
    await expect(
      this.heading
    ).toBeHidden({
      timeout: 120000
    });


    console.log(
      'Questionnaire Continue clicked successfully.'
    );
  }
}


module.exports =
  HealthQuestionnairePage;