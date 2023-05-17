import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { chainSelector } from "../../../store/reducers/chainSlice";
import {
  ensureLinkProtocol,
  makeSubscanLink,
  makeSubsquareLink,
} from "../../../utils/url";

export function useUserLinks() {
  const { address } = useParams();
  const chain = useSelector(chainSelector);

  const { email, riot, twitter, web } = useFetchIdentity(chain, address);

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
  }, [chain, address, email, riot, twitter, web]);

  return links;
}

// TODO: may should move to hooks
function useFetchIdentity(chain, address) {
  const [info, setInfo] = useState({});

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_APP_IDENTITY_SERVER_HOST
      }/${chain}/identity/${address}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data?.info) {
          setInfo(data.info);
        }
      });
  }, [chain, address]);

  return info;
}
