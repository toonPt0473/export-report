import { useState, useEffect } from 'react'
import axios from 'axios'

function useReport() {
  const [columnName, setcolumnName] = useState([])
  const fetchColumnName = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API}/report/column_name`)
      const data = result.data.map((i, index) => ({
        title: i,
        key: index.toString(),
      }))
      setcolumnName(data)
    } catch (error) {
      console.log(error)
    }
  }
  const getReport = async (selectColumn) => {
    console.log(selectColumn)
    const result = await axios.post(`${process.env.REACT_APP_API}/report`, { selectColumn }, { responseType: 'blob' })
    console.log(result)
    const blob = new Blob([result.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = '01. E-Learning Upload Template(report).xlsx'
    link.click()
    link.remove()
  }
  useEffect(() => {
    fetchColumnName()
  }, [])
  return {
    columnName,
    getReport,
  }
}

export default useReport
