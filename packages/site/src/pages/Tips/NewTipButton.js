import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewTipModal from "./NewTipModal";
import { accountSelector } from "../../store/reducers/accountSlice";

export default function NewTipButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewTipModel, setShowNewTipModel] = useState(false);

  return (
    <>
      <OnChainActionButton
        disabled={!account}
        onClick={() => setShowNewTipModel(true)}
      >
        New Tip
      </OnChainActionButton>
      <NewTipModal
        visible={showNewTipModel}
        setVisible={setShowNewTipModel}
        onFinalized={onFinalized}
      />
    </>
  );
}
