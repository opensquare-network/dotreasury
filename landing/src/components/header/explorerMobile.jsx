import IconMask from "@site/src/components/Icon/Mask";
import { HeaderLogo } from "./logo";
import ContactUsLink from "./contactUsLink";
import Button from "../button";
import { Select } from "semantic-ui-react";
import { useState } from "react";
import { CHAINS } from "../../utils/chains";
import ImageWithDark from "@site/src/components/ImageWithDark";
import { cn } from "src/utils";
import ExternalLink from "@site/src/components/ExternalLink";

export default function HeaderExplorerMobile({ setMobileExplorerVisible }) {
  const [value, setValue] = useState(CHAINS.polkadot.value);

  const options = [CHAINS.polkadot, CHAINS.kusama].map((chain) => {
    return {
      key: chain.value,
      value: chain.value,
      text: (
        <div className="option flex items-center justify-between w-full">
          <span className="inline-flex items-center">
            <ImageWithDark src={`/imgs/logo-${chain.value}.svg`} />
            <span className="ml-2 p-14-medium">{chain.name}</span>
          </span>
          <span className="ml-2 p-12-medium text-textTertiary">
            {chain.symbol}
          </span>
        </div>
      ),
    };
  });

  return (
    <div
      className="absolute top-0 left-0 right-0 bg-neutral100 z-10"
      style={{ boxShadow: "var(--shadow200)" }}
    >
      <div className="flex items-center justify-between border-b border-neutral300 py-5 px-6 ">
        <HeaderLogo />

        <IconMask
          role="button"
          src="/imgs/close.svg"
          color="textPrimary"
          size={24}
          alt="menu"
          onClick={() => {
            setMobileExplorerVisible(false);
          }}
        />
      </div>

      <div className="py-5 px-6 ">
        <div className="py-4 text-center">
          <ContactUsLink />
        </div>

        <div className="py-4">
          <Select
            className={cn(
              "relative mb-4",
              "!px-4 !py-1.5 !min-h-full",
              "!border-neutral400 !rounded",
              "[&_.menu]:!border-neutral400",
              "[&_.text]:!flex [&_.text]:!items-center [&_.text]:!w-full [&_.text_.option]:pr-8",
              "[&_i.icon]:!min-w-[36px] [&_i.icon]:!min-h-[36px] [&_i.icon]:max-w-[36px] [&_i.icon]:max-h-[36px]",
              "[&_i.icon]:flex [&_i.icon]:items-center [&_i.icon]:justify-center",
              "[&_i.icon]:!top-0 [&_i.icon]:!right-0 [&_i.icon]:!m-0 [&_i.icon]:!p-1.5",
            )}
            fluid
            options={options}
            value={value}
            onChange={(_, { value }) => setValue(value)}
          />
          <ExternalLink href={`https://${value}.dotreasury.com`}>
            <Button className="w-full">Explore Treasury</Button>
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
