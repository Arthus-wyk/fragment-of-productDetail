import { ArtifactSchema } from '@/lib/schema'
import { ExecutionResult } from '@/lib/types'
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { DeepPartial } from 'ai'
import {
  Button,
  Popover,
  Input,
  Space,
  Row,
  Col,
  Skeleton,
  Typography,
  Card,
  Divider,
} from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ColorResult, SketchPicker } from 'react-color'

export default function GradientBackgroundPicker({
  result,
  setBackgroundColor,
}: {
  result?: ExecutionResult
  setBackgroundColor: (color: string) => void
}) {
  const [colors, setColors] = useState(['#ffffff']) // 默认颜色数组
  const [gradientDirection, setGradientDirection] = useState('to right') // 渐变方向
  const [visibleColorPicker, setVisibleColorPicker] = useState<number | null>(
    null,
  ) // 控制颜色选择器弹出

  // 更新颜色
  const updateColor = (index: number, newColor: ColorResult) => {
    if (colors.length == 1) {
      setColors([newColor.hex])
    } else {
      const updatedColors = [...colors]
      updatedColors[index] = newColor.hex
      setColors(updatedColors)
    }
  }

  // 添加颜色
  const addColor = () => {
    setColors([...colors, '#000000']) // 默认新颜色为黑色
  }

  // 删除颜色
  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index)
    setColors(updatedColors)
    // 如果删除的颜色是当前打开的颜色选择器，关闭它
    if (visibleColorPicker === index) {
      setVisibleColorPicker(null)
    }
  }

  // 渐变方向切换
  const handleDirectionChange = (direction: string) => {
    setGradientDirection(direction)
  }

  // 生成渐变样式
  const gradientStyle = {
    background:
      colors.length === 1
        ? colors[0] // 单色背景
        : `linear-gradient(${gradientDirection}, ${colors.join(', ')})`, // 渐变背景
    width: '100%',
    borderRadius: '4px',
    padding: '20px',
  }
  useEffect(() => {
    console.log('set color')
    setBackgroundColor(gradientStyle.background)
  }, [colors])

  useEffect(() => {
    console.log(result)
    if (result) setColors(JSON.parse(result.code))
  }, [result])

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-[#FFF1D9] rounded-lg shadow">
      {/* 标题部分 */}
      <div className="text-center mb-6">
        <Typography.Title level={3} className="!mb-2">
          背景颜色选择器
        </Typography.Title>
        <Typography.Text type="secondary">
          点击色块调整颜色，支持多颜色渐变配置
        </Typography.Text>
      </div>
      {/* 工具栏 */}
      <Card className="!mb-4 bg-[#FFF1D9]" bodyStyle={{ padding: 16 }}>
        <Space size="middle" align="center">
          <Button type="primary" icon={<PlusOutlined />} onClick={addColor}>
            添加颜色
          </Button>

          <Divider type="vertical" className="!h-8" />

          <Typography.Text strong>渐变方向：</Typography.Text>
          <Button.Group>
            <Button
              icon={<ArrowRightOutlined />}
              onClick={() => handleDirectionChange('to right')}
            >
              水平
            </Button>
            <Button
              icon={<ArrowDownOutlined />}
              onClick={() => handleDirectionChange('to bottom')}
            >
              垂直
            </Button>
            <Button
              icon={<ArrowRightOutlined />}
              onClick={() => handleDirectionChange('to top right')}
            >
              对角
            </Button>
          </Button.Group>
        </Space>
      </Card>

      {/* 颜色选择区域 */}
      <Card
        className="bg-[#FFF1D9]"
        title="颜色配置"
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="horizontal" size={16} className="flex flex-wrap">
          {colors.map((color, index) => (
            <div
              key={index}
              className="relative group"
              style={{ width: 64, height: 64 }}
            >
              <Popover
                placement="bottom"
                content={
                  <SketchPicker
                    color={color}
                    onChangeComplete={(newColor) =>
                      updateColor(index, newColor)
                    }
                  />
                }
                trigger="click"
                open={visibleColorPicker === index}
                onOpenChange={(visible) =>
                  setVisibleColorPicker(visible ? index : null)
                }
              >
                <Button
                  shape="circle"
                  style={{
                    backgroundColor: color,
                    width: 56,
                    height: 56,
                    border: `2px solid ${color === '#FFFFFF' ? '#d9d9d9' : color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  className="transition-transform hover:scale-105"
                />
              </Popover>

              {/* 删除按钮 */}
              <Button
                shape="circle"
                size="small"
                danger
                type="primary"
                icon={<CloseOutlined />}
                onClick={() => removeColor(index)}
                className="absolute -top-2 -right-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ zIndex: 1 }}
              />
            </div>
          ))}
        </Space>
      </Card>

      {/* 展示区域 */}
      <div className="w-full flex items-center justify-center">
        <div
          style={{
            width: '70%',
            marginBottom: '20px',
            padding: '20px',
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.2)', // 半透明背景
            boxShadow:
              '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)', // 模拟浮雕效果
            backdropFilter: 'blur(10px)', // 背景模糊
            WebkitBackdropFilter: 'blur(10px)', // 兼容 Safari
            border: '1px solid rgba(255, 255, 255, 0.3)', // 边框
          }}
        >
          <Typography.Text strong style={{marginBottom:"5px"}}>背景展示</Typography.Text>
          <div style={gradientStyle}>
            <Row gutter={[16, 16]}>
              {/* 左侧商品图片 */}
              <Skeleton.Image />
              {/* 右侧商品信息 */}
              <Col xs={36} md={12}>
                <Skeleton active paragraph={{ rows: 4 }} />
                {/* 模拟按钮 */}
                <div style={{ marginTop: '16px' }}>
                  <Skeleton.Button
                    active
                    style={{ width: '150px', marginRight: '10px' }}
                  />
                  <Skeleton.Button active style={{ width: '150px' }} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}
