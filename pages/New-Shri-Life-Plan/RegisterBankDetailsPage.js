const { expect } = require('@playwright/test');

class RegisterBankDetailsPage {
  constructor(page) {
    this.page = page;

    this.bankDropdown =
      page.locator('#selectBanks').first();

    this.accountNumber =
      page.locator('#newAccountNo').first();

    this.ifscCode =
      page.locator('#newIFSCCode').first();

    this.accountHolderName =
      page.locator('#newAccountHolderName').first();

    this.accountType =
      page.locator('#newAccountType').first();

    this.authenticateNow =
        page.getByRole('button', {
            name: /Authenticate Now/i,
        });
  }

  async waitForPage() {
    console.log(
      'Waiting for Register Bank Details popup...'
    );

    await expect(
      this.bankDropdown
    ).toBeVisible({
      timeout: 60000,
    });

    await expect(
      this.bankDropdown
    ).toBeEnabled({
      timeout: 30000,
    });

    console.log(
      'Register Bank Details popup loaded.'
    );
  }

  async selectBank(bankNameFromExcel) {
    const requiredBankName = String(
      bankNameFromExcel || ''
    )
      .trim()
      .toUpperCase();

    if (!requiredBankName) {
      throw new Error(
        'BankName is empty in BankDetails Excel sheet.'
      );
    }

    console.log(
      `Bank name from Excel: "${requiredBankName}"`
    );

    /*
     * Get all dropdown option labels.
     */
    const bankOptions =
      await this.bankDropdown
        .locator('option')
        .allTextContents();

    const cleanedOptions = bankOptions.map(
      option => option.trim()
    );

    console.log(
      `Total available banks: ${cleanedOptions.length}`
    );

    /*
     * Find the exact bank ignoring uppercase/lowercase.
     */
    const matchingBank = cleanedOptions.find(
      option =>
        option.toUpperCase() === requiredBankName
    );

    if (!matchingBank) {
      console.log(
        'First available bank options:',
        cleanedOptions.slice(0, 20)
      );

      throw new Error(
        `Bank "${bankNameFromExcel}" was not found ` +
        'in the bank dropdown.'
      );
    }

    console.log(
      `Selecting bank: "${matchingBank}"`
    );

    await this.bankDropdown.selectOption({
      label: matchingBank,
    });

    /*
     * Verify that the placeholder is no longer selected.
     */
    const selectedBank =
      await this.bankDropdown
        .locator('option:checked')
        .textContent();

    console.log(
      `Selected bank: "${selectedBank?.trim()}"`
    );

    if (
      !selectedBank ||
      selectedBank
        .trim()
        .toUpperCase() !== requiredBankName
    ) {
      throw new Error(
        `Bank selection failed. Selected value: ` +
        `"${selectedBank}"`
      );
    }

    /*
     * Allow the application to display the bank fields.
     */
    await this.page.waitForTimeout(1500);
  }

  async fillBankDetails(bankData) {
    if (!bankData) {
      throw new Error(
        'BankDetails Excel data was not found.'
      );
    }

    console.log(
      'Bank Details Excel data:',
      bankData
    );

    await this.waitForPage();

    const bankName = String(
      bankData.BankName || ''
    ).trim();

    const accountNumber = String(
      bankData.AccountNumber || ''
    ).trim();

    const ifscCode = String(
      bankData.IFSCCode || ''
    )
      .trim()
      .toUpperCase();

    const accountHolderName = String(
      bankData.AccountHolderName || ''
    ).trim();

    const accountType = String(
      bankData.AccountType || ''
    ).trim();

    /*
     * Select bank first.
     */
    await this.selectBank(bankName);

    /*
     * Wait for fields that appear after bank selection.
     */
    console.log(
      'Waiting for Account Number field...'
    );

    await expect(
      this.accountNumber
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.accountNumber
    ).toBeEditable({
      timeout: 30000,
    });

    console.log(
      `Entering Account Number: ${accountNumber}`
    );

    await this.accountNumber.fill(
      accountNumber
    );

    await expect(
      this.accountNumber
    ).toHaveValue(accountNumber);

    console.log(
      `Entering IFSC Code: ${ifscCode}`
    );

    await expect(
      this.ifscCode
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.ifscCode
    ).toBeEditable({
      timeout: 30000,
    });

    await this.ifscCode.click();

    await this.ifscCode.fill('');

    await this.ifscCode.pressSequentially(
      ifscCode,
      {
        delay: 100,
      }
    );

    await this.ifscCode.press('Tab');

    await expect(
      this.ifscCode
    ).toHaveValue(ifscCode);

    /*
     * Wait for IFSC validation to complete.
     */
    await this.page.waitForTimeout(2000);

    console.log(
      `Entering Account Holder Name: ` +
      `${accountHolderName}`
    );

    await expect(
      this.accountHolderName
    ).toBeVisible({
      timeout: 30000,
    });

    await expect(
      this.accountHolderName
    ).toBeEditable({
      timeout: 30000,
    });

    await this.accountHolderName.fill(
      accountHolderName
    );

    await expect(
      this.accountHolderName
    ).toHaveValue(accountHolderName);

    /*
     * Account Type may appear only after IFSC validation.
     */
    if (await this.accountType.isVisible()) {
      console.log(
        `Selecting Account Type: ${accountType}`
      );

      const accountTypeOptions =
        await this.accountType
          .locator('option')
          .allTextContents();

      const matchingAccountType =
        accountTypeOptions.find(
          option =>
            option.trim().toUpperCase() ===
            accountType.toUpperCase()
        );

      if (!matchingAccountType) {
        throw new Error(
          `Account Type "${accountType}" was not found. ` +
          `Available options: ${accountTypeOptions.join(', ')}`
        );
      }

      await this.accountType.selectOption({
        label: matchingAccountType.trim(),
      });
    } else {
      console.log(
        'Account Type dropdown is not displayed.'
      );
    }

    console.log(
      'All bank details entered successfully.'
    );
  }

