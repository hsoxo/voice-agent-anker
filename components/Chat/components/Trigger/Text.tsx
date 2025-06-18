import React from "react";
import styled from "@emotion/styled";

const TriggerText = () => {
  return (
    <CloseText>
      <div>
        Hey there! I'm here to help you with any questions you might have.
      </div>
      <div className="message-area">Enter your message...</div>
    </CloseText>
  );
};

const CloseText = styled.div`
  padding: 16px 32px 16px 16px;
  text-align: left;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  .message-area {
    color: #999;
    border-top: 2px solid #e5e7eb;
    padding-top: 8px;
    padding-right: 32px;
    margin-top: 8px;
  }
`;

export default TriggerText;
