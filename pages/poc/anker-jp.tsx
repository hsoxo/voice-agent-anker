import { CallSettings } from "@/types/projects";
import dynamic from "next/dynamic";

const PocPage = dynamic(() => import("@/components/PocPage"), { ssr: false });

export default function Index({
  appId,
  settings,
}: {
  appId: string;
  settings: CallSettings;
}) {
  return <PocPage appId={appId} settings={settings} />;
}

export async function getServerSideProps() {
  const appId = "anker-jp";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/web-app-settings/${appId}`
  );
  const data = await response.json();
  console.log(data);
  return {
    props: {
      appId,
      settings: data,
    },
  };
}
