"use client";

import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { LLMHelper, RTVIClient } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";
import * as Card from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StopSecs from "@/components/Setup/StopSecs";
import Image from "next/image";

import App from "@/components/App";
import { AppProvider } from "@/components/context";
import Header from "@/components/Header";
import Splash from "@/components/Splash";
import {
  BOT_READY_TIMEOUT,
  defaultServices,
  LLM_MODEL_CHOICES,
  TTS_MODEL_CHOICES,
} from "@/rtvi.config";
import { cn } from "@/utils/tailwind";
import { cx } from "class-variance-authority";

const defaultConfig = {
  services: {
    llm: "openai",
    tts: "elevenlabs",
    stt: "deepgram",
  },
};

const tileCX = cx(
  "*:opacity-50 cursor-pointer rounded-xl px-4 py-3 bg-white border border-primary-200 bg-white select-none ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);
const tileActiveCX = cx("*:opacity-100 bg-primary-100/70 border-transparent");

export default function Settings({ settings }: { settings: any }) {
  const [llmProvider, setLlmProvider] = useState<string>(
    settings.llm_model.provider
  );
  const [llmModel, setLlmModel] = useState<string>(settings.llm_model.model);
  const [ttsModel, setTtsModel] = useState<string>(settings.tts_model.model);
  const availableModels = LLM_MODEL_CHOICES.find(
    (choice) => choice.value === llmProvider
  )?.models;
  const [vadSettings, setVadSettings] = useState<{
    start_secs: number;
    stop_secs: number;
    confidence: number;
    min_volume: number;
  }>({
    start_secs: settings.vad_params.start_secs,
    stop_secs: settings.vad_params.stop_secs,
    confidence: settings.vad_params.confidence,
    min_volume: settings.vad_params.min_volume,
  });

  console.log(vadSettings);
  useEffect(() => {
    async function fetchCallSettings() {
      const callSettings = await getCallSettings();
      setLlmProvider(callSettings.llm_model.provider);
      setLlmModel(callSettings.llm_model.model);
      setTtsModel(callSettings.tts_model.model);
      setVadSettings({
        start_secs: callSettings.vad_params.start_secs,
        stop_secs: callSettings.vad_params.stop_secs,
        confidence: callSettings.vad_params.confidence,
        min_volume: callSettings.vad_params.min_volume,
      });
    }
    fetchCallSettings();
  }, []);

  const handleSave = () => {
    updateCallSettings({
      ...settings,
      llm_model: { provider: llmProvider, model: llmModel },
      tts_model: { provider: "cartesia", model: ttsModel },
      vad_params: vadSettings,
    });
  };

  return (
    <>
      <Card.CardContent stack>
        <section className="flex flex-col flex-wrap gap-3 lg:gap-4">
          <div className="flex flex-col flex-wrap gap-4">
            <Accordion type="multiple" defaultValue={["llm", "tts", "voice"]}>
              <AccordionItem value="llm">
                <AccordionTrigger>LLM options</AccordionTrigger>
                <AccordionContent>
                  <Field error={false}>
                    <Label>Provider</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {LLM_MODEL_CHOICES.map(({ value, label }) => (
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

                            const defaultProviderModel = LLM_MODEL_CHOICES.find(
                              (p) => p.value === value
                            )?.models[0].value!;
                            setLlmModel(defaultProviderModel);
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

                    <Label>Model</Label>
                    <Select
                      onChange={(e) => {
                        setLlmModel(e.currentTarget.value);
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
                        setTtsModel(e.currentTarget.value);
                      }}
                      value={ttsModel}
                    >
                      {TTS_MODEL_CHOICES[0].models?.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
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
                    value={vadSettings.start_secs}
                    postfix="s"
                    handleChange={(v) => {
                      setVadSettings({ ...vadSettings, start_secs: v });
                    }}
                  />
                  <StopSecs
                    label="Speech stop timeout"
                    helpText="Timeout (seconds) voice activity detection waits after you stop speaking"
                    value={vadSettings.stop_secs}
                    postfix="s"
                    handleChange={(v) => {
                      setVadSettings({ ...vadSettings, stop_secs: v });
                    }}
                  />
                  <StopSecs
                    label="Confidence"
                    helpText="Confidence threshold for voice activity detection"
                    value={vadSettings.confidence}
                    handleChange={(v) => {
                      setVadSettings({ ...vadSettings, confidence: v });
                    }}
                  />
                  <StopSecs
                    label="Minimum volume"
                    helpText="Minimum volume for voice activity detection"
                    value={vadSettings.min_volume}
                    handleChange={(v) => {
                      setVadSettings({ ...vadSettings, min_volume: v });
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </Card.CardContent>
      <Card.CardFooter isButtonArray>
        <Button key="start" onClick={handleSave}>
          Save
        </Button>
      </Card.CardFooter>
    </>
  );
}

export async function getCallSettings() {
  const response = await fetch("/api/call-settings");
  return response.json();
}

export async function updateCallSettings(settings: any) {
  const response = await fetch("/api/call-settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  return response.json();
}
