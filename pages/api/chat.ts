import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { id: chatId } = req.query;

  if (!chatId || typeof chatId !== 'string') {
    res.status(400).end('Missing chatId');
    return;
  }

  try {
    const upstreamRes = await fetch(`https://newcast-dev-test-gw.hhe.by/api/chat/${chatId}`, {
      method: 'POST',
      headers: {
        ...req.headers,
        host: undefined, // 防止 host 被传过去
      },
      body: req,
    });

    // 将响应头复制给前端
    res.writeHead(upstreamRes.status, Object.fromEntries(upstreamRes.headers.entries()));

    if (upstreamRes.body) {
      // 使用 Node.js 的 stream pipe 方法直接转发 body
      Readable.from(upstreamRes.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Proxy request failed:', err);
    res.status(500).end('Proxy error');
  }
}
