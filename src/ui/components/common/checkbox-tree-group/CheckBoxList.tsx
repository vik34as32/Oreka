import React, { ReactElement } from "react";
import { CheckBoxState } from "./CheckBoxTree";
import CheckBoxTreeItem from "./CheckBoxTreeItem";

export type Item = {
  id: string;
  name: string;
  parentId?: string;
  additionalInfo:{
    [id:string]:any
  }
};

export interface CheckBoxListProps {
  items: Item[];
  idsToRender?: string[];
  identLevel?: string;
  onClick: (id: string) => void;
  getStateForId: (id: string) => CheckBoxState | undefined;
  render:(props:any) => ReactElement;
}

const CheckBoxList: React.FC<CheckBoxListProps> = (
  props: CheckBoxListProps
): ReactElement => {
  const getChildNodes = (parentId: string) => {
    const nodeItems = props.items.filter((item) => item.parentId === parentId);
    return nodeItems.map((item) => {
      return (
        <CheckBoxTreeItem
          key={item.id}
          render={props.render}
          nodeId={`${item.id}`}
          label={item.name}
          itemProps={{
            checkState:props.getStateForId(item.id),
            checkBoxClickHandler: props.onClick
          }}
          children={getChildNodes(item.id)}
        />
      );
    });
  };
  return (
    <>
      {props.items
        .filter((item) => !item.parentId)
        .map((item) => {
          return (
            <CheckBoxTreeItem
              key={item.id}
              render={props.render}
              nodeId={`${item.id}`}
              label={item.name}
              itemProps={{
                checkState:props.getStateForId(item.id),
                checkBoxClickHandler: props.onClick
              }}
              children={getChildNodes(item.id)}
            />
          );
        })}
    </>
  );
};
export default React.memo(CheckBoxList);
