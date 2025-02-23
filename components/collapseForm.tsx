'use client'

import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Collapse,
  CollapseProps,
  Form,
  Input,
  InputNumber,
  Upload,
} from 'antd'
interface CollapseFormProps {
    form: any; // 父组件传递的 Form 实例
    onFormChange: (changedValues: any, allValues: any) => void; // 父组件传递的回调函数
  }
export default function CollapseForm({ form, onFormChange }:CollapseFormProps) {
  // 提交表单的处理逻辑
  const handleSubmit = (values: any) => {
    console.log('提交的表单数据:', values)
    // 在这里处理表单数据，例如发送到后端
  }

  // 上传图片的处理逻辑
  const handleUpload = (info: { file: any }) => {
    console.log('上传的图片:', info.file)
    // 可以在这里处理上传的图片，例如存储到服务器
  }
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '表单',
      children: (
        <div className="flex-grow overflow-auto p-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            {/* 图片上传 */}
            <Form.Item
              label="商品图片"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: '请上传商品图片' }]}
            >
              <Upload
                name="image"
                listType="picture"
                maxCount={1}
                onChange={handleUpload}
                beforeUpload={() => false} // 禁止自动上传
              >
                <Button icon={<UploadOutlined />}>点击上传图片</Button>
              </Upload>
            </Form.Item>

            {/* 商品名称 */}
            <Form.Item
              label="商品名称"
              name="name"
              rules={[{ required: true, message: '请输入商品名称' }]}
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>

            {/* 商品详情 */}
            <Form.Item
              label="商品详情"
              name="details"
              rules={[{ required: true, message: '请输入商品详情' }]}
            >
              <Input.TextArea
                placeholder="请输入商品详情"
                rows={4}
                maxLength={500}
              />
            </Form.Item>

            {/* 商品价格 */}
            <Form.Item
              label="商品价格"
              name="price"
              rules={[{ required: true, message: '请输入商品价格' }]}
            >
              <InputNumber
                placeholder="请输入商品价格"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            {/* 商品规格 */}
            <Form.Item
              label="商品规格"
              name="specifications"
              rules={[{ required: true, message: '请输入商品规格' }]}
            >
              <Input placeholder="请输入商品规格" />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ]
  
  return (
    <div className='mt-auto'>
    <Collapse
      items={items}
      style={{
        bottom: '100%', // 控制展开方向向上
        left: 0,
        right: 0,
        background: '#f5f5f5',
      }}
    ></Collapse>
    </div>
  )
}
