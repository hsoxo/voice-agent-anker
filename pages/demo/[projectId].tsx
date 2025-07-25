import axios from "axios";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/JapanBankDemo"), {
  ssr: false,
});

export default function Index({ projectId, settings, services }: any) {
  return (
    <HomePage
      projectId={projectId}
      defaultConfig={settings}
      defaultServices={services}
    />
  );
}

export const getServerSideProps = async ({
  params,
}: {
  params: {
    projectId: string;
  };
}) => {
  const redirect = {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
  let response;
  try {
    response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${params.projectId}`
    );
  } catch (e) {
    return redirect;
  }
  if (!response.data) {
    return redirect;
  }
  return {
    props: {
      projectId: params.projectId,
      settings: response.data.call_settings,
      services: response.data.services,
    },
  };
};
