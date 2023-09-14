import { cn } from "../../utils";

const SHOW_INFO_SIZE = 80;
const SHOULD_SCALE_INFO_SIZE = 200;

export default function ProjectBubble({ size = null, project }) {
  if (!size) {
    return null;
  }

  const showInfo = size >= SHOW_INFO_SIZE;

  return (
    <div
      className={cn(
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
          className="w-16 h-16 mx-auto"
          style={{
            maxWidth: "calc(100% - 16px)",
            maxHeight: "calc(100% - 16px)",
          }}
          src="/imgs/logo-polkadot.svg"
          alt={project}
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
              {project}
            </h3>
            <h4
              className="h4-16-semibold"
              style={{
                fontSize: size < SHOULD_SCALE_INFO_SIZE ? size / 14 : undefined,
                lineHeight: "150%",
              }}
            >
              ≈ $192.77M
            </h4>
            <p
              className="p-14-medium text-textTertiary"
              style={{
                fontSize: size < SHOULD_SCALE_INFO_SIZE ? size / 16 : undefined,
                lineHeight: "142%",
              }}
            >
              45.45M DOT
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
