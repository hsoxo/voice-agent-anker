import styled from "@emotion/styled";
import { useState, useEffect, useMemo } from "react";
import Bubble from "./Bubble";
import { v4 as uuidv4 } from "uuid";
import Pusher from "pusher-js";
import ButtonApp from "../ButtonApp";
import { Button } from "../ui/button";
import { SendHorizonal, MessageSquare, X } from "lucide-react";
import Logo from "@/assets/icons/logo-dark.svg";
import Image from "next/image";
import Product from "./Product";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

import Loading from "./Loading";
import VoiceSessionFullScreen from "./VoiceSessionFullScreen";
import { VideoAgent } from "../VideoAgent";

interface Chat {
  text: string;
  time: string;
  role: "ai" | "user";
}

// product_info: {
//   type: "related-products",
//   href: "https://www.anker.com/products/a1614-b",
//   text: "Slim, portable magnetic battery with kickstand.",
//   label: "Anker 622 Magnetic Battery (MagGo)",
//   postfix: null,
//   image:
//     "https://dzqkhoe0j5v3w.cloudfront.net/shoppable-video/anker-622_magnetic_battery.jpg",
//   callback_response: null,
// },
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

  const isVoiceAgentConnected = voiceBotState === "connected";
  const botLoaded = isVoiceAgentConnected || videoBotLoaded;

  return (
    <TooltipProvider>
      <div style={{ position: "fixed", bottom: 32, right: 32 }}>
        <Wrapper
          className={chatOpen ? "open" : "close"}
          onClick={() => !chatOpen && handleOpen()}
        >
          {chatOpen ? (
            <>
              <div className="close-button">
                <Button
                  onClick={handleClose}
                  isRound
                  variant="icon"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <X />
                </Button>
              </div>
              <div className="logo">
                <Image alt="logo" src={Logo} width={140} />
              </div>
              {/* {videoBotLoaded ? (
                <div className="flex items-center justify-center">
                  <RoomWrapper onLoaded={setVideoBotLoaded} />
                </div>
              ) : null} */}
              <BubbleWrapper>
                {chats.map((chat, index) => (
                  <Bubble
                    key={index}
                    text={chat.text}
                    time={chat.time}
                    role={chat.role}
                  />
                ))}
                {isBotLoading && <Bubble text={<Loading />} role="ai" />}
                <div id="bubble-bottom" />
              </BubbleWrapper>
              <InputWrapper>
                <div>
                  <input
                    style={{ width: botLoaded ? 0 : 330 }}
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        handleSend();
                      }
                    }}
                  />
                  {botLoaded ? null : (
                    <div style={{ width: 2, height: 30, background: "#eee" }} />
                  )}
                  {isVoiceAgentConnected ? null : (
                    <VideoAgent
                      apiKey="1cc7ee7a-62f7-4af5-91e1-d8d873dda74c"
                      agentId="shopping-agent-1"
                      baseUrl=""
                      onLoaded={setVideoBotLoaded}
                    />
                  )}
                  {botLoaded ? null : (
                    <Tooltip>
                      <TooltipTrigger>
                        <ButtonApp
                          chatId={chatId}
                          setVoiceBotState={setVoiceBotState}
                          connectedComponent={VoiceSessionFullScreen}
                        />
                      </TooltipTrigger>
                      {!isVoiceAgentConnected && (
                        <TooltipContent>
                          <p>Talk with agent</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}
                </div>
              </InputWrapper>
              <div className="send-button">
                <Button
                  onClick={handleSend}
                  isRound
                  size="icon"
                  className="flex-shrink-0 button-color"
                >
                  <SendHorizonal />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="close-text">
                <div>
                  Hey there! I'm here to help you with any questions you might
                  have.
                </div>
                <div className="message-area">Enter your message...</div>
              </div>
              <div className="send-button">
                <Button
                  onClick={handleOpen}
                  isRound
                  size="icon"
                  className="flex-shrink-0 button-color"
                >
                  <MessageSquare />
                </Button>
              </div>
            </>
          )}
        </Wrapper>
        {chatOpen && !videoBotLoaded && (
          <Products show={showProducts}>
            {products.map((product) => (
              <Product
                key={product.href}
                product={product}
                handleLearnMore={handleLearnMore}
              />
            ))}
          </Products>
        )}
      </div>
    </TooltipProvider>
  );
};

const InputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  padding: 16px;
  width: 440px;
  > div {
    border-radius: 30px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: 4px;
    padding: 4px 4px 4px 16px;
    min-height: 56px;
  }

  input {
    width: 100%;
    border-radius: 4px;
    border: none;
    outline: none;
    transition: width 0.3s ease;
  }
`;
const Wrapper = styled.div`
  z-index: 1000;
  transition: all 0.5s ease;
  &.close {
    width: 240px;
    height: 136px;
  }
  &.open {
    width: 460px;
    height: 720px;
  }
  border-radius: 28px;
  background: linear-gradient(
    to bottom right,
    rgba(242, 243, 255, 0.95),
    rgba(255, 255, 255, 0.9) 50%,
    rgba(242, 243, 255, 0.1) 100%
  );
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);

  .logo {
    padding: 16px;
  }

  .close-text {
    padding: 16px 32px 16px 16px;
    text-align: left;
    color: #333;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    .message-area {
      color: #999;
      border-top: 2px solid #e5e7eb;
      padding-top: 8px;
      padding-right: 32px;
      margin-top: 8px;
    }
  }
  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    z-index: 1001;
  }
  .send-button {
    position: absolute;
    right: -16px;
    bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    z-index: 1001;
    border-radius: 50%;
  }

  .button-color {
    background: linear-gradient(
      145.55deg,
      rgb(95, 88, 255) -12.97%,
      rgb(172, 0, 216) 103.71%
    );
    border: none;
  }
`;

const Products = styled.div<{ show: boolean }>`
  padding: 16px 32px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  width: 200px;
  transition: opacity 0.3s ease;
  opacity: ${({ show }) => (show ? 1 : 0)};
  left: ${({ show }) => (show ? "-180px" : "0")};
  border-radius: 20px;
  z-index: -1;
  top: 16px;
  overflow-y: auto;
  height: 680px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
`;

const BubbleWrapper = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 140px);
`;

export default VoiceChat;
