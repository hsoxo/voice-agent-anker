// pages/call-settings/[clientId].tsx
import dynamic from "next/dynamic";
import { GetServerSidePropsContext } from "next";

const WebAppSettingsPage = dynamic(
  () => import("@/components/WebAppSettings/client"),
  {
    ssr: false,
  }
);

export default function Page({ clientId }: { clientId: string }) {
  return <WebAppSettingsPage clientId={clientId} />;
}

const USERNAME = "admin";
const PASSWORD = "newcast";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ clientId: string }>
) => {
  const { req, res, params } = context;

  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Basic ")) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.end("Unauthorized");
    return { props: {} as any };
  }

  const base64Credentials = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64Credentials, "base64")
    .toString()
    .split(":");

  if (user !== USERNAME || pass !== PASSWORD) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.end("Unauthorized");
    return { props: {} as any };
  }

  const { clientId } = context.params!;

  return {
    props: {
      clientId,
    },
  };
};
