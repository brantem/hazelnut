import type { AppProps } from 'next/app';

import { useLoadStore } from 'lib/stores';

import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useLoadStore();

  return <Component {...pageProps} />;
}

export default MyApp;
