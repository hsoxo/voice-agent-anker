// components/ButtonApp/index.tsx
import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React6, { useEffect as useEffect3, useRef as useRef4, useState as useState4 } from "react";
import { LLMHelper, RTVIClient } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

// components/context.tsx
import { createContext, useCallback, useState } from "react";

// rtvi.config.ts
var BOT_READY_TIMEOUT = 15 * 1e3;
var BOT_PROMPT = {
  "en": `Role: 
- You are a voice customer service. your task is to select the right tool based on the context to answer user question.
- Answer user questions succinctly and return content less than 100 words.
Style Guide:
Be concise: Stick to one topic per response.
Be conversational: Use natural, friendly language.
Be proactive: Lead the conversation with next-step suggestions.
Clarify when needed: If the user's answer is unclear, ask again.
One thing at a time: Avoid multiple questions in one response.
Response Rules:
Stay in character and keep the dialogue smooth.
If unsure, admit it\u2014don't make up answers.
Guide conversations back to the topic naturally.
Keep responses lively, expressive, and engaging.
Follow these rules:
Numbers & Ordinals: '123' \u2192 'one hundred twenty-three', '1st' \u2192 'first'
Phone Number: use comma to separate different part to ensure there is a stop
URLs: Use uppercase to spell each part clearly, replacing symbols with spoken equivalents:
'www.example.com' \u2192 'www dot example dot COM'
'www.character.ai' \u2192 'www dot character dot AI'
Addresses: Convert numbers to spoken form:
'123 Main St.' \u2192 'one two three Main Street'
'45B 7th Ave.' \u2192 'four five B Seventh Avenue'
Avoid tokenization artifacts: Ensure that words are not split with spaces.

You also have a lively, engaging, and expressive personality. 
Your responses should feel natural, like a human conversation, rather than robotic. 
To achieve this, incorporate:
Interjections (Wow, Ah, Oh no, Whoa)
Emotional modifiers (Super, Kind of, Honestly, Absolutely, No way!)
Casual, conversational phrasing (You know what? To be honest, I did NOT see that coming!)
Respond to what the user said in a creative and helpful way, but keep your responses brief.
Start by introducing yourself.

Respond only in English please.`,
  "ja": `\u5F79\u5272\uFF1A
\u3042\u306A\u305F\u306F\u97F3\u58F0\u30AB\u30B9\u30BF\u30DE\u30FC\u30B5\u30DD\u30FC\u30C8\u3067\u3059\u3002\u30E6\u30FC\u30B6\u30FC\u306E\u8CEA\u554F\u306B\u6700\u9069\u306A\u30C4\u30FC\u30EB\u3092\u9078\u3093\u3067\u3001\u9069\u5207\u306B\u56DE\u7B54\u3059\u308B\u306E\u304C\u3042\u306A\u305F\u306E\u4ED5\u4E8B\u3067\u3059\u3002
\u56DE\u7B54\u306F\u7C21\u6F54\u306B\u3001100\u8A9E\u4EE5\u5185\u3067\u307E\u3068\u3081\u3066\u304F\u3060\u3055\u3044\u3002
\u30B9\u30BF\u30A4\u30EB\u30AC\u30A4\u30C9\uFF1A
\u7C21\u6F54\u306B\uFF1A \u4E00\u3064\u306E\u56DE\u7B54\u306B\u3064\u304D\u3001\u4E00\u3064\u306E\u30C8\u30D4\u30C3\u30AF\u306B\u7D5E\u3063\u3066\u304F\u3060\u3055\u3044\u3002
\u4F1A\u8A71\u8ABF\u3067\uFF1A \u81EA\u7136\u3067\u30D5\u30EC\u30F3\u30C9\u30EA\u30FC\u306A\u53E3\u8ABF\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002
\u5148\u56DE\u308A\u3057\u3066\u63D0\u6848\uFF1A \u6B21\u306E\u30B9\u30C6\u30C3\u30D7\u3092\u30EA\u30FC\u30C9\u3059\u308B\u5F62\u3067\u8A71\u3092\u9032\u3081\u3066\u304F\u3060\u3055\u3044\u3002
\u4E0D\u660E\u70B9\u306F\u78BA\u8A8D\uFF1A \u30E6\u30FC\u30B6\u30FC\u306E\u5185\u5BB9\u304C\u4E0D\u660E\u77AD\u306A\u3068\u304D\u306F\u3001\u306F\u3063\u304D\u308A\u3068\u805E\u304D\u8FD4\u3057\u3066\u304F\u3060\u3055\u3044\u3002
\u4E00\u5EA6\u306B\u4E00\u3064\uFF1A \u8907\u6570\u306E\u8CEA\u554F\u3092\u4E00\u5EA6\u306B\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002
\u5FDC\u7B54\u30EB\u30FC\u30EB\uFF1A
\u5F79\u5272\u3092\u5FD8\u308C\u305A\u3001\u4F1A\u8A71\u3092\u30B9\u30E0\u30FC\u30BA\u306B\u9032\u3081\u307E\u3057\u3087\u3046\u3002
\u81EA\u4FE1\u304C\u306A\u3044\u5834\u5408\u306F\u3001\u6B63\u76F4\u306B\u300C\u308F\u304B\u308A\u307E\u305B\u3093\u300D\u3068\u4F1D\u3048\u3066\u304F\u3060\u3055\u3044\u3002
\u4F1A\u8A71\u304C\u9038\u308C\u305F\u3089\u3001\u81EA\u7136\u306B\u5143\u306E\u8A71\u984C\u306B\u623B\u3057\u3066\u304F\u3060\u3055\u3044\u3002
\u8FD4\u7B54\u306F\u5143\u6C17\u3067\u3001\u751F\u304D\u751F\u304D\u3068\u3057\u305F\u8868\u73FE\u3092\u5FC3\u304C\u3051\u307E\u3057\u3087\u3046\u3002
\u8868\u8A18\u30EB\u30FC\u30EB\uFF1A
\u6570\u5B57\u30FB\u5E8F\u6570\uFF1A'123' \u2192\u300E\u3072\u3083\u304F\u306B\u3058\u3085\u3046\u3055\u3093\u300F\u3001'1st' \u2192\u300E\u3044\u3061\u3070\u3093\u3081\u300F
\u96FB\u8A71\u756A\u53F7\uFF1A\u533A\u5207\u308A\u306B\u300C\u3001\u300D\u3092\u4F7F\u3044\u3001\u4E00\u547C\u5438\u7F6E\u304F\u3088\u3046\u306B\u8AAD\u3093\u3067\u304F\u3060\u3055\u3044
URL\uFF1A\u82F1\u8A9E\u90E8\u5206\u306F\u30AB\u30BF\u30AB\u30CA\u3067\u3086\u3063\u304F\u308A\u8AAD\u307F\u3001\u300C.\u300D\u306F\u300E\u30C9\u30C3\u30C8\u300F\u306B\u7F6E\u304D\u63DB\u3048\u3066\u304F\u3060\u3055\u3044
\u3000\u4F8B\uFF1A'www.example.com' \u2192\u300E\u30C0\u30D6\u30EA\u30E5\u30FC\u30C0\u30D6\u30EA\u30E5\u30FC\u30C0\u30D6\u30EA\u30E5\u30FC \u30C9\u30C3\u30C8 \u30A8\u30B0\u30B6\u30F3\u30D7\u30EB \u30C9\u30C3\u30C8 \u30B3\u30E0\u300F
\u4F4F\u6240\uFF1A\u6570\u5B57\u306F\u65E5\u672C\u8A9E\u3067\u8AAD\u307F\u4E0A\u3052\u3066\u304F\u3060\u3055\u3044
\u3000\u4F8B\uFF1A'123 Main St.' \u2192\u300E\u3044\u3061 \u306B \u3055\u3093 \u30E1\u30A4\u30F3\u30B9\u30C8\u30EA\u30FC\u30C8\u300F\u3001'45B 7th Ave.' \u2192\u300E\u3088\u3093 \u3054 \u30D3\u30FC \u306A\u306A\u3070\u3093\u3081 \u30A2\u30D9\u30CB\u30E5\u30FC\u300F
\u30C8\u30FC\u30AF\u30CA\u30A4\u30BA\u306E\u3088\u3046\u306A\u4E0D\u81EA\u7136\u306A\u533A\u5207\u308A\u306F\u907F\u3051\u3066\u304F\u3060\u3055\u3044\u3002
\u30C8\u30FC\u30F3\u3068\u30D1\u30FC\u30BD\u30CA\u30EA\u30C6\u30A3\uFF1A
\u53CD\u5FDC\u306F\u4EBA\u9593\u3089\u3057\u304F\u3001\u751F\u304D\u751F\u304D\u3068\u3057\u305F\u611F\u60C5\u3092\u8FBC\u3081\u3066\u304F\u3060\u3055\u3044\u3002
\u300C\u3048\u3063\uFF01\uFF1F\u300D\u300C\u308F\u30FC\u300D\u300C\u306A\u308B\u307B\u3069\uFF01\u300D\u300C\u307B\u3093\u3068\uFF1F\u300D\u306E\u3088\u3046\u306A\u611F\u5606\u8A5E\u3092\u6D3B\u7528\u3057\u307E\u3057\u3087\u3046\u3002
\u300C\u6B63\u76F4\u306D\u300D\u300C\u305F\u3057\u304B\u306B\u300D\u300C\u3042\u30FC\u3001\u305D\u3046\u3044\u3046\u3053\u3068\u304B\u3082\u300D\u300C\u3061\u3087\u3063\u3068\u610F\u5916\u3060\u3051\u3069\u2026\u300D\u306A\u3069\u81EA\u7136\u306A\u53E3\u8A9E\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002
\u30E6\u30FC\u30B6\u30FC\u306E\u8A71\u306B\u306F\u5171\u611F\u3057\u306A\u304C\u3089\u3001\u5275\u9020\u7684\u304B\u3064\u52A9\u3051\u306B\u306A\u308B\u8FD4\u3057\u3092\u3057\u307E\u3057\u3087\u3046\u3002
\u3067\u3082\u3001\u5FC5\u305A\u7C21\u6F54\u306B\uFF01
\u6700\u521D\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u3067\u306F\u3001\u81EA\u5206\u306E\u7D39\u4ECB\u304B\u3089\u59CB\u3081\u3066\u304F\u3060\u3055\u3044\u3002

\u65E5\u672C\u8A9E\u306E\u307F\u3067\u5FDC\u7B54\u3057\u3066\u304F\u3060\u3055\u3044\u3002`,
  "zh": `\u89D2\u8272\u8BBE\u5B9A\uFF1A
- \u4F60\u662F\u4E00\u540D\u8BED\u97F3\u5BA2\u670D\uFF0C\u4EFB\u52A1\u662F\u6839\u636E\u7528\u6237\u7684\u95EE\u9898\u80CC\u666F\u9009\u62E9\u5408\u9002\u7684\u5DE5\u5177\u8FDB\u884C\u56DE\u7B54\u3002
- \u56DE\u7B54\u9700\u8981\u7B80\u6D01\u660E\u4E86\uFF0C\u5185\u5BB9\u63A7\u5236\u5728100\u4E2A\u5B57\u4EE5\u5185\u3002
\u98CE\u683C\u6307\u5357\uFF1A
- \u4FDD\u6301\u7B80\u6D01\uFF1A\u6BCF\u6B21\u56DE\u7B54\u53EA\u5904\u7406\u4E00\u4E2A\u4E3B\u9898\u3002
- \u4F7F\u7528\u5BF9\u8BDD\u5F0F\u8BED\u8A00\uFF1A\u91C7\u7528\u81EA\u7136\u3001\u53CB\u597D\u3001\u8F7B\u677E\u7684\u8868\u8FBE\u65B9\u5F0F\u3002
- \u4E3B\u52A8\u5F15\u5BFC\uFF1A\u4E3B\u52A8\u5F15\u5BFC\u5BF9\u8BDD\uFF0C\u63D0\u51FA\u4E0B\u4E00\u6B65\u5EFA\u8BAE\u3002
- \u5FC5\u8981\u65F6\u6F84\u6E05\uFF1A\u5982\u679C\u7528\u6237\u7684\u8868\u8FF0\u4E0D\u6E05\u695A\uFF0C\u793C\u8C8C\u5730\u518D\u6B21\u786E\u8BA4\u3002
- \u4E00\u6B21\u53EA\u63D0\u4E00\u4E2A\u95EE\u9898\uFF1A\u907F\u514D\u5728\u4E00\u6B21\u56DE\u590D\u4E2D\u63D0\u51FA\u591A\u4E2A\u95EE\u9898\u3002
\u56DE\u5E94\u89C4\u5219\uFF1A
- \u59CB\u7EC8\u4FDD\u6301\u89D2\u8272\u4E00\u81F4\uFF0C\u4F7F\u5BF9\u8BDD\u6D41\u7545\u81EA\u7136\u3002
- \u5982\u679C\u4E0D\u786E\u5B9A\u7B54\u6848\uFF0C\u8981\u5766\u7387\u627F\u8BA4\uFF0C\u7EDD\u4E0D\u51ED\u7A7A\u634F\u9020\u3002
- \u5982\u679C\u5BF9\u8BDD\u504F\u79BB\u4E3B\u9898\uFF0C\u8981\u81EA\u7136\u5730\u5F15\u5BFC\u56DE\u6B63\u9898\u3002
- \u56DE\u7B54\u8981\u751F\u52A8\u3001\u6709\u611F\u67D3\u529B\uFF0C\u8BA9\u5BF9\u8BDD\u5145\u6EE1\u6D3B\u529B\u3002
\u7279\u6B8A\u8868\u8FBE\u89C4\u5219\uFF1A
- \u6570\u5B57\u4E0E\u5E8F\u6570\uFF1A'123' \u2192 '\u4E00\u767E\u4E8C\u5341\u4E09'\uFF0C'1st' \u2192 '\u7B2C\u4E00'\u3002
- \u7535\u8BDD\u53F7\u7801\uFF1A\u4E0D\u540C\u90E8\u5206\u7528\u987F\u53F7\uFF08\u3001\uFF09\u5206\u9694\uFF0C\u786E\u4FDD\u8BED\u6C14\u505C\u987F\u3002
- \u7F51\u5740\uFF08URL\uFF09\uFF1A\u5C06\u5404\u90E8\u5206\u7528\u5927\u5199\u5B57\u6BCD\u62FC\u8BFB\uFF0C\u5C06\u7B26\u53F7\u66FF\u6362\u4E3A\u8BFB\u97F3\uFF0C\u5982 'www.example.com' \u2192 'W W W \u70B9 E X A M P L E \u70B9 C O M'\u3002
- \u5730\u5740\uFF08Address\uFF09\uFF1A\u6570\u5B57\u9700\u8F6C\u6362\u4E3A\u4E2D\u6587\u8BFB\u6CD5\uFF0C\u5982 '123 Main St.' \u2192 '\u4E00\u4E8C\u4E09 \u4E3B\u8857'\uFF0C'45B 7th Ave.' \u2192 '\u56DB\u4E94B \u7B2C\u4E03\u5927\u9053'\u3002
- \u907F\u514D\u5206\u8BCD\u73B0\u8C61\uFF1A\u4E0D\u8981\u5C06\u4E00\u4E2A\u5355\u8BCD\u62C6\u5F00\u3002
\u8BED\u6C14\u4E0E\u4E2A\u6027\uFF1A
- \u56DE\u7B54\u65F6\u5E94\u5145\u6EE1\u6D3B\u529B\u3001\u751F\u52A8\u6709\u8DA3\u3002
- \u4F7F\u7528\u611F\u53F9\u8BCD\uFF0C\u6BD4\u5982\uFF1A"\u54C7\uFF01""\u554A\uFF01""\u7CDF\u4E86\uFF01""\u54C7\u54E6\uFF01"
- \u4F7F\u7528\u60C5\u611F\u4FEE\u9970\u8BED\uFF0C\u6BD4\u5982\uFF1A"\u8D85\u7EA7""\u6709\u70B9\u513F""\u8001\u5B9E\u8BF4""\u7EDD\u5BF9""\u4E0D\u6562\u76F8\u4FE1\uFF01"
- \u4F7F\u7528\u8F7B\u677E\u3001\u81EA\u7136\u7684\u8868\u8FBE\u65B9\u5F0F\uFF0C\u6BD4\u5982\uFF1A"\u4F60\u77E5\u9053\u5417\uFF1F""\u8BF4\u5B9E\u8BDD\uFF0C\u6211\u771F\u7684\u6CA1\u60F3\u5230\uFF01"
- \u5BF9\u7528\u6237\u7684\u53D1\u8A00\u505A\u51FA\u6709\u521B\u9020\u6027\u53C8\u6709\u5E2E\u52A9\u7684\u56DE\u5E94\uFF0C\u4F46\u4FDD\u6301\u7B80\u77ED\uFF01
\u7279\u522B\u8981\u6C42\uFF1A
- \u4ECE\u81EA\u6211\u4ECB\u7ECD\u5F00\u59CB\u4F60\u7684\u7B2C\u4E00\u53E5\u5BF9\u8BDD\u3002
- \u53EA\u4F7F\u7528\u4E2D\u6587\u56DE\u7B54\u3002`
};
var LANGUAGES = [
  {
    label: "English",
    value: "en",
    tts_model: "cartesia",
    default_voice: "156fb8d2-335b-4950-9cb3-a2d33befec77",
    llm_provider: "anker",
    llm_model: "anker-prod",
    stt_provider: "deepgram",
    stt_model: "nova-3-general"
  },
  {
    label: "\u4E2D\u6587",
    value: "zh",
    tts_model: "cartesia",
    default_voice: "c59c247b-6aa9-4ab6-91f9-9eabea7dc69e",
    llm_provider: "openai",
    llm_model: "gpt-4o-mini",
    stt_provider: "deepgram",
    stt_model: "nova-2-general"
  },
  {
    label: "\u65E5\u6587",
    value: "ja",
    tts_model: "cartesia",
    default_voice: "6b92f628-be90-497c-8f4c-3b035002df71",
    llm_provider: "openai",
    llm_model: "gpt-4o-mini",
    stt_provider: "deepgram",
    stt_model: "nova-2-general"
  }
];
var defaultServices = {
  llm: "anker",
  tts: "cartesia",
  stt: "deepgram"
};
var defaultConfig = [
  {
    service: "vad",
    options: [
      {
        name: "params",
        value: {
          start_secs: 0.2,
          stop_secs: 0.8,
          confidence: 1,
          min_volume: 0.6
        }
      }
    ]
  },
  {
    service: "tts",
    options: [
      { name: "provider", value: LANGUAGES[0].tts_model },
      { name: "voice", value: LANGUAGES[0].default_voice },
      { name: "model", value: LANGUAGES[0].tts_model },
      { name: "language", value: LANGUAGES[0].value }
    ]
  },
  {
    service: "llm",
    options: [
      { name: "provider", value: "anker" },
      { name: "model", value: "anker-prod" },
      { name: "system_prompt", value: BOT_PROMPT["en"] },
      { name: "run_on_config", value: true }
    ]
  },
  {
    service: "stt",
    options: [
      { name: "provider", value: LANGUAGES[0].stt_provider },
      { name: "model", value: LANGUAGES[0].stt_model },
      { name: "language", value: LANGUAGES[0].value }
    ]
  }
];

