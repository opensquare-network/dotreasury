import Container from "@site/src/components/Container";
import { cn } from "../../utils";
import EcosystemAssetsDistribution from "./assetsDistribution";
import EcosystemDotsama from "./dotsamaEcosystem";

export default function Ecosystem() {
  return (
    <Container
      className={cn(
        "py-10 grid grid-cols-3 gap-x-4",
        "max-md:block max-md:space-y-4",
      )}
    >
      <EcosystemDotsama className="col-span-2" />

      <EcosystemAssetsDistribution className="col-span-1" />
    </Container>
  );
}
