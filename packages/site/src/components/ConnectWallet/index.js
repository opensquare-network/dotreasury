import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import { accountSelector } from "../../store/reducers/accountSlice";
import ConnectWalletModal from "./ConnectWalletModal";
import User from "./User";

const Wrapper = styled.div``;

const ConnectButton = styled.div`
  cursor: pointer;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  background: linear-gradient(90deg, #F23252 0%, #F2B12F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export default function ConnectWallet() {
  const [modalVisible, setModalVisible] = useState(false);
  const account = useSelector(accountSelector);

  return (
    <Wrapper>
      {
        account ? (
          <User address={account?.address} />
        ) : (
          <ConnectButton onClick={() => setModalVisible(true)}>Connect Wallet</ConnectButton>
        )
      }
      <ConnectWalletModal
        visible={modalVisible}
        setVisible={setModalVisible}
      />
    </Wrapper>
  );
}
