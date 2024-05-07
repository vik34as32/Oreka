import { ChangeEvent, Component } from "react";

import {
  AccountBalanceOutlined,
  AccountBoxOutlined,
  BarChartOutlined,
  BrowserUpdatedOutlined,
  CurrencyExchangeOutlined,
  DeviceHubOutlined,
  Height,
  ImportExportOutlined,
  Language,
  LanguageOutlined,
  LeaderboardOutlined,
  SwapVertOutlined,
  SyncAltOutlined,
} from "@mui/icons-material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import ViewListIcon from "@mui/icons-material/ViewList";

import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import {
  Box,
  Chip,
  IconButton,
  Modal,
  Stack,
  SvgIconTypeMap,
  TextField,
  Typography,
} from "@mui/material";
import { OverridableComponent } from "@mui/types";
import { IJsonModel } from "flexlayout-react";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import GridWidgets from "../../data/GridWidgets.json";
import SpreadSheetWidgets from "../../data/SpreadSheetWidgets.json";
import ChartWidgets from "../../data/ChartWidgets.json";
import preConfiguredWidgets from "../../data/WidgetConfigurations.json";
import { setCanvasModel } from "../../redux/action-handlers/canvas/CanvasActions";
import CanvasFactory from "../canvas/services/CanvasService";
import { HorizontalDivider } from "./common/dividers/Dividers";
import AddCustomWidgetModal from "./custom-widget/AddCustomWidgetModal";
import { setIsPageUnsaved } from "../../redux/action-handlers/page/PageActions";
import DoubleIcon from "./common/DoubleIcon";
import { checkWidget } from "./common/widget-menu/WidgetMenu";
import { setAlertMessage } from "../../redux/action-handlers/app/AppActions";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 376,
  boxShadow: 24,
  p: 2,
};

type AddWidgetDropdownProps = {
  addWidgetMetaData: AddWidgetdataModel[];
  open: boolean;
  canvasModel: IJsonModel;
  activeTabSet: string;
  activePageId: string;
  handleOpen: () => void;
  handleClose: () => void;
  setCanvasModel: (model: IJsonModel) => void;
  setIsPageUnsaved: (value: boolean) => void;
  setAlertMessage: (message: string, messageType: string) => void;
};

