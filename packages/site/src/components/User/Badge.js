import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  > img {
    width: 18px;
    height: 18px;
  }
`;

const statusIconMap = new Map([
  ["NOT_VERIFIED", "error-grey"],
  ["VERIFIED", "auth"],
  ["ERRONEOUS", "error"],
  ["VERIFIED_LINKED", "authorized-sub"],
  ["NOT_VERIFIED_LINKED", "sub-grey"],
  ["ERRONEOUS_LINKED", "sub-red"],
]);

const Badge = ({ status }) => {
  if (status === "NO_ID") return null;
  const icon = statusIconMap.get(status);
  const imgSrc = `/imgs/badge-icons/${icon}.svg`;
  return <Wrapper>{icon && <Image src={imgSrc} />}</Wrapper>;
};

export default Badge;
