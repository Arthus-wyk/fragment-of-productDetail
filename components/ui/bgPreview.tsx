import { Col, Row, Skeleton, Typography } from 'antd'
import React from 'react'

import { defaultStyle } from '@/app/web-generator/[id]/background/defaultStyle'

export default function BgPreview({ gradientStyle }: { gradientStyle: any }) {

  return (
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
          border: '1px solid rgba(255, 255, 255, 0.3)' // 边框
        }}
      >
        <Typography.Text strong style={{ marginBottom: '5px' }}>背景展示</Typography.Text>
        <div style={gradientStyle ? gradientStyle : defaultStyle}>
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
  )
}