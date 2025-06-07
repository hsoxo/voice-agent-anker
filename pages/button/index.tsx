export const config = {
  unstable_runtimeJS: true,
  unstable_runtime: 'edge', // 或 'experimental-edge'
};

import {LocalButton} from "@/components/ButtonApp/LocalButton";

  
export default function Page() {
  return (
    <LocalButton />
  )
}
