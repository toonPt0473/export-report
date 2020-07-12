const init = async () => {
  const express = require('express')
  const bodyParser = require('body-parser')
  const sql = require('mssql')
  const cors = require('cors')
  const generateExcel = require('./generateExcel')

  require('dotenv').config()

  const app = express()
  const port = process.env.PORT || 5555

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
  }

  const pool = await sql.connect(config)

  app.get('/report/column_name', async (req, res) => {
    const datasets = await sql.query`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'e_learning_export'
    `
    const result = datasets.recordset.map((i) => i.COLUMN_NAME)
    res.status(200).json(result)
  })

  app.post('/report', async (req, res) => {
    const { selectColumn = [] } = req.body
    const queryString = 'SELECT ' + selectColumn.join(',') + ' FROM TESTDB.dbo.e_learning_export'
    if (selectColumn.length > 0) {
      const datasets = await pool.request().query(queryString)
      const fielname = await generateExcel(datasets.recordset, selectColumn)
      res.download('./' + fielname)
    }
  })

  app.use(function (req, res) {
    res.status(404).json({
      error: {
        title: 'Resource not found',
        code: 404,
      },
    })
  })

  app.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
  })
}

init()
