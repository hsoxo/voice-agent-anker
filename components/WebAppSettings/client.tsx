// components/CallSettingsPage.tsx
"use client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import * as Card from "@/components/ui/card";
import Settings from "@/components/WebAppSettings";

export default function CallSettingsPage({ clientId }: { clientId: string }) {
  return (
    <main>
      <div id="app">
        <TooltipProvider>
          <Card.Card shadow className="animate-appear max-w-lg">
            <Card.CardHeader>
              <Card.CardTitle>Web Chat Settings ({clientId})</Card.CardTitle>
            </Card.CardHeader>
            <Settings clientId={clientId} showExtra={true} />
          </Card.Card>
        </TooltipProvider>
      </div>
    </main>
  );
}
