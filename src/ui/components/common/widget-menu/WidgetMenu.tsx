import {
  AddTwoTone,
  CancelOutlined,
  ControlPointDuplicate,
  EditOutlined,
  FilterAltOutlined,
  ImportExportOutlined,
  MoreVert,
  OpenInFull,
  OpenInNew,
  ViewSidebarOutlined,
} from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { IJsonModel } from "flexlayout-react";
import { isArray } from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as appActions from "../../../../redux/action-handlers/app/AppActions";
import * as FlexLayout from "flexlayout-react";
import { setAlertMessage } from "../../../../redux/action-handlers/app/AppActions";
import { setCanvasModel } from "../../../../redux/action-handlers/canvas/CanvasActions";
import CanvasFactory from "../../../canvas/services/CanvasService";
import WidgetFactory from "../../../canvas/services/WidgetService";
import { Filter } from "../../custom-widget/WidgetConfig";
import TagForShortcutComponent from "../TagForShortcutComponent";
import PopoutFactory from "../../../canvas/services/PopoutService";

export type WidgetMenuProps = {
  componentId: string | undefined;
  widgetType: string;
  closeWidget: () => void;
  toogleToolPanel?: (compoenntId: string) => void;
  toggleFloatingFilter?: (compoenntId: string) => void;
  duplicateWidget: (componentId: string) => void;
  customizeWidgetModalState: boolean;
  toggleCustomizeWidgetModal: (open: boolean) => void;
  tabsetId: string;
  setCanvasModel: (model: IJsonModel) => void;
  canvasModel: IJsonModel;
  activePageId: string;
  setAlertMessage: (message: string, messageType: string) => void;
  handleEditWidget: () => void;
  isIconVisible: boolean;
  handleAddWidgetModal: (tabSetId: string) => void;
  isMaximized: boolean;
  tabSetModel: FlexLayout.Model;
  isPopout: boolean;
  tabSetNode: FlexLayout.TabSetNode | FlexLayout.BorderNode;
  handleExportWidget: () => void;
  setActiveTabSet:(activeTabSet:string | undefined) => void;
};

