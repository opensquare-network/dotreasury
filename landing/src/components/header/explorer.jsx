import { forwardRef } from "react";
import Card from "../../../../site/src/components/Card";
import { cn } from "../../utils";

function HeaderExplorer(props, ref) {
  const links = [
    {
      link: "https://polkadot.dotreasury.com",
      icon: "/imgs/logo-polkadot.svg",
      name: "Polkadot",
      symbol: "DOT",
    },
    {
      link: "https://kusama.dotreasury.com",
      icon: "/imgs/logo-kusama.svg",
      name: "Kusama",
      symbol: "KSM",
    },
  ];

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
            <img src={item.icon} alt={item.name} className="mr-2" />
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
}

HeaderExplorer.propTypes = {
  className: String,
};

export default forwardRef(HeaderExplorer);
