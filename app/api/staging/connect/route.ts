export const runtime = "nodejs"; // Required for SST

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';
const ANKER_API_URL = process.env.ANKER_API_URL_STAGING;
const ANKER_API_KEY = process.env.ANKER_API_KEY_STAGING;
const lambdaClient = new LambdaClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const headers = {
  Authorization: `Bearer ${DAILY_API_KEY}`,
  'Content-Type': 'application/json',
};

async function getExistingRooms() {
  try {
    const response = await axios.get(`${DAILY_API_URL}/rooms`, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

async function checkIfRoomAvailable(roomName: string) {
  try {
    const response = await axios.get(`${DAILY_API_URL}/rooms/${roomName}/presence`, { headers });
    console.log(response.data);
    return response.data.total_count === 0;
  } catch (error) {
    console.error('Error checking room availability:', error);
    return false;
  }
}

async function createRoom() {
  try {
    const roomName = uuidv4();
    const response = await axios.post(`${DAILY_API_URL}/rooms`, { name: roomName }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    return null;
  }
}

async function getARoom() {
  const rooms = await getExistingRooms();
  for (const room of rooms) {
    if (await checkIfRoomAvailable(room.name)) {
      return room;
    }
  }
  return await createRoom();
}

async function getToken(roomName: string, expiryTime = 600, owner = true) {
  try {
    const expiration = Math.floor(Date.now() / 1000) + expiryTime;
    const response = await axios.post(
      `${DAILY_API_URL}/meeting-tokens`,
      { properties: { room_name: roomName, is_owner: owner, exp: expiration } },
      { headers }
    );
    return response.data.token;
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

async function startBot(roomUrl: string, token: string) {
  const command = new InvokeCommand({
    FunctionName: "voice-agent-anker-bot",
    Payload: JSON.stringify({ room_url: roomUrl, token, anker_api_url: ANKER_API_URL, anker_token: ANKER_API_KEY }),
    InvocationType: 'Event', // Asynchronous invocation
  });
  lambdaClient.send(command).catch(error => console.error('Error invoking Lambda:', error));
}


export async function POST(req: NextRequest) {
  try {
    const room = await getARoom();
    if (!room) {
      return NextResponse.json({ error: 'Failed to create or get a room' }, { status: 500 });
    }

    const token = await getToken(room.name);
    if (!token) {
      return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
    await startBot(room.url, token);

    return NextResponse.json({ room_url: room.url, token });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}