import { useEffect } from "react";
import { currentChain } from "../../utils/chains";

const BeneficiariesRedirect = () => {
  useEffect(() => {
    if (!currentChain) {
      return;
    }

    window.location.replace(`https://${currentChain}.subsquare.io/treasury`);
  }, []);

  return null;
};

export default BeneficiariesRedirect;
