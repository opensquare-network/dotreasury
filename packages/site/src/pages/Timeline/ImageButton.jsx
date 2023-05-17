import styled from "styled-components";

import ImageWithDark from "../../components/ImageWithDark";

const ImageButton = styled(ImageWithDark)`
  size: 20px;
  width: 20px;
  height: 20px;
  border-radius: 50%;

  -webkit-filter: grayscale(1);
  filter: grayscale(1);
  opacity: 0.5;

  &:hover {
    cursor: pointer;
    -webkit-filter: grayscale(0);
    filter: grayscale(0);
    opacity: 1;
  }
`;

export default ImageButton;
