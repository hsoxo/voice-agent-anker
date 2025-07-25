import { CallSettings, Project, ServiceConfig } from "@/types/projects";
import axios from "axios";

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}`,
    { validateStatus: () => true }
  );
  console.log(response);
  if (!response.status || response.status >= 400) {
    throw new Error(response.data?.detail || "Failed to fetch project");
  }
  return response.data;
};

export const getProjectFlow = async (projectId: string): Promise<any> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/flow`,
    { validateStatus: () => true }
  );
  console.log(response);
  if (!response.status || response.status >= 400) {
    throw new Error(response.data?.detail || "Failed to fetch project");
  }
  return response.data;
};

export const updateProjectCallSettings = async (
  projectId: string,
  call_settings: ServiceConfig[]
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/call_settings`,
    call_settings
  );
  return response.data;
};

export const uploadProjectFlow = async (projectId: string, flow: string) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/flow`,
    { flow }
  );
  return response.data;
};
