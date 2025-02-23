'use client'

import GradientBackgroundPicker from '@/components/gradientBackgroundPicker'
import { supabase } from '@/lib/utils/supabase/client'
import { updateColor } from '@/lib/utils/supabase/queries'
import { Button, Col, Divider, Row, Skeleton } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

export default function WebGeneratorBackgroundPreview({
  result,
}: {
  result: any
}) {
  const gradientStyle = {
    background: result,
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    padding: '20px',
    display:'flex'
  }
  return (
    <div className="w-full flex items-center px-2 pt-1 justify-center h-full ">
      <div
        style={{
          width: '100%',
          height: '50%',
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
        <div style={gradientStyle}>
          <Row
            gutter={[24, 24]}
            align="middle"
            justify="center"
            style={{ height: '100%' }}
          >
            {/* 左侧商品图片 */}
            <Col
              xs={24}
              md={8}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Skeleton.Image
                 style={{ width: '80%', maxWidth: '250px', height: 'auto' }}
              />
            </Col>
            {/* 右侧商品信息 */}
            <Col xs={24} md={16}>
              <Skeleton
                active
                paragraph={{ rows: 6 }}
                style={{ fontSize: '1.2rem', marginBottom: '20px' }}
              />
              {/* 模拟按钮 */}
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <Skeleton.Button
                  active
                  style={{ width: '200px', height: '50px', fontSize: '1rem' }}
                />
                <Skeleton.Button
                  active
                  style={{ width: '200px', height: '50px', fontSize: '1rem' }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
