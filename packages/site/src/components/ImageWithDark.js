import { Image } from "semantic-ui-react";
import { useDark } from "../context/theme";
import { useMemo } from "react";
import { getUrlExtension } from "../utils/url";

/**
 * @param {typeof Image & {src: string, srcDark?: string, srcDarkSuffix?: string, dark?: boolean}} props
 * @description Wrapped `Image` with auto dark compatible
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

  return <Image {...props} src={url} />;
}
