// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import SearchIcon from "@mui/icons-material/Search";
// import {
//   Card,
//   Grid,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import { cloneDeep, debounce } from "lodash";
// import React, {
//   useCallback,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from "react";
// import { DragDropContext, DropResult } from "react-beautiful-dnd";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { dataSources } from "../../../redux/reducers/canvas/CanvasReducer";
// import { DATE, DOUBLE, FLOAT, INT, STRING } from "../../../utilities/Constants";
// import {
//   getNodeItems,
//   isNumeric,
// } from "../../../utilities/GridComponentUtilities";
// import { WidgetPropsType } from "../../canvas/services/WidgetService";
// import { Item } from "../common/checkbox-tree/CheckBoxList";
// import CheckBoxTree, {
//   CheckBoxState,
//   ItemState,
// } from "../common/checkbox-tree/CheckBoxTree";
// import { DragItemProps } from "../common/checkbox-tree/CheckBoxTreeItem";
// import updateItemStates from "../common/checkbox-tree/updateItemStates";
// import {
//   findVisibleCols,
//   getAllSearchItems,
//   getLeafNodes,
//   recursivelyAddChildren,
//   recursivelyRemoveChildren,
// } from "../common/checkbox-tree/utils/helper";
// import { LinkColor, linkColors } from "../common/widget-link/WidgetLink";
// import AggregateItemList, {
//   AggregateFunction,
// } from "./drag-drop/AggregateItemList";
// import DroppedItemList from "./drag-drop/DroppedItemList";
// import { rearrange, reorder } from "./drag-drop/util/helper";
// import FilterItemList, { FilterType } from "./drag-drop/FilterItemList";
// import OrderByItemList, { OrderByType } from "./drag-drop/OrderByItemList";

// const getDefaultItemStates = (items: Item[]) => {
//   return items.map((i) => ({
//     id: i.id,
//     state: CheckBoxState.UNCHECKED,
//   }));
// };

// export type DroppedItemState = {
//   item: Item;
//   checked: boolean;
//   appliedFunction?: AggregateFunction;
//   filter?: Filter;
//   orderBy?: OrderBy;
// };
// export type ItemConfigProps = {
//   id: string;
//   allowedDataType: string[];
//   areDuplicatesAllowed: boolean;
//   itemStates: DroppedItemState[];
// };
// export type DroppableContainerState = {
//   [dropContainerId: string]: ItemConfigProps;
// };
// const getInitialState = (): DroppableContainerState => {
//   return {
//     groupBy: {
//       id: "groupBy",
//       itemStates: [],
//       allowedDataType: [STRING, DATE],
//       areDuplicatesAllowed: false,
//     },
//     splitBy: {
//       id: "splitBy",
//       itemStates: [],
//       allowedDataType: [STRING, DATE],
//       areDuplicatesAllowed: false,
//     },
//     aggregateBy: {
//       id: "aggregateBy",
//       itemStates: [],
//       allowedDataType: [INT, DOUBLE, STRING],
//       areDuplicatesAllowed: true,
//     },
//     orderBy: {
//       id: "orderBy",
//       itemStates: [],
//       allowedDataType: [STRING, DATE, INT, DOUBLE, FLOAT],
//       areDuplicatesAllowed: false,
//     },
//     whereBy: {
//       id: "whereBy",
//       itemStates: [],
//       allowedDataType: [STRING, DATE, INT, DOUBLE, FLOAT],
//       areDuplicatesAllowed: true,
//     },
//     xAxis: {
//       id: "xAxis",
//       itemStates: [],
//       allowedDataType: [STRING, DATE],
//       areDuplicatesAllowed: false,
//     },
//     yAxis: {
//       id: "yAxis",
//       itemStates: [],
//       allowedDataType: [STRING, DATE],
//       areDuplicatesAllowed: false,
//     },
//   };
// };
// type WidgetConfigProps = {
//   componentType: string;
//   widgetPropsType?: WidgetPropsType;
//   changeSelectedComponentType: (componentType: string) => void;
// };
// export interface Filter {
//   colId: string;
//   filterType: FilterType;
//   value:
//     | string
//     | number
//     | Date
//     | boolean
//     | Array<string | number | Date | boolean>;
// }
// export interface OrderBy {
//   colId: string;
//   orderByType: OrderByType;
// }
// export interface WidgetFilter {
//   filter: any;
//   filterType: string;
//   type: string;
// }
// export interface WidgetColumnState {
//   width?: number;
//   filter?: WidgetFilter;
//   order: number;
// }
// export type AggFunc = [string, string];
// export type WidgetConfigsType = {
//   id: string;
//   visibleCols: string[];
//   functionCols: AggFunc[];
//   groupBy: string[];
//   splitBy: string[];
//   orderBy: OrderBy[];
//   filterBy: Filter[];
//   name: string;
//   dataSourceId: string;
//   componentType: string;
//   pivot: boolean;
//   chartType?: any;
//   filterColor: LinkColor;
//   color?: { [key: string]: string };
//   columnState?: { [colId: string]: WidgetColumnState };
// };
// const DEFAULT_DATASOURCE_INDEX = 5;
// const DEFAULT_COMPONENT_TYPE_INDEX = 0;
// const componentTypes = ["Data Grid", "Charts", "Spread Sheet"];
// const dataSourceList = [
//   "Account Panel",
//   "Broker Panel",
//   "SubBroker Panel",
//   "Dealing Panel",
//   "Dealing Panel Interval",
//   "Client Position Live",
//   "Order Panel",
//   "Tick Data",
// ];
// const chartTypes = [
//   "X Bar",
//   "Y Bar",
//   "X/Y Line",
//   "X/Y Scatter",
//   "Y Line",
//   "Y Area",
//   "Y Scatter",
//   "OHLC",
//   "Candlestick",
//   "Treemap",
//   "Sunburst",
//   "Heatmap",
// ];

