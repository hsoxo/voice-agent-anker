import React from "react";
import styled from "@emotion/styled";
import Product from "./Product";

const Products = ({
  products,
  show,
  handleLearnMore,
}: {
  products: any;
  show: boolean;
  handleLearnMore: (text: string) => void;
}) => {
  return (
    <Wrapper show={show}>
      {products.map((product) => (
        <Product
          key={product.href}
          product={product}
          handleLearnMore={handleLearnMore}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ show: boolean }>`
  padding: 16px 32px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  width: 200px;
  transition: opacity 0.3s ease;
  opacity: ${({ show }) => (show ? 1 : 0)};
  left: ${({ show }) => (show ? "-180px" : "0")};
  border-radius: 20px;
  z-index: -1;
  top: 16px;
  overflow-y: auto;
  height: 680px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
`;

export default Products;
