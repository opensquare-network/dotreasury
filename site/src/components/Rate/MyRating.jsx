import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StarsAction from "./StarsAction";
import ButtonPrimary from "../ButtonPrimary";
import { addRate, loadingSelector } from "../../store/reducers/rateSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { addToast } from "../../store/reducers/toastSlice";
import { accountSelector } from "../../store/reducers/accountSlice";

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
  color: var(--textPrimary);
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
  color: var(--textPrimary);
  border: 1px solid var(--neutral400);
  background-color: transparent;
  margin: 0;
  :hover,
  :focus {
    border-color: var(--neutral500) !important;
  }
  ::placeholder {
    color: var(--textDisable);
  }
`;

const TextCount = styled.div`
  position: absolute;
  font-size: 12px;
  line-height: 18px;
  color: var(--textTertiary);
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
  const loading = useSelector(loadingSelector);
  const account = useSelector(accountSelector);

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
        }),
      );
      return;
    }

    if (!account) {
      dispatch(
        addToast({
          type: "error",
          message: "Please connect wallet",
        }),
      );
      return;
    }

    const address = account.address;
    const extensionName = account.extension;

    dispatch(
      addRate(
        chain,
        type,
        index,
        rate,
        content.trim() === "" ? null : content.trim(),
        "1",
        parseInt(Date.now() / 1000),
        address,
        extensionName,
      ),
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
          placeholder={`What do you think about this ${type}? (optional)`}
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
    </Wrapper>
  );
}
