// _document.js - Custom document for SEO and fonts
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Khareef Home & Cosmetics - Premium quality home goods and cosmetics. خريف للأدوات المنزلية والكوزمتكس" />
        <meta name="keywords" content="home goods, cosmetics, cookware, perfumes, beauty, خريف, أدوات منزلية, كوزمتكس" />
        <meta property="og:title" content="Khareef Home & Cosmetics" />
        <meta property="og:description" content="Premium quality home goods and cosmetics" />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Cairo:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
