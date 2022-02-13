import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { TransactionProvider } from 'contexts/TransactionProvider'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  )
}
