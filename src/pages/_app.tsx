import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

import { useLoadStore } from 'lib/stores';

import 'styles/globals.css';
import 'styles/markdown.css';

function MyApp({ Component, pageProps }: AppProps) {
  useLoadStore();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Hazelnut" />
        <meta name="keywords" content="Hazelnut" />
        <title>Hazelnut</title>

        <link rel="manifest" href="/manifest.json" />
        <link href="/icons/icon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/icons/icon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
