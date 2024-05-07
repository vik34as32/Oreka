import { Box } from "@mui/system";
import React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckBoxList, { Item } from "./CheckBoxList";

export type ItemState = {
  id: string;
  state: CheckBoxState;
};
export enum CheckBoxState {
  UNCHECKED,
  CHECKED,
  INDETERMINATE,
}
export type CheckBoxTreeProps = {
  items: Item[];
  getStateForId: (id: string) => CheckBoxState;
  clickHandler: (id: string) => void;
};
const CheckBoxTree = (props: CheckBoxTreeProps) => {
  return (
    <Box sx={{ background: "#020305", pl: 0, height: "100%" }}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon color="#A9B2CC" />}
        defaultExpandIcon={<ChevronRightIcon color="#A9B2CC" />}
        sx={{ height: "27rem" ,flexGrow: 1, maxWidth: 400, overflowY: "scroll",
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#6A7187',
        },'&::-webkit-scrollbar': {
          backgroundColor: '#0A0A0A',
        }
        }}
      >
        <CheckBoxList
          items={props.items}
          onClick={props.clickHandler}
          getStateForId={props.getStateForId}
        />
      </TreeView>
    </Box>
  );
};

export default CheckBoxTree;
