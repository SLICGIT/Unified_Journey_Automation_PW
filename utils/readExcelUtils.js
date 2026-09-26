const xlsx = require('xlsx');

function readExcel(filePath, sheetName) {
  const workbook = xlsx.readFile(filePath);

  console.log("📄 Available Sheets:", workbook.SheetNames);

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`❌ Sheet "${sheetName}" not found`);
  }

  const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

  console.log(`✅ Loaded sheet: ${sheetName}`, data);

  return data;
}

module.exports = { readExcel };