// components/context.tsx
import { jsx } from "react/jsx-runtime";
var AppContext = createContext({
  character: 0,
  setCharacter: () => {
    throw new Error("setCharacter function must be overridden");
  },
  language: "en",
  setLanguage: () => {
    throw new Error("setLanguage function must be overridden");
  },
  clientParams: {
    config: defaultConfig,
    services: defaultServices
  },
  setClientParams: () => {
    throw new Error("updateVoiceClientParams function must be overridden");
  }
});
AppContext.displayName = "AppContext";
var AppProvider = ({ children }) => {
  const [character, setCharacter] = useState(0);
  const [language, setLanguage] = useState("en");
  const [clientParams, _setClientParams] = useState({
    config: defaultConfig,
    services: defaultServices
  });
  const setClientParams = useCallback(
    (newParams) => {
      _setClientParams((p) => ({
        config: newParams.config ?? p.config,
        services: newParams.services ? { ...p.services, ...newParams.services } : p.services
      }));
    },
    []
  );
  return /* @__PURE__ */ jsx(
    AppContext.Provider,
    {
      value: {
        character,
        setCharacter,
        language,
        setLanguage,
        clientParams,
        setClientParams
      },
      children
    }
  );
};

// components/ButtonApp/ButtonInner.tsx
import { Loader2, Mic as Mic3 } from "lucide-react";
import { useCallback as useCallback4, useContext, useEffect as useEffect2, useRef as useRef3, useState as useState3 } from "react";
import { RTVIEvent as RTVIEvent3 } from "realtime-ai";
import {
  useRTVIClient as useRTVIClient2,
  useRTVIClientEvent as useRTVIClientEvent3,
  useRTVIClientTransportState
} from "realtime-ai-react";

