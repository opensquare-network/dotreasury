import styled from "styled-components"
import AssetInput from "../../../components/AssetInput";
import CustomInput from "../../../components/Input";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;

  border: 1px solid #F4F4F4;
  border-radius: 4px;

  .hover-only {
    display: none;
  }

  :hover {
    background: #FAFAFA;
    .hover-only {
      display: block;
    }
  }
`;

const Fields = styled.div`
  display: flex;
  gap: 16px;
  flex-grow: 1;
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
`;

export default function TipInputs({ index, isCouncilor, canDelete, onDelete }) {
  const symbol = useSelector(chainSymbolSelector);
  return (
    <Wrapper>
      <Fields>
        <Field>
          <FieldTitle>
            <div style={{ display: "flex", gap: "4px" }}>
              <span>Beneficiary</span>
              <span style={{ color: "rgba(0, 0, 0, 0.3)" }}>#{index}</span>
            </div>
            {canDelete && <TextButton className="hover-only" onClick={onDelete}>Delete</TextButton>}
          </FieldTitle>
          <CustomInput placeholder="Please fill beneficiary address..." />
        </Field>
        {isCouncilor && (
          <Field>
            <FieldTitle>Value</FieldTitle>
            <AssetInput symbol={symbol} placeholder="0" />
          </Field>
        )}
      </Fields>
      <Field>
        <FieldTitle>Reason</FieldTitle>
        <CustomInput placeholder="Please fill reason..." />
      </Field>
    </Wrapper>
  )
}
