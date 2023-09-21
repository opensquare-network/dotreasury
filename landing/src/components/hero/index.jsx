import { useElementSize } from "usehooks-ts";
import Container from "../../../../site/src/components/Container";
import ProjectBubble from "./projectBubble";
import ProjectBubbleGroup from "./projectBubbleGroup";
import HeroContent from "./content";
import { cn } from "../../utils";
import { useTreasuriesData } from "../../hooks/useTreasuriesData";

export default function Hero() {
  const [bubblesRef, bubblesSize] = useElementSize();
  const { data } = useTreasuriesData();

  return (
    <Container className="grid grid-cols-2 h-[480px] py-20 max-md:grid-cols-1">
      <div className="px-6 flex items-center">
        <HeroContent />
      </div>

      <div
        ref={bubblesRef}
        className={cn(
          "sm:px-4 max-md:pt-4",
          "h-[480px] max-md:h-[315px] max-sm:h-[235px]",
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
