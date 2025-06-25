// pages/call-settings/[clientId].tsx
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";

const WebAppSettingsPage = dynamic(
  () => import("@/components/WebAppSettings/client"),
  {
    ssr: false,
  }
);

export default function Page({ clientId }: { clientId: string }) {
  return <WebAppSettingsPage clientId={clientId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { clientId } = context.params!;
  return {
    props: {
      clientId,
    },
  };
};
