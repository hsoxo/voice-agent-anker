// pages/call-settings/[clientId].tsx
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";

const CallSettingsPage = dynamic(
  () => import("@/components/CallSettings/client"),
  {
    ssr: false,
  }
);

export default function Page({ clientId }: { clientId: string }) {
  return <CallSettingsPage clientId={clientId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { clientId } = context.params!;
  return {
    props: {
      clientId,
    },
  };
};
