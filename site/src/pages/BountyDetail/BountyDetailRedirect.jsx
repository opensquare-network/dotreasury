import { useEffect } from "react";
import { currentChain } from "../../utils/chains";
import { useParams } from "react-router-dom";

const BountyDetailRedirect = () => {
  const { bountyIndex } = useParams();

  useEffect(() => {
    if (!bountyIndex || !currentChain) {
      return;
    }

    window.location.replace(
      `https://${currentChain}.subsquare.io/treasury/bounties/${String(
        bountyIndex,
      )}`,
    );
  }, [bountyIndex]);

  return null;
};

export default BountyDetailRedirect;
