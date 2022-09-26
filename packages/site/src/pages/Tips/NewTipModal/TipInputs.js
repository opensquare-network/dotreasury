import styled from "styled-components"
import AssetInput from "../../../components/AssetInput";
import CustomInput from "../../../components/Input";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { ErrorMessage } from "../../../components/styled";

const Wrapper = styled.div`
  border: 1px solid #F4F4F4;
  border-radius: 4px;
`;

const Fields = styled.div`
  display: flex;
  gap: 16px;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
`;

const FieldTitle = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.9);
  justify-content: space-between;
`;

const TextButton = styled.div`
  cursor: pointer;
  color: #E90B0B;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #E90B0B;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.3);
  background: #FAFAFA;
  border-bottom: 1px solid #F4F4F4;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  .error {
    margin-bottom: 8px;
  }
`;

export default function TipInputs({ index, isCouncilor, canDelete, onDelete, tipData }) {
  const symbol = useSelector(chainSymbolSelector);

  return (
    <Wrapper>
      <Header>
        <span>#{index + 1}</span>
        {canDelete && (
          <TextButton onClick={onDelete}>Delete</TextButton>
        )}
      </Header>
      <Body>
        {tipData?.errorMessage && (
          <ErrorMessage className="error">{tipData?.errorMessage}</ErrorMessage>
        )}
        <Fields>
          <Field>
            <FieldTitle>Beneficiary</FieldTitle>
            <CustomInput
              placeholder="Please fill beneficiary address..."
              onChange={e => tipData.beneficiary = e.target.value}
            />
          </Field>
          {isCouncilor && (
            <Field>
              <FieldTitle>Value</FieldTitle>
              <AssetInput
                symbol={symbol}
                placeholder="0"
                onChange={e => tipData.value = e.target.value}
              />
            </Field>
          )}
        </Fields>
        <Field>
          <FieldTitle>Reason</FieldTitle>
          <CustomInput
            placeholder="Please fill reason..."
            onChange={e => tipData.reason = e.target.value}
          />
        </Field>
      </Body>
    </Wrapper>
  )
}