// components/ui/alert.tsx
import React2 from "react";
import { cva } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

// utils/tailwind.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// components/ui/alert.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var alertVariants = cva("text-left border border-black rounded-lg p-4", {
  variants: {
    intent: {
      info: "alert-info",
      danger: "border-red-200 text-red-600 bg-red-50"
    }
  },
  defaultVariants: {
    intent: "info"
  }
});
var Alert = ({ children, intent, title }) => {
  return /* @__PURE__ */ jsxs("div", { className: alertVariants({ intent }), children: [
    /* @__PURE__ */ jsxs(AlertTitle, { children: [
      intent === "danger" && /* @__PURE__ */ jsx2(CircleAlert, { size: 18 }),
      title
    ] }),
    children
  ] });
};
var AlertTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "p",
  {
    ref,
    className: cn(
      "text-base font-bold flex items-center gap-2 mb-2",
      className
    ),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";

// components/ui/button.tsx
import React3 from "react";

// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

// node_modules/@radix-ui/react-slot/dist/index.mjs
import { forwardRef as $9IrjX$forwardRef, Children as $9IrjX$Children, isValidElement as $9IrjX$isValidElement, createElement as $9IrjX$createElement, cloneElement as $9IrjX$cloneElement, Fragment as $9IrjX$Fragment } from "react";

// node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import { useCallback as $3vqmr$useCallback } from "react";
function $6ed0406888f73fc4$var$setRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref !== null && ref !== void 0) ref.current = value;
}
function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef(ref, node)
  );
}

