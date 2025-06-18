// @ts-nocheck
import NextCors from "nextjs-cors";

import axios from "axios";

export default async (req, res) => {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const url = `${process.env.NEXT_PUBLIC_APPS_API_URL}/v1/video-agent/create-room`;

    const searchParams = new URLSearchParams(req.url.split("?")[1]);
    const api_key = searchParams.get("api_key");
    const agent_id = searchParams.get("agent_id");

    const response = await axios.post(url, {
      api_key,
      agent_id,
      host: req.headers.host,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(error.response?.status || 500)
      .json({ error: "An error occurred" });
  }
};
