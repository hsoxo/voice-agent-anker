import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const gsi1sk = req.query.gsi1sk as string;

      const historyRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/history/${gsi1sk}`
      );

      const fileUrl = `https://dzqkhoe0j5v3w.cloudfront.net/${historyRes.data.files.recording}`;

      try {
        const fileRes = await axios.get(fileUrl, { responseType: "stream" });

        res.setHeader(
          "Content-Type",
          fileRes.headers["content-type"] || "application/octet-stream"
        );

        fileRes.data.pipe(res);
        return;
      } catch (err: any) {
        return res
          .status(500)
          .json({ error: "Download failed", details: err.message });
      }
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error("Error handling request:", error);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Internal Server Error" };
    return res.status(status).json(data);
  }
}