type AddWidgetDropdownState = {
  showWidgetMetaData: AddWidgetdataModel[];
  widgetType: number | null;
  widget: string | null;
  widgetDataType: string | null;
  openCustomWidgetModal: boolean;
  name: string;
};
type PanelWidgets = {
  id: string;
  iconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  secondIconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  dataSourceId?: string;
  name?: string;
};
type Widget = {
  id: string;
  type: string;
  name: string;
  iconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  children: PanelWidgets[];
};
const widgets: Widget[] = [
  {
    id: "panel",
    type: "panel",
    name: "Panels",
    iconComponent: TableViewOutlinedIcon,
    children: [
      {
        id: "account-panel",
        iconComponent: AccountBoxOutlined,
        secondIconComponent: BarChartOutlined,
      },
      {
        id: "broker-panel",
        iconComponent: AccountBalanceOutlined,
        secondIconComponent: BarChartOutlined,
      },
      {
        id: "login-device-panel",
        iconComponent: AccountBalanceOutlined,
        secondIconComponent: BarChartOutlined,
      },
      
      
      {
        id: "subbroker-panel",
        iconComponent: DeviceHubOutlined,
        secondIconComponent: BarChartOutlined,
      },
      {
        id: "dealing-panel",
        iconComponent: BrowserUpdatedOutlined,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "dealing-panel-interval",
        iconComponent: BrowserUpdatedOutlined,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "order-panel",
        iconComponent: SyncAltOutlined,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "event-management-system-panel",
        iconComponent: SyncAltOutlined,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "alert-notification-panel",
        iconComponent: SyncAltOutlined,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "watch-list-panel",
        iconComponent: CurrencyExchangeOutlined,
        secondIconComponent: SwapVertOutlined,
      },
    ],
  },
  {
    id: "data-grid",
    type: "grid",
    name: "Data Grid",
    iconComponent: TableViewOutlinedIcon,
    children: [
      {
        id: "subbroker-volume",
        iconComponent: DeviceHubOutlined,
        secondIconComponent: BarChartOutlined,
      },
      {
        id: "broker-volume",
        iconComponent: AccountBalanceOutlinedIcon,
        secondIconComponent: BarChartOutlined,
      },
      {
        id: "login-volume",
        iconComponent: FingerprintOutlinedIcon,
        secondIconComponent: BarChartOutlined,
      },
      {
        id: "subbroker-pl",
        iconComponent: DeviceHubOutlined,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "broker-pl",
        iconComponent: AccountBalanceOutlinedIcon,
        secondIconComponent: SwapVertOutlined,
      },
      {
        id: "login-balance",
        iconComponent: FingerprintOutlinedIcon,
        secondIconComponent: SwapVertOutlined,
      },
    ],
  },
  {
    id: "spread-sheet",
    type: "spreadsheet",
    name: "SpreadSheet",
    iconComponent: LanguageOutlined,
    children: [
      {
        id: "sheet-panel",
        iconComponent: InsightsOutlinedIcon,
        secondIconComponent: LanguageOutlined,
      },
    ],
  },
  {
    id: "chart",
    type: "chart",
    name: "Chart",
    iconComponent: LeaderboardOutlined,
    children: [
      {
        id: "subbroker-balance",
        iconComponent: DeviceHubOutlined,
        secondIconComponent: BarChartOutlined,
      },
    ],
  },
  {
    id: "webpage",
    type: "webpage",
    name: "Web Page",
    iconComponent: BrowserUpdatedOutlined,
    children: [],
  },
  {
    id: "profit-loss-report",
    type: "profit-loss-report",
    name: "Profit and loss report",
    iconComponent: BrowserUpdatedOutlined,
    children: [],
  },

  {
    id: "login-Deviece",
    type: "Login-Deviece",
    name: "Login-Deviece",
    iconComponent: BrowserUpdatedOutlined,
    children: [],
  },
];
class AddWidgetModal extends Component<
  AddWidgetDropdownProps,
  AddWidgetDropdownState
