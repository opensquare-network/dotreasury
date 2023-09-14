import { useElementSize } from "usehooks-ts";
import Container from "../../../../site/src/components/Container";
import { BUBBLE_DATA } from "../../fixtures";
import ProjectBubble from "./project-bubble";
import ProjectBubbleGroup from "./project-bubble-group";
import HeroContent from "./content";
import { cn } from "../../utils";

export default function Hero() {
  const [bubblesRef, bubblesSize] = useElementSize();

  return (
    <div className="py-20">
      <Container className="grid grid-cols-2 h-[480px] max-md:grid-cols-1">
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
            data={BUBBLE_DATA}
            renderBubbleToHTMLString={(node) => {
              return <ProjectBubble project={node.name} size={node.r * 2} />;
            }}
          />
        </div>
      </Container>
    </div>
  );
}
