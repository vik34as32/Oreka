import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeView } from "@mui/lab";
import { Box } from "@mui/material";
import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useState } from "react";
import CheckBoxList, { Item } from "./CheckBoxList";
import { updateItemStates } from "./util/helper";

export interface CheckBoxTreeProps {
  items: Item[];
  clickHandler: (id: string) => void;
  render: (props: any) => ReactElement;
}
export enum CheckBoxState {
  UNCHECKED,
  CHECKED,
  INDETERMINATE,
}
export type ItemState = {
  id: string;
  state: CheckBoxState;
};
export type CheckBoxTreeHandles = {
  getState:() => ItemState[]
}
const CheckBoxTree =  React.forwardRef<CheckBoxTreeHandles,CheckBoxTreeProps>((props: CheckBoxTreeProps,ref): ReactElement  => {
  const [itemStates, setItemStates] = useState<ItemState[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(props.items);
    const itemStates: ItemState[] = props.items.map((item) => ({
      id: item.id,
      state: CheckBoxState.UNCHECKED,
    }));
    setItemStates(itemStates);
  }, [props.items]);

  const getStateForId = useCallback((id: string) => {
    // use to get state of the item object using the id (used in checkbox tree)
    const res = itemStates.find((itemState) => itemState.id === id);
    return res ? res.state : CheckBoxState.INDETERMINATE;
  }, [itemStates]);

  const clickHandler = useCallback(
    (itemId: string) => {
      const currentItemState = getStateForId(itemId);
      const desiredCheckBoxState =
        currentItemState === CheckBoxState.CHECKED
          ? CheckBoxState.UNCHECKED
          : CheckBoxState.CHECKED;
      updateCheckBoxTree(itemId, desiredCheckBoxState);
      props.clickHandler(itemId);
    },
    [itemStates, items]
  );

  const updateCheckBoxTree = useCallback(
    (itemId: string, desiredCheckBoxState: CheckBoxState) => {
      setItemStates((prevItemStates) => {
        return updateItemStates(
          prevItemStates,
          items,
          itemId,
          desiredCheckBoxState
        );
      });
    },
    [items, itemStates]
  );
  const getState = ():ItemState[] => {
    return itemStates;
  }
  useImperativeHandle(ref,() => ({
    getState
  }))
  return (
    <>
      <Box sx={{ background: "transparent", pl: 0, height: "100%" }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon htmlColor="#A9B2CC" />}
          defaultExpandIcon={<ChevronRightIcon htmlColor="#A9B2CC" />}
          sx={{
            height: "fit-content",
            flexGrow: 1,
            maxWidth: 400,
            overflowY: "scroll",
          }}
        >
          <CheckBoxList
            items={items}
            onClick={clickHandler}
            getStateForId={getStateForId}
            render={props.render}
          />
        </TreeView>
      </Box>
    </>
  );
});

export default React.memo(CheckBoxTree);
