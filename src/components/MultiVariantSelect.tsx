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
import { Items } from "../App.types";
import { ProductCode } from "../products.const";

type MultiVariantSelectOption = {
  productCode: ProductCode;
  label: string;
};

export type MultiVariantSelectSelection = {
  productCode: ProductCode;
  label: string;
  quantity: number;
};

type MultiVariantSelectProps = {
  title: string;
  subtitle?: string;
  options: MultiVariantSelectOption[];
  allowQuantitySelection: boolean;
  minSingleQuantity?: number;
  quantity?: {
    min?: number;
    max?: number;
    validateZero?: boolean;
  };
  singleItemMaxQty?: number;
  items: Items;
  setItems: React.Dispatch<React.SetStateAction<Items>>;
  setErrorMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
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
    singleItemMaxQty,
    minSingleQuantity = 1,
    items,
    setItems,
    setErrorMap,
  } = props;
  if (minSingleQuantity > (quantity?.max ?? Number.MAX_SAFE_INTEGER)) {
    throw new Error("incorrect options - minSingleQuantity > quantity.max");
  }
  if (new Set(options.map((option) => option.label)).size !== options.length) {
    throw new Error("incorrect options - labels are not unique");
  }

  const [error, setError] = useState("");

  const totalQuantity = options.reduce((sum, option) => {
    const qty = items[option.productCode]?.[option.label] ?? 0;
    return sum + qty;
  }, 0);
  const hasSomeChecked = options.some(
    (option) => (items[option.productCode]?.[option.label] ?? 0) > 0
  );

  useEffect(() => {
    if (
      totalQuantity < (quantity?.min ?? 0) &&
      (hasSomeChecked || quantity?.validateZero)
    ) {
      setError(`Minimum quantity is ${quantity?.min ?? 0}`);
    } else if (totalQuantity > (quantity?.max ?? Number.MAX_SAFE_INTEGER)) {
      setError(`Maximum quantity is ${quantity?.max}`);
    } else {
      setError("");
    }
  }, [totalQuantity, quantity, hasSomeChecked]);

  useEffect(() => {
    setErrorMap((prev) => {
      if (error?.length) {
        return {
          ...prev,
          [title]: true,
        };
      }
      return {
        ...prev,
        [title]: false,
      };
    });
  }, [error, setErrorMap, title]);

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
        <Typography
          sx={{
            fontSize: "1em",
            fontWeight: "medium",
            "@media(min-width: 780px)": {
              fontSize: "1.2em",
            },
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8em",
            marginBottom: "0.5em",
            "@media(min-width: 780px)": {
              fontSize: "0.9em",
            },
          }}
        >
          {subtitle}
        </Typography>
        {error.length > 0 && (
          <Typography
            sx={{
              fontSize: "0.8em",
              color: "red",
              "@media(min-width: 780px)": {
                fontSize: "0.9em",
              },
            }}
          >
            {error}
          </Typography>
        )}
        <OptionsContainer>
          {options.map((option) => {
            const qtyOfOthers = options.reduce((sum, innerOption) => {
              if (innerOption.label === option.label) {
                return sum;
              }
              const qty =
                items[innerOption.productCode]?.[innerOption.label] ?? 0;
              return sum + qty;
            }, 0);
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
                  sx={{
                    gridColumnStart: "1",
                    gridColumnEnd: "1",
                  }}
                  control={
                    <Checkbox
                      onChange={(e) => {
                        setItems((items) => {
                          if (e.target.checked) {
                            return {
                              ...items,
                              [option.productCode]: {
                                ...items[option.productCode],
                                [option.label]: minSingleQuantity,
                              },
                            };
                          } else {
                            const {
                              [option.productCode]: itemsOfProduct,
                              ...restItems
                            } = items;
                            if (!itemsOfProduct) {
                              return items;
                            }
                            if (Object.keys(itemsOfProduct).length === 1) {
                              return restItems;
                            }

                            const {
                              [option.label]: unselectedVariant,
                              ...restVariants
                            } = itemsOfProduct;
                            return {
                              ...restItems,
                              [option.productCode]: restVariants,
                            };
                          }
                        });
                      }}
                    />
                  }
                  label={option.label}
                  checked={
                    items[option.productCode]?.[option.label] ? true : false
                  }
                  disabled={
                    maxAllowedQty <= 0 &&
                    !items[option.productCode]?.[option.label]
                  }
                />
                {items[option.productCode]?.[option.label] &&
                  allowQuantitySelection && (
                    <Select
                      defaultValue={minSingleQuantity}
                      value={
                        items[option.productCode]?.[option.label] ??
                        minSingleQuantity
                      }
                      sx={{
                        gridColumnStart: "2",
                        marginBottom: "0.5em",
                        padding: "0em",
                        ".MuiSelect-select": {
                          padding: "0em 0.5em",
                        },
                      }}
                      onChange={(e) => {
                        setItems((items) => {
                          return {
                            ...items,
                            [option.productCode]: {
                              ...items[option.productCode],
                              [option.label]: e.target.value,
                            },
                          };
                        });
                      }}
                    >
                      {[
                        ...Array(maxAllowedQty + 1 - minSingleQuantity).keys(),
                      ].map((i: number) => (
                        <MenuItem value={i + minSingleQuantity}>
                          {i + minSingleQuantity}
                        </MenuItem>
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