> {
  constructor(props: AddWidgetDropdownProps) {
    super(props);
    this.state = {
      widget: null,
      widgetType: null,
      showWidgetMetaData: props.addWidgetMetaData,
      widgetDataType: "live",
      openCustomWidgetModal: false,
      name: "Widget",
    };
    widgets.forEach((widget) => {
      widget.children.forEach((child) => {
        if (widget.type === "grid") {
          child.dataSourceId = GridWidgets[child.id].dataSourceId;
          child.name = GridWidgets[child.id].name;
        } else if (widget.type === "spreadsheet") {
          child.dataSourceId = SpreadSheetWidgets[child.id].dataSourceId;
          child.name = SpreadSheetWidgets[child.id].name;
        } else if (widget.type === "chart") {
          child.dataSourceId = ChartWidgets[child.id].dataSourceId;
          child.name = ChartWidgets[child.id].name;
        } else if (widget.type === "panel") {
          child.dataSourceId = preConfiguredWidgets[child.id].dataSourceId;
          child.name = preConfiguredWidgets[child.id].name;
        }
      });
    });
  }

  resetState = () => {
    this.setState({
      widget: null,
      widgetType: null,
      widgetDataType: "live",
      name: "Widget",
    });
  };
  openCustomizeWidgetModal = () => {
    // close the current modal, open customize widget modal, reset current states
    this.setState({ openCustomWidgetModal: true });
  };
  handleCustomWidgetModalClose = () => {
    this.setState({ openCustomWidgetModal: false });
    this.handleClose();
  };
  addWidgetPanel(widgetPanel: any) {
    const canvasService = CanvasFactory.getInstance();
    const newModel = canvasService.addToModel(
      this.props.activePageId,
      this.props.canvasModel,
      this.props.activeTabSet,
      widgetPanel.name,
      widgetPanel
    );
    this.props.setCanvasModel(newModel);
    this.props.setIsPageUnsaved(true);
    this.handleClose();
  }
  handleClose = () => {
    this.resetState();
    this.props.handleClose();
  };
  addPanel(widgetId: string) {
    const widget = { ...preConfiguredWidgets[widgetId] };
    this.addWidgetPanel(widget);
  }
  addGridWidget(widgetId: string) {
    const widget = { ...GridWidgets[widgetId] };
    this.addWidgetPanel(widget);
  }
  addSpreadSheetWidget(widgetId: string) {
    const widget = { ...SpreadSheetWidgets[widgetId] };
    this.addWidgetPanel(widget);
  }
  addChartWidget(widgetId: string) {
    const widget = { ...ChartWidgets[widgetId] };
    this.addWidgetPanel(widget);
  }
  clickHandler = (index: number, widgetId?: string) => {
    if (widgets[index].children.length === 0) {
      this.addPanel(widgets[index].id);
      this.setState({ name: widgets[index].name });
    } else if (widgets[index].type === "grid" && widgetId) {
      this.addGridWidget(widgetId);
      this.setState({ name: widgets[index].name });
    } else if (widgets[index].type === "spreadsheet" && widgetId) {
      this.addSpreadSheetWidget(widgetId);
      this.setState({ name: widgets[index].name });
    } else if (widgets[index].type === "chart" && widgetId) {
      this.addChartWidget(widgetId);
      this.setState({ name: widgets[index].name });
    } else if (widgets[index].type === "panel" && widgetId) {
      this.addPanel(widgetId);
      this.setState({ name: widgets[index].name });
    } else {
      this.setState({ widgetType: index, name: widgets[index].name });
    }
  };

  handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = this.handleFileRead;
    reader.readAsText(file);
  };

  handleFileRead = (event: ProgressEvent<FileReader>) => {
    if (event && event.target) {
      try {
        const content: string = event.target?.result as string;
        const jsonData = JSON.parse(content);

        if (jsonData.hasOwnProperty("widgetProps")) {
          this.ImportWidget(jsonData["widgetProps"]);
        } else {
          this.props.setAlertMessage("Problem in file", "error");
        }
      } catch (error) {
        this.props.setAlertMessage("Problem in file", "error");
      }
    }
  };

  ImportWidget = (widgetProps: any) => {
    if (!checkWidget(widgetProps)) {
      this.props.setAlertMessage("Problem in file", "error");
      return;
    }

    const canvasService = CanvasFactory.getInstance();
    const newModel = canvasService.addToModel(
      this.props.activePageId,
      this.props.canvasModel,
      this.props.activeTabSet,
      widgetProps.name,
      widgetProps
    );
    this.props.setCanvasModel(newModel);
    this.props.setAlertMessage("Widget Imported Successfully", "success");
    this.handleClose();
  };



  

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.handleClose}
        sx={{ border: "none" }}
      >
        <Stack
          sx={{ ...style, "&:focus": { outline: "none" } }}
          border={"none"}
          spacing={2}
          direction={"column"}
          className="modal-container"
          autoFocus={false}
        >
          <Box display={"flex"} flexDirection={"row"}>
            <Box
              sx={{
                display:
                  this.state.widgetType === null ||
                  widgets[this.state.widgetType].children.length === 0
                    ? "none"
                    : "flex",
                color: "#D5E2F0",
                cursor: "pointer",
                mr: 1,
              }}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowBackIosIcon
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  fontSize: "15px",
                }}
                onClick={() =>
                  this.setState({ widgetType: null, name: "Widget" })
                }
              />
            </Box>

            <Typography
              className="header-text"
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              Add {this.state.name}
            </Typography>
            <IconButton onClick={this.handleClose}>
              <CloseIcon
                sx={{ color: "#6a7187", cursor: "pointer", fontSize: "18px" }}
                fontSize="small"
              />
            </IconButton>
          </Box>
          <Box
            sx={{
              display:
                this.state.widgetType === null ||
                widgets[this.state.widgetType].children.length === 0
                  ? "flex"
                  : "none",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              height: "48px",
              background: "#0A0A0A",
            }}
            className={"modal-input-container"}
          >
            <img src={"assets/icons/search.svg"} style={{ padding: "10px" }} />
            <TextField
              placeholder="Search"
              hiddenLabel
              size="small"
              variant="standard"
              sx={{ border: "none" }}
              InputProps={{
                disableUnderline: true,
              }}
              // onChange={(e) => this.onSearch(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: this.state.widgetType === null ? "initial" : "none",
            }}
          >
            {widgets.map((widget, index) => (
              <Box
                display={"flex"}
                flexDirection={"row"}
                sx={{ p: 1, color: "#D5E2F0", cursor: "pointer" }}
                onClick={() => {
                  this.clickHandler(index);
                }}
              >
                {React.createElement(widget.iconComponent)}
                <Typography
                  sx={{
                    ml: 1,
                    width: "100%",
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                  variant="body1"
                >
                  {widget.name}
                </Typography>
                <Box>
                  {widget.children?.length > 0 ? (
                    <ChevronRightIcon sx={{ width: "20px", Height: "20px" }} />
                  ) : (
                    <AddIcon sx={{ width: "20px", Height: "20px" }} />
                  )}
                </Box>
              </Box>
            ))}
            <HorizontalDivider />
            <Box
              display={"flex"}
              flexDirection={"row"}
              sx={{ p: 1, color: "#D5E2F0", cursor: "pointer" }}
            >
              <ImportExportOutlined />
              <input
                type="file"
                id="upload-file"
                accept=".json"
                style={{ display: "none" }}
                onChange={(event) => {
                  event.target.files = null;
                  this.handleFileUpload(event);
                }}
              />
              <label htmlFor="upload-file">
                <Typography className="setting" sx={{ ml: 1, cursor: "pointer" }} variant="body1">
                  Import Widget
                </Typography>
              </label>
            </Box>
          </Box>
          <Box
            sx={{
              display:
                this.state.widgetType === null ||
                widgets[this.state.widgetType].children.length === 0
                  ? "none"
                  : "initial",
            }}
          >
            <Box sx={{ mt: 1 }}>
              {this.state.widgetType !== null &&
                widgets[this.state.widgetType].children.map((widget) => (
              
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems="center"
                    sx={{ p: 1, color: "#D5E2F0", cursor: "pointer" }}
                    onClick={() => {
                      this.clickHandler(this.state.widgetType, widget.id);
                    }}
                  >
                    {/* {React.createElement(widget.iconComponent)} */}
                    <DoubleIcon
                      firstIcon={widget.iconComponent}
                      secondIcon={widget.secondIconComponent}
                    ></DoubleIcon>
                    <Typography
                      className="setting"
                      sx={{ ml: 1 }}
                      variant="body1"
                    >{`${widget.name}`}</Typography>
                    <Box sx={{ marginLeft: "auto" }}>
                      <AddIcon sx={{ width: "20px", Height: "20px" }} />
                    </Box>
                  </Box>
                ))}
            </Box>
            <HorizontalDivider />
            <Box
              display={"flex"}
              flexDirection={"row"}
              sx={{ p: 1, color: "#D5E2F0", cursor: "pointer" }}
              onClick={this.openCustomizeWidgetModal}
            >
              <WidgetsOutlinedIcon />
              <Typography className="setting" sx={{ ml: 1 }} variant="body1">
                Custom
              </Typography>
            </Box>
          </Box>
          {this.state.widgetType !== null && (
            <AddCustomWidgetModal
              open={this.state.openCustomWidgetModal}
              onClose={this.handleCustomWidgetModalClose}
              widgetType={widgets[this.state.widgetType].type}
            />
          )}
        </Stack>
      </Modal>
    );
  }
}
function mapStateToProps(state: any) {
  return {
    canvasModel: state.canvas.canvasModel,
    activeTabSet: state.canvas.activeTabSet,
    activePageId: state.page.activePageId,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setCanvasModel: (model: IJsonModel) => dispatch(setCanvasModel(model)),
    setIsPageUnsaved: (value: boolean) => dispatch(setIsPageUnsaved(value)),
    setAlertMessage: (message: string, messageType: string) =>
      dispatch(setAlertMessage(message, messageType)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddWidgetModal);
