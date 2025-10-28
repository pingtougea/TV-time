import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider, theme } from 'antd'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#AB8BFF',
          colorText: '#cecefb',
          colorTextPlaceholder: '#a8b5db',
          colorBorder: '#2a2748',
          colorSplit: '#2a2748',
          colorBgBase: '#030014',
          colorBgContainer: '#0f0d23',
          colorBgElevated: '#0f0d23',
        },
        algorithm: theme.darkAlgorithm,
      }}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
//这个是CRA创建时自带的，不用管
