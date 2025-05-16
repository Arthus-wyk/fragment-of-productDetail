import { Col, Row, Skeleton, Typography } from 'antd'
import React from 'react'

import { defaultStyle } from '@/app/web-generator/[id]/background/defaultStyle'

export default function BgPreview({ gradientStyle }: { gradientStyle: any }) {

  return (
    <div className="w-full flex items-center justify-center">
      <div
        style={{
          width: '90%',
          height:'1200px',
          marginBottom: '20px',
          padding: '20px',
          borderRadius: '15px',
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)', // 模拟浮雕效果
          backdropFilter: 'blur(10px)', // 背景模糊
          WebkitBackdropFilter: 'blur(10px)', // 兼容 Safari
            ...gradientStyle ? gradientStyle : defaultStyle
        }}
      >
        <div>
          <Col className='w-full h-full'>
              <Skeleton active paragraph={{ rows: 10 }} />
              {/* 模拟按钮 */}
              <div style={{ marginTop: '16px',marginBottom:'32px' }}>
                <Skeleton.Button
                  active
                  style={{ width: '150px', marginRight: '10px' }}
                />
                <Skeleton.Button active style={{ width: '150px' }} />
              </div>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Col>
        </div>
      </div>
    </div>
  )
}