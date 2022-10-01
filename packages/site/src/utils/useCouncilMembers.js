import { useEffect } from "react";
import { useState } from "react";
import useApi from "../hooks/useApi";

export default function useCouncilMembers() {
  const api = useApi();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.council.members().then(members => {
      const data = members.toJSON();
      if (data) {
        setMembers(data);
      }
    });
  }, [api]);

  return members;
}
