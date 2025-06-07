import Document, { Html, Head, Main, NextScript } from 'next/document';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Audio Bots Demo",
    description: "Audio Bots voice-to-voice example app",
  };

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;