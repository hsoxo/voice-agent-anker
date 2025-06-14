export interface FunctionCallMessage {
  type: "link" | "related-questions" | "related-products" | "product-list";
  href: string;
  label: string;
  text: string;
  callback_response: string;
  image?: string;
}

export interface CallContext {
  fullScreen: boolean;
  showCaption: boolean;
  transcripts: { role: string; content: string }[];
  productList: FunctionCallMessage[];
  relatedQuestions: FunctionCallMessage[];
  relatedProducts: FunctionCallMessage[];
  links: FunctionCallMessage[];
}

export interface CallInfo {
  conversation_id: string;
  max_call_duration: number;
  greeting_message: string;
  product_info: FunctionCallMessage;
  product_list: FunctionCallMessage[];
}

export interface AgentInfo {
  agent_id: string;
  replica_id: string;
  persona_id: string;
  preview_video: string;
  name: string;
  error: boolean;
}
