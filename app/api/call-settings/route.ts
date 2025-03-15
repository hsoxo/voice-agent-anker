import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(
      `http://44.213.201.101:7860/twilio/call-settings`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    const response = await axios.put(
      `http://44.213.201.101:7860/twilio/call-settings`,
      body
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json((error as any).response.data, { status: 500 });
  }
}
