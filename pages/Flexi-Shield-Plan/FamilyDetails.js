const { expect } = require('@playwright/test');

class FamilyDetailsPage {

  constructor(page) {

    this.page = page;

    // =====================================================
    // FAMILY MEMBER 1
    // =====================================================

    this.fm1Name =
      page.locator('#txtFM1Name');

    this.fm1Status =
      page.locator('#selFM1Status');

    this.fm1Age =
      page.locator('#txtFM1Age');

    this.fm1HealthStatus =
      page.locator('#txtFM1HealthStatus');


    // =====================================================
    // FAMILY MEMBER 2
    // =====================================================

    this.fm2Name =
      page.locator('#txtFM2Name');

    this.fm2Status =
      page.locator('#selFM2Status');

    this.fm2Age =
      page.locator('#txtFM2Age');

    this.fm2HealthStatus =
      page.locator('#txtFM2HealthStatus');


    // =====================================================
    // FAMILY MEMBER 3
    // =====================================================

    this.fm3Name =
      page.locator('#txtFM3SpouseName');

    this.fm3Status =
      page.locator('#selFM3StatusSpouse');

    this.fm3Age =
      page.locator('#txtFM3AgeSpouse');

    this.fm3HealthStatus =
      page.locator('#txtFM3HealthStatusSpouse');


    // =====================================================
    // CONTINUE
    // =====================================================

    this.continueButton =
      page.locator('#btnContinue');

  }


  // =====================================================
  // WAIT FOR FAMILY DETAILS PAGE
  // =====================================================

  async waitForPage() {

    console.log(
      'Waiting for Family Details page...'
    );

    await expect(
      this.fm1Name
    ).toBeVisible({
      timeout: 120000
    });

    await expect(
      this.fm1Status
    ).toBeVisible({
      timeout: 60000
    });

    console.log(
      'Family Details page displayed.'
    );
  }


  // =====================================================
  // FILL FAMILY MEMBER 1
  // =====================================================

  async fillFamilyMember1(data) {

    console.log(
      'Filling Family Member 1...'
    );

    const name =
      String(
        data.FM1Name ??
        data.FamilyMember1Name ??
        ''
      ).trim();

    const status =
      String(
        data.FM1Status ??
        data.FamilyMember1Status ??
        ''
      ).trim();

    const age =
      String(
        data.FM1Age ??
        data.FamilyMember1Age ??
        ''
      ).trim();

    const healthStatus =
      String(
        data.FM1HealthStatus ??
        data.FamilyMember1HealthStatus ??
        ''
      ).trim();


    if (name) {

      await this.fm1Name.fill(name);

      console.log(
        `Family Member 1 Name: ${name}`
      );
    }


    if (status) {

      await this.selectStatus(
        this.fm1Status,
        status,
        'Family Member 1 Status'
      );
    }


    if (age) {

      await this.fm1Age.fill(age);

      console.log(
        `Family Member 1 Age: ${age}`
      );
    }


    if (healthStatus) {

      await this.fm1HealthStatus
        .fill(healthStatus);

      console.log(
        `Family Member 1 Health Status: ${healthStatus}`
      );
    }
  }


  // =====================================================
  // FILL FAMILY MEMBER 2
  // =====================================================

  async fillFamilyMember2(data) {

    console.log(
      'Filling Family Member 2...'
    );

    const name =
      String(
        data.FM2Name ??
        data.FamilyMember2Name ??
        ''
      ).trim();

    const status =
      String(
        data.FM2Status ??
        data.FamilyMember2Status ??
        ''
      ).trim();

    const age =
      String(
        data.FM2Age ??
        data.FamilyMember2Age ??
        ''
      ).trim();

    const healthStatus =
      String(
        data.FM2HealthStatus ??
        data.FamilyMember2HealthStatus ??
        ''
      ).trim();


    if (name) {

      await this.fm2Name.fill(name);

      console.log(
        `Family Member 2 Name: ${name}`
      );
    }


    if (status) {

      await this.selectStatus(
        this.fm2Status,
        status,
        'Family Member 2 Status'
      );
    }


    if (age) {

      await this.fm2Age.fill(age);

      console.log(
        `Family Member 2 Age: ${age}`
      );
    }


    if (healthStatus) {

      await this.fm2HealthStatus
        .fill(healthStatus);

      console.log(
        `Family Member 2 Health Status: ${healthStatus}`
      );
    }
  }


