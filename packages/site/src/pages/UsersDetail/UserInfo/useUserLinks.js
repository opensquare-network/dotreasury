import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useIdentity } from "../../../utils/hooks";
import {
  ensureLinkProtocol,
  makeSubscanLink,
  makeSubsquareLink,
} from "../../../utils/url";

export function useUserLinks() {
  const { address } = useParams();
  const chain = useSelector(chainSelector);
  const { email, riot, twitter, web } = useIdentity(address);

  const links = useMemo(() => {
    const items = [];
    const fixedItems = [
      {
        link: makeSubsquareLink(chain, "user", address),
      },
      {
        link: makeSubscanLink(chain, "account", address),
      },
    ];

    if (email) {
      items.push({
        link: `mailto:${email}`,
      });
    }
    if (riot) {
      items.push({
        link: `https://matrix.to/#/${riot}`,
      });
    }
    if (twitter) {
      items.push({
        link: `https://www.twitter.com/${twitter}`,
      });
    }
    if (web) {
      items.push({
        link: ensureLinkProtocol(web),
        description: "Web",
      });
    }

    return items.concat(fixedItems);
  }, [chain, email, riot, twitter, web]);

  return links;
}