// const WidgetConfig = React.forwardRef((props: WidgetConfigProps, ref) => {
//   const getSelectedComponentType = (): number => {
//     switch (props.componentType) {
//       case "grid":
//         return 0;
//       case "chart":
//         return 1;
//       case "spreadsheet":
//         return 2;
//       default:
//         return 0;
//     }
//   };

//   const getComponentTypeFromIndex = (componentTypeNumber: number): string => {
//     switch (componentTypeNumber) {
//       case 0:
//         return "grid";
//       case 1:
//         return "chart";
//       case 2:
//         return "spreadsheet";
//       default:
//         return "grid";
//     }
//   };

//   const [config, setConfig] = useState<DroppableContainerState>(
//     getInitialState()
//   ); // used for drag drop
//   const [dataSource, setDataSource] = useState<number>(
//     DEFAULT_DATASOURCE_INDEX
//   );
//   const [selectedComponentType, setSelectedComponentType] = useState<number>(0);
//   const [nodeItems, setNodeItems] = useState<Item[]>(
//     getNodeItems(dataSourceList[dataSource])
//   );
//   const [items, setItems] = useState<Item[]>([]);
//   const [itemStates, setItemStates] = useState<ItemState[]>([]); // used for checkbox tree
//   const [chartType, setChartType] = useState<string>(chartTypes[0]);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const itemStatesRef = useRef<null | ItemState[]>();
//   const itemsRef = useRef<null | Item[]>();

//   // changeToInitialStateRef is used for whether we want to set initial state for config
//   const changeToInitialStateRef = useRef<boolean>(true);
//   // changeItemStateToDefaultRef is used for whether we want to set defalut itemstate for column
//   const changeItemStateToDefaultRef = useRef<boolean>(true);

//   useEffect(() => {
//     setSelectedComponentType(getSelectedComponentType());
//   }, [props.componentType]);

//   const getWidgetConfigs = (): WidgetConfigsType | null => {
//     if (!itemStatesRef.current) return null;
//     const visibleCols = findVisibleCols(itemStatesRef.current, nodeItems).map(
//       (item) => item.id
//     );
//     const functionCols = config.aggregateBy.itemStates.map(
//       (itemState): AggFunc => {
//         return [
//           itemState.item.id,
//           AggregateFunction[
//             itemState.appliedFunction ?? AggregateFunction.SUM
//           ].toLowerCase(),
//         ];
//       }
//     );
//     const groupBy = config.groupBy.itemStates.map(
//       (itemState) => itemState.item.id
//     );
//     const splitBy = config.splitBy.itemStates.map(
//       (itemState) => itemState.item.id
//     );
//     const filterBy: Filter[] = config.whereBy.itemStates.map(
//       (itemState) =>
//         itemState.filter ?? {
//           colId: itemState.item.id,
//           filterType: "==",
//           value: "",
//         }
//     );
//     const orderBy: OrderBy[] = config.orderBy.itemStates.map(
//       (itemState) =>
//         itemState.orderBy ?? { colId: itemState.item.id, orderByType: "ASC" }
//     );
//     let name = "test";
//     if (props.widgetPropsType) {
//       name = props.widgetPropsType.name;
//     }
//     let dataSourceObject = dataSources[dataSource];
//     //debugger
//     if (!dataSourceObject)
//       dataSourceObject = dataSources[DEFAULT_DATASOURCE_INDEX];
//     const widgetConfigs = {
//       id: "",
//       visibleCols,
//       functionCols,
//       groupBy,
//       splitBy,
//       orderBy,
//       filterBy,
//       name,
//       dataSourceId: dataSourceObject.id,
//       componentType: getComponentTypeFromIndex(selectedComponentType),
//       pivot: groupBy.length > 0,
//       chartType,
//       filterColor: linkColors.slice(-1)[0],
//     };
//     return widgetConfigs;
//   };
//   useImperativeHandle(ref, () => ({
//     getWidgetConfigs,
//     onDiscard,
//   }));