  // =====================================================
  // FILL FAMILY MEMBER 3
  // =====================================================

  async fillFamilyMember3(data) {

    console.log(
      'Filling Family Member 3...'
    );

    const name =
      String(
        data.FM3Name ??
        data.FamilyMember3Name ??
        ''
      ).trim();

    const status =
      String(
        data.FM3Status ??
        data.FamilyMember3Status ??
        ''
      ).trim();

    const age =
      String(
        data.FM3Age ??
        data.FamilyMember3Age ??
        ''
      ).trim();

    const healthStatus =
      String(
        data.FM3HealthStatus ??
        data.FamilyMember3HealthStatus ??
        ''
      ).trim();


    if (name) {

      await this.fm3Name.fill(name);

      console.log(
        `Family Member 3 Name: ${name}`
      );
    }


    if (status) {

      await this.selectStatus(
        this.fm3Status,
        status,
        'Family Member 3 Status'
      );
    }


    if (age) {

      await this.fm3Age.fill(age);

      console.log(
        `Family Member 3 Age: ${age}`
      );
    }


    if (healthStatus) {

      await this.fm3HealthStatus
        .fill(healthStatus);

      console.log(
        `Family Member 3 Health Status: ${healthStatus}`
      );
    }
  }


  // =====================================================
  // STATUS SELECTION
  // =====================================================

  async selectStatus(
    locator,
    value,
    fieldName
  ) {

    const status =
      String(value).trim();

    const normalized =
      status.toUpperCase();


    if (
      normalized === 'ALIVE'
    ) {

      await locator.selectOption({
        value: '901'
      });

    } else if (
      normalized === 'DEAD'
    ) {

      await locator.selectOption({
        value: '902'
      });

    } else if (
      status === '901' ||
      status === '902'
    ) {

      await locator.selectOption({
        value: status
      });

    } else {

      throw new Error(
        `${fieldName}: Invalid status "${value}". ` +
        `Expected Alive, Dead, 901 or 902.`
      );
    }


    const selectedText =
      await locator
        .locator('option:checked')
        .textContent();

    console.log(
      `${fieldName} selected: ${String(
        selectedText
      ).trim()}`
    );
  }


  // =====================================================
  // FILL ALL FAMILY DETAILS
  // =====================================================

  async fillFamilyDetails(data) {

    console.log(
      '===== Filling Family Details ====='
    );

    await this.fillFamilyMember1(
      data
    );

    await this.fillFamilyMember2(
      data
    );

    await this.fillFamilyMember3(
      data
    );

    console.log(
      'Family Details entered successfully.'
    );
  }


  // =====================================================
  // CONTINUE TO BANK ACCOUNT DETAILS
  // =====================================================

  async clickContinue() {

    console.log(
      'Clicking Family Details Continue button...'
    );

    await this.continueButton.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await this.continueButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.continueButton
    ).toBeEnabled({
      timeout: 30000
    });

    await this.continueButton.click();

    console.log(
      'Family Details Continue button clicked.'
    );
  }


  // =====================================================
  // COMPLETE FAMILY DETAILS
  // =====================================================

  async completeFamilyDetails(data) {

    await this.waitForPage();

    await this.fillFamilyDetails(
      data
    );

    await this.clickContinue();

    console.log(
      'Family Details completed successfully.'
    );
  }
}


module.exports = FamilyDetailsPage;