import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { encodeChainAddress } from "../../services/chainApi";
import { accountSelector, checkAccount } from "../../store/reducers/accountSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
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
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const account = useSelector(accountSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(checkAccount());
  }, [dispatch]);

  const encodedAddress = encodeChainAddress(account?.address, chain);

  return (
    <Wrapper>
      {
        account ? (
          <User address={encodedAddress} />
        ) : (
          <ConnectButton onClick={() => setModalVisible(true)}>Connect Wallet</ConnectButton>
        )
      }
      {modalVisible && (
        <ConnectWalletModal
          visible={modalVisible}
          setVisible={setModalVisible}
        />
      )}
    </Wrapper>
  );
}