//   const setDataSourceAndNodeItems = () => {
//     if (props.widgetPropsType) {
//       //debugger
//       const tempDataSource = dataSources.find(
//         (element) => element.id === props.widgetPropsType?.dataSourceId
//       );
//       if (tempDataSource) {
//         const index = dataSourceList.findIndex(
//           (value) => value === tempDataSource.name
//         );
//         if (index !== -1) {
//           changeToInitialStateRef.current = false;
//           changeItemStateToDefaultRef.current = false;
//           setDataSource(index);
//           if (index === DEFAULT_DATASOURCE_INDEX) {
//             changeItemStateToDefaultRef.current = false;
//             changeToInitialStateRef.current = true;
//           }
//           const tempItems = getNodeItems(dataSourceList[index]);
//           setNodeItems(nodeItems);
//           itemsRef.current = tempItems;
//           setItems(tempItems);

//           //setItemStates to bydefault checked for props visible columns
//           const states = getDefaultItemStates(tempItems);
//           if (props.widgetPropsType) {
//             props.widgetPropsType.visibleCols.forEach((col) => {
//               let index = states.findIndex((value) => value.id === col);
//               if (index !== -1) {
//                 states[index].state = CheckBoxState.CHECKED;
//               }
//             });
//           }
//           setItemStates(states);
//           itemStatesRef.current = states;
//         }
//       }
//     }
//   };

//   const onDiscard = () => {
//     setConfig(getInitialState());
//     setDataSource(DEFAULT_DATASOURCE_INDEX);
//     const nodeitem = getNodeItems(dataSourceList[DEFAULT_DATASOURCE_INDEX]);
//     setNodeItems(nodeitem);
//     setItemStates(getDefaultItemStates(nodeitem));
//     if (props.widgetPropsType) {
//       setDataSourceAndNodeItems();
//       resetParameter();
//       props.widgetPropsType.visibleCols.forEach((col) => {
//         updateCheckBoxTree(col, CheckBoxState.CHECKED, null);
//       });
//     }
//   };

//   useEffect(() => {
//     if (props.widgetPropsType) {
//       setDataSourceAndNodeItems();
//       resetParameter();
//       props.widgetPropsType.visibleCols.forEach((col) => {
//         updateCheckBoxTree(col, CheckBoxState.CHECKED, null);
//       });
//       if (props.componentType === "chart") {
//         setChartType(props.widgetPropsType.chartType);
//       }
//     } else {
//       setConfig(getInitialState());
//       setDataSource(DEFAULT_DATASOURCE_INDEX);
//       const nodeitem = getNodeItems(dataSourceList[DEFAULT_DATASOURCE_INDEX]);
//       setNodeItems(nodeitem);
//       setItemStates(getDefaultItemStates(nodeitem));
//     }
//   }, [props.widgetPropsType]);

//   useEffect(() => {
//     const nodeItems = getNodeItems(dataSourceList[dataSource]);
//     setNodeItems(nodeItems);
//     if (changeToInitialStateRef.current) {
//       setConfig(getInitialState());
//       changeItemStateToDefaultRef.current = true;
//     } else {
//       changeItemStateToDefaultRef.current = false;
//       changeToInitialStateRef.current = true;
//     }
//   }, [dataSource]);

//   useEffect(() => {
//     if (changeItemStateToDefaultRef.current) {
//       setItemStates(getDefaultItemStates(nodeItems));
//     } else {
//       changeItemStateToDefaultRef.current = true;
//     }
//   }, [nodeItems]);

