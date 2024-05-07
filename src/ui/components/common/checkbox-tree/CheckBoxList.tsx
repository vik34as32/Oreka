import React from "react";
import CheckBoxTreeItem from "./CheckBoxTreeItem";
import { CheckBoxState } from "./CheckBoxTree";

export type Item = {
  id: string;
  name: string;
  dataType: string;
  parentId?: string;
};
type CheckBoxListProps = {
  items: Item[];
  idsToRender?: string[];
  identLevel?: string;
  onClick: (id: string) => void;
  getStateForId: (id: string) => CheckBoxState | undefined;
};

const CheckBoxList = (props: CheckBoxListProps) => {
  const getChildNodes = (parentId: string) => {
    const nodeItems = props.items.filter((item) => item.parentId === parentId);
    return nodeItems.map((item) => {
      const state = props.getStateForId(item.id);
      return (
        <CheckBoxTreeItem
          key={item.id}
          nodeId={`${item.id}`}
          label={item.name}
          ContentProps={
            {
              dataType: item.dataType,
              checkState: state,
              checkBoxClickHandler: props.onClick,
            } as any
          }
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
          const state = props.getStateForId(item.id);

          return (
            <CheckBoxTreeItem
              key={item.id}
              nodeId={`${item.id}`}
              label={item.name}
              ContentProps={
                {
                  dataType: item.dataType,
                  checkState: state,
                  checkBoxClickHandler: props.onClick,
                } as any
              }
              children={getChildNodes(item.id)}
            />
          );
        })}
    </>
  );
};

export default CheckBoxList;
