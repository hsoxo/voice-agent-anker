"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import * as Card from "@/components/ui/card";
import Settings from "@/components/CallSettings";
import { GetServerSideProps } from "next";

export default function Home({ clientId }: { clientId: string }) {

  return (
    <main>
      <div id="app">
        <TooltipProvider>
          <Card.Card shadow className="animate-appear max-w-lg">
            <Card.CardHeader>
              <Card.CardTitle>Call Settings {clientId ? `for ${clientId}` : ""}</Card.CardTitle>
            </Card.CardHeader>
            <Settings clientId={clientId as string} showExtra={true} />
          </Card.Card>
        </TooltipProvider>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { clientId } = context.params!;

  return {
    props: {
      clientId,
    },
  };
};
