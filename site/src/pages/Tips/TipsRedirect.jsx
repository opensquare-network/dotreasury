import { useEffect } from "react";
import { currentChain } from "../../utils/chains";

const TipsRedirect = () => {
  useEffect(() => {
    if (!currentChain) {
      return;
    }

    window.location.replace(
      `https://${currentChain}.subsquare.io/treasury/tips`,
    );
  }, []);

  return null;
};

export default TipsRedirect;
