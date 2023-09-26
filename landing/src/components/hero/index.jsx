import { useElementSize } from "usehooks-ts";
import Container from "@site/src/components/Container";
import ProjectBubble from "./projectBubble";
import ProjectBubbleGroup from "./projectBubbleGroup";
import HeroContent from "./content";
import { cn } from "../../utils";
import { useTreasuriesData } from "../../hooks/useTreasuriesData";

export default function Hero() {
  const [bubblesRef, bubblesSize] = useElementSize();
  const { data } = useTreasuriesData();

  return (
    <Container
      className={cn(
        "grid grid-cols-2",
        "max-md:grid-cols-1",
        "h-[480px] py-20 max-md:py-10",
      )}
    >
      <div className="px-6 flex items-center">
        <HeroContent />
      </div>

      <div
        ref={bubblesRef}
        className={cn(
          "w-[660px] h-[480px]",
          "max-md:w-[335px] max-md:h-[335px]",
          "max-sm:w-[305px] max-sm:h-[305px]",
          "sm:px-4 max-md:pt-4",
          "mx-auto max-md:-translate-x-5",
        )}
      >
        <ProjectBubbleGroup
          width={bubblesSize.width}
          height={bubblesSize.height}
          data={data}
          renderBubbleToHTMLString={(node) => <ProjectBubble node={node} />}
        />
      </div>
    </Container>
  );
}
