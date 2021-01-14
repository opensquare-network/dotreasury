import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import ExplorerLink from "../../components/ExplorerLink";

import {TEXT_DARK_MAJOR, TEXT_DARK_MINOR} from "../../constants"
import { scanHeightSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
`

const DarkMinorLabel = styled(Label)`
  color: ${TEXT_DARK_MINOR};
  margin-left: 4px;
`;

const DarkMajorLabel = styled(Label)`
  color: ${TEXT_DARK_MAJOR};
  margin-left: 8px;
`;

const Polygon = styled(Image)`
  width: 12px;
  height: 12px;
`

const ScanHeight = () => {
  const scanHeight = useSelector(scanHeightSelector);

  return (
    <Wrapper>
      <Polygon src={"/imgs/polygon.svg"} />
      <DarkMinorLabel>Scan height</DarkMinorLabel>
      <ExplorerLink href={`/block/${scanHeight}`}>
        <DarkMajorLabel>{`#${scanHeight}`}</DarkMajorLabel>
      </ExplorerLink>
    </Wrapper>
  )
};

export default ScanHeight;
