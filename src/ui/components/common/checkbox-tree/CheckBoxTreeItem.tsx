import { Box } from "@mui/system";
import React, { useCallback } from "react";
import TreeItem, {
  TreeItemContentProps,
  useTreeItem,
  TreeItemProps,
} from "@mui/lab/TreeItem";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Checkbox, Typography } from "@mui/material";
import { CheckBoxState } from "./CheckBoxTree";
import { useDrag } from "react-dnd";
import { DATE, DATETIME, DOUBLE, INT, STRING } from "../../../../utilities/Constants";
declare module "@mui/lab/TreeItem" {
  interface TreeItemContentProps {
    checkState: CheckBoxState;
    checkBoxClickHandler: (id: string) => void;
  }
}
export type DragItemProps = {
  id:string
}
export const getColor = (dataType: string | undefined): string => {
  switch (dataType) {
    case STRING:
      return "#EC4E4B";
    case INT:
    case DOUBLE:
      return "#00A7E1";
    case DATE:
    case DATETIME:
      return "#c990f5";
    default:
      return "#22D373";
  }
};
export const getDataTypeAlias = (dataType: string | undefined): string => {
  switch (dataType) {
    case STRING:
      return "ABC";
    case INT:
    case DOUBLE:
      return "123";
    case DATE:
    case DATETIME:
      return "DATE";
    default:
      return "OTHER";
  }
};
const TreeNode = React.forwardRef((props: TreeItemContentProps, ref) => {
  const {
    nodeId,
    expansionIcon,
    label,
    dataType,
    checkState,
    checkBoxClickHandler,
  } = props;
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
      <DragIndicatorIcon sx={{ m: 0.5, color: "#6A7187",cursor : "grab" }} fontSize="small" />
      <Checkbox
        sx={{ p: 0 }}
        onClick={() => checkBoxClickHandler(nodeId)}
        checked={checkState === CheckBoxState.CHECKED}
        indeterminate={checkState === CheckBoxState.INDETERMINATE}
      />
      <Typography ml={0.5} variant="body2" color={getColor(dataType)}>
        {getDataTypeAlias(dataType)}
      </Typography>
      <Typography ml={0.5} variant="body2">
        {label}
      </Typography>
    </Box>
  );
});

const CheckBoxTreeItem = (props: TreeItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "checkbox-tree-item",
    item:{id:props.nodeId},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const dragRef = useCallback(
    (elt: Element) => {
      elt?.addEventListener("focusin", (e) => {
        // Disable Treeview focus system which make draggable on TreeIten unusable
        // see https://github.com/mui-org/material-ui/issues/29518
        e.stopImmediatePropagation();
      });
      drag(elt);
    },
    [drag]
  );
  return <TreeItem sx={{background:isDragging?'darkgray':'initial'}} ref={dragRef} ContentComponent={TreeNode} {...props} />;
};

export default CheckBoxTreeItem;
