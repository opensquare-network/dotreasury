import Card from "../../../../../site/src/components/Card";
import CountDown from "../../../../../site/src/components/CountDown";
import ImageWithDark from "../../../../../site/src/components/ImageWithDark";
import SummaryItem from "../../../../../site/src/components/Summary/Item";
import { abbreviateBigNumber } from "../../../../../site/src/utils";
import { parseEstimateTime } from "../../../../../site/src/utils/parseEstimateTime";
import { useOverviewTotalAmount } from "../../../hooks/overview/useTotalAmount";
import {
  useOverviewData,
  useScanHeight,
  useSpendPeriodData,
  useTreasuryData,
} from "../../../hooks/useData";
import { getChainSettings } from "../../../utils/chains";
import BlocksTime from "../../BlocksTime";
import Button from "../../button";
import { extractTime } from "@polkadot/util";

export default function OverviewSummary({ chain = "" }) {
  const { symbol, name, value } = getChainSettings(chain);
  const height = useScanHeight(chain);
  const { totalIncome, totalOutput } = useOverviewTotalAmount(chain);
  const overviewData = useOverviewData(chain);
  const treasuryData = useTreasuryData(chain);
  const spendPeriodData = useSpendPeriodData(chain);
  const symbolPrice = overviewData?.latestSymbolPrice ?? 0;

  return (
    <Card className="!p-6 h-full flex flex-col gap-y-6">
      <div className="space-y-6 h-full">
        <div>
          <ImageWithDark
            className="w-12 h-12"
            src={`/imgs/logo-${value}.svg`}
          />
          <h3 className="h2-22-bold mt-3">{name}</h3>
        </div>

        <div>
          <Button className="w-full">{name} Treasury</Button>
        </div>

        <div>
          <SummaryItem
            className="justify-between py-2"
            title="Available"
            icon={<ImageWithDark src="/imgs/data-available.svg" />}
            content={
              <SummaryItemValueContent
                amount={treasuryData.free}
                symbol={symbol}
                symbolPrice={symbolPrice}
              />
            }
          />
          <SummaryItem
            className="justify-between py-2"
            title="Spend Period"
            icon={<CountDown percent={spendPeriodData.progress} />}
            content={
              <div>
                <BlocksTime
                  chain={chain}
                  blocks={spendPeriodData.restBlocks}
                  unitMapper={{ d: "Day" }}
                  pluralUnitMapper={{ d: "Days" }}
                  ValueWrapper={(props) => (
                    <span className="h3-18-semibold" {...props}>
                      {props.children || 0}
                    </span>
                  )}
                  UnitWrapper={(props) => (
                    <span
                      className="h3-18-semibold text-textTertiary mx-1"
                      {...props}
                    />
                  )}
                />

                <p className="p-12-normal text-textTertiary">
                  {parseEstimateTime(extractTime(spendPeriodData.periodTime))}
                </p>
              </div>
            }
          />

          <hr className="my-4" />

          <SummaryItem
            className="justify-between py-2"
            title="Total Income"
            icon={<ImageWithDark src="/imgs/data-available.svg" />}
            content={
              <SummaryItemValueContent
                amount={totalIncome}
                symbol={symbol}
                symbolPrice={symbolPrice}
              />
            }
          />
          <SummaryItem
            className="justify-between py-2"
            title="Total Output"
            icon={<ImageWithDark src="/imgs/data-available.svg" />}
            content={
              <SummaryItemValueContent
                amount={totalOutput}
                symbol={symbol}
                symbolPrice={symbolPrice}
              />
            }
          />
        </div>
      </div>

      <div>
        <hr className="mb-4" />

        <div className="text-textSecondary p-14-medium flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="mr-2"
          >
            <circle cx="6" cy="6" r="6" fill="var(--green100)" />
            <circle cx="6" cy="6" r="2" fill="var(--green500)" />
          </svg>
          #{height?.toLocaleString?.()}
        </div>
      </div>
    </Card>
  );
}

function SummaryItemValueContent({ amount = 0, symbol = "", symbolPrice = 0 }) {
  return (
    <div>
      <div className="flex items-center h3-18-semibold">
        <div className="mr-1">{abbreviateBigNumber(amount)}</div>
        <div className="text-textTertiary">{symbol}</div>
      </div>
      <div className="text-textTertiary p-12-normal">
        {!!amount && "≈ "}${abbreviateBigNumber(amount * symbolPrice)}
      </div>
    </div>
  );
}
