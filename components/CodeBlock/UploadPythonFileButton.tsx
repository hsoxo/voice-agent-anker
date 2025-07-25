import React, { useRef } from "react";
import { Button } from "../ui/button";
import { uploadProjectFlow } from "@/services/projects";
import { toast } from "sonner";

const MAX_SIZE = 500 * 1024; // 500KB

const UploadPythonFileButton = ({
  projectId,
  onUploaded,
}: {
  projectId: string;
  onUploaded: (code: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".py")) {
      alert("Only .py files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("File size exceeds 500KB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result as string;
      console.log("File content:", text);
      await uploadProjectFlow(projectId, text);
      // 你可以在这里将文本保存到状态或传给后端
      toast.success("File uploaded successfully");
      onUploaded(text);
    };
    reader.onerror = () => {
      alert("Failed to read the file.");
    };

    reader.readAsText(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <Button size="sm" onClick={handleClick}>
        Upload Python File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".py"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadPythonFileButton;
