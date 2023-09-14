import { useElementSize } from "usehooks-ts";
import Container from "../../../../site/src/components/Container";
import { BUBBLE_DATA } from "../../fixtures";
import ProjectBubble from "./project-bubble";
import ProjectBubbleGroup from "./project-bubble-group";
import HeroContent from "./content";

export default function Hero() {
  const [bubblesRef, bubblesSize] = useElementSize();

  return (
    <div className="py-20">
      <Container className="grid grid-cols-2 min-h-[480px]">
        <div className="px-6">
          <HeroContent />
        </div>

        <div ref={bubblesRef} className="px-4">
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