const WidgetMenu: React.FC<WidgetMenuProps> = (
  props: WidgetMenuProps
): JSX.Element => {
  const [filterEnabled, setFilterEnabled] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const filterToggleShortCutKeys = useMemo(() => ["shift", "f"], []);
  const toolPanelToggleShortCutKeys = useMemo(() => ["shift", "c"], []);

  const handleFilterToggle = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (props.toggleFloatingFilter && props.componentId)
        props.toggleFloatingFilter(props.componentId);
      setFilterEnabled((filterEnabled) => !filterEnabled);
      setAnchorEl(null);
    },
    [props.toggleFloatingFilter, filterEnabled, props.componentId]
  );

  const handleToggleToolPanel = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (props.toogleToolPanel && props.componentId)
        props.toogleToolPanel(props.componentId);
      setAnchorEl(null);
    },
    [props.componentId, props.toogleToolPanel]
  );

  const handleCloseWidget = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTabMenuClose();
    props.closeWidget();
  };

  const handleEditWidget = (e?: React.MouseEvent) => {
    onTabMenuClose();
    props.handleEditWidget();
  };

  const duplicateWidget = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (props.componentId) {
        props.duplicateWidget(props.componentId);
        onTabMenuClose();
      }
    },
    [props.componentId, props.duplicateWidget]
  );

  const onTabMenuClose = () => {
    setAnchorEl(null);
  };

  const downloadJsonFile = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportWidget = (e: React.MouseEvent) => {
    if (!props.componentId) return;
    props.handleExportWidget();
    const widgetServiceInstance = WidgetFactory.getInstance();
    const widgetProps = widgetServiceInstance.getProps(props.componentId);
    if (!widgetProps) return;
    const jsonData = {
      widgetProps: widgetProps,
    };

    let fileName = "page.json";
    if (widgetProps.name || widgetProps.name.trim() != "") {
      fileName = widgetProps.name.trim() + "_widget.json";
    }
    downloadJsonFile(jsonData, fileName);
    props.setAlertMessage("Widget Exported Successfully", "success");

    e.stopPropagation();
    onTabMenuClose();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsText(file);
  };

  const handleFileRead = (event: ProgressEvent<FileReader>) => {
    if (event && event.target) {
      try {
        const content: string = event.target?.result as string;
        const jsonData = JSON.parse(content);

        if (jsonData.hasOwnProperty("widgetProps")) {
          ImportWidget(jsonData["widgetProps"]);
        } else {
          props.setAlertMessage("Problem in file", "error");
        }
      } catch (error) {
        props.setAlertMessage("Problem in file", "error");
      }
    }
  };

  const ImportWidget = (widgetProps: any) => {
    if (!checkWidget(widgetProps)) {
      props.setAlertMessage("Problem in file", "error");
      return;
    }

    const canvasService = CanvasFactory.getInstance();
    const newModel = canvasService.addToModel(
      props.activePageId,
      props.canvasModel,
      props.tabsetId,
      widgetProps.name,
      widgetProps
    );
    props.setCanvasModel(newModel);
    props.setAlertMessage("Widget Imported Successfully", "success");
    onTabMenuClose();
  };

  return (
    <>
      <IconButton
        size="small"
        sx={{ pl: 1, width: 7 }}
        onMouseDown={(e: any) => {
          props.setActiveTabSet(props.tabsetId);
          setAnchorEl(e.currentTarget)
        }}
      >
        <MoreVert fontSize="small" htmlColor="#6A7187" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onTabMenuClose}
        disableAutoFocusItem
        disableAutoFocus
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            background: "#020305",
          },
        }}
      >
        <MenuList sx={{ p: 0, color: "#D5E2F0" }}>
          {!props.isIconVisible && (
            <MenuItem
              onMouseDown={() => {
                setAnchorEl(null);
                props.handleAddWidgetModal(props.tabsetId);
              }}
            >
              <ListItemIcon sx={{ marginRight: "-10px" }}>
                <AddTwoTone
                  style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography className="menu-item">Add Widget</Typography>
              </ListItemText>
              <TagForShortcutComponent
                shortcut={["Shift", "A"]}
              ></TagForShortcutComponent>
            </MenuItem>
          )}
          {!props.isIconVisible && (
            <MenuItem
              onMouseDown={() => {
                setAnchorEl(null);
                props.tabSetModel.doAction(
                  FlexLayout.Actions.maximizeToggle(props.tabsetId)
                );
              }}
            >
              <ListItemIcon sx={{ marginRight: "-10px" }}>
                <OpenInFull
                  style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography className="menu-item">
                  {props.isMaximized ? "Minimize" : "Maximize"}
                </Typography>
              </ListItemText>
              <TagForShortcutComponent
                shortcut={["Shift", "M"]}
              ></TagForShortcutComponent>
            </MenuItem>
          )}
          {!props.isIconVisible && !props.isPopout && (
            <MenuItem
              onMouseDown={() => {
                setAnchorEl(null);
                const popoutService = PopoutFactory.getInstance();
                const tabNode =
                  props.tabSetNode.getSelectedNode() as FlexLayout.TabNode;
                const componentId = tabNode.getComponent();
                if (componentId)
                  popoutService.openTabAsPopout(componentId, tabNode.getName());
              }}
            >
              <ListItemIcon sx={{ marginRight: "-10px" }}>
                <OpenInNew
                  style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography className="menu-item">Popout</Typography>
              </ListItemText>
              <TagForShortcutComponent
                shortcut={["Shift", "O"]}
              ></TagForShortcutComponent>
            </MenuItem>
          )}
          <MenuItem onMouseDown={handleFilterToggle}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <FilterAltOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Toggle Filter</Typography>
            </ListItemText>
            <TagForShortcutComponent
              shortcut={["Shift", "F"]}
            ></TagForShortcutComponent>
          </MenuItem>
          <MenuItem onMouseDown={handleToggleToolPanel}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <ViewSidebarOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Toogle Tool Panel</Typography>
            </ListItemText>
            <TagForShortcutComponent
              shortcut={["Shift", "C"]}
            ></TagForShortcutComponent>
          </MenuItem>
          <MenuItem onMouseDown={duplicateWidget}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <ControlPointDuplicate
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Duplicate</Typography>
            </ListItemText>
            <TagForShortcutComponent
              shortcut={["Shift", "D"]}
            ></TagForShortcutComponent>
          </MenuItem>
          <MenuItem onMouseDown={handleCloseWidget}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <CancelOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Close Widget</Typography>
            </ListItemText>
            <TagForShortcutComponent
              shortcut={["Shift", "F4"]}
            ></TagForShortcutComponent>
          </MenuItem>
          <MenuItem onMouseDown={handleEditWidget}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <EditOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Edit</Typography>
            </ListItemText>
            <TagForShortcutComponent
              shortcut={["Shift", "E"]}
            ></TagForShortcutComponent>
          </MenuItem>
          <MenuItem onMouseDown={exportWidget}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <ImportExportOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Export Widget</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <ImportExportOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <input
              type="file"
              id="upload-file"
              accept=".json"
              style={{ display: "none" }}
              onChange={(event) => {
                event.target.files = null;
                setAnchorEl(null);
                handleFileUpload(event);
              }}
            />
            <label htmlFor="upload-file">
              <Typography
                variant="body1"
                component="span"
                className="menu-item"
              >
                Import Widget
              </Typography>
            </label>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export function checkWidget(obj: any) {
  // this function is used to check widget while importing
  // this function need to be changed if WidgetPropsType will change
  let isProper = true;

  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const keys = [
    "id",
    "visibleCols",
    "functionCols",
    "groupBy",
    "splitBy",
    "filterBy",
    "name",
    "dataSourceId",
    "componentType",
    "pivot",
    "filterColor",
  ];

  if (
    obj.hasOwnProperty("componentType") &&
    obj["componentType"] === "watchlist"
  ) {
    isProper =
      Array.isArray(obj.subscribedTickers) &&
      obj.subscribedTickers.every((ticker) => typeof ticker === "string");
  }

  isProper =
    isProper &&
    typeof obj.id === "string" &&
    Array.isArray(obj.visibleCols) &&
    obj.visibleCols.every((col: string) => typeof col === "string") &&
    Array.isArray(obj.functionCols) &&
    obj.functionCols.every(
      (col: [string, string]) =>
        Array.isArray(col) &&
        col.length === 2 &&
        typeof col[0] === "string" &&
        typeof col[1] === "string"
    ) &&
    Array.isArray(obj.groupBy) &&
    obj.groupBy.every((group: string) => typeof group === "string") &&
    Array.isArray(obj.splitBy) &&
    obj.splitBy.every((split: string) => typeof split === "string") &&
    Array.isArray(obj.filterBy) &&
    obj.filterBy.every(
      (filter: Filter) =>
        (typeof filter === "object" &&
          typeof filter.colId === "string" &&
          typeof filter.value === "number") ||
        typeof filter.value === "string" ||
        typeof filter.value === "boolean" ||
        filter.value instanceof Date ||
        isArray(filter.value)
    ) &&
    typeof obj.name === "string" &&
    typeof obj.dataSourceId === "string" &&
    typeof obj.componentType === "string" &&
    typeof obj.pivot === "boolean" &&
    typeof obj.filterColor === "object" &&
    obj.filterColor !== null &&
    typeof obj.filterColor.color === "string" &&
    typeof obj.filterColor.type === "string" &&
    (typeof obj.chartType === "undefined" ||
      typeof obj.chartType === "string") &&
    (typeof obj.color === "undefined" ||
      (typeof obj.color === "object" && obj.color !== null));

  return isProper;
}

function mapStateToProps(state: any) {
  return {
    customizeWidgetModalState: state.app.customizeWidgetModalState,
    canvasModel: state.canvas.canvasModel,
    activePageId: state.page.activePageId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    toggleCustomizeWidgetModal: (open: boolean) =>
      dispatch(appActions.toggleCustomizeWidgetModal(open)),
    setCanvasModel: (model: IJsonModel) => dispatch(setCanvasModel(model)),
    setAlertMessage: (message: string, messageType: string) =>
      dispatch(setAlertMessage(message, messageType)),
      setActiveTabSet:(activeTabSet:string | undefined) => dispatch(appActions.setActiveTabSet(activeTabSet)),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(WidgetMenu)
);
