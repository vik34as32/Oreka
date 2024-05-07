import {
  Checkbox,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import {
  getColor,
  getDataTypeAlias,
} from "../../common/checkbox-tree/CheckBoxTreeItem";
import { Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { DroppedItemState } from "../WidgetConfig";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { useDrop } from "react-dnd";
import {DragItemProps} from "../../common/checkbox-tree/CheckBoxTreeItem";

export enum AggregateFunction {
  SUM,
  MIN,
  MAX,
  COUNT,
  AVG,
  FIRST,
  LAST
}
const AllowedStringAggFunc = [AggregateFunction.COUNT,AggregateFunction.FIRST,AggregateFunction.LAST];
export type ItemProps = {
  itemState: DroppedItemState;
  index: number;
  droppableId: string;
  handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
  handleAggregateFnSelect: (index: number, fn: AggregateFunction) => void;
};
const CustomArrowIcon = (props) => {
  return (
    <ArrowDropDownCircleOutlinedIcon
      {...props}
      fontSize="small"
      sx={{ strokeWidth: 0.5 }}
    />
  );
};
const DraggableAggregateByItem = (props: ItemProps) => {
  return (
    <Draggable draggableId={props.itemState.item.id+"-"+props.droppableId+"-"+props.index} index={props.index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          display={"flex"}
          flexDirection={"row"}
          sx={{
            alignItems: "center",
            background: snapshot.isDragging ? "gray" : "initial",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
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
          <Box sx={{ mr: 1 }}>
            <FormControl
              sx={{ m: 0.3, minWidth: 90, fontSize: "0.8em" }}
              size="small"
            >
              <Select
                value={props.itemState.appliedFunction}
                disableUnderline
                IconComponent={CustomArrowIcon}
                sx={{ height: 25 }}
                onChange={(e) =>
                  props.handleAggregateFnSelect(props.index, e.target.value)
                }
              >
                {Object.values(AggregateFunction)
                  .filter((item) => typeof item == "string")
                  .filter((item) => props.itemState.item.dataType!== "string" || props.itemState.item.dataType === "string" && AllowedStringAggFunc.includes(AggregateFunction[item]))
                  .map((item) => (
                    <MenuItem key={item} value={AggregateFunction[item]}>
                      {item.toString().toLowerCase()}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export type DroppedItemListProps = {
  itemStates: DroppedItemState[];
  droppableId: string;
  handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
  handleAggregateFnSelect: (index: number, fn: AggregateFunction) => void;
  handleCheckBoxItemDrop: (item:DragItemProps,droppableId:string) => void;
};
const AggregateItemList = (props: DroppedItemListProps) => {
  const [{isOver},drop] = useDrop(()=>({
    accept:"checkbox-tree-item",
    drop:(item:DragItemProps) => props.handleCheckBoxItemDrop(item,props.droppableId),
    collect:monitor=>({
      isOver:monitor.isOver(),
    })
  }))
  return (
    <Box ref={drop} sx={{mt:1, maxHeight : "5.5rem",overflowY: "scroll",
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#6A7187',
    }}}>
      <Droppable droppableId={props.droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              border: snapshot.isDraggingOver || isOver
                ? "1px dotted #A9B2CC"
                : "initial",
              minHeight: snapshot.isDraggingOver || isOver ? "50px" : "20px",
              transition:'ease 0.2s'
            }}
          >
            {props.itemStates.length < 1 && (
              <Typography sx={{ color: "#747C8E" }} variant="body2">
                Drag and drop elements here
              </Typography>
            )}
            {props.itemStates.map((itemState, index) => (
              <DraggableAggregateByItem
                itemState={itemState}
                index={index}
                key={itemState.item.id+"-"+index}
                droppableId={props.droppableId}
                handleCheckBoxClick={props.handleCheckBoxClick}
                handleAggregateFnSelect={props.handleAggregateFnSelect}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Box>
  );
};

export default AggregateItemList;
