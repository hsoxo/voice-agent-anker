import styled from "@emotion/styled";
import { useState, useEffect, useMemo } from "react";
import Bubble from "./Bubble";
import { v4 as uuidv4 } from "uuid";
import Pusher from "pusher-js";
import ButtonApp from "../ButtonApp";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";


interface Chat {
  text: string;
  time: string;
  role: "ai" | "user";
}

export const VoiceChat = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [isVoiceBotOpen, setIsVoiceBotOpen] = useState(false);

  const pusher = useMemo(() => {
    if (typeof window === "undefined") return;
    return new Pusher('fb609e51dceb9a27d79c', {
      cluster: 'mt1',
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
        const existing = prev.find((chat) => chat.time === data.timestamp);
        if (existing) {
          const newChats = [...prev];
          const index = newChats.findIndex(
            (chat) => chat.time === data.timestamp
          );
          newChats[index] = { ...existing, text: existing.text + data.message };
          return newChats;
        }
        return [
          ...prev,
          { text: data.message, time: data.timestamp, role: "ai" },
        ];
      });
    });
  }, [chatId, channel]);

  const handleSend = () => {
    fetch(`/api/voice-chat/chat?chatId=${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });
  };

  const handleShowVoiceBot = () => {
    setIsVoiceBotOpen(true);
  };

  return (
    <Wrapper>
      <BubbleWrapper>
        {chats.map((chat, index) => (
          <Bubble
            key={index}
            text={chat.text}
            time={chat.time}
            role={chat.role}
          />
        ))}
      </BubbleWrapper>
      {isVoiceBotOpen && (
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <ButtonApp />
        </div>
      )}
      <InputWrapper>
        <div className="w-[320px] flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSend();
                setChats((prev) => [
                  ...prev,
                  { text: text, time: new Date().toISOString(), role: "user" },
                ]);
                setText("");
              }
            }}
          />
          <ButtonApp />
          <Button onClick={handleSend} isRound size="icon" className="flex-shrink-0">
            <SendHorizonal />
          </Button>
        </div>
      </InputWrapper>
    </Wrapper>
  );
};

const InputWrapper = styled.div`
  border-top: 1px solid #ccc;
  position: absolute;
  bottom: 0;
  > div {
    display: flex;
    align-items: center;
    border: none;
    padding: 0;
    margin: 0;
    gap: 4px;
    padding: 4px 4px 4px 8px;
  }
`;
const Wrapper = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  width: 320px;
  height: 480px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BubbleWrapper = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 48px);
`;

const Input = styled.input`
  width: 100%;
  border-radius: 4px;
  border: none;
  outline: none;
`;

export default VoiceChat;
