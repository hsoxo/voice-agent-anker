import React from "react";
import TriggerText from "./Text";
import ChatButton from "../ChatButton";

const Trigger = ({ handleOpen }: { handleOpen: () => void }) => {
  return (
    <>
      <TriggerText />
      <ChatButton open={false} handler={handleOpen} />
    </>
  );
};

export default Trigger;
