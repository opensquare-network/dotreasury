import Card from "../../../../site/src/components/Card";
import ExternalLink from "../../../../site/src/components/ExternalLink";
import IconMask from "../../../../site/src/components/Icon/Mask";
import ImageWithDark from "../../../../site/src/components/ImageWithDark";
import { abbreviateBigNumber } from "../../../../site/src/utils";
import { useTreasuriesData } from "../../hooks/useTreasuriesData";
import { cn } from "../../utils";
import { getChainSettings } from "../../utils/chains";

export default function EcosystemDotsama(props) {
  const { data } = useTreasuriesData();
  const max = Math.max(...data.map((treasury) => treasury.value));

  return (
    <Card {...props} className={cn("!p-6", props.className)}>
      <h4 className="h3-18-semibold">Treasury in Dotsama Ecosystem</h4>
      <p className="p-14-medium text-textTertiary">Updated at 0000</p>

      <div className="mt-6 space-y-4">
        {data.map((treasury) => (
          <div key={treasury.chain}>
            <TreasuryItem max={max} {...treasury} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function TreasuryItem({ max, ...treasury }) {
  const chainSettings = getChainSettings(treasury.chain);

  return (
    <div className="flex items-center">
      <div className="w-[160px] h4-16-semibold flex items-center">
        <div className="mr-2 p-1 border border-neutral300 rounded flex items-center">
          <ImageWithDark src={`/imgs/logo-${chainSettings.value}.svg`} />
        </div>
        {chainSettings.hasDotreasury ? (
          <ExternalLink
            href={`https://${chainSettings.value}.dotreasury.com`}
            className={cn(
              "inline-flex items-center",
              "hover:text-textPrimary hover:underline",
            )}
          >
            {chainSettings.name}
            <IconMask
              src="/imgs/caret-up-right.svg"
              color="textTertiary"
              size={24}
            />
          </ExternalLink>
        ) : (
          <span className="text-textTertiary">{chainSettings.name}</span>
        )}
      </div>

      <div className="flex items-center flex-grow">
        <div
          className="bg-pink300 h-5 mr-4"
          style={{
            width: `${(treasury.value / max) * 100}%`,
          }}
        />
        <div className="p-14-medium flex items-center gap-x-2">
          <div className="text-textPrimary whitespace-nowrap">
            {!!treasury.amount && "≈ "}$
            {abbreviateBigNumber(treasury.amount * treasury.price)}
          </div>
          <div className="flex items-center text-textTertiary">
            <div className="mr-1">{abbreviateBigNumber(treasury.amount)}</div>
            <div className="text-textTertiary">{chainSettings.symbol}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
