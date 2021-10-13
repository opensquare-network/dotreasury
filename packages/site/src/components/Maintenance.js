import React from "react";
import styled from "styled-components";

import { useWindowSize } from "../utils/hooks";

const Wrapper = styled.div`
  padding: 12px;
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(90deg, #f23252 0%, #f2b12f 100%);
  text-align: center;
`;

const Maintenance = () => {
  const [width] = useWindowSize();

  return (
    <Wrapper>
      {width && width >= 900
        ? "The website is currently under maintenance. We will be back soon. Thank you for your patience."
        : "The website under maintenance"}
    </Wrapper>
  );
};

export default Maintenance;