//   useEffect(
//     debounce(() => {
//       if (searchValue.length === 0) {
//         setItems(nodeItems);
//       } else {
//         const newItems = nodeItems.filter(
//           (item) =>
//             searchValue === "" ||
//             item.name
//               .toLocaleLowerCase()
//               .includes(searchValue.toLocaleLowerCase())
//         );
//         const finalItems = getAllSearchItems(newItems, nodeItems);
//         setItems(finalItems);
//       }
//     }, 250),
//     [searchValue, nodeItems]
//   );

//   useEffect(() => {
//     itemsRef.current = items;
//   }, [items]);

//   useEffect(() => {
//     itemStatesRef.current = itemStates;
//   }, [itemStates]);

//   const onDragEnd = ({ destination, source }: DropResult) => {
//     // handles drop logic for items dropped withing same droppable area or another droppable area (exluding checkbox tree)
//     // dropped outside the list
//     if (!destination) return;
//     if (destination.droppableId === source.droppableId) {
//       setConfig((config) => {
//         const newItemStates = reorder(
//           config[source.droppableId].itemStates,
//           source.index,
//           destination.index
//         );
//         return {
//           ...config,
//           [source.droppableId]: {
//             ...config[source.droppableId],
//             itemStates: newItemStates,
//           },
//         };
//       });

//       return;
//     }

//     setConfig((config) => {
//       // if found duplicate (not applicable for aggregateBy)
//       const sourceItemStates = config[source.droppableId].itemStates;
//       const destinationItemStates = config[destination.droppableId].itemStates;

//       if (
//         !config[destination.droppableId].allowedDataType.includes(
//           sourceItemStates[source.index].item.dataType
//         ) ||
//         (!config[destination.droppableId].areDuplicatesAllowed &&
//           destinationItemStates.filter(
//             (itemState) =>
//               itemState.item.id === sourceItemStates[source.index].item.id
//           ).length > 0)
//       )
//         // !datatype allowed || (!duplicate allowed && !unique)
//         return config;

//       const [sourceItems, destinationItems] = rearrange(
//         sourceItemStates,
//         source.index,
//         destinationItemStates,
//         destination.index
//       );
//       return {
//         ...config,
//         [source.droppableId]: {
//           ...config[source.droppableId],
//           itemStates: sourceItems,
//         },
//         [destination.droppableId]: {
//           ...config[destination.droppableId],
//           itemStates: destinationItems,
//         },
//       };
//     });
//   };
//   function handleCheckBoxItemDrop(item: DragItemProps, droppableId: string) {
//     // IMP: necessary to update state like this to prevent bugs due to async nature of setState function
//     // handles item drop from checkbox tree to other droppable areas
//     setConfig((config) => {
//       if (!itemsRef.current) return config;
//       // make checkbox item in checkbox tree to checked
//       const currentCheckBoxItemState = getStateForId(item.id);
//       const leafNodes = getLeafNodes(item.id, itemsRef.current);
//       const [newItemStates, updatedItemStates] = recursivelyAddChildren(
//         leafNodes,
//         droppableId,
//         config
//       );
//       const updatedItemIdMap = updatedItemStates.reduce(
//         (prev: { [id: string]: DroppedItemState }, itemState) => {
//           prev[itemState.item.id] = itemState;
//           return prev;
//         },
//         {}
//       );
//       if (currentCheckBoxItemState === CheckBoxState.UNCHECKED) {
//         updateCheckBoxTree(item.id, CheckBoxState.CHECKED, updatedItemIdMap);
//       }
//       return {
//         ...config,
//         [droppableId]: {
//           ...config[droppableId],
//           itemStates: newItemStates,
//         },
//       };
//     });
//   }
//   const handleDragCheckBoxClick = useCallback(
//     (droppableId: string, itemIndex: number) => {
//       // handles checkbox click for items that are dropped in areas like group by, split by etc.
//       setConfig((config) => {
//         const itemStates = config[droppableId].itemStates;
//         itemStates.splice(itemIndex, 1);
//         return {
//           ...config,
//           [droppableId]: {
//             ...config[droppableId],
//             itemStates: itemStates,
//           },
//         };
//       });
//     },
//     [config]
//   );
//   const handleAggregateFnSelect = useCallback(
//     (index: number, fn: AggregateFunction): void => {
//       setConfig((config) => {
//         const newItemStates = Array.from(config.aggregateBy.itemStates);
//         newItemStates[index].appliedFunction = fn;

