'use client'

import { Button, Card, Col, Collapse, Row } from 'antd'
import classNames from 'classnames'
import { SetStateAction, useState } from 'react'

export default function StyleSelect({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean
  onSubmit: (style: string, layout: string) => void
}) {
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const handleSelect = (type: string, key: SetStateAction<null>) => {
    if (type === '布局') {
      setSelectedLayout(key)
    } else if (type === '风格') {
      setSelectedStyle(key)
    }
  }
  const options = [
    {
      type: '布局',
      items: [
        {
          key: '1',
          title: '经典布局',
          img: 'https://fopme.xyz/jindian.png',
          color: '#f0f2f5',
        },
        {
          key: '2',
          title: '分屏布局',
          img: 'https://fopme.xyz/fenye.png',
          color: '#e6f7ff',
        },
        {
          key: '3',
          title: '网格布局',
          img: 'https://fopme.xyz/wangge.png',
          color: '#f9f0ff',
        },
        {
          key: '4',
          title: '卡片布局',
          img: 'https://fopme.xyz/kapian.png',
          color: '#fff7e6',
        },
      ],
    },
    {
      type: '风格',
      items: [
        {
          key: '1',
          title: '简约',
          img: 'https://fopme.xyz/85f4efe4-6ada-4456-a9a8-75aedd35eef0.png',
          color: '#f6ffed',
        },
        {
          key: '2',
          title: '现代',
          img: 'https://fopme.xyz/xiandai.png',
          color: '#e6fffb',
        },
        {
          key: '3',
          title: '复古',
          img: 'https://fopme.xyz/fugu.png',
          color: '#fff0f6',
        },
        {
          key: '4',
          title: '卡通',
          img: 'https://fopme.xyz/katong.png',
          color: '#e8f5e9',
        },
        {
          key: '5',
          title: '豪华',
          img: 'https://fopme.xyz/shehua.png',
          color: '#fffbe6',
        },
      ],
    },
  ]

  const renderOptions = (group: any) => (
    <Row gutter={[16, 16]}>
      {group.items.map((item: any) => (
        <Col xs={24} sm={12} key={item.title}>
          <Card
            hoverable
            onClick={() => handleSelect(group.type, item.key)}
            className={classNames(
              'transition-transform duration-300 ease-in-out',
              {
                'border-blue-300 border-4 shadow-lg scale-105':
                  group.type === '布局' && selectedLayout === item.key,
                'border-green-300 border-4 shadow-lg scale-105':
                  group.type === '风格' && selectedStyle === item.key,
                'hover:shadow-md hover:scale-105': true,
              },
            )}
            style={{
              backgroundColor: item.color,
              textAlign: 'start',
              borderRadius: '8px',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <div className="text-start font-bold text-lg">{item.title}</div>
            <img
              src={item.img}
              alt={item.title}
              className="mx-auto mb-2 w-20 h-20 rounded-sm" // Tailwind 类
            />
          </Card>
        </Col>
      ))}
    </Row>
  )

  return (
    <div style={{ padding: '20px' }}>
      <Collapse
        className="p-1"
        items={[
          {
            key: '1',
            label: '布局/风格',
            children: (
              <div className="p-2 dark:bg-black text-white">
                <Row gutter={[32, 32]}>
                  {/* 左侧：布局 */}
                  <Col xs={24} sm={12}>
                    <h3>布局</h3>
                    {renderOptions(options[0])}
                  </Col>
                  {/* 右侧：风格 */}
                  <Col xs={24} sm={12}>
                    <h3>风格</h3>
                    {renderOptions(options[1])}
                  </Col>
                  <div className="w-full flex justify-end">
                    <Button
                      style={{
                        backgroundColor:
                          !selectedLayout || !selectedStyle
                            ? '#d9d9d9'
                            : '#1890ff', // 自定义背景色
                        color:
                          !selectedLayout || !selectedStyle
                            ? '#8c8c8c'
                            : '#fff', // 自定义字体颜色
                        borderColor:
                          !selectedLayout || !selectedStyle
                            ? '#d9d9d9'
                            : '#1890ff', // 自定义边框颜色
                        cursor:
                          !selectedLayout || !selectedStyle
                            ? 'not-allowed'
                            : 'pointer', // 禁用时鼠标样式
                      }}
                      type="primary"
                      loading={isLoading}
                      disabled={!selectedLayout || !selectedStyle}
                      onClick={() => onSubmit(selectedStyle!, selectedLayout!)}
                    >
                      生成
                    </Button>
                  </div>
                </Row>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
