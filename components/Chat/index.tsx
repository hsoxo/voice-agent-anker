import styled from "@emotion/styled";
import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Pusher from "pusher-js";
import { TooltipProvider } from "../ui/tooltip";
import ChatButton from "./components/ChatButton";
import Trigger from "./components/Trigger";
import ChatCard from "./components/ChatCard";
import Products from "./components/Products";
import ButtonApp from "@/components/ButtonApp";
import VoiceSession from "./VoiceSession";
import { RoomWrapper, StartButton } from "../VideoAgent";
import { Product } from "./types";
import { useShallow } from "zustand/shallow";
import { useChatStore } from "./store";

interface Chat {
  text: string;
  time: string;
  role: "ai" | "user";
}

export const VoiceChat = () => {
  const [text, setText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [voiceBotState, setVoiceBotState] = useState<string>("idle");
  const [videoBotLoaded, setVideoBotLoaded] = useState<boolean>(false);
  const [flipped, setFlipped] = useState(false);
  const [app, setApp] = useState<"voice" | "video" | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const {
    chatId,
    setChatId,
    followUpQuestions,
    setFollowUpQuestions,
    addChat,
    chats,
    isBotLoading,
    setIsBotLoading,
  } = useChatStore(
    useShallow((state) => ({
      chats: state.chats,
      addChat: state.addChat,
      chatId: state.chatId,
      setChatId: state.setChatId,
      followUpQuestions: state.followUpQuestions,
      setFollowUpQuestions: state.setFollowUpQuestions,
      isBotLoading: state.isBotLoading,
      setIsBotLoading: state.setIsBotLoading,
    }))
  );

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
      addChat({
        text: data.content,
        time: data.timestamp,
        role: data.role,
      });
      setIsBotLoading(false);
      setTimeout(() => {
        document.getElementById("bubble-bottom")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    });
    channel.bind(`product-recommendations`, (data: any) => {
      console.log("product-recommendations", data);
      setProducts(data);
    });
    channel.bind(`follow-up-questions`, (data: any) => {
      console.log("follow-up-questions", data);
      setFollowUpQuestions(data);
    });
  }, [chatId, channel]);

  const _handleSend = (text: string) => {
    setIsBotLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/llm/chat/${chatId}/chat/completions`,
      {
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
      }
    );
  };

  const handleSend = (customText?: string) => {
    const combinedText = customText || text;
    if (!combinedText) return;
    _handleSend(combinedText);
    setFollowUpQuestions([]);
    addChat({
      text: combinedText,
      time: new Date().toISOString(),
      role: "user",
    });
    if (combinedText === text) {
      setText("");
    }
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
                  followUpQuestions={followUpQuestions}
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
                appId="chat"
                chatId={chatId}
                setVoiceBotState={handleVoiceBotStateChange}
                connectedComponent={VoiceSession}
                autoStart={true}
                openStatement={true}
              />
            ) : app === "video" ? (
              <>
                <StartButton
                  apiKey="f2288322-bb47-4e68-a405-607f6ba27fa1"
                  agentId="cb34df69-b0a3-4dd1-b2d5-390d0eefa6e4"
                  onLoaded={handleVideoBotStateChange}
                  appId="chat"
                  chatId={chatId}
                  autoJoin
                />
                <RoomWrapper onLoaded={handleVideoBotStateChange} width={320} />
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
  border-radius: 28px;
  overflow: hidden;
`;

export default VoiceChat;
