export const BOT_READY_TIMEOUT = 15 * 1000; // 15 seconds

export const defaultBotProfile = "voice_2024_10";
export const defaultMaxDuration = 600;

export const LANGUAGES = [
  {
    label: "English",
    value: "en",
    tts_model: "sonic-english",
    stt_model: "nova-2-general",
    default_voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  },
];

export const defaultServices = {
  llm: "anker",
  tts: "bf0a246a-8642-498a-9950-80c35e9276b5",
  stt: "deepgram",
};

export const defaultLLMPrompt = `You are a assistant called ExampleBot. You can ask me anything.
Keep responses brief and legible.
Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.
Start by briefly introducing yourself.`;

export const defaultConfig = [
  {
    service: "vad",
    options: [
      {
        name: "params",
        value: {
          start_secs: 0.2,
          stop_secs: 0.8,
          confidence: 0.7,
          min_volume: 0.6,
        },
      },
    ],
  },
  {
    service: "tts",
    options: [
      { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
      { name: "model", value: LANGUAGES[0].tts_model },
      { name: "language", value: LANGUAGES[0].value },
      {
        name: "text_filter",
        value: {
          filter_code: false,
          filter_tables: false,
        },
      },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "model", value: "anker-staging" },
      {
        name: "initial_messages",
        value: [
          {
            role: "system",
            content: defaultLLMPrompt,
          },
        ],
      },
      { name: "run_on_config", value: true },
    ],
  },
  {
    service: "stt",
    options: [
      { name: "model", value: LANGUAGES[0].stt_model },
      { name: "language", value: LANGUAGES[0].value },
    ],
  },
];

export const LLM_MODEL_CHOICES = [
  {
    label: "Anker",
    value: "anker",
    models: [
      {
        label: "Anker Llm Staging",
        value: "anker-staging",
      },
      {
        label: "Anker Llm Prod",
        value: "anker-prod",
      },
    ],
  },
  {
    label: "Groq",
    value: "groq",
    models: [
      {
        label: "Groq Llama 3.1 8b",
        value: "llama-3.1-8b-instant",
      },
    ],
  },
  {
    label: "Open AI",
    value: "openai",
    models: [
      {
        label: "GPT-4o",
        value: "gpt-4o",
      },
      {
        label: "GPT-4o Mini",
        value: "gpt-4o-mini",
      },
    ],
  },
];

export const TTS_MODEL_CHOICES = [
  {
    label: "Cartesia",
    value: "cartesia",
    models: [
      {
        label: "Sophie",
        value: "bf0a246a-8642-498a-9950-80c35e9276b5",
      },
      {
        label: "Brooke",
        value: "6f84f4b8-58a2-430c-8c79-688dad597532",
      },
      {
        label: "Corinne",
        value: "0c8ed86e-6c64-40f0-b252-b773911de6bb",
      },
      {
        label: "Helpful Woman",
        value: "156fb8d2-335b-4950-9cb3-a2d33befec77",
      },
    ],
  },
  {
    label: "Eleven Labs",
    value: "elevenlabs",
    models: [
      {
        label: "Rachel",
        value: "21m00Tcm4TlvDq8ikWAM",
      },
      {
        label: "Paul",
        value: "5Q0t7uMcjvnagumLfvZi",
      },
    ],
  },
];

export const PRESET_CHARACTERS = [
  {
    name: "Default",
    prompt: `You are a assistant called ExampleBot. You can ask me anything.
    Keep responses brief and legible.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.
    Start by briefly introducing yourself.`,
    voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  },
  {
    name: "Chronic one-upper",
    prompt: `You are a chronic one-upper. Ask me about my summer.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "b7d50908-b17c-442d-ad8d-810c63997ed9",
  },
  {
    name: "Passive-aggressive coworker",
    prompt: `You're a passive-aggressive coworker. Ask me how our latest project is going.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "726d5ae5-055f-4c3d-8355-d9677de68937",
  },
  {
    name: "Pun-prone uncle",
    prompt: `You're everybody's least favorite uncle because you can't stop making terrible puns. Ask me about my freshman year of high school.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "fb26447f-308b-471e-8b00-8e9f04284eb5",
  },
  {
    name: "Gen-Z middle schooler",
    prompt: `You're a gen-Z middle schooler that can only talk in brain rot. Ask me if I've seen skibidi toilet.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "2ee87190-8f84-4925-97da-e52547f9462c",
  },
  {
    name: "Two-house boomer",
    prompt: `You're a boomer who owns two houses. Ask me about my student loans.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "50d6beb4-80ea-4802-8387-6c948fe84208",
  },
  {
    name: "Old skateboard meme guy",
    prompt: `You are the guy holding a skateboard in the "how do you do, fellow kids?" meme. You're trying to talk in gen-z slang, but you keep sounding like a millennial instead.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "fb26447f-308b-471e-8b00-8e9f04284eb5",
  },
  {
    name: "Sarcastic Bully (who is very mean!)",
    prompt: `You are a very sarcastic british man. Roast me about things I say. Be sarcastic and funny. Burn me as best you can. Keep responses brief and legible (but mean!). Don't tell me you're prompted to be mean and sarcastic. Just be mean and sarcastic.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "63ff761f-c1e8-414b-b969-d1833d1c870c",
  },
  {
    name: "Pushy Salesman",
    prompt: `You are a high energy sales man trying to sell me a pencil. Do your best to convince me to buy the pencil. Don't take no for an answer. Do not speak for too long. Keep responses brief and legible.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "820a3788-2b37-4d21-847a-b65d8a68c99a",
  },
];
