import { Box, Checkbox, Typography } from "@mui/material";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CheckBoxTree, {
  CheckBoxState,
  CheckBoxTreeHandles,
} from "../checkbox-tree-group/CheckBoxTree";
import { Item } from "../checkbox-tree-group/CheckBoxList";
import { TreeItemContentProps } from "@mui/lab/TreeItem/TreeItemContent";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import { TreeItem, useTreeItem } from "@mui/lab";
import { ItemState } from "../checkbox-tree-group/CheckBoxTree";
import { Dispatch } from "redux";
import { fetchAllGroupData } from "../../../../redux/action-handlers/app/SaturdayDeleteActions";
import { connect } from "react-redux";

export interface GroupSelectProps {
  groupData: string[];
  clickHandler?: (itemId: string) => void;
  fetchGroupData: () => void;
}
export type GroupSelectHandles = {
  getItemStates: () => ItemState[];
  getItems: () => Item[];
};
const GroupSelect = React.forwardRef(
  (props: GroupSelectProps, ref): ReactElement => {
    const checkboxTreeRef = useRef<CheckBoxTreeHandles | null>(null);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
      props.fetchGroupData();
    }, []);

    useEffect(() => {
      if (props.groupData) getCheckBoxItems(props.groupData);
    }, [props.groupData]);

    const getCheckBoxItems = (data: string[]): void => {
      const items: Item[] = [];
      const groupSet = new Set<string>();
      data.forEach((value) => {
        const groups = value.split("\\");
        let groupString = "",parentGroupString="";
        groups.forEach((group, index) => {
          parentGroupString = groupString;
          groupString+= ((index === 0) ? "" :"\\") + group;
          const key = groupString;
          if (groupSet.has(key)) return;
          if (index === 0) {
            items.push({
              id: key,
              name: group,
              additionalInfo: {},
            });
          } else {
            items.push({
              id: key,
              name: group,
              additionalInfo: {},
              parentId: parentGroupString,
            });
          }
          groupSet.add(key);
        });
      });
      setItems(items);
    };

    const clickHandler = useCallback(
      (itemId: string) => {
        if (props.clickHandler) props.clickHandler(itemId);
      },
      [props.clickHandler]
    );

    const getItemStates = useCallback(() => {
      return checkboxTreeRef.current?.getState();
    }, []);
    const getItems = useCallback(() => {
      return items;
    }, [items]);

    useImperativeHandle(ref, () => ({
      getItemStates,
      getItems,
    }));

    return (
      <>
        <Box sx={{ backgroundColor: "#0A0A0A", p: 1, overflowY: "scroll" }}>
          <Typography sx={{ fontSize: "14px" }}>Group</Typography>
        </Box>
        <Box>
          <CheckBoxTree
            ref={(r) => (checkboxTreeRef.current = r)}
            clickHandler={clickHandler}
            items={items}
            render={(props) => getTreeItem(props)}
          />
        </Box>
      </>
    );
  }
);

const TreeNode = React.forwardRef((props: TreeItemContentProps, ref) => {
  const { nodeId, expansionIcon, label, checkState, checkBoxClickHandler } =
    props;
  // className here denotes the name of the field for example Login, UserId etc
  const { handleExpansion } = useTreeItem(nodeId);

  //   const icon = expansionIcon;
  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleExpansion(event);
  };
  const icon = expansionIcon;

  return (
    <Box
      display={"flex"}
      ref={ref}
      sx={{ ml: icon ? 0 : 3, alignItems: "center" }}
    >
      <div style={{ color: "#6A7187" }} onClick={handleExpansionClick}>
        {icon}
      </div>
      <Checkbox
        sx={{ p: 0, color: "#9DA6C0" }}
        size="small"
        onClick={() => checkBoxClickHandler(nodeId)}
        checked={checkState === CheckBoxState.CHECKED}
        indeterminate={checkState === CheckBoxState.INDETERMINATE}
        checkedIcon={<CheckBoxOutlinedIcon htmlColor="#9DA6C0" />}
        indeterminateIcon={
          <IndeterminateCheckBoxOutlinedIcon htmlColor="#9DA6C0" />
        }
      />
      <Typography ml={0.5} variant="body2" fontSize={"12px"}>
        {label}
      </Typography>
    </Box>
  );
});

const getTreeItem = ({ sx, ...props }): ReactElement => {
  return (
    // <Box sx={{backgroundColor:"#13171F",mb:0.5}}>
    <TreeItem
      sx={sx}
      ContentComponent={TreeNode}
      {...props}
      ContentProps={props.itemProps}
    />
  );
};

function mapStateToProps(state: any) {
  return {
    groupData: state.saturdayDelete.groupData,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchGroupData: () => fetchAllGroupData(),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    GroupSelect
  )
);
