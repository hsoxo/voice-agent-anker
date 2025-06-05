import React from "react";

import DeviceSelect from "./DeviceSelect";

export const MinialConfigure: React.FC = React.memo(
  () => {
    return (
        <DeviceSelect hideMeter={false} />
    );
  },
);
