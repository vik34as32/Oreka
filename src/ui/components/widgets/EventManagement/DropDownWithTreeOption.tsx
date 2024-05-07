import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import {
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import React from "react";
import DropDownMenu from "./DropDownMenu";

type DropDownWithTreeOptionProps = {
  value: String;
  dropdownOptions: any[];
  handleNodeSelect: (
    _event: React.SyntheticEvent<Element, Event>,
    nodeId: string
  ) => void;
  isTrigger: boolean;
};

const DropDownWithTreeOption = (props: DropDownWithTreeOptionProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <TextField
        value={props.value}
        onClick={handleClick}
        sx={{
          width: "100%",
          backgroundColor: "#0A0A0A",
        }}
        InputLabelProps={{ shrink: false }}
        InputProps={{
          readOnly: true,
          style: {
            direction: "ltr",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <ArrowDropDown />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          placeholder: "Select",
          style: { height: "50px", padding: 0, paddingLeft: 8 },
        }}
      ></TextField>
      <DropDownMenu
        anchorEl={anchorEl}
        dropdownOptions={props.dropdownOptions}
        handleClose={handleClose}
        handleNodeSelect={props.handleNodeSelect}
        open={open}
        value={props.value}
        isTrigger={props.isTrigger}
      />
    </>
  );
};

export default React.memo(DropDownWithTreeOption);
