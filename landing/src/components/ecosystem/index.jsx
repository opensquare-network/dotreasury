import Card from "../../../../site/src/components/Card";
import Container from "../../../../site/src/components/Container";

export default function Ecosystem() {
  return (
    <Container className="py-10 grid grid-col-2 grid-flow-col gap-x-4">
      <Card className="!p-6 col-span-3">
        <h4 className="h3-18-semibold">Treasury in Dotsama Ecosystem</h4>
      </Card>
      <Card className="!p-6 col-span-1">
        <h4 className="h3-18-semibold">Treasury Assets Distribution</h4>
      </Card>
    </Container>
  );
}
