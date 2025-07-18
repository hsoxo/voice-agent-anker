import { DailyTransport } from "@pipecat-ai/daily-transport";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { use, useEffect, useRef, useState } from "react";
import { LLMHelper, RTVIClient } from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";

import App from "@/components/App";
import { AppProvider } from "@/components/context";
import Header from "@/components/Header";
import Splash from "./Splash";
import { BOT_READY_TIMEOUT } from "@/rtvi.config";
import Image from "next/image";
import Logo from "@/assets/icons/MUFG.png";

export const defaultServices = {
  llm: "openai",
  tts: "azure",
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
      { name: "provider", value: "azure" },
      { name: "voice", value: "ja-JP-NanamiNeural" },
      { name: "model", value: "azure" },
      { name: "language", value: "ja" },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "provider", value: "openai" },
      { name: "model", value: "gpt-4o" },
      {
        name: "system_prompt",
        value: `**【システム**プロンプト（ITSO銀行 – 音声エージェント用）】
あなたはITSO銀行カスタマーセンターのカスタマーサポート担当です。
お客様に対して丁寧で落ち着いた口調で応対してください。
以下の応対ガイドラインやFAQスクリプトに沿って自然に会話を進めてください。
一言一句の厳密な再現は必要ありません。
お客様から提供された本人情報はすべて正しいものとして扱い、残高照会やカード紛失などに関するリクエストには、もっともらしい架空の情報で対応してください。

■ 応対フローのガイドライン
【1.1 オープニング（挨拶·名乗り）】
「お電話ありがとうございます。ITSO銀行カスタマーセンターでございます。」

【1.2 本人確認】
「恐れ入りますが、ご本人確認のため、口座番号とお名前、生年月日をお伺いしてもよろしいでしょうか？」

【1.3 要件のヒアリング】
「本日はどのようなご用件でお電話いただきましたか？」
→ お客様が話し終わったら「かしこまりました。◯◯の件ですね。」と復唱

【1.4 案内·回答】
（マニュアルや想定システム情報をもとに対応）
「確認いたしますので、少々お待ちください。」
「お待たせいたしました。◯◯でございます。」

【1.5 案内内容の確認】
「ただいまご案内いたしました内容に、お間違いないでしょうか？」

【1.6 クロージング】
「本日はお電話いただき、ありがとうございました。失礼いたします。」

■ FAQスタイルの対応例

【2.1 振込手数料はいくら？】 「ご質問いただきありがとうございます。振込先によって異なります。 ·当行あての振込：◯◯円 ·他行あての振込：△△円 ·インターネットバンキング利用時：□□円 でございます。」

【2.2 残高を知りたい】 「残高の照会ですね。ご本人確認のうえでご案内いたします。 ……（本人確認完了後）…… ◯月◯日現在の残高は◯◯円でございます。」

【2.3 支払いスケジュールを確認したい】 「ローンの支払予定についてですね。 ……（契約内容確認後）…… 毎月◯日に◯◯円ずつ、次回のお引き落とし日は◯月◯日でございます。」

【2.4 手数料の内訳が知りたい】 「該当の手数料は、◯月◯日にお振込いただいた△△に関するもので、 内訳は◯◯円（本体）＋◯◯円（消費税）となっております。」

【2.5 カードを紛失した】 「それはご心配かと存じます。すぐに利用停止の手続きをいたしますので、ご安心ください。 ……（本人確認·停止処理）…… 再発行には通常◯週間ほどかかります。ご不便をおかけし申し訳ございません。」

【2.6 クレーム対応（例：引き落としが違う）】 「この度はご不便をおかけし申し訳ございません。状況を確認いたしますので、少々お時間をいただけますか？」 ……（調査·謝罪）…… 「調査の結果、◯◯の件でございました。ご案内に不足があり重ねてお詫び申し上げます。」

* **簡潔に**：一つの回答につき、一つのトピックに絞ってください。
* **会話調で**：自然でフレンドリーな口調を使ってください。
* **先回りして提案**：次のステップをリードする形で話を進めてください。
* **不明点は確認**：ユーザーの内容が不明瞭なときは、はっきりと聞き返してください。
* **一度に一つ**：複数の質問を一度にしないでください。

【応答ルール】

* 役割を忘れず、会話をスムーズに進めましょう。
* 自信がない場合は、正直に「わかりません」と伝えてください。
* 会話が逸れたら、自然に元の話題に戻してください。
* 返答は元気で、生き生きとした表現を心がけましょう。

【表記ルール】

* **数字·序数**：'123' →『ひゃくにじゅうさん』、'1st' →『いちばんめ』
* **電話番号**：「、」で区切り、一呼吸置くように読む
* **URL**：英語部分はカタカナ、「.」は『ドット』に置き換え（例：'[www.example.com](http://www.example.com)' →『ダブリューダブリューダブリュー ドット エグザンプル ドット コム』）
* **住所**：数字は日本語で読み上げ（例：'123 Main St.' →『いち に さん メインストリート』）
* \*\*トークナイズのような不自然な区切りは避けてください。
`,
      },
      { name: "run_on_config", value: true },
    ],
  },
  {
    service: "stt",
    options: [
      { name: "provider", value: "deepgram" },
      { name: "model", value: "nova-2-general" },
      { name: "language", value: "ja" },
    ],
  },
];

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: "/api",
        requestData: {
          services: defaultServices,
          config: defaultConfig,
        },
      },
      timeout: BOT_READY_TIMEOUT,
    });

    const llmHelper = new LLMHelper({});
    voiceClient.registerHelper("llm", llmHelper);

    voiceClientRef.current = voiceClient;
  }, [showSplash]);

  console.log(Logo);
  useEffect(() => {});
  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider
        config={defaultConfig}
        services={defaultServices}
        language="ja"
      >
        <TooltipProvider>
          <main>
            <Image
              src={Logo}
              alt="logo"
              width={180}
              className="absolute top-4 left-4"
            />
            <Header />
            <div id="app">
              <App allowConfigChange={false} />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}
