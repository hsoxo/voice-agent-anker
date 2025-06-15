import { AgentInfo, CallInfo, CallContext } from "./types";
import { create } from "zustand";

interface VideoAgentContextType {
  query: string;

  apiKey: string | undefined;
  setApiKey: (apiKey: string) => void;

  agentId: string | undefined;
  setAgentId: (agentId: string) => void;

  baseUrl: string | undefined;
  setBaseUrl: (baseUrl: string) => void;

  callInfo: CallInfo | undefined;
  setCallInfo: (callInfo: CallInfo) => void;
  removeCallInfo: () => void;

  agentInfo: AgentInfo | undefined;
  setAgentInfo: (agentInfo: AgentInfo) => void;

  tavusLoaded: boolean;
  setTavusLoaded: (loaded: boolean) => void;

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
  setApiKey: (apiKey: string) => set({ apiKey }),
  agentId: undefined,
  setAgentId: (agentId: string) => set({ agentId }),
  baseUrl: undefined,
  setBaseUrl: (baseUrl: string) => set({ baseUrl }),
  callInfo: undefined,
  setCallInfo: (callInfo: CallInfo) => set({ callInfo }),
  removeCallInfo: () => set({ callInfo: undefined }),
  agentInfo: undefined,
  setAgentInfo: (agentInfo: AgentInfo) => set({ agentInfo }),
  tavusLoaded: false,
  setTavusLoaded: (loaded: boolean) => set({ tavusLoaded: loaded }),
  callContext: DEFAULT_CALL_CONTEXT,
  resetCallContext: () => set({ callContext: DEFAULT_CALL_CONTEXT }),
}));