//         return {
//           ...config,
//           aggregateBy: {
//             ...config.aggregateBy,
//             itemStates: newItemStates,
//           },
//         };
//       });
//     },
//     [config]
//   );
//   const handleOrderBySelect = useCallback(
//     (index: number, orderByType: OrderByType): void => {
//       setConfig((config: DroppableContainerState) => {
//         const newItemStates = Array.from(config.orderBy.itemStates);
//         newItemStates[index].orderBy = {
//           colId: newItemStates[index].item.id,
//           orderByType,
//         };
//         return {
//           ...config,
//           orderBy: {
//             ...config.orderBy,
//             itemStates: newItemStates,
//           },
//         };
//       });
//     },
//     [config]
//   );
//   const handleFilterSelect = useCallback(
//     (index: number, filterType: FilterType): void => {
//       setConfig((config: DroppableContainerState) => {
//         const newItemStates = Array.from(config.whereBy.itemStates);
//         newItemStates[index].filter = {
//           colId: newItemStates[index].item.id,
//           filterType,
//           value: newItemStates[index].filter?.value ?? "",
//         };
//         return {
//           ...config,
//           whereBy: {
//             ...config.whereBy,
//             itemStates: newItemStates,
//           },
//         };
//       });
//     },
//     [config]
//   );
//   const handleFilterValue = useCallback(
//     (index: number, filterValue: string): void => {
//       setConfig((config: DroppableContainerState) => {
//         const newItemStates = Array.from(config.whereBy.itemStates);
//         const getFilterValue = (value: string) => {
//           const res = value.split(",");
//           if (res.length > 1) {
//             const ans:any[] = [];
//             res.forEach((val) => {
//               ans.push(
//                 isNumeric(newItemStates[index].item.dataType)
//                   ? parseFloat(val)
//                   : val
//               );
//             });
//             return ans;
//           }
//           return isNumeric(newItemStates[index].item.dataType)
//             ? parseFloat(filterValue)
//             : filterValue;
//         };
//         newItemStates[index].filter = {
//           colId: newItemStates[index].item.id,
//           filterType: newItemStates[index].filter?.filterType ?? "==",
//           value: getFilterValue(filterValue),
//         };
//         return {
//           ...config,
//           whereBy: {
//             ...config.whereBy,
//             itemStates: newItemStates,
//           },
//         };
//       });
//     },
//     [config]
//   );
//   const getStateForId = useCallback(
//     (id: string) => {
//       // use to get state of the item object using the id (used in checkbox tree)
//       if (itemStatesRef.current) {
//         const res = itemStatesRef.current.find(
//           (itemState) => itemState.id === id
//         );
//         return res ? res.state : CheckBoxState.INDETERMINATE;
//       } else {
//         return CheckBoxState.INDETERMINATE;
//       }
//     },
//     [itemStates]
//   );

//   const updateCheckBoxTree = useCallback(
//     (
//       id: string,
//       desiredCheckBoxState: CheckBoxState,
//       itemsToUpdate: { [itemId: string]: DroppedItemState } | null
//     ) => {
//       // used to handle recursive checkbox click for checkbox tree component
//       setItemStates((prevItemStates) => {
//         if (!itemsRef.current) return prevItemStates;
//         const temp = cloneDeep(
//           updateItemStates(
//             prevItemStates,
//             itemsRef.current,
//             id,
//             desiredCheckBoxState,
//             itemsToUpdate
//           )
//         );
//         itemStatesRef.current = temp;
//         return cloneDeep(
//           updateItemStates(
//             prevItemStates,
//             itemsRef.current,
//             id,
//             desiredCheckBoxState,
//             itemsToUpdate
//           )
//         );
//       });
//     },
//     [itemStates, items]
//   );

//   const resetParameter = () => {
//     resetConfigForEdit("groupBy");
//     resetConfigForEdit("splitBy");
//     resetConfigForEdit("filterBy");
//     resetConfigForEdit("functionCols");
//   };

