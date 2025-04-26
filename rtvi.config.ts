export const BOT_READY_TIMEOUT = 15 * 1000; // 15 seconds

export const defaultMaxDuration = 600;

export const LANGUAGES = [
  {
    label: "English",
    value: "en",
    tts_model: "cartesia",
    default_voice: "156fb8d2-335b-4950-9cb3-a2d33befec77",
    llm_provider: "anker",
    llm_model: "anker-prod",
    stt_provider: "deepgram",
    stt_model: "nova-3-general",
  },
  {
    label: "中文",
    value: "zh",
    tts_model: "cartesia",
    default_voice: "c59c247b-6aa9-4ab6-91f9-9eabea7dc69e",
    llm_provider: "openai",
    llm_model: "gpt-4o-mini",
    stt_provider: "deepgram",
    stt_model: "nova-2-general",
  },
  {
    label: "日文",
    value: "ja",
    tts_model: "cartesia",
    default_voice: "6b92f628-be90-497c-8f4c-3b035002df71",
    llm_provider: "openai",
    llm_model: "gpt-4o-mini",
    stt_provider: "deepgram",
    stt_model: "nova-2-general",
  },
];

export const defaultServices = {
  llm: "anker",
  tts: "cartesia",
  stt: "deepgram",
};

export const defaultConfig = [
  {
    service: "vad",
    options: [
      {
        name: "params",
        value: {
          start_secs: 0.2,
          stop_secs: 0.8,
          confidence: 1,
          min_volume: 0.6,
        },
      },
    ],
  },
  {
    service: "tts",
    options: [
      { name: "provider", value: LANGUAGES[0].tts_model },
      { name: "voice", value: LANGUAGES[0].default_voice },
      { name: "model", value: LANGUAGES[0].tts_model },
      { name: "language", value: LANGUAGES[0].value },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "provider", value: "anker" },
      { name: "model", value: "anker-prod" },
      { name: "run_on_config", value: true },
    ],
  },
  {
    service: "stt",
    options: [
      { name: "provider", value: LANGUAGES[0].stt_provider },
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
        label: "Jacqueline (F)",
        value: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        language: "en",
      },
      {
        label: "Brooke (F)",
        value: "6f84f4b8-58a2-430c-8c79-688dad597532",
        language: "en",
      },
      {
        label: "Jordan (M)",
        value: "87bc56aa-ab01-4baa-9071-77d497064686",
        language: "en",
      },
      {
        label: "Vexa (F)",
        value: "156fb8d2-335b-4950-9cb3-a2d33befec77",
        language: "en",
      },
      {
        label: "Chongz (M)",
        value: "146485fd-8736-41c7-88a8-7cdd0da34d84",
        language: "en",
      },
      {
        label: "Keith (M)",
        value: "9fa83ce3-c3a8-4523-accc-173904582ced",
        language: "en",
      },
      {
        label: "Ronald (M)",
        value: "5ee9feff-1265-424a-9d7f-8e4d431a12c7",
        language: "en",
      },
      {
        label: "Salesman (M)",
        value: "820a3788-2b37-4d21-847a-b65d8a68c99a",
        language: "en",
      },
      {
        label: "Joan (F)",
        value: "5abd2130-146a-41b1-bcdb-974ea8e19f56",
        language: "en",
      },
      {
        label: "Connie (F)",
        value: "8d8ce8c9-44a4-46c4-b10f-9a927b99a853",
        language: "en",
      },
      {
        label: "Professional women (F)",
        value: "248be419-c632-4f23-adf1-5324ed7dbf1d",
        language: "en",
      },
      {
        label: "教授",
        value: "c59c247b-6aa9-4ab6-91f9-9eabea7dc69e",
        language: "zh",
      },
      {
        label: "接线员",
        value: "3a63e2d1-1c1e-425d-8e79-5100bc910e90",
        language: "zh",
      },
      {
        label: "Kenji (M)",
        value: "6b92f628-be90-497c-8f4c-3b035002df71",
        language: "ja",
      },
      {
        label: "Yuki (F)",
        value: "59d4fd2f-f5eb-4410-8105-58db7661144f",
        language: "ja",
      },
      {
        label: "Yumi (F)",
        value: "2b568345-1d48-4047-b25f-7baccf842eb0",
        language: "ja",
      },
      {
        label: "Yuto (M)",
        value: "e8a863c6-22c7-4671-86ca-91cacffc038d",
        language: "ja",
      },
    ],
  },
];
