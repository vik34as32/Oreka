import { Checkbox, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import {
  getColor,
  getDataTypeAlias,
} from "../../common/checkbox-tree/CheckBoxTreeItem";
import { Draggable } from "react-beautiful-dnd";
import { DroppedItemState } from "../WidgetConfig";

export type ItemProps = {
  itemState: DroppedItemState;
  index: number;
  droppableId: string;
  handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
};
const DraggableGroupByItem = (props: ItemProps) => {
  return (
    <Draggable draggableId={props.itemState.item.id+"-"+props.droppableId} index={props.index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          display={"flex"}
          sx={{
            alignItems: "center",
            background: snapshot.isDragging ? "gray" : "initial",
          }}
        >
          <span {...provided.dragHandleProps}>
            <DragIndicatorIcon sx={{ color: "#6A7187" }} fontSize="small" />
          </span>
          <Checkbox
            checkedIcon={<CheckBoxOutlinedIcon htmlColor="#fff" />}
            sx={{ p: 0 }}
            checked={props.itemState.checked}
            onClick={() =>
              props.handleCheckBoxClick(props.droppableId, props.index)
            }
          />
          <Typography
            ml={0.5}
            variant="body2"
            color={getColor(props.itemState.item.dataType)}
          >
            {getDataTypeAlias(props.itemState.item.dataType)}
          </Typography>
          <Typography ml={0.5} variant="body2">
            {props.itemState.item.name}
          </Typography>
        </Box>
      )}
    </Draggable>
  );
};

export default DraggableGroupByItem;
