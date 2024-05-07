import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as FlexLayout from "flexlayout-react";
import { Box, Button, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import Chart from "./Chart";
import ProfitHistogram from "./ProfitHistogram";
import StatisticalAnalysis from "./StatisticalAnalysis";
import "../../../../assets/css/profit_loss_report_flexlayout.css";
import DropdownTreeSelect, { TreeNode } from "react-dropdown-tree-select";
import AddTicker from "../watch-list/AddTicker";
import { CloseFullscreen, KeyboardArrowDown, OpenInFull } from "@mui/icons-material";
import { Dispatch } from "@reduxjs/toolkit";
import PositionAnalysis from "./PositionAnalysis";
import TradingRange from "./TradingRange";
import WeightedStatisticalAnalysis from "./WeightedStatisticalAnalysis";
import { setAlertMessage } from "../../../../redux/action-handlers/app/AppActions";
import { connect } from "react-redux";
import LossHistogram from "./LossHistogram";
import WidgetFactory, {
  WidgetHandles,
  WidgetProps,
} from "../../../canvas/services/WidgetService";
import { v4 as uuidv4 } from "uuid";
import Loader from "../../common/loader/Loader";

const PROFIT_LOSS_API_BASE_URL = import.meta.env.VITE_PROFIT_LOSS_API_BASE_URL;

export interface ProfitLossReportProps extends WidgetProps {
  setAlertMessage: (message: string, messageType: string) => void;
  canvasModel: FlexLayout.IJsonModel;
}

const ProfitLossReport = React.forwardRef<WidgetHandles, ProfitLossReportProps>(
  (props: ProfitLossReportProps, ref): ReactElement => {
    const flexLayoutRef = useRef<FlexLayout.Layout | null>(null);
    const [loginDataList, setLoginDataList] = useState([]);
    const sideData = ["Buy", "Sell", "All"];
    const [loginValue, setLoginValue] = useState<string>("");
    const [symbolValue, setSymbolValue] = useState<string>("");
    const [sideValue, setSideValue] = useState<string>("All");
    const dropdownRef = useRef(null);
    const statisticalAnalysisData = useRef<any[]>([]);
    const weightedStatisticalAnalysisData = useRef<any[]>([]);
    const positionAnalysisData = useRef<any[]>([]);
    const tradingRangeData = useRef<Record<string, any>>({});
    const profitHistogramData = useRef<any[]>([]);
    const potentialProfitHistogramData = useRef<any[]>([]);
    const lossHistogramData = useRef<any[]>([]);
    const potentialLossHistogramData = useRef<any[]>([]);
    const widgetService = WidgetFactory.getInstance();
    const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const canvasModel = useRef<FlexLayout.IJsonModel>(
      props.canvasModel ?? {
        global: {
          tabEnableClose: false,
          rootOrientationVertical: true,
          tabSetEnableDrag: false,
          tabEnableDrag: false,
          splitterSize: 4,
        },
        layout: {
          type: "row",
          children: [
            {
              type: "row",
              weight: 100,
              children: [
                {
                  type: "tabset",
                  weight: 60,
                  children: [
                    {
                      type: "tab",
                      name: "Weighted Statistical Analysis",
                      component: "weighted-statistical-analysis",
                    },
                    {
                      type: "tab",
                      name: "Statistical Analysis",
                      component: "statistical-analysis",
                    },
                  ],
                },
                {
                  type: "tabset",
                  weight: 50,
                  children: [
                    {
                      type: "tab",
                      name: "Position Analysis",
                      component: "position-analysis",
                    },
                  ],
                },
              ],
            },
            {
              type: "row",
              weight: 100,
              children: [
                {
                  type: "row",
                  weight: 65,
                  children: [
                    {
                      type: "tabset",
                      weight: 60,
                      children: [
                        {
                          type: "tab",
                          name: "Chart",
                          component: "chart",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "row",
                  weight: 55,
                  children: [
                    {
                      type: "tabset",
                      weight: 45,
                      children: [
                        {
                          type: "tab",
                          name: "Trading Range",
                          component: "trading-range",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "row",
                  weight: 50,
                  children: [
                    {
                      type: "tabset",
                      weight: 25,
                      children: [
                        {
                          type: "tab",
                          name: "Profit histogram",
                          component: "profit-histogram",
                        },
                      ],
                    },
                    {
                      type: "tabset",
                      weight: 25,
                      children: [
                        {
                          type: "tab",
                          name: "Loss histogram",
                          component: "loss-histogram",
                        },
                      ],
                    },
                  ],
                },

                {
                  type: "row",
                  weight: 50,
                  children: [
                    {
                      type: "tabset",
                      weight: 25,
                      children: [
                        {
                          type: "tab",
                          name: "Potential Profit histogram",
                          component: "potential-profit-historgam",
                        },
                      ],
                    },
                    {
                      type: "tabset",
                      weight: 25,
                      children: [
                        {
                          type: "tab",
                          name: "Potential Loss histogram",
                          component: "potential-loss-histogram",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      }
    );

    useEffect(() => {
      if (dropdownRef.current) {
        dropdownRef.current.resetSearchState = () => {};
      }
    }, []);

    useEffect(() => {
      const getGroupData = () => {
        fetch(`${PROFIT_LOSS_API_BASE_URL}/groups`)
          .then((response) => response.json())
          .then((groupArray) => {
            const groups: string[] = Object.values(groupArray.data);
            const data: any = [];
            groups.forEach((item) => {
              const parts = item.split("\\");
              let currentLevel = data;
              parts.forEach((part) => {
                const existingItem = currentLevel.find(
                  (node) => node.label === part
                );
                if (existingItem) {
                  currentLevel = existingItem.children;
                } else {
                  const id = uuidv4();
                  const newItem = { label: part, children: [], id: id };
                  currentLevel.push(newItem);
                  currentLevel = newItem.children;
                }
              });
            });
            setLoginDataList(data);
          });
      };

      getGroupData();
    }, []);

    const factory = useCallback((node: FlexLayout.TabNode) => {
      const componentId = node.getComponent();
      if (componentId === "chart") {
        return (
          <Chart
            profitData={profitHistogramData.current}
            lossData={lossHistogramData.current}
            potentialProfitData={potentialProfitHistogramData.current}
            potentialLossData={potentialLossHistogramData.current}
          />
        );
      } else if (componentId === "profit-histogram") {
        return <ProfitHistogram histogramData={profitHistogramData.current} />;
      } else if (componentId === "potential-profit-historgam") {
        return (
          <ProfitHistogram
            histogramData={potentialProfitHistogramData.current}
          />
        );
      } else if (componentId === "loss-histogram") {
        return <LossHistogram histogramData={lossHistogramData.current} />;
      } else if (componentId === "potential-loss-histogram") {
        return (
          <LossHistogram histogramData={potentialLossHistogramData.current} />
        );
      } else if (componentId === "statistical-analysis") {
        return (
          <StatisticalAnalysis
            statisticalAnalysisData={statisticalAnalysisData.current}
            openValue={tradingRangeData.current["Open"]}
          />
        );
      } else if (componentId === "position-analysis") {
        return (
          <PositionAnalysis
            positionAnalysisData={positionAnalysisData.current}
          />
        );
      } else if (componentId === "trading-range") {
        return <TradingRange tradingRangeData={tradingRangeData.current} />;
      } else if (componentId === "weighted-statistical-analysis") {
        return (
          <WeightedStatisticalAnalysis
            weightedStatisticalAnalysisData={
              weightedStatisticalAnalysisData.current
            }
            openValue={tradingRangeData.current["Open"]}
          />
        );
      } else {
        return null;
      }
    }, []);

    const onModelChange = useCallback((model: FlexLayout.Model) => {
      const updatedModel = model.toJson();
      canvasModel.current = updatedModel;
      const widgetProps = widgetService.getProps(props.id);

      if (widgetProps) {
        widgetProps.canvasModel = canvasModel.current;
        widgetService.setProps(widgetProps.id, widgetProps);
      }
    }, []);

    const updateSelectedAttributes = (nodes, selectedNode: TreeNode) => {
      return nodes.map((node) => {
        const isSelected = selectedNode.id === node.id;
        const children = updateSelectedAttributes(node.children, selectedNode);

        return {
          ...node,
          checked: isSelected,
          children,
        };
      });
    };

    const handleOnDropdownChange = (
      currentNode: TreeNode,
      selectedNodes: TreeNode[]
    ) => {
      document.getElementsByClassName("search")[0].value = currentNode.label;
      setLoginValue(currentNode.label);
      setLoginDataList((prevLoginDataList) => {
        return updateSelectedAttributes(prevLoginDataList, currentNode);
      });
    };

    const handleTickerAdd = (ticker: string | string[]) => {
      setSymbolValue(ticker as string);
    };

    const handleGetDataButtonClick = async () => {
      // alert("helo")
      if (
        loginValue.localeCompare("") === 0 ||
        symbolValue.localeCompare("") === 0 ||
        sideValue.localeCompare("") === 0
      ) {
        props.setAlertMessage("Please Select all required values", "error");
        return;
      }
      setIsDataAvailable(false);
      setIsLoading(true);
      const response = await fetch(
        `${PROFIT_LOSS_API_BASE_URL}/getdatabyusersymbolside`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            user: loginValue,
            symbol: symbolValue,
            side: sideValue,
          }),
        }
      );
      if (response.status === 200) {
        const responseData = await response.json();
        profitHistogramData.current = responseData.data.BinRange?.Profit ?? [];
        potentialProfitHistogramData.current =
          responseData.data.BinRange?.PP ?? [];
        lossHistogramData.current = responseData.data.BinRange?.Loss ?? [];
        potentialLossHistogramData.current =
          responseData.data.BinRange?.PL ?? [];
        positionAnalysisData.current =
          responseData.data?.positionAnalysis ?? [];
        tradingRangeData.current = responseData.data?.OHLC ?? {};
        statisticalAnalysisData.current =
          responseData.data.baseEffect?.mean ?? [];
        weightedStatisticalAnalysisData.current =
          responseData.data.baseEffect["weighted mean"] ?? [];
        setIsLoading(false);
        setIsDataAvailable(true);
      }
    };

    const onRenderTabSet = (
      tabSetNode: FlexLayout.TabSetNode | FlexLayout.BorderNode,
      values: FlexLayout.ITabSetRenderValues
    ) => {
      values.buttons.push(
        <Tooltip
          title={
            <span style={{ whiteSpace: "pre" }}>
              {tabSetNode.isMaximized() ? "Minimize" : "Maximize"} Shift + M
            </span>
          }
        >
          <IconButton
            size="small"
            sx={{ p: 0 }}
            onClick={(e) => {
              tabSetNode
                .getModel()
                .doAction(
                  FlexLayout.Actions.maximizeToggle(tabSetNode.getId())
                );
            }}
          >
            {tabSetNode.isMaximized() ? (
              <CloseFullscreen htmlColor="#6A7187" fontSize="small" />
            ) : (
              <OpenInFull htmlColor="#6A7187" fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      );
    };

    const onAction = (action: FlexLayout.Action) => {
      if (action.type === "FlexLayout_RenameTab") {
        return undefined;
      }
      return action;
    }

    return (
      <>
        <Box
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          sx={{ backgroundColor: "#13171F" }}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            height={"40px"}
            gap={1}
            paddingTop={0.5}
            paddingBottom={0.5}
            paddingLeft={1.5}
          >
            <DropdownTreeSelect
              data={loginDataList}
              mode="radioSelect"
              className="bootstrap-demo"
              texts={{ placeholder: "Select Login" }}
              onChange={handleOnDropdownChange}
              ref={dropdownRef}
            />
            <AddTicker
              onTickerAdd={handleTickerAdd}
              subscribedTickers={symbolValue}
              isWatchListTicker={false}
            />
            <TextField
              variant="standard"
              margin="none"
              size="small"
              label={sideValue === "" ? "Select side" : ""}
              select
              value={sideValue}
              sx={{
                background: "none",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#2B3349",
                borderRadius: "4px",
                width: "175px",
                paddingLeft: "8px",
                paddingTop: "4px",
                fontSize: "14px",
                fontFamily: "Inter",
                marginLeft: "2px",
                marginTop: "1.5px",
                height: "30px",
              }}
              InputLabelProps={{
                shrink: false,
                style: {
                  top: "-13px",
                  color: "grey",
                  paddingLeft: "8px",
                  fontSize: "14px",
                  fontFamily: "Inter",
                },
              }}
              SelectProps={{
                MenuProps: {
                  sx: {
                    width: "100%",
                  },
                },
                IconComponent: () => (
                  <IconButton sx={{ p: 0.2 }}>
                    <KeyboardArrowDown />
                  </IconButton>
                ),
              }}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setSideValue(event.target.value);
              }}
              InputProps={{
                disableUnderline: true,
                style: {
                  direction: "ltr",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: "-4px",
                },
              }}
              inputProps={{
                placeholder: "Add side",
                style: { height: "35px", padding: 0 },
              }}
            >
              {sideData.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              onClick={handleGetDataButtonClick}
              sx={{
                textTransform: "capitalize",
                paddingLeft: 0.5,
                paddingRight: 0.5,
                paddingTop: 0,
                paddingBottom: 0,
                marginLeft: 0.7,
                marginTop: "1.5px",
                width: 100,
                height: 30,
              }}
            >
              Get Data
            </Button>
          </Box>
          {isLoading ? (
            <Loader size={50} />
          ) : (
            isDataAvailable && (
              <FlexLayout.Layout
                ref={flexLayoutRef}
                model={FlexLayout.Model.fromJson(canvasModel.current)}
                onModelChange={onModelChange}
                onRenderTabSet={onRenderTabSet}
                onAction={onAction}
                factory={factory}
                icons={{
                  maximize: null,
                  restore: null,
                  popout: null,
                }}
              />
            )
          )}
        </Box>
      </>
    );
  }
);

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setAlertMessage: (message: string, messageType: string) =>
      dispatch(setAlertMessage(message, messageType)),
  };
}

export default React.memo(connect(null, mapDispatchToProps)(ProfitLossReport));
