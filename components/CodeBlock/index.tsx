import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CodeBlock as CodeBlockComponent } from "react-code-blocks";
import { Button } from "../ui/button";
import UploadPythonFileButton from "./UploadPythonFileButton";

const CodeBlock = ({
  projectId,
  code,
}: {
  projectId: string;
  code: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [localCode, setLocalCode] = useState(code);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([localCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "flow.py";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="text-left py-12">
      <div className="font-semibold mb-2 flex justify-between">
        <span>Flow: </span>
        <UploadPythonFileButton
          projectId={projectId}
          onUploaded={setLocalCode}
        />
      </div>
      <div className="relative rounded-md overflow-hidden">
        <div className="absolute top-2 right-2 flex gap-2">
          <div>
            <Button
              className="text-sm hover:underline"
              size="sm"
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
          <CopyToClipboard text={localCode} onCopy={() => setCopied(true)}>
            <Button className="text-sm hover:underline" size="sm">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </CopyToClipboard>
        </div>
        <div className="max-h-[80vh] overflow-y-scroll no-scrollbar">
          <CodeBlockComponent
            text={localCode}
            showLineNumbers
            wrapLongLines
            language="python"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
