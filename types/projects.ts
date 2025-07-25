export type AWSKey = {
  aws_access_key_id: string;
  aws_secret_access_key: string;
};

type TTSModel = {
  provider?: string; // default: "cartesia"
  language?: string; // default: "en"
  model?: string; // default: "cartesia"
  voice: string;
};

type LLMModel = {
  provider: string;
  model: string;
  customer: string;
  system_prompt: string;
};

type VADParams = {
  start_secs?: number; // default: 0.2
  stop_secs?: number; // default: 0.8
  confidence?: number; // default: 0.7
  min_volume?: number; // default: 0.6
};

type StartBotRequest = {
  app_id?: string | null;
  room_url?: string | null;
  token?: string | null;
  language?: string; // default: "en"
  tts_model: TTSModel;
  llm_model: LLMModel;
  vad_params: VADParams;
  chat_id?: string | null;
  open_statement?: boolean | string; // default: true
  template?: string | null;
  llm_url?: string | null;
};

type Option = {
  name: string;
  value: any;
};

export type ServiceConfig = {
  service: string;
  options: Option[];
};

type ServicesMapping = {
  llm: string;
  tts: string;
  stt: string;
};

export type CallSettings = {
  config: ServiceConfig[];
  services: ServicesMapping;
};

export type Project = {
  id: string;
  call_settings: ServiceConfig[];
  services: Record<string, string>;
  flow_path: string;
};
