import { useEffect } from "react";
import { currentChain } from "../../utils/chains";

const ProjectsRedirect = () => {
  useEffect(() => {
    if (!currentChain) {
      return;
    }

    window.location.replace(
      `https://${currentChain}.subsquare.io/treasury/projects`,
    );
  }, []);

  return null;
};

export default ProjectsRedirect;
