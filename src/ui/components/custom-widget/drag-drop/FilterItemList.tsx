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
  
 
export type FilterType = | "<"
| ">"
| "<="
| ">="
| "=="
| "!="
| "is null"
| "is not null"
| "in"
| "not in"
| "begins with"
| "ends with"
| "contains"
| "not contains";

export const FilterOptions = ["<",">" ,"<=",">=","==","!=","is null", "is not null" ,"in","not in","begins with","ends with","contains","not contains"];
const AllowedFilterOptionsForString = ["!=","==","begins with", "ends with","is null","is not null" ,"contains","not contains"];

  
  export type ItemProps = {
    itemState: DroppedItemState;
    index: number;
    droppableId: string;
    handleCheckBoxClick: (droppableId: string, itemIndex: number) => void;
    handleFilterSelect: (index: number, filterType:FilterType) => void;
    handleFilterValue: (index: number, filterValue:string) => void;
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
            <Box sx={{ mr: 0.2,ml:0.5, display:'flex'}}>
              <FormControl
                sx={{  fontSize: "0.8em",minWidth:"20%",flexGrow:1 }}
                size="small"
              >
                <Select
                  value={props.itemState.filter?.filterType ?? "=="}
                  disableUnderline
                  variant="standard"
                  IconComponent={CustomArrowIcon}
                  size="small"
                  sx={{ height: 25 }}
                  SelectDisplayProps={{
                    style:{
                      padding:"0px 2px 2px 3px",
                    },
                  }}
                  autoWidth
                  onChange={(e) =>
                    props.handleFilterSelect(props.index, (e.target.value as FilterType))
                  }
                >
                  {Object.values(FilterOptions)
                    .filter((item) => props.itemState.item.dataType!== "string" || props.itemState.item.dataType === "string" && AllowedFilterOptionsForString.includes(item))
                    .map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField sx={{ml:0.4,maxWidth:"60%"}} defaultValue={props.itemState.filter?.value} size="small" variant="standard" onBlur={e => props.handleFilterValue(props.index,e.target.value)}/>
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
    handleFilterSelect: (index: number, filterType:FilterType) => void;
    handleFilterValue: (index: number, filterValue:string) => void;
    handleCheckBoxItemDrop: (item:DragItemProps,droppableId:string) => void;
  };
  const FilterItemList = (props: DroppedItemListProps) => {
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
                <DraggableAggregateByItem
                  itemState={itemState}
                  index={index}
                  key={itemState.item.id+"-"+index}
                  droppableId={props.droppableId}
                  handleCheckBoxClick={props.handleCheckBoxClick}
                  handleFilterSelect={props.handleFilterSelect}
                  handleFilterValue={props.handleFilterValue}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>
    );
  };
  
  export default FilterItemList;
      