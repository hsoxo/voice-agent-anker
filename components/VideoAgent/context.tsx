
import { AgentInfo, CallInfo, CallContext } from "./types";
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

  callContext: CallContext;
  resetCallContext: () => void;
}

const DEFAULT_CALL_CONTEXT = {
  fullScreen: false,
  showCaption: false,
  transcripts: [],
  productList: [],
  relatedQuestions: [],
  relatedProducts: [],
  links: [],
};

export const useVideoAgentStore = create<VideoAgentContextType>((set) => ({
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

