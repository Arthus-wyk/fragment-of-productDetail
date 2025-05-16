'use client'

import { Button, Card, Col, Collapse, Divider, Row } from 'antd'
import classNames from 'classnames'
import { SetStateAction, useState } from 'react'
import { Typography } from 'antd'

const { Title } = Typography

export default function StyleSelect({
                                      isLoading,
                                      onSubmit
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
          img: '/images/jindian.png',
          color: '#f0f2f5'
        },
        {
          key: '2',
          title: '分屏布局',
          img: '/images/fenye.png',
          color: '#e6f7ff'
        },
        {
          key: '3',
          title: '网格布局',
          img: '/images/wangge.png',
          color: '#f9f0ff'
        },
        {
          key: '4',
          title: '卡片布局',
          img: '/images/kapian.png',
          color: '#fff7e6'
        }
      ]
    },
    {
      type: '风格',
      items: [
        {
          key: '1',
          title: '简约',
          img: '/images/jianyue.png',
          color: '#f6ffed'
        },
        {
          key: '2',
          title: '现代',
          img: '/images/xiandai.png',
          color: '#e6fffb'
        },
        {
          key: '3',
          title: '复古',
          img: '/images/fugu.png',
          color: '#fff0f6'
        },
        {
          key: '4',
          title: '卡通',
          img: '/images/katong.png',
          color: '#e8f5e9'
        },
        {
          key: '5',
          title: '豪华',
          img: '/images/shehua.png',
          color: '#fffbe6'
        }
      ]
    }
  ]

  const renderOptions = (group: any) => (
    <Row gutter={[16, 16]}>
      {group.items.map((item: any) => (
        <Col xs={24} sm={12} key={item.title}>
          <Card
            hoverable
            onClick={() => handleSelect(group.type, item.key)}
            className={classNames(
              'transition-transform duration-300 ease-in-out','hover:shadow-md hover:scale-105 '
            )}
            style={{
              backgroundColor: item.color,
              backgroundImage: `url(${item.img})`, // 这里加上
              backgroundSize: 'cover',             // 背景铺满
              backgroundPosition: 'center',        // 居中
              textAlign: 'start',
              borderRadius: '8px'
            }}
            bodyStyle={{
              background:
                (group.type === '布局' && selectedLayout === item.key) ||
                (group.type === '风格' && selectedStyle === item.key) ?
                  undefined:'rgba(255,255,255,0.7)'
            }} // 可选：内容半透明
          >
            <div className="w-[100px] text-start font-bold text-lg">{item.title}</div>
          </Card>

        </Col>

      ))}
      <Divider />
    </Row>
  )

  return (
    <div style={{ padding: '20px' }}>

      <div className="p-2 dark:bg-black text-white">
        <Col >
          {/* 左侧：布局 */}
          <Title level={2}>布局</Title>
          <Row xs={24} sm={12}>
            {renderOptions(options[0])}
          </Row>
          {/* 右侧：风格 */}
          <Title level={2}>风格</Title>
          <Row xs={24} sm={12}>
            {renderOptions(options[1])}
          </Row>
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
                    : 'pointer' // 禁用时鼠标样式
              }}
              type="primary"
              loading={isLoading}
              disabled={!selectedLayout || !selectedStyle}
              onClick={() => onSubmit(selectedStyle!, selectedLayout!)}
            >
              生成
            </Button>
          </div>
        </Col>
      </div>

    </div>
  )
}
