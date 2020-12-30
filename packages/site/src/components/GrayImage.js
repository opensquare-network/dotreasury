import styled from "styled-components";
import { Image } from "semantic-ui-react";

const GrayImage = styled(Image)`
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
  opacity: 0.5;
`;

export default GrayImage;