//   const resetConfigForEdit = (parameter: string) => {
//     if (
//       parameter === "groupBy" ||
//       parameter === "splitBy" ||
//       parameter === "filterBy" ||
//       parameter === "functionCols"
//     ) {
//       setConfig((config) => {
//         if (!itemsRef.current) return config;
//         const newConfigState = { ...config };
//         if (
//           props.widgetPropsType &&
//           props.widgetPropsType[parameter as keyof WidgetConfigsType]
//         ) {
//           props.widgetPropsType[parameter as keyof WidgetConfigsType].forEach(
//             (col) => {
//               let droppableId = parameter;
//               let node = itemsRef.current?.find((x) => x.id === col);
//               if (parameter === "filterBy") {
//                 node = itemsRef.current?.find((x) => x.id === col.colId);
//                 droppableId = "whereBy";
//               } else if (parameter === "functionCols") {
//                 node = itemsRef.current?.find((x) => x.id === col[0]);
//                 droppableId = "aggregateBy";
//               }

//               if (node) {
//                 let configDroppableItemState = [
//                   ...newConfigState[droppableId].itemStates,
//                 ];
//                 if (parameter === "filterBy") {
//                   configDroppableItemState.push({
//                     item: node,
//                     checked: true,
//                     appliedFunction:
//                       node.dataType === "string"
//                         ? AggregateFunction.COUNT
//                         : AggregateFunction.SUM,
//                     filter: {
//                       colId: node.id,
//                       filterType: col.filterType,
//                       value: col.value,
//                     },
//                   });
//                 } else if (parameter === "functionCols") {
//                   configDroppableItemState.push({
//                     item: node,
//                     checked: true,
//                     appliedFunction: Object.values(AggregateFunction).indexOf(
//                       col[1].toUpperCase()
//                     ),
//                   });
//                 } else {
//                   configDroppableItemState.push({
//                     item: node,
//                     checked: true,
//                     appliedFunction:
//                       node.dataType === "string"
//                         ? AggregateFunction.COUNT
//                         : AggregateFunction.SUM,
//                   });
//                 }
//                 newConfigState[droppableId] = {
//                   ...newConfigState[droppableId],
//                   itemStates: configDroppableItemState
//                     ? configDroppableItemState
//                     : newConfigState[droppableId].itemStates,
//                 };
//               }
//             }
//           );
//         }
//         return newConfigState;
//       });
//     }
//   };

//   const clickHandler = useCallback(
//     async (itemId: string) => {
//       const currentItemState = getStateForId(itemId);
//       const desiredCheckBoxState =
//         currentItemState === CheckBoxState.CHECKED
//           ? CheckBoxState.UNCHECKED
//           : CheckBoxState.CHECKED;
//       updateCheckBoxTree(itemId, desiredCheckBoxState, null);

//       setConfig((config) => {
//         if (!itemsRef.current) return config;
//         const newConfigState = { ...config };
//         const leafNodes = getLeafNodes(itemId, itemsRef.current);
//         if (desiredCheckBoxState === CheckBoxState.CHECKED) {
//           const droppableIds = ["groupBy", "aggregateBy"];

//           droppableIds.forEach((droppableId) => {
//             // recursively add children to aggregateBy and groupBy section
//             let newLeafNode: Item[] = [];
//             if (droppableId === "aggregateBy") {
//               leafNodes.forEach((node) => {
//                 if (node.dataType !== "string") {
//                   newLeafNode.push(node);
//                 }
//               });
//             }
//             const [newItemStates, updatedItemStates] = recursivelyAddChildren(
//               droppableId === "aggregateBy" ? newLeafNode : leafNodes,
//               droppableId,
//               config
//             );
//             newConfigState[droppableId] = {
//               ...newConfigState[droppableId],
//               itemStates: newItemStates
//                 ? newItemStates
//                 : newConfigState[droppableId].itemStates,
//             };
//           });
//         } else {
//           // remove
//           Object.keys(config).forEach((droppableId) => {
//             const newItemStates = recursivelyRemoveChildren(
//               leafNodes,
//               droppableId,
//               config
//             );
//             newConfigState[droppableId] = {
//               ...newConfigState[droppableId],
//               itemStates: newItemStates
//                 ? newItemStates
//                 : newConfigState[droppableId].itemStates,
//             };
//           });
//         }
//         return newConfigState;
//       });
//     },
//     [items, config]
//   );

