import React from "react";
import styled from "@emotion/styled";
import { Button } from "@/components/uiStyled/Button";
import { X } from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/icons/logo-dark.svg";

interface HeaderProps {
  handleClose: () => void;
}

const Header = ({ handleClose }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <Image alt="logo" src={Logo} width={140} />
      <Button
        onClick={handleClose}
        isRound
        variant="icon"
        size="icon"
        className="flex-shrink-0"
      >
        <X />
      </Button>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  button {
    cursor: pointer;
    flex-shrink: 0;
  }
`;

export default Header;
