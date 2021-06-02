import '../styles/globals.css'
import type { AppProps } from 'next/app'
import CssBaseline from '@material-ui/core/CssBaseline'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <head>
      </head>
        <CssBaseline />
        <Component {...pageProps} />
    </>
    ) 
}
export default MyApp
