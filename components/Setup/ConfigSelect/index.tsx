import { cx } from "class-variance-authority";
import { Languages } from "lucide-react";
import Image from "next/image";
import React, { useContext } from "react";
import { RTVIClientConfigOption } from "realtime-ai";

import { AppContext, ClientParams } from "@/components/context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LANGUAGES, LLM_MODEL_CHOICES, TTS_MODEL_CHOICES } from "@/rtvi.config";
import { cn } from "@/utils/tailwind";

import StopSecs from "../StopSecs";

interface ConfigSelectProps {
  state: string;
  onServiceUpdate: (service: { [key: string]: string }) => void;
  onConfigUpdate: (configOption: RTVIClientConfigOption[]) => void;
  inSession?: boolean;
}

const tileCX = cx(
  "*:opacity-50 cursor-pointer rounded-xl px-4 py-3 bg-white border border-primary-200 bg-white select-none ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);
const tileActiveCX = cx("*:opacity-100 bg-primary-100/70 border-transparent");

interface ConfigOption {
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

const convertClientParamsToConfigOptions = (
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

export const ConfigSelect: React.FC<ConfigSelectProps> = ({
  onConfigUpdate,
  onServiceUpdate,
  state,
  inSession = false,
}) => {
  const { language, setLanguage, clientParams } = useContext(AppContext);
  const config = convertClientParamsToConfigOptions(clientParams);

  return (
    <>
      <div className="flex flex-col flex-wrap gap-4">
        <Field label="Language" error={false}>
          <Select
            onChange={(e) => {
              const languageConfig = LANGUAGES.find(
                (l) => l.value === e.currentTarget.value
              )!;
              setLanguage(languageConfig.value);
              onServiceUpdate({
                tts: languageConfig.tts_model,
                llm: languageConfig.llm_provider,
                stt: languageConfig.stt_provider,
              });

              onConfigUpdate([
                {
                  service: "tts",
                  options: [
                    { name: "language", value: languageConfig.value },
                    { name: "provider", value: languageConfig.tts_model },
                    { name: "voice", value: languageConfig.default_voice },
                    { name: "model", value: languageConfig.tts_model },
                  ],
                },
                {
                  service: "llm",
                  options: [
                    { name: "model", value: languageConfig.llm_model },
                    { name: "provider", value: languageConfig.llm_provider },
                  ],
                },
                {
                  service: "stt",
                  options: [
                    { name: "model", value: languageConfig.stt_model },
                    { name: "provider", value: languageConfig.stt_provider },
                    { name: "language", value: languageConfig.value },
                  ],
                },
              ]);
            }}
            value={config.tts.language}
            icon={<Languages size={24} />}
          >
            {LANGUAGES.map((lang, i) => (
              <option key={lang.label} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </Select>
        </Field>
        <Accordion type="single" collapsible>
          <AccordionItem value="llm">
            <AccordionTrigger>LLM options</AccordionTrigger>
            <AccordionContent>
              <Field error={false}>
                {!inSession && (
                  <>
                    <Label>Provider</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {LLM_MODEL_CHOICES.map(({ value, label }) => (
                        <div
                          tabIndex={0}
                          className={cn(
                            tileCX,
                            value === config.llm.provider && tileActiveCX
                          )}
                          key={value}
                          onClick={() => {
                            if (value === config.llm.provider) return;

                            const defaultProviderModel = LLM_MODEL_CHOICES.find(
                              (p) => p.value === value
                            )?.models[0].value!;

                            onServiceUpdate({ llm: value });
                            onConfigUpdate([
                              {
                                service: "llm",
                                options: [
                                  { name: "provider", value: value },
                                  {
                                    name: "model",
                                    value: defaultProviderModel,
                                  },
                                ],
                              },
                            ]);
                          }}
                        >
                          <Image
                            src={`/logo-${value}.svg`}
                            alt={label}
                            width="200"
                            height="60"
                            className="user-select-none pointer-events-none"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Label>Model</Label>
                <Select
                  onChange={(e) => {
                    onServiceUpdate({ llm: config.llm.provider });
                    onConfigUpdate([
                      {
                        service: "llm",
                        options: [
                          { name: "provider", value: config.llm.provider },
                          { name: "model", value: e.currentTarget.value },
                        ],
                      },
                    ]);
                  }}
                  value={config.llm.model}
                >
                  {LLM_MODEL_CHOICES.find(
                    ({ value }) => value === config.llm.provider
                  )?.models.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tts">
            <AccordionTrigger>TTS options</AccordionTrigger>
            <AccordionContent>
              <Field error={false}>
                <Label>Model</Label>
                <Select
                  onChange={(e) => {
                    const provider = TTS_MODEL_CHOICES.find(({ models }) =>
                      models.find((m) => m.value === e.currentTarget.value)
                    )!;
                    const voice = provider.models.find(
                      (m) => m.value === e.currentTarget.value
                    )!;
                    onServiceUpdate({ tts: provider.value });
                    onConfigUpdate([
                      {
                        service: "tts",
                        options: [
                          { name: "language", value: voice.language },
                          { name: "provider", value: provider.value },
                          { name: "voice", value: voice.value },
                          { name: "model", value: provider.value },
                        ],
                      },
                    ]);
                  }}
                  value={config.tts.voice}
                >
                  {TTS_MODEL_CHOICES.filter(({ models }) =>
                    models.find(({ language: lang }) => lang === language)
                  ).map(({ value, label, models }) => (
                    <optgroup key={value} label={label}>
                      {models
                        .filter(({ language: lang }) => language === lang)
                        .map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </Select>
              </Field>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="voice">
            <AccordionTrigger>VAD config</AccordionTrigger>
            <AccordionContent>
              <StopSecs
                label="Speech start timeout"
                helpText="Timeout (seconds) voice activity detection waits after you start speaking"
                value={config.vad.start_secs}
                postfix="s"
                handleChange={(v) => {
                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...config.vad, start_secs: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
              <StopSecs
                label="Speech stop timeout"
                helpText="Timeout (seconds) voice activity detection waits after you stop speaking"
                value={config.vad.stop_secs}
                postfix="s"
                handleChange={(v) => {
                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...config.vad, stop_secs: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
              <StopSecs
                label="Confidence"
                helpText="Confidence threshold for voice activity detection"
                value={config.vad.confidence}
                handleChange={(v) => {
                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...config.vad, confidence: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
              <StopSecs
                label="Minimum volume"
                helpText="Minimum volume for voice activity detection"
                value={config.vad.min_volume}
                handleChange={(v) => {
                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...config.vad, min_volume: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default ConfigSelect;
