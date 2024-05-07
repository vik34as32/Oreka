import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import { Menu, MenuItem } from "@mui/material";
import React from "react";

type DropDownMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  value: String;
  dropdownOptions: any[];
  handleClose: () => void;
  handleNodeSelect: (
    _event: React.SyntheticEvent<Element, Event>,
    nodeId: string,
  ) => void;
  isTrigger: boolean;
};

const DropDownMenu = (props: DropDownMenuProps) => {
  return (
    <Menu
      id="basic-menu"
      anchorEl={props.anchorEl}
      open={props.open}
      onClose={props.handleClose}
      MenuListProps={{
        disablePadding: true,
      }}
      PaperProps={{
        sx: {
          border: 1,
          borderColor: "#2B3349",
          width: props.isTrigger ? 520 : 368,
          background: "#020305",
        },
      }}
    >
      <MenuItem
        sx={{
          backgroundColor: "#0A0A0A",
          color: "#D5E2F0",
        }}
      >
        <TreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
          onNodeSelect={props.handleNodeSelect}
          sx={{
            height: 120,
            flexGrow: 1,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            overflowY: "scroll",
          }}
        >
          {props.dropdownOptions.map((rootNode) => (
            <TreeItem
              nodeId={rootNode.nodeId}
              label={rootNode.label}
              sx={{
                color: "#D5E2F0",
                fontFamily: "Inter",
                fontSize: 12,
              }}
            >
              {rootNode.children.map((childNode: any) => (
                <TreeItem
                  nodeId={childNode.nodeId}
                  label={childNode.label}
                  onClick={props.handleClose}
                  sx={{
                    color: "#D5E2F0",
                    fontFamily: "Inter",
                    fontSize: 12,
                  }}
                ></TreeItem>
              ))}
            </TreeItem>
          ))}
        </TreeView>
      </MenuItem>
    </Menu>
  );
};

export default React.memo(DropDownMenu);
