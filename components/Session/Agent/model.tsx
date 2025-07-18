import React, { useContext } from "react";
import { RTVIClientConfigOption, RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";

import { AppContext } from "@/components/context";

const ModelBadge: React.FC = () => {
  const { clientParams } = useContext(AppContext);

  const [model, setModel] = React.useState<string | undefined>(
    clientParams.config
      .find((c) => c.service === "llm")
      ?.options.find((p) => p.name === "model")?.value as string
  );

  useRTVIClientEvent(
    RTVIEvent.Config,
    async (config: RTVIClientConfigOption[]) => {
      const m = config
        .find((c) => c.service === "llm")
        ?.options.find((p) => p.name === "model")?.value as string;

      setModel(m);
    }
  );

  return (
    <div className="absolute top-3 left-3 right-3 text-center z-[99] uppercase text-[11px] font-semibold text-primary-500">
      {model}
    </div>
  );
};

export default ModelBadge;
