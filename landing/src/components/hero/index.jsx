import { useElementSize } from "usehooks-ts";
import Container from "../../../../site/src/components/Container";
import ProjectBubble from "./projectBubble";
import ProjectBubbleGroup from "./projectBubbleGroup";
import HeroContent from "./content";
import { cn } from "../../utils";
import { useQuery } from "@apollo/client";
import { GET_TREASURIES } from "../../services/gqls";

export default function Hero() {
  const [bubblesRef, bubblesSize] = useElementSize();
  const { data } = useQuery(GET_TREASURIES);
  const treasuries = data?.treasuries || [];

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
          data={treasuries}
          renderBubbleToHTMLString={(node) => <ProjectBubble node={node} />}
        />
      </div>
    </Container>
  );
}
