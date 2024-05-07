import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

type CustomMultiSelectionDropDownProps = {
  optionsList: string[];
  valuesList: string[];
  handleChange: (event: SelectChangeEvent<string[]>) => void;
  isAllSelected: boolean;
};

const CustomMultiSelectionDropDown = (
  props: CustomMultiSelectionDropDownProps
) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-checkbox-label">
          {props.valuesList.length === 0 ? "Select" : ""}
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          multiple
          SelectDisplayProps={{ style: { padding: "13.5px 14px" } }}
          sx={{
            backgroundColor: "#0A0A0A",
            "& > .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2B3349",
            },
          }}
          placeholder="Select"
          value={props.valuesList}
          onChange={(val) => {
            props.handleChange(val);
          }}
          inputProps={{
            style: { height: "40px", padding: 0, paddingLeft: 8 },
          }}
          input={<OutlinedInput inputProps={{ placeholder: "Select" }} />}
          renderValue={(selected) =>
            selected.length === props.optionsList.length
              ? "All"
              : selected.join(", ")
          }
          MenuProps={MenuProps}
        >
          <MenuItem value="All">
            <ListItemIcon>
              <Checkbox
                checked={props.isAllSelected}
                indeterminate={
                  props.valuesList.length > 0 &&
                  props.valuesList.length < props.optionsList.length
                }
              />
            </ListItemIcon>
            <ListItemText
              primary="All"
            />
          </MenuItem>
          {props.optionsList.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={props.valuesList.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default React.memo(CustomMultiSelectionDropDown);
