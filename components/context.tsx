import React, { createContext, ReactNode, useCallback, useState } from "react";
import { defaultConfig, defaultServices } from "../rtvi.config";

export interface RTVIConfig {
  service: string;
  options: {
    name: string
    value: any
  }[]
}

export type ClientParams = {
  config: RTVIConfig[];
  services: { [key: string]: string };
};

interface AppContextType {
  character: number;
  setCharacter: (value: number) => void;
  language: string;
  setLanguage: (value: string) => void;
  clientParams: ClientParams;
  setClientParams: (newParams: {
    config?: RTVIConfig[];
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
    config: defaultConfig as RTVIConfig[],
    services: defaultServices as { [key: string]: string },
  },
  setClientParams: () => {
    throw new Error("updateVoiceClientParams function must be overridden");
  },
});
AppContext.displayName = "AppContext";

type AppContextProps = {
  children: ReactNode;
  config?: RTVIConfig[];
  services?: { [key: string]: string };
  language?: string;
};

export const AppProvider: React.FC<
  React.PropsWithChildren<AppContextProps>
> = ({ children, config, services, language: lang }) => {
  const [character, setCharacter] = useState<number>(0);
  const [language, setLanguage] = useState<string>(lang ?? "en");
  const [clientParams, _setClientParams] = useState<ClientParams>({
    config: config ?? (defaultConfig as RTVIConfig[]),
    services: services ?? (defaultServices as { [key: string]: string }),
  });

  const setClientParams = useCallback(
    (newParams: {
      config?: RTVIConfig[];
      services?: { [key: string]: string };
    }) => {
      _setClientParams((p) => {
        const newConfig = p.config.reduce((acc, cur) => {
          if (!cur) return
          const newItem = newParams.config?.find(c => c.service == cur.service)
          if (newItem) {
            const options = cur.options.reduce((acc1, cur1) => {
              const newOption = newItem.options.find(oo => cur1.name == oo.name)
              if (newOption) {
                acc1.push(newOption)
              } else {
                acc1.push(cur1)
              }
              return acc1
            }, [] as any)
            acc.push({
              ...cur,
              options,
            })
          } else {
            acc.push(cur)
          }
          return acc
        }, [] as RTVIConfig[])
        return {
          config: newConfig,
          services: newParams.services
            ? { ...p.services, ...newParams.services }
            : p.services,
        }
      })
    }, [])
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
