import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StarsAction from "./StarsAction";
import ButtonPrimary from "../ButtonPrimary";
import SelectAddress from "../../pages/SelectAddress";
import { addRate, loadingSelector } from "../../store/reducers/rateSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { addToast } from "../../store/reducers/toastSlice";

const Wrapper = styled.div`
  padding: 0 24px;
  flex-grow: 1;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  > :last-child {
    margin-left: 16px;
  }
`;

const TextareaWrapper = styled.div`
  position: relative;
  margin-top: 8px;
`;

const StyledTextarea = styled.textarea`
  resize: none;
  width: 100%;
  height: 83px;
  padding: 8px 16px;
  font-size: 14px;
  line-height: 22px;
  border-radius: 4px;
  outline: none;
  color: rgba(0, 0, 0, 0.87);
  border-color: rgba(34, 36, 38, 0.15);
  margin: 0;
  :hover,
  :focus {
    border-color: #cccccc !important;
  }
  ::placeholder {
    color: rgba(0, 0, 0, 0.15);
  }
`;

const TextCount = styled.div`
  position: absolute;
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.3);
  bottom: 8px;
  right: 8px;
`;

const ButtonWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
`;

export default function MyRating({ type, index }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [rate, setRate] = useState(0);
  const chain = useSelector(chainSelector);
  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const loading = useSelector(loadingSelector);

  const onChange = (e) => {
    let value = e.target.value;
    if (e.target.value.length > 280) {
      value = value.substr(0, 280);
    }
    setContent(value);
  };

  const startRate = () => {
    if (loading) return;
    if (rate < 1 || rate > 5) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select 1 to 5 stars",
        })
      );
      return;
    }
    setAccountsModalOpen(true);
  };

  const onSelectSignedAccount = (account) => {
    setAccountsModalOpen(false);
    if (!account) {
      return;
    }

    localStorage.setItem("lastSignatureAddress", account.address);

    const address = account.address;
    dispatch(
      addRate(
        chain,
        type,
        index,
        rate,
        content.trim() === "" ? null : content.trim(),
        "1",
        parseInt(Date.now() / 1000),
        address
      )
    );

    setContent("");
    setRate(0);
  };

  return (
    <Wrapper>
      <TitleWrapper>
        Your grading
        <StarsAction rate={rate} setRate={setRate} />
      </TitleWrapper>
      <TextareaWrapper>
        <StyledTextarea
          placeholder="What do you think about this proposal? (optional)"
          value={content}
          onChange={onChange}
        />
        <TextCount>{content.length}/280</TextCount>
      </TextareaWrapper>
      <ButtonWrapper>
        <ButtonPrimary onClick={startRate} loading={loading}>
          Sign
        </ButtonPrimary>
      </ButtonWrapper>
      {accountsModalOpen && (
        <SelectAddress
          onClose={() => setAccountsModalOpen(false)}
          onSelect={onSelectSignedAccount}
        />
      )}
    </Wrapper>
  );
}
