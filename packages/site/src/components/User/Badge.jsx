import React from "react";
import styled from "styled-components";
import ImageWithDark from "../ImageWithDark";

const Wrapper = styled.div`
  > img {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
`;

const statusIconMap = new Map([
  ["NOT_VERIFIED", "unauthorized"],
  ["VERIFIED", "authorized"],
  ["ERRONEOUS", "error"],
  ["VERIFIED_LINKED", "authorized-sub"],
  ["LINKED", "unauthorized-sub"],
  ["ERRONEOUS_LINKED", "unauthorized-error"],
]);

const Badge = ({ status }) => {
  if (status === "NO_ID") {
    return null;
  }

  const icon = statusIconMap.get(status);
  if (!icon) {
    return null;
  }

  const imgSrc = `/imgs/badge-icons/${icon}.svg`;
  return <Wrapper>{icon && <ImageWithDark src={imgSrc} />}</Wrapper>;
};

export default Badge;
