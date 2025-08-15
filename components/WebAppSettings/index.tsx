import { useEffect, useState } from "react";
import * as Card from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { ClientParams } from "@/components/context";
import ConfigSelect from "@/components/Setup/ConfigSelect";
import { defaultConfig, defaultServices } from "@/rtvi.config";
import { toast } from "sonner";
import { getWebSettings, updateWebSettings } from "@/services/web-settings";

export default function Settings({
  clientId,
  showExtra = false,
  readonly = false,
}: {
  clientId: string;
  showExtra?: boolean;
  readonly?: boolean;
}) {
  const [language, setLanguage] = useState("en");
  const [clientParams, setClientParams] = useState<null | ClientParams>(null);

  const onConfigUpdate = (newConfigs: any[]) => {
    setClientParams((prev) => {
      if (!prev) return null;
      const newClientParams = {
        config: [...prev.config],
        services: { ...prev.services },
      };
      for (const service of newConfigs) {
        const serviceIndex = prev?.config.findIndex(
          (c) => c.service === service.service
        );
        if (serviceIndex !== -1) {
          newClientParams.config[serviceIndex] = service;
        }
        if (service.service === "tts") {
          const provider = service.options.find(
            (o: any) => o.name === "provider"
          )!.value;
          newClientParams.services.tts = provider;
        }
        if (service.service === "llm") {
          const provider = service.options.find(
            (o: any) => o.name === "provider"
          )!.value;
          newClientParams.services.llm = provider;
        }
        if (service.service === "stt") {
          const provider = service.options.find(
            (o: any) => o.name === "provider"
          )!.value;
          newClientParams.services.stt = provider;
        }
      }
      return newClientParams;
    });
  };

  useEffect(() => {
    async function fetchCallSettings() {
      const callSettings = await getWebSettings(clientId);
      console.log(callSettings);
      if (!callSettings.config) {
        setClientParams({
          config: defaultConfig,
          services: defaultServices,
        });
      } else {
        setClientParams(callSettings);
        setLanguage(callSettings.language);
      }
    }
    fetchCallSettings();
  }, []);

  const handleSave = () => {
    updateWebSettings(clientParams, clientId);
    toast.success("Settings saved");
  };

  return (
    <>
      <Card.CardContent stack>
        <section className="flex flex-col flex-wrap gap-3 lg:gap-4">
          {clientParams && (
            <ConfigSelect
              onConfigUpdate={onConfigUpdate}
              onServiceUpdate={() => {}}
              inSession={false}
              clientParams={clientParams}
              language={language}
              setLanguage={setLanguage}
              showExtra={showExtra}
              readonly={readonly}
            />
          )}
        </section>
      </Card.CardContent>
      <Card.CardFooter isButtonArray>
        <Button key="start" onClick={handleSave} disabled={readonly}>
          Save
        </Button>
      </Card.CardFooter>
    </>
  );
}
