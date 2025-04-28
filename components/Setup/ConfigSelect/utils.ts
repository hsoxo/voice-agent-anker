import { ClientParams } from "@/components/context";

export interface ConfigOption {
  llm: {
    model: string;
    provider: string;
  };
  tts: {
      language: string;
      provider: string;
      voice: string;
      model: string;
  };
  vad: {
      start_secs: number;
      stop_secs: number;
      confidence: number;
      min_volume: number;
  };
  stt: {
      language: string;
      model: string;
  };
}
  
export const convertClientParamsToConfigOptions = (
  clientParams: ClientParams
): ConfigOption => {
  return clientParams.config.reduce((acc, config) => {
    acc[config.service] = config.options.reduce((acc, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {} as any);
    return acc;
  }, {} as any);
};