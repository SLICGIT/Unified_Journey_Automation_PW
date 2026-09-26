const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

function readExcelSheet(fileName, sheetName) {
  const filePath = path.resolve(
    process.cwd(),
    'test_data',
    fileName
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Excel file not found: ${filePath}`
    );
  }

  const workbook = XLSX.readFile(filePath, {
    raw: false
  });

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(
      `Sheet "${sheetName}" not found in ${fileName}`
    );
  }

  return XLSX.utils.sheet_to_json(sheet, {
    defval: '',
    raw: false
  });
}

function getRowByTcId(rows, tcId) {
  const matchedRow = rows.find(
    row =>
      String(row.tc_id).trim() ===
      String(tcId).trim()
  );

  if (!matchedRow) {
    throw new Error(
      `No Excel data found for tc_id: ${tcId}`
    );
  }

  return matchedRow;
}

module.exports = {
  readExcelSheet,
  getRowByTcId
};