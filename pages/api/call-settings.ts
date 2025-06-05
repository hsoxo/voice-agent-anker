import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/twilio/call-settings`
      );
      return res.status(200).json(response.data);
    }

    if (req.method === "PUT") {
      const body = req.body;
      console.log(body);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/twilio/call-settings`,
        body
      );
      return res.status(200).json(response.data);
    }

    // 如果不是 GET 或 PUT，返回 405
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error("Error handling request:", error);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Internal Server Error" };
    return res.status(status).json(data);
  }
}
