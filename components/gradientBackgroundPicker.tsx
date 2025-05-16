
import { ExecutionResult } from '@/lib/types'
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  PlusOutlined
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
  Divider
} from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import { string } from 'zod'

export type gradientStyleType={
  background:string
  width:string
  borderRadius:string
  padding:string
}

export default function GradientBackgroundPicker({
                                                   result,
                                                   onBgChange
                                                 }: {
  result?: ExecutionResult
  onBgChange: (color: any) => void
}) {
  const [colors, setColors] = useState(['#ffffff']) // 默认颜色数组
  const [gradientDirection, setGradientDirection] = useState('to right') // 渐变方向
  const [visibleColorPicker, setVisibleColorPicker] = useState<number | null>(
    null
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

  useEffect(() => {
    const gradientStyle:gradientStyleType = {
      background:
        colors.length === 1
          ? colors[0] // 单色背景
          : `linear-gradient(${gradientDirection}, ${colors.join(', ')})`, // 渐变背景
      width: '100%',
      borderRadius: '4px',
      padding: '20px'
    }
    onBgChange(gradientStyle)

  }, [colors,gradientDirection])

  useEffect(() => {
    console.log(result)
    if (result) setColors(JSON.parse(result.code))
  }, [result])

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4  rounded-lg shadow">
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
      <Card className="!mb-4 " bodyStyle={{ padding: 16 }}>
        <Space size="middle" align="center">
          <Button type="primary" icon={<PlusOutlined />} onClick={addColor}>
            添加颜色
          </Button>

          <Divider type="vertical" className="!h-8" />

          <Typography.Text strong>渐变方向：</Typography.Text>
          <Button.Group>
            <Button
              color={gradientDirection === 'to right' ? 'cyan':undefined}
              variant={gradientDirection === 'to right' ? "outlined":undefined}
              icon={<ArrowRightOutlined />}
              onClick={() => handleDirectionChange('to right')}
            >
              水平
            </Button>
            <Button
              color={gradientDirection === 'to bottom' ? 'cyan':undefined}
              variant={gradientDirection === 'to bottom' ? "outlined":undefined}
              icon={<ArrowDownOutlined />}
              onClick={() => handleDirectionChange('to bottom')}
            >
              垂直
            </Button>
            <Button
              color={gradientDirection === 'to top right' ? 'cyan':undefined}
              variant={gradientDirection === 'to top right' ? "outlined":undefined}
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
        title="颜色配置"
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="horizontal" size={16} className="flex flex-wrap">
          {colors.map((color, index) => (
            <div
              key={index}
              className="relative group z-100"
              style={{ width: 64, height: 64 }}
            >
              <Popover
                placement="bottom"
                content={
                  <div onClick={(e) => e.stopPropagation()}>
                    <SketchPicker
                      className="z-100"
                      color={color}
                      onChangeComplete={(newColor) =>
                        updateColor(index, newColor)
                      }
                    />
                  </div>
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
    </div>
  )
}
