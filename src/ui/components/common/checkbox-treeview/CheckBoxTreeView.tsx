import {
  Box,
  Checkbox,
  FormControlLabel,
  Icon,
  Typography,
} from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createMixins";
import React, { useState } from "react";

export type groups = {
  group: string;
  checked: boolean;
};

type treeType = {
  group: string;
  id: string;
  checked: boolean;
  indeterminate: boolean;
  margin: number;
  hide: boolean;
  showExpCol: boolean;
  icon: string;
  index: number;
};

type propsType = {
  data: groups[];
  isEditable: boolean;
};

const CheckBoxTreeView = (props: propsType) => {
  let index: number = 0;
  let stree: treeType[] = [];
  const [checked, setChecked] = React.useState<groups[]>(props.data);
  const [tree, setTree] = useState<treeType[]>(stree);

  React.useEffect(() => {
    setChecked(props.data);
    showArrows();
    initialTreeRender();
  }, [props.data]);

  const checkBoxFragment = (index: number) => {
    const propss = tree.filter((s) => s.index == index)[0];
    const group = propss.group.replace(/_/g, " ");
    return (
      <React.Fragment>
        <Box
          key={index}
          sx={{
            display: propss.hide ? "none" : "flex",
            alignItems: "center",
            ml: propss.margin * 2,
            height: "1.5rem",
          }}
        >
          <div
            onClick={(e) => handleCollapse(e, index)}
            style={{
              marginRight: "10px",
            }}
          >
            <Icon
              sx={{
                visibility: propss.showExpCol ? "inherit" : "hidden",
                fontSize: "1rem",
              }}
            >
              {propss.icon}
            </Icon>
          </div>
          <FormControlLabel
            id={propss.id}
            sx={{
              textTransform: "uppercase",
              display: "flex",
              height: 10,
              alignItems: "center",
            }}
            label={
              <Typography sx={{ fontSize: "12px", ml: 1 }}>{group}</Typography>
            }
            control={
              <Checkbox
                key={index}
                sx={{ p: 0, width: "8px", height: "8px", ml: 1 }}
                checked={propss.checked}
                indeterminate={propss.indeterminate}
                onClick={(e) => handleCheckboxClick(e, index)}
                color="default"
                size="small"
                disabled={!props.isEditable}
              />
            }
          />
        </Box>
      </React.Fragment>
    );
  };

  function createTreeView(
    groups: string,
    tick: boolean,
    margin: number = 0,
    prevGroup?: string,
    id?: string
  ) {
    let arr = groups.split("\\");
    let arrlen = arr.length;
    let prevArr = prevGroup?.split("\\");
    if (arrlen > 1) {
      let firstElement = arr.shift();
      let prevFirstElement = prevArr?.shift();
      if (firstElement === prevFirstElement) {
        createTreeView(
          arr.join("\\"),
          tick,
          ++margin,
          prevArr?.join("\\"),
          id + "\\" + arr[0]
        );
      } else {
        stree.push({
          group: firstElement?.toLowerCase()!,
          checked: tick,
          indeterminate: false,
          margin: margin,
          hide: true,
          id: id!,
          index: index++,
          showExpCol: false,
          icon: "add",
        });
        createTreeView(
          arr.join("\\"),
          tick,
          ++margin,
          prevArr?.join("\\"),
          id + "\\" + arr[0]
        );
      }
    } else {
      stree.push({
        group: arr[0],
        checked: tick,
        indeterminate: false,
        margin: margin,
        hide: true,
        id: id!,
        index: index++,
        showExpCol: false,
        icon: "add",
      });
    }
  }

  function generateCheckBoxList() {
    const SortData = [...checked].sort((a, b) => (a.group > b.group ? 1 : -1));
    SortData.map((v: groups, i, arr) =>
      i === 0
        ? createTreeView(v.group, false, 0, "", v.group.split("\\")[0])
        : createTreeView(
            v.group,
            false,
            0,
            arr[i - 1].group,
            v.group.split("\\")[0]
          )
    );
    return <React.Fragment></React.Fragment>;
  }

  const handleCheckboxClick = (e: any, key: number) => {
    const itemTree = [...tree];
    itemTree.filter((s) => s.index == key)[0].checked = e.target.checked;
    let id = itemTree.filter((s) => s.index == key)[0].id;

    setTree(itemTree);
    changeChildNodes(id);
    changeParentNodes(id);

    getUpdatedChecks();
  };

  const changeChildNodes = (id: string) => {
    const itemTree = [...tree];
    itemTree.filter((s) => s.id == id)[0].indeterminate = false;
    let check = itemTree.filter((s) => s.id == id)[0].checked;

    itemTree
      .filter((s) => s.id.startsWith(id + "\\"))
      .forEach((v, i, arr) => {
        v.checked = check;
        v.indeterminate = false;
      });

    setTree(itemTree);
  };

  const changeParentNodes = (id: string) => {
    const checks = [...tree];
    let ids = id.split("\\");
    if (ids.length > 1) {
      ids.pop();
      id = ids.join("\\");
      var children = checks.filter((s) => s.id.startsWith(id + "\\"));
      let counter = 0,
        tick = 0,
        unTick = 0,
        halfTick = 0;
      children.forEach((v, key: number, parent) => {
        {
          ++counter;
          if (checks.filter((s) => s.id === v.id)[0].checked == true) ++tick;
          else ++unTick;
        }
      });
      if (counter > 0) {
        if (counter === tick) {
          checks.filter((s) => s.id === id)[0].checked = true;
          checks.filter((s) => s.id === id)[0].indeterminate = false;
        } else if (counter === unTick) {
          checks.filter((s) => s.id === id)[0].checked = false;
          checks.filter((s) => s.id === id)[0].indeterminate = false;
        } else {
          checks.filter((s) => s.id === id)[0].indeterminate = true;
          checks.filter((s) => s.id === id)[0].checked = false;
        }
        setTree(checks);
      }
      changeParentNodes(id);
    }
  };

  const initialTreeRender = () => {
    checked.forEach((v, i, arr) => {
      if (v.checked == true) {
        const list = [...tree];
        list.filter((s) => s.id == v.group)[0].checked = v.checked;
        setTree(list);
        changeChildNodes(v.group);
        changeParentNodes(v.group);
      }
    });
  };

  const getUpdatedChecks = () => {
    const list = [...tree];
    const checks = [...checked];
    list.forEach((v, i, arr) => {
      if (checks.find((s) => s.group == v.id) != null) {
        checks.filter((s) => s.group == v.id)[0].checked = v.checked;
      }
    });
    setChecked(checks);
  };

  const handleCollapse = (e: any, key: number) => {
    const itemTree = [...tree];
    const item = itemTree.filter((s) => s.index == key)[0];
    let hide = item.icon == "add" ? false : true;

    itemTree.filter((s) => s.index == key)[0].icon = hide ? "add" : "remove";
    itemTree
      .filter((s) => s.id.startsWith(item.id + "\\"))
      .forEach((v, i, arr) => {
        if (!hide) {
          if (v.id.split("\\").length == item.id.split("\\").length + 1)
            v.hide = hide;
        } else {
          v.hide = hide;
          v.icon = "add";
        }
      });

    setTree(itemTree);
  };

  const showArrows = () => {
    const list = [...tree];
    list.forEach((v, i, arr) => {
      if (list.filter((s) => s.id.startsWith(v.id)).length > 1) {
        v.showExpCol = true;
        if (arr[i + 1].id.split("\\").length == v.id.split("\\").length)
          v.showExpCol = false;
      }
      if (v.id.split("\\").length == 1) v.hide = false;
    });
    setTree(list);
  };

  return (
    <Box>
      {generateCheckBoxList()}
      {tree.map((v, i, arr) => checkBoxFragment(i))}
    </Box>
  );
};

const checkBoxCss: CSSProperties = {
  color: "#FFFFFF",
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "12px",
};

export default CheckBoxTreeView;
