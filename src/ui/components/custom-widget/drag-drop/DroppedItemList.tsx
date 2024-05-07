import React from "react";
import { Box, Typography } from "@mui/material";
import DraggableGroupByItem from "./DraggableGroupByItem";
import { Droppable } from "react-beautiful-dnd";
import { DroppedItemState } from "../WidgetConfig";
import { DragItemProps } from "../../common/checkbox-tree/CheckBoxTreeItem";
import { useDrop } from "react-dnd";

export type DroppedItemListProps = {
  itemStates: DroppedItemState[];
  droppableId: string;
  handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
  handleCheckBoxItemDrop: (item:DragItemProps,droppableId:string) => void;
};
const DroppedItemList = (props: DroppedItemListProps) => {
  const [{isOver},drop] = useDrop(()=>({
    accept:"checkbox-tree-item",
    drop:(item:DragItemProps) => props.handleCheckBoxItemDrop(item,props.droppableId),
    collect:monitor=>({
      isOver:monitor.isOver(),
    })
  }))
  return (
    <Box ref={drop} sx={{ mt: 1,maxHeight : "5.5rem",overflowY: "scroll",
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#6A7187',
    } }}>
      <Droppable droppableId={props.droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              border: snapshot.isDraggingOver || isOver
                ? "1px dotted #A9B2CC"
                : "initial",
              minHeight: snapshot.isDraggingOver || isOver ? "50px" : "30px",
              transition:'ease 0.2s'
            }}
          >
            {props.itemStates.length < 1 && (
              <Typography sx={{ color: "#747C8E" }} variant="body2">
                Drag and drop elements here
              </Typography>
            )}
            
            {props.itemStates.map((itemState, index) => (
              <DraggableGroupByItem
                itemState={itemState}
                index={index}
                key={itemState.item.id}
                droppableId={props.droppableId}
                handleCheckBoxClick={props.handleCheckBoxClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Box>
  );
};

export default DroppedItemList;
