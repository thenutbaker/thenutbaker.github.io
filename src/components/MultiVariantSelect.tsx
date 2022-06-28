import styled from "@emotion/styled";
import {
  Paper,
  Checkbox,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

type MultiVariantSelectSelection = {
  value: string;
  quantity: number;
};

type MultiVariantSelectProps = {
  title: string;
  subtitle?: string;
  options: string[];
  onChange: (selections: MultiVariantSelectSelection[]) => void;
};

const OptionsContainer = styled.div`
  display: grid;
  gridtemplatecolumns: 4fr 1fr;
`;

const MultiVariantSelect = (props: MultiVariantSelectProps) => {
  const { title, subtitle, options } = props;
  const [checkedMap, setCheckedMap] = useState(
    options.reduce<Record<string, boolean>>((acc, option) => {
      acc[option] = false;
      return acc;
    }, {})
  );
  return (
    <Paper
      sx={{
        gridColumnStart: "2",
        marginTop: "1em",
        marginBottom: "1em",
        padding: "1em",
        maxHeight: "fit-content",
      }}
      elevation={3}
    >
      <>
        <Typography sx={{ fontSize: "1.2em" }}>{title}</Typography>
        <Typography sx={{ fontSize: "1rem", marginBottom: "0.5em" }}>
          {subtitle}
        </Typography>
        <OptionsContainer>
          {options.map((option) => {
            return (
              <>
                <FormControlLabel
                  sx={{ gridColumnStart: "1", gridColumnEnd: "1" }}
                  control={
                    <Checkbox
                      onChange={(e) => {
                        setCheckedMap({
                          ...checkedMap,
                          [option]: e.target.checked,
                        });
                      }}
                    />
                  }
                  label={option}
                  checked={checkedMap[option]}
                />
                {checkedMap[option] && (
                  <Select defaultValue={1} sx={{ gridColumnStart: "2" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                )}
              </>
            );
          })}
        </OptionsContainer>
      </>
    </Paper>
  );
};

export default MultiVariantSelect;
