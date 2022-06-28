import MultiVariantSelect from "../components/MultiVariantSelect";
import styled from "@emotion/styled";
import { GRANOLA_FLAVOURS } from "../const";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  background-color: #5a777b;
  min-height: 100vh;
`;

const Form = () => {
  return (
    <Container>
      <MultiVariantSelect
        title="225g Granola"
        subtitle="1 for $14, 2 for $26, 3 for $36, 4 for $46"
        options={GRANOLA_FLAVOURS}
        onChange={() => {}}
      />
      <MultiVariantSelect
        title="450g Granola"
        subtitle="1 for $25, 2 for $45, 3 for $65, 4 for $80"
        options={GRANOLA_FLAVOURS}
        onChange={() => {}}
      />
      <div />
    </Container>
  );
};

export default Form;
