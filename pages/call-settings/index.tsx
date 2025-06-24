import dynamic from "next/dynamic";
const CallSettings = dynamic(
  () => import("@/components/CallSettings/wrapper"),
  { ssr: false }
);

export default function Index() {
  return <CallSettings title="Anker Settings" readonly />;
}
