const Excel = require('exceljs')
const generateExcel = async (raw, column) => {
  const workbook = new Excel.Workbook()
  workbook.creator = 'Me'
  workbook.lastModifiedBy = 'Me'
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.addWorksheet('My Sheet', { properties: { tabColor: { argb: 'FFC0000' } } })
  const worksheet = workbook.getWorksheet('My Sheet')
  worksheet.columns = column.map((i) => ({
    header: i,
    key: i,
    width: 12,
  }))
  for (const each in raw) {
    worksheet.addRow(raw[each])
  }
  await workbook.xlsx.writeFile('./01. E-Learning Upload Template(report).xlsx')
  return '01. E-Learning Upload Template(report).xlsx'
}

module.exports = generateExcel