//   return (
//     <Box sx={{ background: "#131722", overflowY: "hidden" }}>
//       <Box sx={{ borderBottom: "1px solid #404b66" }}>
//         <Stack
//           direction={"row"}
//           sx={{ display: "flex", justifyContent: "space-between", p: 0.5 }}
//         >
//           <Box
//             sx={{
//               maxHeight: "34px",
//               width: "100%",
//               maxWidth: 0.3,
//               display: "flex",
//               flexDirection: "row",
//               gap: 2,
//             }}
//           >
//             <Select
//               variant="standard"
//               label="widget"
//               size="small"
//               value={selectedComponentType.toString()}
//               IconComponent={KeyboardArrowDownIcon}
//               disableUnderline
//               onChange={(e: SelectChangeEvent) => {
//                 setSelectedComponentType(+e.target.value);
//                 props.changeSelectedComponentType(
//                   getComponentTypeFromIndex(+e.target.value)
//                 );
//               }}
//               sx={{ color: "#A9B2CC", width: "200px", minWidth: "140px" }}
//             >
//               {componentTypes.map((dataSource, index) => (
//                 <MenuItem key={dataSource} value={index}>
//                   {dataSource}
//                 </MenuItem>
//               ))}
//             </Select>
//             <Select
//               variant="standard"
//               label="widget"
//               size="small"
//               value={dataSource.toString()}
//               IconComponent={KeyboardArrowDownIcon}
//               disableUnderline
//               onChange={(e: SelectChangeEvent) => {
//                 if (
//                   props.widgetPropsType &&
//                   (props.widgetPropsType.dataSourceId === "account-panel" ||
//                     props.widgetPropsType.dataSourceId === "broker-panel" ||
//                     props.widgetPropsType.dataSourceId === "subbroker-panel")
//                 ) {
//                   return;
//                 }
//                 setDataSource(+e.target.value);
//               }}
//               sx={{ color: "#A9B2CC" }}
//             >
//               {dataSourceList.map((dataSource, index) => (
//                 <MenuItem key={dataSource} value={index}>
//                   {dataSource}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Box>
//           {props.componentType === "chart" && (
//             <Box sx={{ maxHeight: "34px", width: "100%", maxWidth: 0.3 }}>
//               <Select
//                 variant="standard"
//                 label="chart-type"
//                 size="small"
//                 value={chartType}
//                 IconComponent={KeyboardArrowDownIcon}
//                 disableUnderline
//                 onChange={(e) => setChartType(e.target.value)}
//                 sx={{ color: "#A9B2CC", float: "right" }}
//               >
//                 {chartTypes.map((chartType) => (
//                   <MenuItem key={chartType} value={chartType}>
//                     {chartType}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Box>
//           )}
//         </Stack>
//       </Box>
//       <Box>
//         <DndProvider backend={HTML5Backend}>
//           <DragDropContext onDragEnd={onDragEnd}>
//             <Grid container>
//               <Grid
//                 item
//                 xs={6}
//                 sx={{
//                   borderRight: "1px solid #404b66",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <Box sx={{ borderBottom: "1px solid #404b66", p: 0.5 }}>
//                   <Typography
//                     sx={{ pl: 1 }}
//                     fontFamily={"sans-serif"}
//                     fontWeight={700}
//                     variant="body2"
//                   >
//                     Elements
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     p: 0,
//                     m: 0,
//                     maxHeight: 550,
//                     overflowY: "scroll",
//                     "&::-webkit-scrollbar-thumb": {
//                       backgroundColor: "#6A7187",
//                     },
//                     "&::-webkit-scrollbar": {
//                       width: 0,
//                     },
//                   }}
//                 >
//                   <Box id="aggregate-by-container">
//                     <Box sx={{ mb: 2 }}>
//                       <Card sx={{ p: "9px 6px" }}>
//                         <Typography sx={{ color: "#A9B2CC" }}>
//                           Aggregated By
//                         </Typography>
//                       </Card>
//                       <AggregateItemList
//                         droppableId={config.aggregateBy.id}
//                         itemStates={config.aggregateBy.itemStates}
//                         handleCheckBoxClick={handleDragCheckBoxClick}
//                         handleAggregateFnSelect={handleAggregateFnSelect}
//                         handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                       />
//                     </Box>
//                   </Box>
//                   <Box sx={{ flexGrow: "1" }}>
//                     <Box
//                       sx={{
//                         color: "#D5E2F0",
//                         background: "#1D2327",
//                         p: 1,
//                         display: "flex",
//                         flexDirection: "row",
//                       }}
//                     >
//                       <Box display="flex" alignItems={"center"}>
//                         <SearchIcon fontSize="medium" />
//                         <TextField
//                           type={"search"}
//                           placeholder="Search element list"
//                           value={searchValue}
//                           size="small"
//                           inputProps={{
//                             style: {
//                               padding: "2px 5px",
//                               fontSize: "1rem",
//                             },
//                           }}
//                           onChange={(e) => setSearchValue(e.target.value)}
//                         />
//                       </Box>
//                     </Box>
//                     <CheckBoxTree
//                       clickHandler={clickHandler}
//                       items={items}
//                       getStateForId={getStateForId}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>
//               <Grid
//                 item
//                 xs={6}
//                 sx={{ borderLeft: "1px solid #404b66", height: 1 }}
//               >
//                 <Box sx={{ borderBottom: "1px solid #404b66", p: 0.5 }}>
//                   <Typography
//                     sx={{ pl: 1, pr: 1 }}
//                     fontFamily={"sans-serif"}
//                     fontWeight={700}
//                     variant="body2"
//                   >
//                     Parameters
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     p: 1,
//                     maxHeight: 550,
//                     overflowY: "scroll",
//                     "&::-webkit-scrollbar-thumb": {
//                       backgroundColor: "#6A7187",
//                     },
//                   }}
//                 >
//                   <Box sx={{ mb: 1 }}>
//                     <Card sx={{ p: "9px 6px" }}>
//                       <Typography sx={{ color: "#A9B2CC" }}>
//                         Group By
//                       </Typography>
//                     </Card>
//                     <DroppedItemList
//                       itemStates={config.groupBy.itemStates}
//                       droppableId={config.groupBy.id}
//                       handleCheckBoxClick={handleDragCheckBoxClick}
//                       handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                     />
//                   </Box>
//                   <Box sx={{ mb: 1 }}>
//                     <Card sx={{ p: "9px 6px" }}>
//                       <Typography sx={{ color: "#A9B2CC" }}>
//                         Split By
//                       </Typography>
//                     </Card>
//                     <DroppedItemList
//                       itemStates={config.splitBy.itemStates}
//                       droppableId={config.splitBy.id}
//                       handleCheckBoxClick={handleDragCheckBoxClick}
//                       handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                     />
//                   </Box>
//                   <Box sx={{ mb: 1 }}>
//                     <Card sx={{ p: "9px 6px" }}>
//                       <Typography sx={{ color: "#A9B2CC" }}>
//                         Order By
//                       </Typography>
//                     </Card>
//                     <OrderByItemList
//                       droppableId={config.orderBy.id}
//                       itemStates={config.orderBy.itemStates}
//                       handleCheckBoxClick={handleDragCheckBoxClick}
//                       handleOrderBySelect={handleOrderBySelect}
//                       handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                     />
//                   </Box>
//                   <Box sx={{ mb: 1 }}>
//                     <Card sx={{ p: "9px 6px" }}>
//                       <Typography sx={{ color: "#A9B2CC" }}>
//                         Filter By
//                       </Typography>
//                     </Card>
//                     <FilterItemList
//                       droppableId={config.whereBy.id}
//                       itemStates={config.whereBy.itemStates}
//                       handleCheckBoxClick={handleDragCheckBoxClick}
//                       handleFilterSelect={handleFilterSelect}
//                       handleFilterValue={handleFilterValue}
//                       handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                     />
//                   </Box>
//                   <Box sx={{ mb: 1 }}>
//                     <Card sx={{ p: "9px 6px" }}>
//                       <Typography sx={{ color: "#A9B2CC" }}>X-Axis</Typography>
//                     </Card>
//                     <DroppedItemList
//                       itemStates={config.xAxis.itemStates}
//                       droppableId={config.xAxis.id}
//                       handleCheckBoxClick={handleDragCheckBoxClick}
//                       handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                     />
//                   </Box>
//                   <Box sx={{ mb: 1 }}>
//                     <Card sx={{ p: "9px 6px" }}>
//                       <Typography sx={{ color: "#A9B2CC" }}>Y-Axis</Typography>
//                     </Card>
//                     <DroppedItemList
//                       itemStates={config.yAxis.itemStates}
//                       droppableId={config.yAxis.id}
//                       handleCheckBoxClick={handleDragCheckBoxClick}
//                       handleCheckBoxItemDrop={handleCheckBoxItemDrop}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>
//             </Grid>
//           </DragDropContext>
//         </DndProvider>
//       </Box>
//     </Box>
//   );
// });

// export default React.memo(WidgetConfig);
