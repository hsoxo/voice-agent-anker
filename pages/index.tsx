import dynamic from "next/dynamic";
import { CallSettings } from "@/types/projects";

const HomePage = dynamic(() => import("@/components/Home"), { ssr: false });
const AnkerPoc = dynamic(() => import("@/components/PocPage"), { ssr: false });
const ANKER_POC_APP_ID = "anker-jp";

export default function Index({
  appId,
  settings,
}: {
  appId: string;
  settings: CallSettings;
}) {
  if (appId == ANKER_POC_APP_ID) {
    return <AnkerPoc appId={appId} settings={settings} />;
  }
  return <HomePage />;
}

export async function getServerSideProps() {
  if (process.env.ENVIRONMENT == "japan") {
    const appId = ANKER_POC_APP_ID;
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
  return {
    props: {},
  };
}
