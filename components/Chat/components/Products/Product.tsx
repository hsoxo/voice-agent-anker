import React from "react";
import styled from "@emotion/styled";
import { Button } from "@/components/uiStyled/Button";
import { ShoppingCart } from "lucide-react";

const Product = ({
  product,
  handleLearnMore,
}: {
  product: any;
  handleLearnMore: (text: string) => void;
}) => {
  return (
    <ProductWrapper>
      <img src={product.image} alt={product.label} />
      <p>{product.text}</p>
      <div className="button-group">
        <Button variant="icon" size="iconSm">
          <ShoppingCart />
        </Button>
        <Button
          size="sm"
          onClick={() =>
            handleLearnMore(
              `I want to learn more about this product: ${product.label}`
            )
          }
        >
          Learn More
        </Button>
      </div>
    </ProductWrapper>
  );
};

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  padding: 8px;

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 64px;
  }

  p {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 0;
  }

  .button-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default Product;
