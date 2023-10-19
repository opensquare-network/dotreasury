import { abbreviateBigNumber } from "@site/src/utils";
import { cn } from "../../utils";
import { getChainSettings } from "@site/src/utils/chains";

const SHOW_INFO_SIZE = 80;
const SHOULD_SCALE_INFO_SIZE = 200;

export default function ProjectBubble({ node }) {
  const size = node.r * 2;

  if (!size) {
    return null;
  }

  const chainSettings = getChainSettings(node.chain);

  const showInfo = size >= SHOW_INFO_SIZE;

  return (
    <div
      className={cn(
        "overflow-hidden",
        "rounded-full flex items-center justify-center",
        "bg-[radial-gradient(50%_50%_at_50%_50%,_#FFF_74.48%,_#FFF0F3_100%)]",
        "dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#0F0F0F_74.48%,_#31080F_100%)]",
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      <div className="w-full h-full flex flex-col justify-center">
        <img
          className="w-16 h-16 mx-auto dark:hidden"
          style={{
            maxWidth: "calc(100% - 16px)",
            maxHeight: "calc(100% - 16px)",
          }}
          src={`/imgs/logo-${chainSettings.value}.svg`}
          alt={chainSettings.name}
        />
        <img
          className="w-16 h-16 mx-auto hidden dark:block"
          style={{
            maxWidth: "calc(100% - 16px)",
            maxHeight: "calc(100% - 16px)",
          }}
          src={`/imgs/logo-${chainSettings.value}-dark.svg`}
          alt={chainSettings.name}
        />
        {showInfo && (
          <div className="text-textPrimary text-center">
            <h3
              className="h3-18-semibold"
              style={{
                fontSize: size < SHOULD_SCALE_INFO_SIZE ? size / 12 : undefined,
                lineHeight: "155%",
              }}
            >
              {chainSettings.name}
            </h3>
            <h4
              className="h4-16-semibold"
              style={{
                fontSize: size < SHOULD_SCALE_INFO_SIZE ? size / 14 : undefined,
                lineHeight: "150%",
              }}
            >
              ≈ ${abbreviateBigNumber(node.value)}
            </h4>
            <p
              className="p-14-medium text-textTertiary"
              style={{
                fontSize: size < SHOULD_SCALE_INFO_SIZE ? size / 16 : undefined,
                lineHeight: "142%",
              }}
            >
              {abbreviateBigNumber(node.amount)} {chainSettings.symbol}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
