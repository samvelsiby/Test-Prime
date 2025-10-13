import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '100vw', 
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <Component {...pageProps} />
    </div>
  )
}
