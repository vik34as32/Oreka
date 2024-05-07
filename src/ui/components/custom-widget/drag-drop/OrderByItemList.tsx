import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
Checkbox,
FormControl,
MenuItem,
Select,
TextField,
Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useDrop } from "react-dnd";
import {
DragItemProps,
getColor,
getDataTypeAlias,
} from "../../common/checkbox-tree/CheckBoxTreeItem";
import { DroppedItemState } from "../WidgetConfig";
  
 
export type OrderByType = "ASC" | "DSC";

export const OrderByOptions = ["ASC","DSC"];

  export type OrderByItemProps = {
    itemState: DroppedItemState;
    index: number;
    droppableId: string;
    handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
    handleOrderBySelect: (index: number, orderByType:OrderByType) => void;
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
  const DraggableOrderByItem = (props: OrderByItemProps) => {
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
            <Box sx={{ display: "flex", alignItems: "center"}}>
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
            <Box sx={{ mr: 0.2,ml:0.5}}>
              <FormControl
                size="small"
              >
                <Select
                  value={props.itemState.orderBy?.orderByType ?? "ASC"}
                  disableUnderline
                  variant="standard"
                  IconComponent={CustomArrowIcon}
                  size="small"
                  sx={{ height: 25,width:60,fontSize:"0.9rem" }}
                  SelectDisplayProps={{
                    style:{
                      padding:"0px 2px 2px 3px",
                    },
                  }}
                  onChange={(e) =>
                    props.handleOrderBySelect(props.index, (e.target.value as OrderByType))
                  }
                >
                  {Object.values(OrderByOptions)
                    .map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
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
  
  export type OrderByDroppedItemListProps = {
    itemStates: DroppedItemState[];
    droppableId: string;
    handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
    handleOrderBySelect: (index: number, orderByType:OrderByType) => void;
    handleCheckBoxItemDrop: (item:DragItemProps,droppableId:string) => void;
  };
  const OrderByItemList = (props: OrderByDroppedItemListProps) => {
    const [{isOver},drop] = useDrop(()=>({
      accept:"checkbox-tree-item",
      drop:(item:DragItemProps) => props.handleCheckBoxItemDrop(item,props.droppableId),
      collect:monitor=>({
        isOver:monitor.isOver(),
      })
    }))
    return (
      <Box ref={drop} sx={{mt:1,maxHeight : "5.5rem",overflowY: "scroll",'&::-webkit-scrollbar-thumb': {
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
                <DraggableOrderByItem
                  itemState={itemState}
                  index={index}
                  key={itemState.item.id+"-"+index}
                  droppableId={props.droppableId}
                  handleCheckBoxClick={props.handleCheckBoxClick}
                  handleOrderBySelect={props.handleOrderBySelect}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>
    );
  };
  
  export default OrderByItemList;
      