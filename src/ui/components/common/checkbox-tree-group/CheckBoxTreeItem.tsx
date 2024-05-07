import TreeItem, {
  TreeItemContentProps,
  useTreeItem,
  TreeItemProps,
} from "@mui/lab/TreeItem";

import React, { ReactElement, useCallback } from "react";
import { useDrag } from "react-dnd";
import { CheckBoxState } from "./CheckBoxTree";

declare module "@mui/lab/TreeItem" {

  interface TreeItemContentPropsGroup extends TreeItemContentProps {
    checkState: CheckBoxState;
    checkBoxClickHandler: (id: string) => void;
  }
}

export type CheckBoxTreeItemProps = TreeItemProps & {
  isDraggable?:boolean;
  itemProps:{
    [id:string]:any;
  };
  render:(props:any) => ReactElement;
}

const CheckBoxTreeItem:React.FC<CheckBoxTreeItemProps> = (props:CheckBoxTreeItemProps):ReactElement => {
    // const [{ isDragging }, drag] = useDrag(() => ({
    //     type: "checkbox-tree-item",
    //     item:{id:props.nodeId},
    //     collect: (monitor) => ({
    //       isDragging: monitor.isDragging(),
    //     }),
    //   }));
    //   const dragRef = useCallback(
    //     (elt: Element) => {
    //       elt?.addEventListener("focusin", (e) => {
    //         // Disable Treeview focus system which make draggable on TreeIten unusable
    //         // see https://github.com/mui-org/material-ui/issues/29518
    //         e.stopImmediatePropagation();
    //       });
    //       drag(elt);
    //     },
    //     [drag]
    //   );
    return (
      props.render({sx:{display:'initial'},...props})
        // <TreeItem sx={{background:isDragging && props.isDraggable ?'darkgray':'initial'}} ref={dragRef} ContentComponent={props.TreeNode} {...props} />
    )
}
export default React.memo(CheckBoxTreeItem);
