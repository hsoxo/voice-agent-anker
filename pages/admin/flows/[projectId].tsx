import { getProject, getProjectFlow } from "@/services/projects";
import { Project } from "@/types/projects";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React from "react";

const HomePage = dynamic(() => import("@/components/Project/Settings"), {
  ssr: false,
});

const CodeBlock = dynamic(() => import("@/components/CodeBlock"), {
  ssr: false,
});

const Flow = ({
  error,
  projectId,
  project,
  flow,
}: {
  error: string;
  projectId: string;
  project: Project;
  flow: string;
}) => {
  console.log(project);
  console.log(flow);

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="min-w-[600px] flex-shrink-0">
        <div className="flex justify-center">
          <HomePage
            projectId={projectId}
            defaultConfig={project.call_settings}
            defaultServices={project.services}
          />
        </div>
      </div>
      <div style={{ width: "calc(100vw - 648px)" }}>
        <CodeBlock code={flow} projectId={projectId} />
      </div>
    </div>
  );
};

const USERNAME = "admin";
const PASSWORD = "newcast";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ projectId: string }>
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

  let project: Project = null;
  let projectFlow: any = null;
  let error: string | null = null;
  try {
    [project, projectFlow] = await Promise.all([
      getProject(params.projectId),
      getProjectFlow(params.projectId),
    ]);
  } catch (e) {
    error = `${e}`;
    console.error(e);
  }
  return {
    props: {
      error,
      projectId: params.projectId,
      project: project ?? null,
      flow: projectFlow.flow ?? null,
    },
  };
};

export default Flow;