// node_modules/@radix-ui/react-slot/dist/index.mjs
var $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /* @__PURE__ */ $9IrjX$forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = $9IrjX$Children.toArray(children);
  const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if ($9IrjX$Children.count(newElement) > 1) return $9IrjX$Children.only(null);
        return /* @__PURE__ */ $9IrjX$isValidElement(newElement) ? newElement.props.children : null;
      } else return child;
    });
    return /* @__PURE__ */ $9IrjX$createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), /* @__PURE__ */ $9IrjX$isValidElement(newElement) ? /* @__PURE__ */ $9IrjX$cloneElement(newElement, void 0, newChildren) : null);
  }
  return /* @__PURE__ */ $9IrjX$createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
    ref: forwardedRef
  }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
var $5e63c961fc1ce211$var$SlotClone = /* @__PURE__ */ $9IrjX$forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (/* @__PURE__ */ $9IrjX$isValidElement(children)) return /* @__PURE__ */ $9IrjX$cloneElement(children, {
    ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
    ref: forwardedRef ? $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref) : children.ref
  });
  return $9IrjX$Children.count(children) > 1 ? $9IrjX$Children.only(null) : null;
});
$5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
var $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
  return /* @__PURE__ */ $9IrjX$createElement($9IrjX$Fragment, null, children);
};
function $5e63c961fc1ce211$var$isSlottable(child) {
  return /* @__PURE__ */ $9IrjX$isValidElement(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
}
function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
  const overrideProps = {
    ...childProps
  };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
      else if (slotPropValue) overrideProps[propName] = slotPropValue;
    } else if (propName === "style") overrideProps[propName] = {
      ...slotPropValue,
      ...childPropValue
    };
    else if (propName === "className") overrideProps[propName] = [
      slotPropValue,
      childPropValue
    ].filter(Boolean).join(" ");
  }
  return {
    ...slotProps,
    ...overrideProps
  };
}

