import styled from "@emotion/styled";
import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Pusher from "pusher-js";
import { TooltipProvider } from "../ui/tooltip";
import ChatButton from "./components/ChatButton";
import Trigger from "./components/Trigger";
import ChatCard from "./components/ChatCard";
import Products from "./components/Products";
import { Button } from "../ui/button";
import ButtonApp from "@/components/ButtonApp";
import VoiceSession from "./VoiceSession";
import { RoomWrapper, StartButton } from "../VideoAgent";

interface Chat {
  text: string;
  time: string;
  role: "ai" | "user";
}

const products = [
  {
    type: "product-info",
    href: "https://www.soundcore.com/products/a3062-noise-cancelling-headphones",
    text: "Compact, foldable, noise-cancelling headphones for travel.",
    label: "Space One Pro | Foldable Over-Ear Headphones",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/soundcore-space_one_pro.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a1790",
    text: "Powerful, expandable energy station for homes and EVs.",
    label: "Anker SOLIX F3800 Portable Power Station",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-solix_f3800.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a2544-maggo-qi2-wireless-charger-magsafe-compatible",
    text: "Charge iPhone and AirPods together seamlessly.",
    label: "Anker MagGo Wireless Charger (2-in-1 Stand)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-maggo_2_in_1_stand.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a1695-anker-power-bank-25000mah-165w?variant=44320657997974",
    text: "High-capacity, fast-charging power bank for multiple devices.",
    label: "Anker Power Bank (25K, 165W, Built-In and Retractable Cables)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-powerbank_25k_165w.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.soundcore.com/products/a3961011?q=x10",
    text: "Secure, sweatproof earbuds with dynamic bass.",
    label: "Soundcore Sport X10 Workout Earbuds",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/soundcore-sport_x10.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.soundcore.com/products/space-q45-a3040011?q=q45",
    text: "Immersive sound with adaptive noise cancelling.",
    label: "Soundcore Space Q45 Noise Cancelling Headphones",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/soundcore-space_q45.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a1294?variant=43821286817942",
    text: "Massive capacity power bank with emergency lighting.",
    label: "Anker 548 Power Bank (PowerCore Reserve 192Wh)",
    postfix: null,
    image: "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-548.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a17221z1?variant=44204711280790",
    text: "Compact, reliable power for outdoor adventures.",
    label: "Anker SOLIX C300 Portable Power Station",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-solix_c300.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a9192",
    text: "12-outlet power strip with USB and safety features.",
    label: "Anker 351 Power Strip",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-351_power_strip.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a2697-anker-charger-140w-4-port?variant=44320558055574",
    text: "High-speed 4-port charger with safety monitoring.",
    label: "Anker Charger (140W, 4-Port, PD 3.1)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-charger_140w.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a25x1-maggo-qi2-wireless-charging-stand-magsafe-compatible?variant=44058196639894",
    text: "Eco-friendly wireless charger with adjustable angles.",
    label: "Anker MagGo Wireless Charger (Stand)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-maggo_wireless_charger_stand.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a83b6-anker-prime-charging-docking-station-14-in-1-dual-display-160w?variant=43931966734486",
    text: "Ultimate 14-in-1 docking station with dual displays.",
    label: "Anker Prime Charging Docking Station (14-in-1, Dual Display, 160W)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-prime_charging_docking_14_in_1.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/products/a1614-b",
    text: "Slim, portable magnetic battery with kickstand.",
    label: "Anker 622 Magnetic Battery (MagGo)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-622_magnetic_battery.jpg",
    callback_response: null,
  },
  {
    type: "product-info",
    href: "https://www.anker.com/ca/products/a9128-6-in-1-charging-station?variant=45100042125476",
    text: "Compact 6-in-1 station with high-speed charging.",
    label: "Anker Prime 6-in-1 Charging Station (140W)",
    postfix: null,
    image:
      "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-charging_station_6_in_1.jpg",
    callback_response: null,
  },
];

const relatedQuestions = [
  {
    question: "What is the best power bank for me?",
  },
];

