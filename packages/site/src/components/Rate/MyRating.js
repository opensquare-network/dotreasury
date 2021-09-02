import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StarsAction from "./StarsAction";
import ButtonPrimary from "../ButtonPrimary";
import SelectAddress from "../../pages/SelectAddress";
import { addRate } from "../../store/reducers/rateSlice";
import { chainSelector } from "../../store/reducers/chainSlice";

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
  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const chain = useSelector(chainSelector);

  const onChange = (e) => {
    let value = e.target.value;
    if (e.target.value.length > 140) {
      value = value.substr(0, 140);
    }
    setContent(value);
  };

  const startRate = () => {
    setAccountsModalOpen(true);
  };

  const onSelectSignedAccount = (account) => {
    console.log(account);
    const address = account.address;
    dispatch(addRate(
      chain,
      type,
      index,
      rate,
      content,
      "1",
      Date.now(),
      address,
    ));
  }

  return (
    <Wrapper>
      <TitleWrapper>
        Your rating
        <StarsAction rate={rate} setRate={setRate} />
      </TitleWrapper>
      <TextareaWrapper>
        <StyledTextarea
          placeholder="What do you think about this proposal? (optional)"
          value={content}
          onChange={onChange}
        />
        <TextCount>{content.length}/140</TextCount>
      </TextareaWrapper>
      <ButtonWrapper>
        <ButtonPrimary onClick={startRate}>Submit</ButtonPrimary>
      </ButtonWrapper>
      <SelectAddress
        accountsModalOpen={accountsModalOpen}
        setAccountsModalOpen={setAccountsModalOpen}
        onSelect={onSelectSignedAccount}
      />
    </Wrapper>
  );
}
