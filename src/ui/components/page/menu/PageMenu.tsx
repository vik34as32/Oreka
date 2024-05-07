import {
  Code,
  ImportExportOutlined,
  Lock,
  LockOpen,
  MoreVert,
  SaveOutlined,
} from "@mui/icons-material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import React, {
  Dispatch,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import TagForShortcutComponent from "../../common/TagForShortcutComponent";
import { connect } from "react-redux";
import * as FlexLayout from "flexlayout-react";
import CanvasFactory from "../../../canvas/services/CanvasService";
import { setAlertMessage } from "../../../../redux/action-handlers/app/AppActions";
import { setIsPageUnsaved } from "../../../../redux/action-handlers/page/PageActions";
import { setCanvasModel } from "../../../../redux/action-handlers/canvas/CanvasActions";
import { cloneDeep } from "lodash";
import EventEmitterService from "../../../../utilities/EventEmitter";
import { PAGE_SAVE } from "../../../../utilities/Constants";
export type PageMenuProps = {
  visible: boolean;
  pageId: string;
  isDeletable: boolean;
  deletePage: (pageId: string) => void;
  editPage: (pageId: string) => void;
  savePage: (pageId: string) => void;
  canvasState: CanvasState;
  name: string;
  setAlertMessage: (message: string, messageType: string) => void;
  setIsPageUnsaved: (value: boolean) => void;
  setCanvasModel: (model: FlexLayout.IJsonModel) => void;
};

const PageMenu: React.FC<PageMenuProps> = (props): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const onMenuClose = (e: MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const confirmDeletePage = (e: MouseEvent) => {
    e.stopPropagation();
    props.deletePage(props.pageId);
  };

  const cancelDeletePage = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(false);
  };

  const deletePage = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
    onMenuClose(e);
  };
  const editPage = (e: MouseEvent) => {
    props.editPage(props.pageId);
    e.stopPropagation();
    onMenuClose(e);
  };
  const savePage = (e: MouseEvent) => {
    const eventEmitterService = EventEmitterService.getInstance();
    eventEmitterService.emit(PAGE_SAVE);
    props.setIsPageUnsaved(false);
    e.stopPropagation();
    onMenuClose(e);
  };

  const lockPage = (e: MouseEvent) => {
    e.stopPropagation();
    const updatedModel = cloneDeep(props.canvasState);
    updatedModel.canvasModel.global = {
      ...updatedModel.canvasModel.global,
      tabSetEnableTabStrip: false,
    };
    props.setCanvasModel(updatedModel.canvasModel);
    onMenuClose(e);
  };

  const unLockPage = (e: MouseEvent) => {
    e.stopPropagation();
    const updatedModel = cloneDeep(props.canvasState);
    updatedModel.canvasModel.global = {
      ...updatedModel.canvasModel.global,
      tabSetEnableTabStrip: true,
    };
    props.setCanvasModel(updatedModel.canvasModel);
    onMenuClose(e);
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

  const exportPage = (e: MouseEvent) => {
    const canvasService = CanvasFactory.getInstance();
    const widgetProps = canvasService.getAllComponentPropsForPage(props.pageId);

    if (!widgetProps || !props.canvasState) return;

    const jsonData = {
      layout: props.canvasState,
      widgetConfigs: widgetProps,
    };

    let fileName = "page.json";
    if (props.name || props.name.trim() != "") {
      fileName = props.name.trim() + "_page.json";
    }

    downloadJsonFile(jsonData, fileName);
    props.setAlertMessage("Page Exported Successfully", "success");

    e.stopPropagation();
    onMenuClose(e);
  };
  return (
    <Box
      sx={{
        pl: 0.2,
        pr: 0.5,
        mt: "-5px",
        display: !props.visible ? "none" : "initial",
      }}
    >
      <IconButton
        size="small"
        sx={{ p: 0, width: 5 }}
        onMouseDown={(e: any) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVert fontSize="small" htmlColor="#6A7187" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        disableAutoFocusItem
        disableAutoFocus
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            background: "#020305",
            border: 1,
            borderColor: "#2B3349",
          },
        }}
      >
        <MenuList sx={{ p: 0, color: "#D5E2F0" }}>
          <MenuItem onClick={editPage}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <BorderColorOutlinedIcon
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Edit Page Name</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={savePage}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <SaveOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Save Page</Typography>
            </ListItemText>
            <TagForShortcutComponent
              shortcut={["Shift", "S"]}
            ></TagForShortcutComponent>
          </MenuItem>
          <MenuItem onClick={deletePage} disabled={!props.isDeletable}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <DeleteOutlineOutlinedIcon
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Delete Page</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={exportPage}>
            <ListItemIcon sx={{ marginRight: "-10px" }}>
              <ImportExportOutlined
                style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography className="menu-item">Export Page</Typography>
            </ListItemText>
          </MenuItem>

          {props.canvasState.canvasModel !== null &&
            (props.canvasState.canvasModel.global.tabSetEnableTabStrip ===
              undefined ||
            props.canvasState.canvasModel.global.tabSetEnableTabStrip ? (
              <MenuItem onClick={lockPage}>
                <ListItemIcon sx={{ marginRight: "-10px" }}>
                  <Lock
                    style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography className="menu-item">Lock Page</Typography>
                </ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={unLockPage}>
                <ListItemIcon sx={{ marginRight: "-10px" }}>
                  <LockOpen
                    style={{ width: "16px", height: "16px", color: "#D5E2F0" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography className="menu-item">Unlock Page</Typography>
                </ListItemText>
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
      {showDeleteConfirmation && (
        <Dialog open={true} onClose={cancelDeletePage} sx={{ top: "-70%" }}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this page?
            </DialogContentText>
          </DialogContent>
          <style>{`
            .MuiDialog-paper {
              border: 1px solid #2B3349};
            }
          `}</style>
          <DialogActions>
            <Button
              onClick={cancelDeletePage}
              color="primary"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeletePage}
              color="primary"
              autoFocus
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    canvasState: state.canvas,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    setAlertMessage: (message: string, messageType: string) =>
      dispatch(setAlertMessage(message, messageType)),
    setIsPageUnsaved: (value: boolean) => dispatch(setIsPageUnsaved(value)),
    setCanvasModel: (model: FlexLayout.IJsonModel) =>
      dispatch(setCanvasModel(model)),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(PageMenu)
);