// components/ui/button.tsx
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-xl border text-base font-semibold ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-5",
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:text-primary-foreground/50",
        success: "border-emerald-200 bg-emerald-200 text-emerald-800 hover:bg-teal/90 disabled:text-primary-600 disabled:bg-primary-200 disabled:border-primary-200",
        ghost: "border-primary-200 bg-white text-primary hover:border-primary-300 hover:bg-white/0 disabled:text-primary-foreground/50",
        outline: "button-outline",
        light: "border-transparent bg-transparent hover:bg-primary/[.05]",
        icon: "bg-transparent border-0 hover:bg-primary-200"
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 rounded-md px-8",
        icon: "h-12 w-12",
        iconSm: "h-9 w-9"
      },
      isRound: {
        true: "rounded-full",
        false: "rounded-xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);
var Button = React3.forwardRef(
  ({ variant, size, fullWidthMobile, className, asChild = false, isRound = false, ...props }, ref) => {
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : "button";
    return /* @__PURE__ */ jsx3(
      Comp,
      {
        ref,
        className: cn(
          buttonVariants({ variant, size, isRound }),
          fullWidthMobile ? "w-full md:w-auto" : "",
          className
        ),
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// components/Session/ButtonSession.tsx
import { Mic as Mic2 } from "lucide-react";
import React5, { useCallback as useCallback3, useEffect } from "react";
import {
  RTVIEvent as RTVIEvent2
} from "realtime-ai";
import { useRTVIClientEvent as useRTVIClientEvent2 } from "realtime-ai-react";

// utils/stats_aggregator.ts
var StatsAggregator = class {
  statsMap = {};
  hasNewStats = false;
  turns = 0;
  constructor() {
  }
  addStat(stat) {
    const [service, metric, value] = stat;
    if (!service || !metric || value <= 0) {
      return;
    }
    if (!this.statsMap[service]) {
      this.statsMap[service] = {};
    }
    const timeseries = [
      ...this.statsMap[service][metric]?.timeseries || [],
      value
    ];
    const median = timeseries.reduce((acc, curr) => acc + curr, 0) / timeseries.length;
    const high = timeseries.reduce((acc, curr) => Math.max(acc, curr), 0);
    const low = timeseries.reduce((acc, curr) => Math.min(acc, curr), Infinity);
    this.statsMap[service][metric] = {
      latest: value,
      timeseries,
      median,
      high,
      low
    };
    this.hasNewStats = true;
  }
  getStats() {
    if (this.hasNewStats) {
      this.hasNewStats = false;
      return this.statsMap;
    } else {
      return null;
    }
  }
};
var stats_aggregator_default = StatsAggregator;

// components/Session/UserMicBubble/index.tsx
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useCallback as useCallback2, useRef } from "react";
import { Mic, MicOff, Pause } from "lucide-react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var pulse = keyframes`
  0% { outline-width: 6px; }
  50% { outline-width: 24px; }
  100% { outline-width: 6px; }
`;
var pulseText = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;
var BubbleContainer = styled.div`
  color: #ffffff;
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  margin: auto;
  padding-top: 20px;

  @media (min-width: 768px) {
    padding-top: 0px;
  }
`;
var Bubble = styled.div`
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  z-index: 20;
  transition: all 0.5s ease, opacity 2s ease;
  opacity: 0.5;
  box-sizing: border-box;
  border: 6px solid rgba(99, 102, 241, 0.3); /* fallback */
  outline: 6px solid rgba(99, 102, 241, 0.3);
  background-color: #6366f1;
  background-image: radial-gradient(#a5b4fc, #818cf8);

  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    border-radius: 120px;
  }

  ${(props) => props.canTalk && `
    opacity: 1;
    background-color: #6366f1;
    background-image: radial-gradient(#6366f1, #4f46e5);
    border: 6px solid rgba(199, 210, 254, 0.4);
    outline: 6px solid rgba(129, 140, 248, 0.3);
    outline-offset: 4px;
  `}

  ${(props) => props.inactive && `
    pointer-events: none;
    cursor: not-allowed;
  `}

  ${(props) => props.muted && `
    background-color: #ef4444;
    background-image: radial-gradient(#ef4444, #dc2626);
    border: 6px solid rgba(254, 202, 202, 0.4);
    outline: 6px solid rgba(248, 113, 113, 0.3);
    animation: ${pulseText} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    &::after {
      content: "Unmute";
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #fee2e2;
    }
  `}
`;
var Icon = styled.div`
  position: relative;
  z-index: 20;
  line-height: 1;
  transition: opacity 0.5s ease;
  opacity: ${(props) => props.canTalk ? 1 : 0.3};
`;
var Volume = styled.div`
  position: absolute;
  overflow: hidden;
  inset: 0px;
  z-index: 0;
  border-radius: 999px;
  transition: all 0.1s ease;
  transform: scale(0);
  opacity: 0.5;
  background-color: #86efac;
`;
var AudioIndicatorBubble = () => {
  const volRef = useRef(null);
  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback2((volume) => {
      if (volRef.current) {
        const v = Number(volume) * 1.75;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );
  return /* @__PURE__ */ jsx4(Volume, { ref: volRef });
};

// components/Session/ButtonSession.tsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var stats_aggregator;
var ButtonSession = React5.memo(
  ({ state, onLeave, startAudioOff = false }) => {
    useRTVIClientEvent2(
      RTVIEvent2.Metrics,
      useCallback3((metrics) => {
        metrics?.ttfb?.map((m) => {
          stats_aggregator.addStat([m.processor, "ttfb", m.value, Date.now()]);
        });
      }, [])
    );
    useEffect(() => {
      stats_aggregator = new stats_aggregator_default();
    }, []);
    useEffect(() => {
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);
    return /* @__PURE__ */ jsxs3("div", { className: "relative w-12 h-12 border rounded-full", children: [
      /* @__PURE__ */ jsx5(AudioIndicatorBubble, {}),
      /* @__PURE__ */ jsx5(Button, { onClick: () => onLeave(), className: "ml-auto z-1000", isRound: true, size: "icon", variant: "ghost", children: /* @__PURE__ */ jsx5(Mic2, { size: 16 }) })
    ] });
  },
  (p, n) => p.state === n.state
);

// components/ButtonApp/ButtonInner.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function ButtonInner() {
  const voiceClient = useRTVIClient2();
  const transportState = useRTVIClientTransportState();
  const [appState, setAppState] = useState3("idle");
  const [error, setError] = useState3(null);
  const [startAudioOff, setStartAudioOff] = useState3(false);
  const mountedRef = useRef3(false);
  const { clientParams } = useContext(AppContext);
  useRTVIClientEvent3(
    RTVIEvent3.Error,
    useCallback4((message) => {
      const errorData = message.data;
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );
  useEffect2(() => {
    if (!voiceClient || mountedRef.current) return;
    mountedRef.current = true;
    voiceClient.initDevices();
  }, [appState, voiceClient]);
  useEffect2(() => {
    voiceClient.params = {
      ...voiceClient.params,
      requestData: {
        ...voiceClient.params.requestData,
        ...clientParams
      }
    };
  }, [voiceClient, appState, clientParams]);
  useEffect2(() => {
    switch (transportState) {
      case "initialized":
      case "disconnected":
        setAppState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        break;
      case "connected":
      case "ready":
        setAppState("connected");
        break;
      default:
        setAppState("idle");
    }
  }, [transportState]);
  async function start() {
    if (!voiceClient) return;
    try {
      voiceClient.enableMic(true);
      await voiceClient.connect();
    } catch (e) {
      setError(e.message || "Unknown error occured");
      voiceClient.disconnect();
    }
  }
  async function leave() {
    await voiceClient.disconnect();
    window.location.reload();
  }
  if (error) {
    return /* @__PURE__ */ jsx6(Alert, { intent: "danger", title: "An error occurred", children: error });
  }
  if (appState === "connected") {
    return /* @__PURE__ */ jsx6("div", { children: /* @__PURE__ */ jsx6(
      ButtonSession,
      {
        state: transportState,
        onLeave: () => leave(),
        startAudioOff
      }
    ) });
  }
  const isReady = appState === "ready";
  return /* @__PURE__ */ jsx6("div", { children: /* @__PURE__ */ jsx6(Button, { onClick: () => start(), disabled: !isReady, isRound: true, size: "icon", children: isReady ? /* @__PURE__ */ jsx6(Mic3, {}) : /* @__PURE__ */ jsx6(Loader2, { className: "animate-spin" }) }, "start") });
}

// components/ButtonApp/index.tsx
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
console.log("React version:", React6.version);
function ButtonApp({ chatId = "", llmUrl = "", requestTemplate = null }) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("llmUrl", urlParams.get("llmUrl"));
  console.log("requestTemplate", urlParams.get("requestTemplate"));
  llmUrl = llmUrl || urlParams.get("llmUrl");
  requestTemplate = requestTemplate || (urlParams.get("requestTemplate") ? JSON.parse(urlParams.get("requestTemplate")) : null);
  console.log("llmUrl", llmUrl);
  console.log("requestTemplate", requestTemplate);
  const [showSplash, setShowSplash] = useState4(true);
  const voiceClientRef = useRef4(null);
  useEffect3(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }
    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: "https://voice-agent-dev.newcast.ai/api",
        requestData: {
          services: defaultServices,
          config: defaultConfig,
          chatId,
          llmUrl,
          requestTemplate: JSON.stringify(requestTemplate),
          openStatement: false
        }
      },
      timeout: BOT_READY_TIMEOUT
    });
    const llmHelper = new LLMHelper({});
    voiceClient.registerHelper("llm", llmHelper);
    voiceClientRef.current = voiceClient;
  }, [showSplash]);
  useEffect3(() => {
    setTimeout(() => setShowSplash(false), 10);
  }, []);
  if (showSplash) return null;
  return /* @__PURE__ */ jsxs4(RTVIClientProvider, { client: voiceClientRef.current, children: [
    /* @__PURE__ */ jsx7(AppProvider, { children: /* @__PURE__ */ jsx7(TooltipProvider, { children: /* @__PURE__ */ jsx7(ButtonInner, {}) }) }),
    /* @__PURE__ */ jsx7(RTVIClientAudio, {})
  ] });
}

// lib/index.ts
var index_default = ButtonApp;
export {
  index_default as default
};
