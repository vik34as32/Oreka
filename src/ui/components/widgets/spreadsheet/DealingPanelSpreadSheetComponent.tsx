import "@grapecity/spread-sheets-designer-resources-en";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013darkGray.css";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./spread-sheet-dark.css";

import * as ExcelIO from "@grapecity/spread-excelio";
import GC from "@grapecity/spread-sheets";
import { Spread } from "@grapecity/spread-sheets-designer";
import { Designer } from "@grapecity/spread-sheets-designer-react";
import { Box } from "@mui/material";
import getDataServiceInstance from "../../../../backend/data-subcription/DataService";
import DataTransformServiceFactory from "../../../../backend/worker/DataTransformService";
import {
  DataColumn,
  DataColumnGroup,
  DataSourceType,
  dataSources,
} from "../../../../redux/reducers/canvas/CanvasReducer";
import { generateUniqueId } from "../../../../utilities/GridComponentUtilities";
import WidgetFactory, {
  DataColumnPropertyMap,
  WidgetProps,
  WidgetPropsType,
} from "../../../canvas/services/WidgetService";
import { applyFilters } from "../utilities/WidgetUtilities";
import { initShortcutAboutRowsAndColumns } from "./shortcut/action.row.column";
import { initShortcutAboutSelection } from "./shortcut/action.selection";
import { initShortcutAboutCalc } from "./shortcut/action.calc";
import { initShortcutAboutStyle } from "./shortcut/action.style";
import { initShortcutAboutCell } from "./shortcut/action.cell";
import AddDuration from "../dealing-panel/AddDuration";
import dealingPanelServiceInstance from "../../../../backend/data-subcription/DealingPanelService";
import dayjs, { Dayjs } from "dayjs";
import { Dispatch } from "@reduxjs/toolkit";
import { setAlertMessage } from "../../../../redux/action-handlers/app/AppActions";
import { connect } from "react-redux";

export interface DealingPanelSpreadSheetComponentProps extends WidgetProps {
  sheets?: string[];
  startTime?: number;
  endTime?: number;
  setAlertMessage: (message: string, messageType: string) => void;
}

//  Spread.Sheets.Designer.LicenseKey =import.meta.env.VITE_APP_SPREAD_JS_DESIGNER_KEY;
//  GC.Spread.Sheets.LicenseKey = import.meta.env.VITE_APP_SPREAD_JS_KEY;
//  (ExcelIO as any).LicenseKey = import.meta.env.VITE_APP_SPREAD_JS_KEY;

type SpreadSheetDimension = { row: number; column: number };

