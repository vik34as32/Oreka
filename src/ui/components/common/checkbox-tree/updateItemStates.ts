import { DroppedItemState } from "../../custom-widget/WidgetConfig";
import { Item } from "./CheckBoxList";
import { CheckBoxState, ItemState } from "./CheckBoxTree";

function updateItemStates(oldState: ItemState[], items: Item[], clickId: string, desiredCheckBoxState: CheckBoxState , itemsToUpdate: {[itemId:string]:DroppedItemState} | null): ItemState[] {
    const newState = oldState;
    const getItemState = (id: string) => {
        return newState.find((i) => i.id === id)?.state;
    };
    const updateParent = (id:string) => {
        const item = items.find((i) => i.id === id);
        const parent = items.find((i) => i.id === item?.parentId);
        if (!parent) return;
        
        const childIds = items.filter((i) => i.parentId === parent.id).map((i) => i.id);
        const childStates = childIds.map((childId) => getItemState(childId));
        if (childStates.length === childStates.filter((s) => s === CheckBoxState.CHECKED).length) {
          const parentState = newState.find((i) => i.id === parent.id);
          if(parentState) parentState.state = CheckBoxState.CHECKED;
        } else if (childStates.length === childStates.filter((s) => s === CheckBoxState.UNCHECKED).length) {
          const parentState = newState.find((i) => i.id === parent.id);
          if(parentState) parentState.state = CheckBoxState.UNCHECKED;
        } else {
          const parentState = newState.find((i) => i.id === parent.id);
          if(parentState) parentState.state = CheckBoxState.INDETERMINATE;
        }
        updateParent(parent.id);
    }
    const setChecked = (id:string,status:CheckBoxState) => {
        const item = newState.find(item => item.id === id);
        const childIds = items.filter(item => item.parentId === id).map(child => child.id);
        if(item && (itemsToUpdate === null || childIds.length > 0 || (childIds.length === 0 && itemsToUpdate[item.id]))) {
          item.state = status;
        } 
        childIds.forEach(childId => setChecked(childId,status));
        updateParent(id);
    }
    setChecked(clickId,desiredCheckBoxState);
    return newState;
}

export default updateItemStates;
