import React, { createContext, ReactNode, useCallback, useState } from "react";
import { RTVIClientConfigOption } from "@pipecat-ai/client-js";
import { defaultConfig, defaultServices } from "../rtvi.config";

export type ClientParams = {
  config: RTVIClientConfigOption[];
  services: { [key: string]: string };
};

interface AppContextType {
  character: number;
  setCharacter: (value: number) => void;
  language: string;
  setLanguage: (value: string) => void;
  clientParams: ClientParams;
  setClientParams: (newParams: {
    config?: RTVIClientConfigOption[];
    services?: { [key: string]: string };
  }) => void;
}

export const AppContext = createContext<AppContextType>({
  character: 0,
  setCharacter: () => {
    throw new Error("setCharacter function must be overridden");
  },
  language: "en",
  setLanguage: () => {
    throw new Error("setLanguage function must be overridden");
  },
  clientParams: {
    config: defaultConfig as RTVIClientConfigOption[],
    services: defaultServices as { [key: string]: string },
  },
  setClientParams: () => {
    throw new Error("updateVoiceClientParams function must be overridden");
  },
});
AppContext.displayName = "AppContext";

type AppContextProps = {
  children: ReactNode;
  config?: RTVIClientConfigOption[];
  services?: { [key: string]: string };
  language?: string;
};

export const AppProvider: React.FC<
  React.PropsWithChildren<AppContextProps>
> = ({ children, config, services, language: lang }) => {
  const [character, setCharacter] = useState<number>(0);
  const [language, setLanguage] = useState<string>(lang ?? "en");
  const [clientParams, _setClientParams] = useState<ClientParams>({
    config: config ?? (defaultConfig as RTVIClientConfigOption[]),
    services: services ?? (defaultServices as { [key: string]: string }),
  });

  const setClientParams = useCallback(
    (newParams: {
      config?: RTVIClientConfigOption[];
      services?: { [key: string]: string };
    }) => {
      _setClientParams((p) => ({
        config: newParams.config ?? p.config,
        services: newParams.services
          ? { ...p.services, ...newParams.services }
          : p.services,
      }));
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        character,
        setCharacter,
        language,
        setLanguage,
        clientParams,
        setClientParams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
