import styled from "@emotion/styled";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProductCode } from "../products.const";

type MultiVariantSelectOption = {
  productCode: ProductCode;
  label: string;
};

type MultiVariantSelectSelection = {
  productCode: ProductCode;
  label: string;
  quantity: number;
};

type MultiVariantSelectProps = {
  title: string;
  subtitle?: string;
  options: MultiVariantSelectOption[];
  onChange: (selections: MultiVariantSelectSelection[]) => void;
  allowQuantitySelection: boolean;
  quantity?: {
    min?: number;
    max?: number;
    validateZero?: boolean;
  };
  singleItemMaxQty?: number;
};

const OptionsContainer = styled.div`
  display: grid;
  gridtemplatecolumns: 4fr 1fr;
`;

const MultiVariantSelect = (props: MultiVariantSelectProps) => {
  const {
    title,
    subtitle,
    options,
    allowQuantitySelection,
    quantity,
    onChange,
    singleItemMaxQty,
  } = props;
  if (new Set(options.map((option) => option.label)).size !== options.length) {
    throw new Error("incorrect options - labels are not unique");
  }

  const [checkedMap, setCheckedMap] = useState(
    options.reduce<Record<string, boolean>>((acc, option) => {
      acc[option.label] = false;
      return acc;
    }, {})
  );
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const totalQuantity = Object.values(quantityMap).reduce(
    (acc, val) => acc + val,
    0
  );

  useEffect(() => {
    if (
      totalQuantity < (quantity?.min ?? 0) &&
      (Object.values(checkedMap).some((checked) => checked) ||
        quantity?.validateZero)
    ) {
      setError(`Minimum quantity is ${quantity?.min ?? 0}`);
    } else if (totalQuantity > (quantity?.max ?? Number.MAX_SAFE_INTEGER)) {
      setError(`Maximum quantity is ${quantity?.max}`);
    } else {
      setError("");
    }
  }, [totalQuantity, quantity, checkedMap, onChange]);

  useEffect(() => {
    onChange(
      Object.keys(checkedMap)
        .filter((label) => checkedMap[label])
        .map((label) => {
          const option = options.find((option) => option.label === label);
          if (!option) {
            throw new Error(`could not find option with label ${label}`);
          }
          return {
            productCode: option.productCode,
            label,
            quantity: quantityMap[label],
          };
        })
    );
  }, [checkedMap, options, quantityMap]);

  return (
    <Paper
      sx={{
        gridColumnStart: "2",
        marginTop: "1em",
        padding: "1em",
        maxHeight: "fit-content",
        ...(error.length > 0 && {
          borderColor: "red",
          border: "0.15em solid red",
        }),
      }}
      elevation={3}
    >
      <>
        <Typography sx={{ fontSize: "1.2em", fontWeight: "medium" }}>
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9em",
            marginBottom: "0.5em",
          }}
        >
          {subtitle}
        </Typography>
        {error.length > 0 && (
          <Typography sx={{ fontSize: "0.9em", color: "red" }}>
            {error}
          </Typography>
        )}
        <OptionsContainer>
          {options.map((option) => {
            const qtyOfOthers = Object.keys(quantityMap).reduce(
              (sum, label) =>
                label === option.label ? sum : sum + (quantityMap[label] ?? 0),
              0
            );
            const maxAllowedQty = Math.min(
              singleItemMaxQty ?? 10,
              Math.max(
                0,
                (quantity?.max ?? Number.MAX_SAFE_INTEGER) - qtyOfOthers
              )
            );
            return (
              <>
                <FormControlLabel
                  sx={{ gridColumnStart: "1", gridColumnEnd: "1" }}
                  control={
                    <Checkbox
                      onChange={(e) => {
                        setCheckedMap({
                          ...checkedMap,
                          [option.label]: e.target.checked,
                        });
                        if (e.target.checked) {
                          setQuantityMap({
                            ...quantityMap,
                            [option.label]: 1,
                          });
                        } else {
                          const { [option.label]: optval, ...rest } =
                            quantityMap;
                          setQuantityMap(rest);
                        }
                      }}
                    />
                  }
                  label={option.label}
                  checked={checkedMap[option.label]}
                  disabled={maxAllowedQty <= 0 && !checkedMap[option.label]}
                />
                {checkedMap[option.label] && allowQuantitySelection && (
                  <Select
                    defaultValue={1}
                    value={quantityMap[option.label] ?? 1}
                    sx={{ gridColumnStart: "2", marginBottom: "0.5em" }}
                    onChange={(e) =>
                      setQuantityMap({
                        ...quantityMap,
                        [option.label]: e.target.value as number,
                      })
                    }
                  >
                    {[...Array(maxAllowedQty).keys()].map((i: number) => (
                      <MenuItem value={i + 1}>{i + 1}</MenuItem>
                    ))}
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
