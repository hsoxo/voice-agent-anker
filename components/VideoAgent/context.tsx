import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { AgentInfo, CallInfo, CallContext, FunctionCallMessage } from "./types";
import { create } from "zustand";

interface VideoAgentContextType {
  query: string;
  apiKey: string | undefined;
  agentId: string | undefined;
  baseUrl: string | undefined;
  callInfo: CallInfo | undefined;
  agentInfo: AgentInfo | undefined;

  setApiKey: (apiKey: string) => void;
  setAgentId: (agentId: string) => void;
  setBaseUrl: (baseUrl: string) => void;
  setCallInfo: (callInfo: CallInfo) => void;
  removeCallInfo: () => void;

  setAgentInfo: (agentInfo: AgentInfo) => void;

  callContext: {
    fullScreen: boolean;
    showCaption: boolean;
    transcripts: { role: string; content: string }[];
    productList: FunctionCallMessage[];
    relatedQuestions: FunctionCallMessage[];
    relatedProducts: FunctionCallMessage[];
    links: FunctionCallMessage[];
  };
  resetCallContext: () => void;
}

const VideoAgentContext = createContext<VideoAgentContextType | undefined>(
  undefined
);

const DEFAULT_CALL_CONTEXT = {
  fullScreen: false,
  showCaption: false,
  transcripts: [],
  productList: [],
  relatedQuestions: [],
  relatedProducts: [],
  links: [],
};

const useVideoAgentStore = create<VideoAgentContextType>((set) => ({
  query: "",
  apiKey: undefined,
  agentId: undefined,
  baseUrl: undefined,
  callInfo: undefined,
  agentInfo: undefined,
  setApiKey: (apiKey: string) => set({ apiKey }),
  setAgentId: (agentId: string) => set({ agentId }),
  setBaseUrl: (baseUrl: string) => set({ baseUrl }),
  setCallInfo: (callInfo: CallInfo) => set({ callInfo }),
  removeCallInfo: () => set({ callInfo: undefined }),
  setAgentInfo: (agentInfo: AgentInfo) => set({ agentInfo }),
  callContext: DEFAULT_CALL_CONTEXT,
  resetCallContext: () => set({ callContext: DEFAULT_CALL_CONTEXT }),
}));

export const VideoAgentProvider = ({
  apiKey: _apiKey,
  agentId: _agentId,
  baseUrl: _baseUrl,
  children,
}: {
  apiKey?: string;
  agentId?: string;
  baseUrl?: string;
  children: ReactNode;
}) => {
  const [apiKey, setApiKey] = useState<string | undefined>(_apiKey);
  const [agentId, setAgentId] = useState<string | undefined>(_agentId);
  const [baseUrl, setBaseUrl] = useState<string | undefined>(_baseUrl);
  const [callInfo, setCallInfo] = useState<CallInfo | undefined>(undefined);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | undefined>(undefined);
  const [callContext, setCallContext] =
    useState<CallContext>(DEFAULT_CALL_CONTEXT);

  const query = useMemo(() => {
    let query = window.location.search;
    if (!query) {
      query = `?api_key=${apiKey}&agent_id=${agentId}`;
    }
    return query;
  }, [apiKey, agentId]);

  const removeCallInfo = useCallback(() => {
    setCallInfo(undefined);
  }, []);

  const resetCallContext = useCallback(() => {
    setCallContext(DEFAULT_CALL_CONTEXT);
  }, []);

  return (
    <VideoAgentContext.Provider
      value={{
        query,
        apiKey,
        agentId,
        baseUrl,
        callInfo,
        agentInfo,
        setApiKey,
        setAgentId,
        setBaseUrl,
        setCallInfo,
        removeCallInfo,
        setAgentInfo,
        callContext,
        resetCallContext,
      }}
    >
      {children}
    </VideoAgentContext.Provider>
  );
};

export const useVideoAgentContext = () => {
  const context = useContext(VideoAgentContext);
  if (!context) {
    throw new Error(
      "useVideoAgentContext must be used within a VideoAgentProvider"
    );
  }
  return context;
};