export const VoiceChat = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [chats, setChats] = useState<Chat[]>([
    {
      text: "Hello, I'm here to help you with any questions you might have.",
      time: new Date().toISOString(),
      role: "ai",
    },
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [voiceBotState, setVoiceBotState] = useState<string>("idle");
  const [videoBotLoaded, setVideoBotLoaded] = useState<boolean>(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [app, setApp] = useState<"voice" | "video" | undefined>(undefined);

  const pusher = useMemo(() => {
    if (typeof window === "undefined") return;
    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "mt1",
      channelAuthorization: {
        transport: "ajax",
        endpoint: `https://newcast.ai/api/platform-service/v1/user/pusher/auth`,
      },
    });
  }, []);

  useEffect(() => {
    setChatId(uuidv4());
  }, []);

  const channel = useMemo(() => {
    if (!pusher || !chatId) return null;
    return pusher.subscribe(`chat-${chatId}`);
  }, [pusher, chatId]);

  useEffect(() => {
    if (!channel || !chatId) return;
    channel.bind(`client-message`, (data: any) => {
      console.log(data);
      setChats((prev) => {
        const existing = prev.findIndex(
          (chat) => chat.time === data.timestamp && chat.role === data.role
        );
        if (existing > -1) {
          const newChats = [...prev];
          newChats[existing] = {
            ...newChats[existing],
            text: newChats[existing].text + " " + data.content,
          };
          return newChats;
        }
        return [
          ...prev,
          { text: data.content, time: data.timestamp, role: data.role },
        ];
      });
      setIsBotLoading(false);
      setTimeout(() => {
        document.getElementById("bubble-bottom")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    });
  }, [chatId, channel]);

  const _handleSend = (text: string) => {
    setIsBotLoading(true);
    fetch(`https://newcast-dev-test-gw.hhe.by/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "conversation_id", content: chatId },
          { role: "user", content: text },
        ],
      }),
    });
  };

  const handleSend = () => {
    if (!text) return;
    _handleSend(text);
    setChats((prev) => [
      ...prev,
      {
        text: text,
        time: new Date().toISOString(),
        role: "user",
      },
    ]);
    setText("");
    setTimeout(() => {
      document.getElementById("bubble-bottom")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleLearnMore = (text: string) => {
    _handleSend(text);
  };

  const handleOpen = () => {
    setChatOpen(true);
    setTimeout(() => setShowProducts(true), 500);
  };

  const handleClose = () => {
    setChatOpen(false);
    setShowProducts(false);
  };

  const handleStartVoiceAgent = () => {
    setApp("voice");
    setFlipped(true);
  };

  const handleVoiceBotStateChange = (state: string) => {
    if (voiceBotState === "connected" && state !== "connected") {
      setApp(undefined);
      setFlipped(false);
    }
    setVoiceBotState(state);
  };

  const handleStartVideoAgent = () => {
    setApp("video");
    setFlipped(true);
  };

  const handleVideoBotStateChange = (state: boolean) => {
    if (videoBotLoaded && !state) {
      setApp(undefined);
      setFlipped(false);
    }
    setVideoBotLoaded(state);
  };

  return (
    <TooltipProvider>
      <Wrapper className={chatOpen ? "open" : "close"}>
        <CardInner flipped={flipped} onClick={() => !chatOpen && handleOpen()}>
          <CardFront>
            {chatOpen ? (
              <>
                <ChatCard
                  handleClose={handleClose}
                  chats={chats}
                  isBotLoading={isBotLoading}
                  text={text}
                  setText={setText}
                  handleSend={handleSend}
                  handleStartVoiceAgent={handleStartVoiceAgent}
                  handleStartVideoAgent={handleStartVideoAgent}
                />
                <ChatButton open={chatOpen} handler={handleSend} />
              </>
            ) : (
              <Trigger handleOpen={handleOpen} />
            )}
          </CardFront>
          <CardBack>
            {app === "voice" ? (
              <ButtonApp
                chatId={chatId}
                setVoiceBotState={handleVoiceBotStateChange}
                connectedComponent={VoiceSession}
                autoStart={true}
              />
            ) : app === "video" ? (
              <>
                <StartButton
                  apiKey="1cc7ee7a-62f7-4af5-91e1-d8d873dda74c"
                  agentId="shopping-agent-1"
                  onLoaded={handleVideoBotStateChange}
                  autoJoin
                />
                <RoomWrapper onLoaded={handleVideoBotStateChange} width={270} />
              </>
            ) : null}
          </CardBack>
        </CardInner>
        {chatOpen && !videoBotLoaded && (
          <Products
            show={showProducts}
            products={products}
            handleLearnMore={handleLearnMore}
          />
        )}
      </Wrapper>
    </TooltipProvider>
  );
};

const Wrapper = styled.div`
  position: fixed;
  bottom: 32px;
  right: 32px;
  perspective: 3000px;
  transition: all 0.5s ease;
  &.close {
    width: 240px;
    height: 136px;
  }
  &.open {
    width: 460px;
    height: 720px;
  }
`;

const CardInner = styled.div<{ flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ flipped }) => (flipped ? "rotateY(180deg)" : "none")};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 28px;
  background: linear-gradient(
    to bottom right,
    rgba(242, 243, 255, 0.95),
    rgba(255, 255, 255, 0.9) 50%,
    rgba(242, 243, 255, 0.1) 100%
  );
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
`;

const CardFront = styled(CardFace)``;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default VoiceChat;