  async clickAuthenticateNow() {
  console.log(
    'Waiting for Authenticate Now button...'
  );

  await expect(
    this.authenticateNow
  ).toBeVisible({
    timeout: 60000,
  });

  await expect(
    this.authenticateNow
  ).toBeEnabled({
    timeout: 30000,
  });

  await this.authenticateNow
    .scrollIntoViewIfNeeded();

  const currentPage = this.page;
  const oldUrl = currentPage.url();

  console.log(
    `URL before authentication: ${oldUrl}`
  );

  /*
   * Start watching for a new browser tab before clicking.
   */
  const newPagePromise = currentPage
    .context()
    .waitForEvent('page', {
      timeout: 15000,
    })
    .catch(() => null);

  await this.authenticateNow.click();

  console.log(
    'Authenticate Now button clicked.'
  );

  /*
   * Check whether authentication opened a new tab.
   */
  const newPage = await newPagePromise;

  if (newPage) {
    console.log(
      'Authentication page opened in a new tab.'
    );

    await newPage.waitForLoadState(
      'domcontentloaded',
      {
        timeout: 60000,
      }
    );

    console.log(
      `New tab URL: ${newPage.url()}`
    );

    await expect(
      newPage.getByText(
        /Aadhaar Validation|Aadhaar/i
      ).first()
    ).toBeVisible({
      timeout: 60000,
    });

    console.log(
      'Aadhaar Validation page loaded in new tab.'
    );

    return newPage;
  }

  /*
   * Otherwise wait for Aadhaar Validation
   * on the same browser page.
   */
  console.log(
    'No new tab opened. Checking same page...'
  );

  const aadhaarPageElement =
    currentPage.getByText(
      /Aadhaar Validation|Aadhaar/i
    ).first();

  await expect(
    aadhaarPageElement
  ).toBeVisible({
    timeout: 60000,
  });

  console.log(
    `URL after authentication: ${currentPage.url()}`
  );

  console.log(
    'Aadhaar Validation page loaded successfully.'
  );

  return currentPage;
}

  async completeRegisterBankDetails(bankData) {
  console.log(
    'Starting Register Bank Details flow...'
  );

  await this.fillBankDetails(bankData);

  console.log(
    'Bank fields completed.'
  );

  const aadhaarPage =
    await this.clickAuthenticateNow();

  console.log(
    'Authentication completed and Aadhaar page loaded.'
  );

  return aadhaarPage;
}

  async clickAuthenticateNow() {
  console.log(
    'Waiting for Authenticate Now button...'
  );

  await expect(
    this.authenticateNow
  ).toBeVisible({
    timeout: 60000,
  });

  await expect(
    this.authenticateNow
  ).toBeEnabled({
    timeout: 30000,
  });

  await this.authenticateNow
    .scrollIntoViewIfNeeded();

  const oldUrl = this.page.url();

  console.log(
    `URL before click: ${oldUrl}`
  );

  console.log(
    'Clicking Authenticate Now...'
  );

  await this.authenticateNow.click();

  console.log(
    'Authenticate Now clicked.'
  );

  await this.page.waitForURL(
    url =>
      url.href.includes(
        'esign.egov.proteantech.in'
      ),
    {
      timeout: 60000,
    }
  );

  console.log(
    `URL after click: ${this.page.url()}`
  );

  await expect(
    this.page.getByText(
      /Please click on the checkbox and enter Aadhaar/i
    )
  ).toBeVisible({
    timeout: 60000,
  });

  console.log(
    'Aadhaar authentication page loaded.'
  );

  return this.page;
}
}

module.exports = RegisterBankDetailsPage;