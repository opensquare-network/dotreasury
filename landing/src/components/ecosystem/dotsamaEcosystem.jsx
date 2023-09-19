import Card from "../../../../site/src/components/Card";
import { cn } from "../../utils";

export default function EcosystemDotsama(props) {
  return (
    <Card {...props} className={cn("!p-6", props.className)}>
      <h4 className="h3-18-semibold">Treasury in Dotsama Ecosystem</h4>
      <p className="p-14-medium text-textTertiary">Updated at 0000</p>
    </Card>
  );
}
