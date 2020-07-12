import React, { useState } from 'react'
import './App.css'
import { Breadcrumb, Form, Transfer, Select, Button } from 'antd'
import useReport from './hooks/useReport'

const { Option } = Select
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
}
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
}

function App() {
  const { columnName, getReport } = useReport()
  const [form] = Form.useForm()
  const [targetKeys, settargetKeys] = useState([])
  const [selectedKeys, setselectedKeys] = useState([])
  const onChangeTypeReport = (value) => {
    form.current.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    })
  }
  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setselectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }
  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    settargetKeys(nextTargetKeys.sort((a, b) => +a - b))
  }
  const onGetReport = async () => {
    const selectColumn = columnName.filter((i) => targetKeys.includes(i.key)).map((j) => j.title)
    await getReport(selectColumn)
  }
  const resetSelect = () => {
    settargetKeys([])
  }
  return (
    <div className="App">
      <h1>ส่งออกข้อมูล</h1>
      <Breadcrumb>
        <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
        <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
        <Breadcrumb.Item>ส่งออกข้อมูล</Breadcrumb.Item>
      </Breadcrumb>
      <Form {...layout} form={form} onFinish={onGetReport} initialValues={{ reportType: 'study' }} style={{ marginTop: 50 }}>
        <Form.Item name="reportType" label="ประเภท" rules={[{ required: true }]}>
          <Select placeholder="ประเภท" onChange={onChangeTypeReport} allowClear>
            <Option value="study">การศึกษาพนักงาน</Option>
          </Select>
        </Form.Item>

        <Form.Item name="columnname" label="เลือกข้อมูลที่ต้องการ" rules={[{ required: true }]}>
          <Transfer
            dataSource={columnName}
            titles={['ข้อมูลที่มีให้เลือก', 'ข้อมูลที่เลือก']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            render={(item) => <div key={item.key}>{item.title}</div>}
            listStyle={{
              minWidth: '45%',
              height: 300,
            }}
            locale={{
              itemsUnit: 'ชิ้น',
              itemUnit: 'ชิ้น',
              notFoundContent: 'ไม่พบข้อมูล',
            }}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 30 }}>
            ส่งออก
          </Button>
          <Button htmlType="button" onClick={resetSelect}>
            ยกเลิก
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default App
