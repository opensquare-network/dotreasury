import { forwardRef } from "react";
import Card from "../../../../site/src/components/Card";
import { cn } from "../../utils";
import { CHAINS } from "../../utils/chains";
import ImageWithDark from "../../../../site/src/components/ImageWithDark";

const HeaderExplorer = forwardRef(function HeaderExplorerComponent(props, ref) {
  const links = Object.keys(CHAINS)
    .filter((chain) => CHAINS[chain].hasDotreasury)
    .map((chain) => {
      const chainSettings = CHAINS[chain];

      return {
        link: `https://${chainSettings.value}.dotreasury.com`,
        icon: `/imgs/logo-${chainSettings.value}.svg`,
        name: chainSettings.name,
        symbol: chainSettings.symbol,
      };
    });

  return (
    <Card
      {...props}
      className={cn("py-1 w-[280px] !rounded", props.className)}
      ref={ref}
    >
      {links.map((item) => (
        <div key={item.link}>
          <a
            href={item.link}
            className="flex items-center px-4 py-2 hover:bg-neutral200"
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <ImageWithDark src={item.icon} alt={item.name} className="mr-2" />
            <span className="w-full inline-flex items-baseline justify-between">
              <span className="text-textPrimary p-14-medium">{item.name}</span>
              <span className="text-textTertiary p-12-medium">
                {item.symbol}
              </span>
            </span>
          </a>
        </div>
      ))}
    </Card>
  );
});

export default HeaderExplorer;