const DealingPanelSpreadSheetComponent = React.forwardRef(
  (props: DealingPanelSpreadSheetComponentProps, ref): ReactElement => {
    const spreadSheet = useRef<GC.Spread.Sheets.Workbook | null>(null);
    const designerRef = useRef<Spread.Sheets.Designer.Designer | null>(null);
    const subscriberId = useRef<string | null>(null);
    const dealingPanelDataService = useRef<any>(null);
    const serviceId = useRef<string | null>(null);
    const dataSourceRef = useRef<DataSourceType | null>(null);
    const dataColMap = useRef<DataColumnPropertyMap>({});
    const propsRef = useRef<DealingPanelSpreadSheetComponentProps>(props);
    const currentDate = new Date();
    const spreadSheetSize = useRef<SpreadSheetDimension>({ row: 0, column: 0 });
    const firstTimeRender = useRef<boolean>(false);


    const [startTime, setStartTime] = useState<number>(
      props.startTime
        ? props.startTime
        : Math.floor(currentDate.setHours(currentDate.getHours() - 1) / 1000)
    );
    const [endTime, setEndTime] = useState<number>(
      props.endTime ? props.endTime : Math.floor(Date.now() / 1000)
    );
    const startTimeRef = useRef<number>(startTime);
    const endTimeRef = useRef<number>(endTime);
    
    const [showNowText, setShowNowText] = useState<boolean>(props.endTime ? false : true);
    const widgetService = WidgetFactory.getInstance();

    const getRowNodeId = useCallback(
      (rowData: any) => {
        if (!dataSourceRef.current) return "";
        if (rowData.data)
          return generateUniqueId(
            dataSourceRef.current.uniqueKey,
            rowData.data
          );
        else return generateUniqueId(dataSourceRef.current.uniqueKey, rowData);
      },
      [props.dataSourceId]
    );
   


    useEffect(() => {
      if (!spreadSheet.current) return;
      const commandManager = spreadSheet.current?.commandManager();
      initShortcutAboutRowsAndColumns(commandManager);
      initShortcutAboutSelection(commandManager);
      initShortcutAboutCalc(commandManager);
      initShortcutAboutCell(commandManager);
      initShortcutAboutStyle(commandManager);
    }, []);

    useEffect(() => {
      if (!props.dataSourceId) return;
      const service = DataTransformServiceFactory.getInstance();
      serviceId.current = service.register(props.dataSourceId);
      return () => {
        if (serviceId.current) {
          service.unregister(serviceId.current);
          serviceId.current = null;
        }
      };
    }, [props.dataSourceId]);

    useEffect(() => {
      propsRef.current = props; // to be used inside callback functions due to stale state issue
    }, [props]);

    useEffect(() => {
      if (!props.dataSourceId || !spreadSheet.current || subscriberId.current)
        return;

      dealingPanelDataService.current = dealingPanelServiceInstance();
      subscribe();

      return () => {
        if (subscriberId.current) {
          dealingPanelDataService.current.unsubscribe(subscriberId.current);
        }
      };
    }, [props.dataSourceId]);

    useEffect(() => {
      if (!props.dataSourceId) return;
      //debugger
      const ds = dataSources.find(
        (dataSource) => dataSource.id === props.dataSourceId
      );
      if (ds) {
        dataSourceRef.current = ds;
        ds.columns.forEach((column) => {
          if ((column as DataColumnGroup).groupingColumns) {
            (column as DataColumnGroup).groupingColumns.forEach((groupCol) => {
              dataColMap.current[groupCol.field] = groupCol;
            });
          } else {
            dataColMap.current[(column as DataColumn).field] =
              column as DataColumn;
          }
        });
      }
    }, [props.dataSourceId]);

    useEffect(() => {
      if (!spreadSheet.current || !props.sheets || props.sheets.length === 0)
        return;

      spreadSheet.current.suspendPaint();
      spreadSheet.current.suspendEvent();
      spreadSheet.current.suspendCalcService();

      props.sheets.forEach((sheetJson) => {
        if (!spreadSheet.current) return;
        let sheetIndex = 1;
        const sheet = JSON.parse(sheetJson);
        if (sheet.name === "Data") {
          const currentSheet = spreadSheet.current.getSheetFromName(sheet.name);
          sheet.isSelected = true;
          currentSheet.fromJSON(sheet);
        } else {
          const newSheet = new GC.Spread.Sheets.Worksheet(sheet.name);
          sheet.isSelected = false;
          spreadSheet.current.addSheet(sheetIndex++, newSheet);
          newSheet.fromJSON(sheet);
        }
      });
      firstTimeRender.current = true;

      spreadSheet.current.resumeCalcService();
      spreadSheet.current.resumeEvent();
      spreadSheet.current.resumePaint();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        onGlobalFilterChange,
        onQuickFilterChange,
        toggleToolPanel,
        toggleFloatingFilter,
        saveWidgetState,
        saveTimeData
      }),
      []
    );
    useEffect(() => {
      fetchDealingData();
    },[props.groupBy,props.functionCols,props.splitBy,props.orderBy,props.filterBy]);

    const onGlobalFilterChange = () => {
      console.debug("onGlobalFilterChange not implemented for chart widget");
    };
    const onQuickFilterChange = () => {
      console.debug("onQuickFilterChange not implemented for chart widget");
    };
    const toggleToolPanel = () => {
      console.debug("toggleToolPanel not applicable in spreadsheet widget");
    };
    const toggleFloatingFilter = () => {
      console.debug("toggleFloatingFilter not implemented for chart widget");
    };
    const saveWidgetState = async () => {
      if (!spreadSheet.current) return;
      const widgetService = WidgetFactory.getInstance();
      const widgetProps = widgetService.getProps(props.id);
      if (!widgetProps) return;

      const totalSheets = spreadSheet.current.getSheetCount();
      const sheetJson: string[] = [];
      for (let i = 0; i < totalSheets; i++) {
        const sheet = spreadSheet.current.getSheet(i);
        const json: any = sheet.toJSON();
        if (i === 0) {
          delete json.data;
        }
        sheetJson.push(JSON.stringify(json));
      }
      widgetProps.sheets = sheetJson;
      widgetProps.startTime = startTime;
      widgetProps.endTime = endTime;
      widgetService.setProps(props.id, widgetProps);
    };

    const saveTimeData = (widgetConfigs: WidgetPropsType) => {
      widgetConfigs.startTime = startTimeRef.current;
      widgetConfigs.endTime = endTimeRef.current;
      widgetService.setProps(widgetConfigs.id, widgetConfigs);
    }

    const onInitialized = (designer: Spread.Sheets.Designer.Designer) => {
      designerRef.current = designer;
      spreadSheet.current = designer.getWorkbook() as GC.Spread.Sheets.Workbook;
      spreadSheet.current.removeSheet(0);
      let sheet = new GC.Spread.Sheets.Worksheet("Data");
      spreadSheet.current.bind(
        GC.Spread.Sheets.Events.SheetMoving,
        function (sender: any, args: any) {
          if (args.oldIndex === 0 || args.newIndex === 0) {
            args.cancel = true;
          }
        }
      );
      spreadSheet.current.bind(
        GC.Spread.Sheets.Events.SheetNameChanging,
        function (sender: any, args: any) {
          if (args.oldValue === "Data") {
            args.cancel = true;
          }
        }
      );
      spreadSheet.current.addSheet(0, sheet);
      bindImportSheetEvents();
    };
    const bindImportSheetEvents = () => {
      if (!designerRef.current || !spreadSheet.current) return;
      let importedSheets: { [id: string]: any } = {};
      let currentSheets: { [id: string]: any } = {};

      designerRef.current.bind(
        Spread.Sheets.Designer.Events.FileLoading,
        function (type: any, message: any) {
          if (
            message.fileType === Spread.Sheets.Designer.FileType.Excel &&
            spreadSheet.current
          ) {
            const sheetCount = spreadSheet.current.getSheetCount();
            for (let i = 0; i < sheetCount; i++) {
              const json: any = spreadSheet.current.getSheet(i).toJSON();
              currentSheets[json.name] = json;
            }
            Object.keys(message.data.sheets).forEach((sheetName: string) => {
              importedSheets[sheetName] = message.data.sheets[sheetName];
            });
          }
        }
      );
      designerRef.current.bind(
        Spread.Sheets.Designer.Events.FileLoaded,
        function (type: any, data: any) {
          if (!spreadSheet.current) return;

          spreadSheet.current.suspendPaint();
          spreadSheet.current.suspendEvent();
          spreadSheet.current.suspendCalcService();

          const currentSheetCount = spreadSheet.current.getSheetCount();
          for (let i = 0; i < currentSheetCount; i++)
            spreadSheet.current.removeSheet(0);

          Object.keys(currentSheets).forEach((sheetName, index) => {
            const newSheet = new GC.Spread.Sheets.Worksheet(sheetName);
            spreadSheet.current?.addSheet(index, newSheet);
            newSheet.fromJSON(currentSheets[sheetName]);
          });
          const prevSheetCount = Object.keys(currentSheets).length;
          Object.keys(importedSheets).forEach((sheetName, index) => {
            let finalSheetName = sheetName;
            while (currentSheets[finalSheetName]) finalSheetName += "-copy";

            const newSheet = new GC.Spread.Sheets.Worksheet(finalSheetName);
            spreadSheet.current?.addSheet(index + prevSheetCount, newSheet);
            importedSheets[sheetName].isSelected = false;
            importedSheets[sheetName].name = finalSheetName;
            newSheet.fromJSON(importedSheets[sheetName]);
          });

          importedSheets = {};
          currentSheets = {};

          spreadSheet.current.resumeCalcService();
          spreadSheet.current.resumeEvent();
          spreadSheet.current.resumePaint();
        }
      );
    };
    const getExtraDataArray = (dataSheet: GC.Spread.Sheets.Worksheet) => {
      if (
        spreadSheetSize.current.row === 0 &&
        spreadSheetSize.current.column === 0
      ) {
        return { dataArrayRight: [], dataArrayBottom: [], formulaArrayRight:[], formulaArrayBottom:[] };
      }
      const dataArrayRight = dataSheet.getArray(
        0,
        spreadSheetSize.current.column,
        dataSheet.getRowCount(),
        dataSheet.getColumnCount() - spreadSheetSize.current.column
      );
      const formulaArrayRight = dataSheet.getArray(
        0,
        spreadSheetSize.current.column,
        dataSheet.getRowCount(),
        dataSheet.getColumnCount() - spreadSheetSize.current.column,
        true
      );
      const dataArrayBottom = dataSheet.getArray(
        spreadSheetSize.current.row,
        0,
        dataSheet.getRowCount() - spreadSheetSize.current.row,
        spreadSheetSize.current.column
      );
      const formulaArrayBottom = dataSheet.getArray(
        spreadSheetSize.current.row,
        0,
        dataSheet.getRowCount() - spreadSheetSize.current.row,
        spreadSheetSize.current.column,
        true
      );
      return { dataArrayRight, dataArrayBottom, formulaArrayRight, formulaArrayBottom };
    };
    const setExtraDataArray = (dataArrayBottom:any[],dataArrayRight:any[],formulaArrayBottom:any[],formulaArrayRight:any[],dataSheet: GC.Spread.Sheets.Worksheet) => {
      dataSheet.setArray(
        0,
        spreadSheetSize.current.column,
        dataArrayRight
      );
      dataSheet.setArray(
        spreadSheetSize.current.row,
        0,
        dataArrayBottom
      );
      dataSheet.setArray(
        0,
        spreadSheetSize.current.column,
        formulaArrayRight,
        true
      );
      dataSheet.setArray(
        spreadSheetSize.current.row,
        0,
        formulaArrayBottom,
        true
      );
    }

    const isSizeChanged = (row:number,col:number) => {
      return spreadSheetSize.current.row !== row || spreadSheetSize.current.column!== col;
    }

    function subscribe() {
      subscriberId.current =
        dealingPanelDataService.current.getNewSubscriptionId();
      const insertData = new Map<string, any>();
      dealingPanelDataService.current.subscribe(
        subscriberId.current,
        {
          onDataRecieve: async (
            messages: any[],
            allowMultipleInsert = false
          ) => {
            if (
              !spreadSheet.current ||
              messages.length === 0 ||
              !serviceId.current
            )
              return;
            if (window.Worker) {
              const service = DataTransformServiceFactory.getInstance();
              messages.forEach((data) => {
                const id = getRowNodeId(data);
              
                if(data.time) data.time = dayjs.unix(data.time).format("HH:mm:ss DD-MM-YYYY");
                insertData.set(id, data);
              });
              const rawData = Array.from(insertData.values());
              const filteredData = applyFilters(
                propsRef.current.filterBy,
                rawData
              );
              const {setAlertMessage,...propsToPass} = propsRef.current;
              const transformedData: any[] = await service.transformData(
                serviceId.current,
                propsToPass,
                filteredData
              );

              let dataSheet = spreadSheet.current.getSheetFromName("Data");

              if (!dataSheet) {
                dataSheet = new GC.Spread.Sheets.Worksheet("Data");
                spreadSheet.current.addSheet(0, dataSheet);
              }
              if (transformedData.length > 0) {
                const widthData = await service.computeSplitHeaderCols(
                  serviceId.current,
                  transformedData[0]
                );

                dataSheet.suspendPaint();
                dataSheet.suspendEvent();
                dataSheet.suspendCalcService();

                const totalLevels = Object.keys(widthData).length;
                let totalColumns = 0;
                widthData[0].forEach((x) => (totalColumns += x[1]));

                const headerCols: string[] = [];
                widthData[totalLevels - 1].forEach((x) => {
                  headerCols.push(x[0]);
                });
                const rows = await service.getRowData(
                  serviceId.current,
                  transformedData,
                  dataColMap.current,
                  headerCols
                );
                let dataRight:any[] = [];
                let dataBottom:any[] = [];
                let formulaRight:any[] = [];
                let formulaBottom:any[] = [];

                if(isSizeChanged(rows.length + propsRef.current.splitBy.length + 1, totalColumns)) {
                  const {dataArrayBottom,dataArrayRight,formulaArrayRight, formulaArrayBottom} = getExtraDataArray(dataSheet);
                  dataRight = dataArrayRight;
                  dataBottom = dataArrayBottom;
                  formulaRight = formulaArrayRight;
                  formulaBottom = formulaArrayBottom;

                  if(!firstTimeRender.current) {
                    dataSheet.reset();
                  }
                }
                firstTimeRender.current = false;

                spreadSheetSize.current = {
                  row: rows.length + propsRef.current.splitBy.length + 1,
                  column: totalColumns,
                };

                dataSheet.addSpan(
                  0,
                  0,
                  propsRef.current.splitBy.length,
                  propsRef.current.groupBy.length
                );
                dataSheet.setColumnCount(Math.max(totalColumns, dataSheet.getColumnCount()));
                dataSheet.setRowCount(
                  Math.max(
                    dataSheet.getRowCount(),
                    rows.length + propsRef.current.splitBy.length + 1
                  )
                );
                dataSheet.setArray(
                  propsRef.current.splitBy.length + 1,
                  0,
                  rows
                );
                setExtraDataArray(dataBottom,dataRight,formulaBottom,formulaRight,dataSheet);

                Object.keys(widthData).forEach((level, index) => {
                  let lastColEnd =
                    index + 1 === totalLevels
                      ? 0
                      : propsRef.current.groupBy.length;
                  widthData[level].forEach(([value, span]) => {
                    if (index + 1 === totalLevels) {
                      dataSheet.setValue(
                        index,
                        lastColEnd,
                        dataColMap.current[value].headerName
                      );
                    } else {
                      dataSheet.addSpan(index, lastColEnd, 1, span);
                      dataSheet.setValue(index, lastColEnd, value);
                    }
                    dataSheet.setColumnWidth(lastColEnd, 150);
                    lastColEnd += span;
                  });
                });
              } else {
                dataSheet.reset();
              }
              dataSheet.resumeCalcService();
              dataSheet.resumeEvent();
              dataSheet.resumePaint();
            }
          },
        },
        startTime,
        endTime
      );
    }

    useEffect(() => {
      saveStartTime(startTime);
    }, [startTime]);

    useEffect(() => {
      saveEndTime(endTime);
    }, [endTime]);

    const saveStartTime = (dateTime: number) => {
      if (dateTime) {
        const widgetProps = widgetService.getProps(props.id);

        if (!widgetProps) return;
        widgetProps.startTime = dateTime;
        widgetService.setProps(widgetProps.id, widgetProps);
      }
    };

    const handleStartDateTimeChange = (dateTime: number) => {
      if (dateTime) {
        if (dateTime > endTime) {
          props.setAlertMessage(
            "Please make sure the start time is earlier than the end time",
            "error"
          );
          return;
        }
        setStartTime(dateTime);
        startTimeRef.current = dateTime;
      }
    };

    const saveEndTime = (dateTime: number) => {
      if (dateTime) {
        const widgetProps = widgetService.getProps(props.id);

        if (!widgetProps) return;
        widgetProps.endTime = dateTime;
        widgetService.setProps(widgetProps.id, widgetProps);
      }
    };

    const handleEndDateTimeChange = (dateTime: number) => {
      if (dateTime) {
        if (startTime > dateTime) {
          props.setAlertMessage("Please make sure the start time is earlier than the end time", "error");
          return;
        }
        setEndTime(dateTime);
        endTimeRef.current = dateTime;
      }
    };

    const toggleNowText = (isNowVisible: boolean) => {
      setShowNowText(isNowVisible);
    };

    const fetchDealingData = () => {
      if (subscriberId.current) {
        if (startTime > endTime) {
          props.setAlertMessage("Please make sure the start time is earlier than the end time", "error");
          return;
        }
        dealingPanelDataService.current.unsubscribe(subscriberId.current);
        subscriberId.current = null;
        spreadSheet.current?.getActiveSheet().clear;
        
      }
      subscribe();
    };

    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        sx={{ backgroundColor: "#13171F" }}
      >
        <AddDuration
          startDateTime={startTime * 1000}
          endDateTime={endTime * 1000}
          showNowText={showNowText}
          handleStartDateTimeChange={handleStartDateTimeChange}
          handleEndDateTimeChange={handleEndDateTimeChange}
          toggleNowText={toggleNowText}
          fetchDealingData={fetchDealingData}
        />

        <Box sx={{ height: "95%" }}>
          <Designer
            styleInfo={{ width: "100%", height: "100%" }}
            designerInitialized={onInitialized}
          />
        </Box>
      </Box>
    );
  }
);

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setAlertMessage: (message: string, messageType: string) => dispatch(setAlertMessage(message, messageType))
  }
}

export default React.memo(connect(null, mapDispatchToProps, null, { forwardRef: true })(DealingPanelSpreadSheetComponent));
