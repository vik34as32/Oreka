import { DroppableContainerState, DroppedItemState } from "../../../custom-widget/WidgetConfig";
import { AggregateFunction } from "../../../custom-widget/drag-drop/AggregateItemList";
import { Item } from "../CheckBoxList";
import { CheckBoxState, ItemState } from "../CheckBoxTree";

export function findAllChildrenRecursively(items: Item[], item: Item):Item[] {
  const leafNodes: Item[] = [];
  const children = items.filter((child) => child.parentId === item.id);
  if (children.length === 0) leafNodes.push(item);
  else children.forEach((item) => getAllChildren(items, item, leafNodes));

  return leafNodes;
}
function getAllChildren(items: Item[], item: Item, leafNodes: Item[]) {
  const children = items.filter((child) => child.parentId === item.id);
  if (children.length === 0) leafNodes.push(item);
  else children.forEach((child) => getAllChildren(items, child, leafNodes));
}
export function getLeafNodes(itemId:string,items:Item[]): Item[] {
  // add all the leaf nodes under dragged node
  const actualItem = items.find((x) => x.id === itemId);
  if(actualItem) {
    return findAllChildrenRecursively(items, actualItem);
  }
  return [];
}
export function recursivelyAddChildren(leafNodes:Item[],droppableId:string,config:DroppableContainerState):[DroppedItemState[],DroppedItemState[]] {
  // add all the leaf nodes under dragged node
    let newItemStates: DroppedItemState[] =
      config[droppableId].itemStates;
    const itemStateKeys: { [id: string]: boolean } = newItemStates.reduce(
      (acc, itemState) => {
        acc[itemState.item.id] = true;
        return acc;
      },
      {}
    );
    const updatedItemStates:DroppedItemState[] = [];
    leafNodes.forEach((node) => {
      // allow duplication for aggregateBy
      if (config[droppableId].allowedDataType.includes(node.dataType) && (config[droppableId].areDuplicatesAllowed || !itemStateKeys[node.id])){
        updatedItemStates.push({
          item: node,
          checked: true,
          appliedFunction: node.dataType === "string" ? AggregateFunction.COUNT : AggregateFunction.SUM,
          filter: {
            colId:node.id,
            filterType:"==",
            value:""
          },
          orderBy: {
            colId: node.id,
            orderByType:"ASC"
          }
        });
        newItemStates.push({
          item: node,
          checked: true,
          appliedFunction: node.dataType === "string" ? AggregateFunction.COUNT : AggregateFunction.SUM,
          filter: {
            colId:node.id,
            filterType:"==",
            value:""
          },
          orderBy: {
            colId: node.id,
            orderByType:"ASC"
          }
        })
      }
    });
    // newItemStates.concat(updatedItemStates);
    return [newItemStates,updatedItemStates];
}
export function recursivelyRemoveChildren(leafNodes:Item[],droppableId:string,config:DroppableContainerState):DroppedItemState[] {
  // remove all the leaf nodes under dragged node

    const newItemStates:DroppedItemState[] = [];
    const itemIdMap:{[id:string]:boolean} = leafNodes.reduce((prev,curr) => {
      prev[curr.id] = true;
      return prev;
    },{});
      config[droppableId].itemStates.forEach((itemState:DroppedItemState) => {
        if(!itemIdMap[itemState.item.id]) {
          newItemStates.push(itemState);
        }
      })
      return newItemStates;
}
export function findVisibleCols(itemStates:ItemState[],items:Item[]): Item[] {
  const itemStatesMap = itemStates.reduce((acc:{[id:string]:CheckBoxState},itemState) => {
    acc[itemState.id] = itemState.state;
    return acc;
  },{});
  return items.filter(item => item.parentId === undefined).reduce((acc:Item[],item:Item) => {
    const leafNodes = getLeafNodes(item.id,items);
    return acc.concat(leafNodes);
  },[]).filter((leafNode:Item) => itemStatesMap[leafNode.id] === CheckBoxState.CHECKED);

}
export function getAllSearchItems(currentItems:Item[],allItems:Item[]):Item[] {
  const itemMap = allItems.reduce((acc:{[id:string]:Item},curr) => {
    acc[curr.id] = curr;
    return acc;
  },{});
  const searchResults = currentItems.reduce((acc:{[id:string]:Item},curr) => {
    acc[curr.id] = curr;
    return acc;
  },{});
  // recursive fetch all parent
  currentItems.forEach(item => {
    let parentId = item.parentId
    while(parentId){
      searchResults[parentId] = itemMap[parentId];
      parentId = itemMap[parentId].parentId;
    }
  });
  const searchResultsArray:Item[]=[];
  Object.keys(searchResults).forEach(key => searchResultsArray.push(searchResults[key]));
  return searchResultsArray;
}