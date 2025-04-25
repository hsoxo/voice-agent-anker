import { cx } from "class-variance-authority";
import { Languages } from "lucide-react";
import Image from "next/image";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RTVIClientConfigOption } from "realtime-ai";

import { AppContext } from "@/components/context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  defaultLLMPrompt,
  LANGUAGES,
  LLM_MODEL_CHOICES,
  TTS_MODEL_CHOICES,
  PRESET_CHARACTERS,
} from "@/rtvi.config";
import { cn } from "@/utils/tailwind";

import Prompt from "../Prompt";
import StopSecs from "../StopSecs";

type CharacterData = {
  name: string;
  prompt: string;
  voice: string;
};

interface ConfigSelectProps {
  state: string;
  onServiceUpdate: (service: { [key: string]: string }) => void;
  onConfigUpdate: (configOption: RTVIClientConfigOption[]) => void;
  inSession?: boolean;
}

const llmProviders = LLM_MODEL_CHOICES.map((choice) => ({
  label: choice.label,
  value: choice.value,
  models: choice.models,
}));

const ttsProviders = TTS_MODEL_CHOICES.map((choice) => ({
  label: choice.label,
  value: choice.value,
  models: choice.models,
}));

const tileCX = cx(
  "*:opacity-50 cursor-pointer rounded-xl px-4 py-3 bg-white border border-primary-200 bg-white select-none ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);
const tileActiveCX = cx("*:opacity-100 bg-primary-100/70 border-transparent");

export const ConfigSelect: React.FC<ConfigSelectProps> = ({
  onConfigUpdate,
  onServiceUpdate,
  state,
  inSession = false,
}) => {
  const { character, setCharacter, language, setLanguage, clientParams } =
    useContext(AppContext);
  console.log(clientParams);

  const [llmProvider, setLlmProvider] = useState<string>(
    clientParams.services.llm
  );
  const [llmModel, setLlmModel] = useState<string>(
    clientParams.config
      .find((c) => c.service === "llm")
      ?.options.find((p) => p.name === "model")?.value as string
  );

  const [ttsProvider, setTtsProvider] = useState<string>(
    clientParams.services.tts
  );
  const [vadStopSecs, setVadStopSecs] = useState<number>(
    (
      clientParams.config
        .find((c) => c.service === "vad")
        ?.options.find((p) => p.name === "params")?.value as {
        stop_secs: number;
      }
    )?.stop_secs
  );
  const [vadStartSecs, setVadStartSecs] = useState<number>(
    (
      clientParams.config
        .find((c) => c.service === "vad")
        ?.options.find((p) => p.name === "params")?.value as {
        start_secs: number;
      }
    )?.start_secs
  );
  const [vadConfidence, setVadConfidence] = useState<number>(
    (
      clientParams.config
        .find((c) => c.service === "vad")
        ?.options.find((p) => p.name === "params")?.value as {
        confidence: number;
      }
    )?.confidence
  );
  const [vadMinVolume, setVadMinVolume] = useState<number>(
    (
      clientParams.config
        .find((c) => c.service === "vad")
        ?.options.find((p) => p.name === "params")?.value as {
        min_volume: number;
      }
    )?.min_volume
  );

  const vadParams = {
    start_secs: vadStartSecs,
    stop_secs: vadStopSecs,
    confidence: vadConfidence,
    min_volume: vadMinVolume,
  };

  const [showPrompt, setshowPrompt] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const ttsConfig = clientParams.config.find(
    (c) => c.service === "tts"
  )!.options;
  const ttsVoice = ttsConfig.find((p) => p.name === "voice")!.value;
  const [ttsModel, setTtsModel] = useState<string>(ttsVoice as string);

  useEffect(() => {
    // Modal effect
    // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
    const current = modalRef.current;

    if (current && showPrompt) {
      current.inert = true;
      current.showModal();
      current.inert = false;
    }
    return () => current?.close();
  }, [showPrompt]);

  const availableModels = LLM_MODEL_CHOICES.find(
    (choice) => choice.value === llmProvider
  )?.models;

  return (
    <>
      <dialog ref={modalRef}>
        <Prompt
          characterPrompt={PRESET_CHARACTERS[character].prompt}
          handleUpdate={(prompt) => {
            onConfigUpdate([
              {
                service: "llm",
                options: [{ name: "initial_messages", value: prompt }],
              },
            ]);
          }}
          handleClose={() => setshowPrompt(false)}
        />
      </dialog>
      <div className="flex flex-col flex-wrap gap-4">
        <Field label="Language" error={false}>
          <Select
            onChange={(e) => {
              setLanguage(e.currentTarget.value);
              const languageConfig = LANGUAGES.find(
                (l) => l.value === e.currentTarget.value
              );
              const voices = TTS_MODEL_CHOICES.find(
                (m) => m.value === languageConfig?.tts_model
              )?.models;
              setTtsModel(
                languageConfig?.default_voice ?? voices?.[0].value ?? ""
              );
              const llmModel = languageConfig?.llm_model ?? "gpt-4o-mini";
              const llmProvider =
                LLM_MODEL_CHOICES.find((l) =>
                  l.models.some((m) => m.value === llmModel)
                )?.value ?? "openai";

              setLlmProvider(llmProvider);
              setLlmModel(llmModel);
              onConfigUpdate([
                {
                  service: "tts",
                  options: [
                    { name: "language", value: languageConfig?.value },
                    { name: "provider", value: languageConfig?.tts_model },
                    { name: "voice", value: languageConfig?.default_voice },
                    { name: "model", value: languageConfig?.tts_model },
                  ],
                },
                {
                  service: "llm",
                  options: [
                    { name: "model", value: llmModel },
                    { name: "provider", value: llmProvider },
                  ],
                },
              ]);
            }}
            value={language}
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
          {/* {language === 0 && (
            <AccordionItem value="character">
              <AccordionTrigger>Character</AccordionTrigger>
              <AccordionContent>
                <Field error={false}>
                  <div className="w-full flex flex-col md:flex-row gap-2">
                    <Select
                      disabled={inSession && !["ready", "idle"].includes(state)}
                      className="flex-1"
                      value={character}
                      onChange={(e) => {
                        setCharacter(parseInt(e.currentTarget.value));
                        composeConfig(
                          parseInt(e.currentTarget.value),
                          language
                        );
                      }}
                    >
                      {PRESET_CHARACTERS.map(({ name }, i) => (
                        <option key={`char-${i}`} value={i}>
                          {name}
                        </option>
                      ))}
                    </Select>
                    <Button variant="light" onClick={() => setshowPrompt(true)}>
                      Customize
                    </Button>
                  </div>
                </Field>
              </AccordionContent>
            </AccordionItem>
          )} */}
          <AccordionItem value="llm">
            <AccordionTrigger>LLM options</AccordionTrigger>
            <AccordionContent>
              <Field error={false}>
                {!inSession && (
                  <>
                    <Label>Provider</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {llmProviders.map(({ value, label }) => (
                        <div
                          tabIndex={0}
                          className={cn(
                            tileCX,
                            value === llmProvider && tileActiveCX
                          )}
                          key={value}
                          onClick={() => {
                            if (value === llmProvider) return;

                            setLlmProvider(value);

                            const defaultProviderModel = llmProviders.find(
                              (p) => p.value === value
                            )?.models[0].value!;
                            setLlmModel(defaultProviderModel);

                            // Update app context
                            onServiceUpdate({ llm: value });
                            onConfigUpdate([
                              {
                                service: "llm",
                                options: [
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
                    setLlmModel(e.currentTarget.value);
                    onConfigUpdate([
                      {
                        service: "llm",
                        options: [
                          { name: "model", value: e.currentTarget.value },
                        ],
                      },
                    ]);
                  }}
                  value={llmModel}
                >
                  {availableModels?.map(({ value, label }) => (
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
                    )?.value;
                    if (provider) {
                      const voice = TTS_MODEL_CHOICES.find(({ models }) =>
                        models.find((m) => m.value === e.currentTarget.value)
                      )?.models.find((m) => m.value === e.currentTarget.value);
                      setTtsModel(e.target.value);
                      setTtsProvider(provider);
                      onConfigUpdate([
                        {
                          service: "tts",
                          options: [
                            { name: "language", value: voice?.language },
                            { name: "provider", value: provider },
                            { name: "voice", value: voice?.value },
                            { name: "model", value: provider },
                          ],
                        },
                      ]);
                    }
                  }}
                  value={ttsModel}
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
                value={vadStartSecs}
                postfix="s"
                handleChange={(v) => {
                  setVadStartSecs(v);

                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...vadParams, start_secs: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
              <StopSecs
                label="Speech stop timeout"
                helpText="Timeout (seconds) voice activity detection waits after you stop speaking"
                value={vadStopSecs}
                postfix="s"
                handleChange={(v) => {
                  setVadStopSecs(v);

                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...vadParams, stop_secs: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
              <StopSecs
                label="Confidence"
                helpText="Confidence threshold for voice activity detection"
                value={vadConfidence}
                handleChange={(v) => {
                  setVadConfidence(v);

                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...vadParams, confidence: v },
                        },
                      ],
                    },
                  ]);
                }}
              />
              <StopSecs
                label="Minimum volume"
                helpText="Minimum volume for voice activity detection"
                value={vadMinVolume}
                handleChange={(v) => {
                  setVadMinVolume(v);

                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [
                        {
                          name: "params",
                          value: { ...vadParams, min_volume: v },
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
