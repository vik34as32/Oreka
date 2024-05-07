import {
  CheckBox,
  CheckBoxOutlineBlank,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { cloneDeep } from "lodash";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

export type AddTickerPropsType = {
  onTickerAdd: (ticker: string | string[]) => void;
  symbolList: string[];
  subscribedTickers: string | string[];
  isWatchListTicker: boolean;
};
const filterOptions = createFilterOptions<string>({
  matchFrom: "any",
  limit: 20,
});
const AddTicker: React.FC<AddTickerPropsType> = (props): ReactElement => {
  if (!props.symbolList) return <></>;

  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const handleTickerSelect = useCallback(
    (
      e: React.SyntheticEvent<Element>,
      selectedValues: string | string[] | null
    ) => {
      e.stopPropagation();
      if (props.isWatchListTicker) {
        if (selectedValues) {
          const temp: string[] = cloneDeep(selectedValues) as string[];
          setSelectedTickers(temp);
        }
      } else {
        props.onTickerAdd(selectedValues as string);
      }
    },
    [selectedTickers]
  );

  const handleTickerAdd = useCallback(() => {
    if (props.isWatchListTicker && selectedTickers && selectedTickers.length > 0) {
      props.onTickerAdd(selectedTickers);
      setSelectedTickers([]);
    }
  }, [selectedTickers, props.onTickerAdd]);

  const icon = <CheckBoxOutlineBlank fontSize="small" />;
  const checkedIcon = <CheckBox fontSize="small" />;

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      pl={props.isWatchListTicker ? 2 : 0}
      gap={2}
      pt={0.5}
      pb={0.5}
    >
      <FormControl sx={{ alignSelf: "center" }}>
        <Autocomplete
          defaultValue={props.subscribedTickers}
          onChange={handleTickerSelect}
          isOptionEqualToValue={(option, value) => {
            return option === value;
          }}
          fullWidth
          freeSolo
          options={props.symbolList.sort()}
          filterOptions={filterOptions}
          multiple={props.isWatchListTicker}
          disableCloseOnSelect={props.isWatchListTicker}
          sx={{ width: 250 }}
          ListboxProps={{
            sx: {
              fontSize: "0.8em",
              border: 1,
              borderColor: "#2B3349",
              padding: 0,
            },
          }}
          renderTags={(values) =>
            values.map((value) => (
              <Chip sx={{ display: "none" }} key={value} label={value} />
            ))
          }
          renderOption={(prop, option, { selected }) => (
            <li {...prop}>
              {props.isWatchListTicker && (
                <Checkbox
                  sx={{ height: 25 }}
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
              )}
              {option}
            </li>
          )}
          componentsProps={{}}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                placeholder={
                  props.isWatchListTicker ? "Add ticker" : "Select symbol"
                }
                InputProps={{
                  ...params.InputProps,
                  style: { padding: "2px", fontSize: "0.9em" },
                  endAdornment: !props.isWatchListTicker && (
                    <IconButton sx={{ p: 0 }}>
                      <KeyboardArrowDown />
                    </IconButton>
                  ),
                }}
                size="small"
              />
            );
          }}
        />
      </FormControl>
      {props.isWatchListTicker && (
        <Button
          variant="outlined"
          color="success"
          sx={{ textTransform: "capitalize", p: 0.1 }}
          onClick={handleTickerAdd}
        >
          Add
        </Button>
      )}
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    symbolList: state.app.symbolList,
  };
}
export default React.memo(connect(mapStateToProps)(AddTicker));
