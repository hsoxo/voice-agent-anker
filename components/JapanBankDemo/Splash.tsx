import React from "react";

import { Button } from "@/components/ui/button";

type SplashProps = {
  handleReady: () => void;
};

export const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  return (
    <main className="flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
      <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance text-center">
          Newcast Interactive AI Agents demo
        </h1>

        <Button onClick={() => handleReady()}>Talk to an agent now</Button>
      </div>
    </main>
  );
};

export default Splash;
