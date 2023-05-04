import { useDark } from "../context/theme";
import { useMemo } from "react";
import { getUrlExtension } from "../utils/url";
import styled from "styled-components";
import { block } from "../styles/tailwindcss";

const Img = styled.img`
  ${block};
`;

/**
 * @param {typeof Image & import("react").ImgHTMLAttributes & {src: string, srcDark?: string, srcDarkSuffix?: string, dark?: boolean}} props
 * @description Wrapped `Img` with auto dark compatible
 */
export default function ImageWithDark({
  src,
  srcDark,
  srcDarkSuffix = "-dark",
  ...props
}) {
  const dark = useDark();

  const url = useMemo(() => {
    const ext = getUrlExtension(src, { dot: true });

    if (dark) {
      if (srcDark) {
        return srcDark;
      } else if (ext) {
        return src.replace(ext, `${srcDarkSuffix}${ext}`);
      }
    }

    return src;
  }, [dark, srcDarkSuffix, src, srcDark]);

  return <Img {...props} src={url} alt={props.alt} />;
}
