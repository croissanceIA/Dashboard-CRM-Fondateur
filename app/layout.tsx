'use client'

import { ConfigProvider, Layout, App } from 'antd'
import frFR from 'antd/locale/fr_FR'
import './globals.css'

const { Header, Content } = Layout

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <title>Dashboard CRM Fondateur</title>
        <meta name="description" content="Suivi commercial pour maximiser le Volume et la Valeur des deals" />
      </head>
      <body>
        <ConfigProvider
          locale={frFR}
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 6
            }
          }}
        >
          <App>
            <Layout>
              <Header
                style={{
                  background: '#001529',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 24px'
                }}
              >
                <h1 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>
                  Dashboard CRM Fondateur
                </h1>
              </Header>
              <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                {children}
              </Content>
            </Layout>
          </App>
        </ConfigProvider>
      </body>
    </html>
  )
}
