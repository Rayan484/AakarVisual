import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { Metadata, Viewport } from "next";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aakar-SAM" />
        <meta
          name="description"
          content="Visualize your interior with suggested colors and textures, or upload your own image to see how it looks in your space."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Aakar-SAM" />
        <meta property="og:title" content="Aakar-SAM" />
        <meta
          property="og:description"
          content="Visualize your interior with suggested colors and textures, or upload your own image to see how it looks in your space."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
