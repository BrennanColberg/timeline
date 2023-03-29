import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          defer
          data-domain="timeline.colberg.dev"
          src="https://plausible.io/js/script.js"
        />
        <script
          src="https://brennancolberg.github.io/by-brennan/by-brennan.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
