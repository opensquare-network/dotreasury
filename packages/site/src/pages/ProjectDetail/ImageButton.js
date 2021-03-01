import styled from "styled-components";

import GrayImage from "../../components/GrayImage";

const ImageButton = styled(GrayImage)`
  size: 22px;
  border-radius: 50%;

  &:hover {
    cursor: pointer;
    -webkit-filter: grayscale(0);
    filter: grayscale(0);
    opacity: 1;
  }
`;

export default ImageButton;
