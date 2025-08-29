import dynamic from "next/dynamic";
import { GetServerSidePropsContext } from "next";
import { Record } from "@/components/HistoryTable";

const HistoryTable = dynamic(
  () => import("@/components/HistoryTable"),
  {
    ssr: false,
  }
);

export default function Page({ history }: { history: { items: Record[] } }) {
  return (
    <div className="p-6">
      <HistoryTable items={history.items} />
    </div>
  );
}

const USERNAME = "voc";
const PASSWORD = "vocadmin";

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

  const history = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/history`, {
    method: 'POST'
  })).json()

  return {
    props: {
      history
    },
  };
};
