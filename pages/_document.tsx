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
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;