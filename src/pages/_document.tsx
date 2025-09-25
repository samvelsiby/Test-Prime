import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/Gonero-ExtraExpanded.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Gonero-ExtraExpanded.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Gonero-ExtraExpanded.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        
        {/* Google Fonts - Poppins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//customer-pyq7haxijl6gyz2i.cloudflarestream.com" />
        
        {/* Optimize font loading */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Ensure font loads immediately */
            @font-face {
              font-family: 'Gonero-ExtraExpanded';
              src: url('/fonts/Gonero-ExtraExpanded.woff2') format('woff2'),
                   url('/fonts/Gonero-ExtraExpanded.woff') format('woff'),
                   url('/fonts/Gonero-ExtraExpanded.ttf') format('truetype'),
                   url('/fonts/Gonero-ExtraExpanded.otf') format('opentype');
              font-weight: normal;
              font-style: normal;
              font-display: block;
            }
            
            /* Prevent font flash by hiding text until font loads */
            .hero-title {
              font-family: 'Gonero-ExtraExpanded', 'Arial Black', sans-serif;
              visibility: hidden;
            }
            
            /* Show text once font is loaded */
            .fonts-loaded .hero-title {
              visibility: visible;
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
