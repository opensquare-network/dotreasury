import { StatusSelect, FormWrapper } from "../../components/Filter";

const statusOptions = [
  { key: "all", value: "-1", text: "All status" },
  { key: "Approved", value: "Approved", text: "Approved" },
  { key: "Paid", value: "Paid", text: "Paid" },
  { key: "Processed", value: "Processed", text: "Processed" },
  { key: "Voided", value: "Voided", text: "Voided" },
];

export default function TreasurySpendsFilter({ status, setStatus }) {
  return (
    <FormWrapper>
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        value={status}
        onChange={(_, { value }) => {
          setStatus(value);
        }}
      />
    </FormWrapper>
  );
}
