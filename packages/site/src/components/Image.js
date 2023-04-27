import { Image as SemanticImage } from "semantic-ui-react";
import { useDark } from "../context/theme";
import { useMemo } from "react";
import { getUrlExtension } from "../utils/url";

/**
 * @param {typeof SemanticImage & {src: string, srcDark?: string, srcDarkSuffix?: string, dark?: boolean}} props
 * @description Wrapped `Image` with auto dark compatible
 */
export default function Image({
  src,
  srcDark,
  dark: supportDark,
  srcDarkSuffix = "-dark",
  ...props
}) {
  const dark = useDark();
  const url = useMemo(() => {
    const ext = getUrlExtension(src, { dot: true });

    if (dark) {
      if (srcDark) {
        return srcDark;
      } else if (supportDark && ext) {
        return src.replace(ext, `${srcDarkSuffix}${ext}`);
      }
    }

    return src;
  }, [dark, srcDarkSuffix, src, supportDark, srcDark]);

  return <SemanticImage {...props} src={url} />;
}
