import { Layout, Menu } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useState } from 'react'

const { Sider, Content } = Layout

interface SidebarLayoutProps {
  defaultContentKey: string // 默认显示的内容 key
  contentMap: Record<string, React.ReactNode> // 内容映射表，key 对应菜单项，value 是要显示的内容
  header:React.ReactNode
}

export default function SidebarLayout({
  defaultContentKey,
  contentMap,
  header
}: SidebarLayoutProps) {
  const [selectedKey, setSelectedKey] = useState(defaultContentKey) // 当前选中的内容 key

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key) // 更新选中的内容 key
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultContentKey]}
          onClick={handleMenuClick}
          items={Object.keys(contentMap).map((key) => ({
            key,
            label: `内容 ${key.toUpperCase()}`, // 菜单项名称
          }))}
        />
      </Sider>

      {/* 内容区域 */}
      <Layout>
        <Header style={{ padding: 0 }}>
          {header}
        </Header>
        <Content style={{ padding: '24px' }}>
          {/* 保持所有内容组件挂载，仅通过 display 控制可见性 */}
          {Object.keys(contentMap).map((key) => (
            <div
              key={key}
              style={{
                display: selectedKey === key ? 'block' : 'none', // 仅显示选中的内容
                height: '100%',
              }}
            >
              {contentMap[key]}
            </div>
          ))}
        </Content>
      </Layout>
    </Layout>
  )
}
