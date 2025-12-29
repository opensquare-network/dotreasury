import { useEffect } from "react";
import { currentChain } from "../../utils/chains";

const ProposalsRedirect = () => {
  useEffect(() => {
    if (!currentChain) {
      return;
    }

    window.location.replace(
      `https://${currentChain}.subsquare.io/treasury/proposals`,
    );
  }, []);

  return null;
};

export default ProposalsRedirect;
