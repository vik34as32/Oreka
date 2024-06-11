import "@grapecity/spread-sheets-designer-resources-en";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013darkGray.css";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
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
// import { generateUniqueId } from "../../../../utilities/GridComponentUtilities";
// import {generateUniqueId} from '../../'
import WidgetFactory, {
  DataColumnPropertyMap,
  WidgetProps,
} from "../../../canvas/services/WidgetService";
import { applyFilters } from "../utilities/WidgetUtilities";
import { initShortcutAboutCalc } from "./shortcut/action.calc";
import { initShortcutAboutCell } from "./shortcut/action.cell";
import { initShortcutAboutRowsAndColumns } from "./shortcut/action.row.column";
import { initShortcutAboutSelection } from "./shortcut/action.selection";
import { initShortcutAboutStyle } from "./shortcut/action.style";
import dayjs from "dayjs";

export interface SpreadSheetComponentProps extends WidgetProps {
  sheets?: string[];
}

//  Spread.Sheets.Designer.LicenseKey = import.meta.env.VITE_APP_SPREAD_JS_DESIGNER_KEY;
//   GC.Spread.Sheets.LicenseKey = import.meta.env.VITE_APP_SPREAD_JS_KEY;
// (ExcelIO as any).LicenseKey = import.meta.env.VITE_APP_SPREAD_JS_KEY;

type SpreadSheetDimension = { row: number; column: number };

const SpreadSheetComponent = React.forwardRef(
  (props: SpreadSheetComponentProps, ref): ReactElement => {
    const spreadSheet = useRef<GC.Spread.Sheets.Workbook | null>(null);
    const designerRef = useRef<Spread.Sheets.Designer.Designer | null>(null);
    const subscriberId = useRef<string | null>(null);
    const serviceId = useRef<string | null>(null);
    const dataSourceRef = useRef<DataSourceType | null>(null);
    const dataColMap = useRef<DataColumnPropertyMap>({});
    const propsRef = useRef<SpreadSheetComponentProps>(props);
    const spreadSheetSize = useRef<SpreadSheetDimension>({ row: 0, column: 0 });
    const firstTimeRender = useRef<boolean>(false);

    const getRowNodeId = useCallback(
      (rowData: any) => {
        if (!dataSourceRef.current) return "";
        // if (rowData.data)
        //   return generateUniqueId(
        //     dataSourceRef.current.uniqueKey,
        //     rowData.data
        //   );
        // else return generateUniqueId(dataSourceRef.current.uniqueKey, rowData);
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
      // const dataSheet = spreadSheet.current?.getSheetFromName("Data");
      // if (!dataSheet) return;
      // dataSheet.reset();
    }, [
      props.groupBy,
      props.functionCols,
      props.filterBy,
      props.orderBy,
      props.splitBy,
    ]);

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

      const subscriptionId = subscribe(props.dataSourceId, props.visibleCols);
      subscriberId.current = subscriptionId;

      return () => {
        if (subscriptionId) {
          const dataServiceInstance = getDataServiceInstance();
          dataServiceInstance.unsubscribe(props.dataSourceId, subscriptionId);
          subscriberId.current = null;
        }
      };
    }, [props.dataSourceId]);

    useEffect(() => {
      if (!subscriberId.current || !props.dataSourceId || !props.visibleCols)
        return;
      const dataServiceInstance = getDataServiceInstance();
      dataServiceInstance.updateSubscription(
        props.dataSourceId,
        subscriberId.current,
        props.visibleCols
      );
    }, [props.visibleCols, props.dataSourceId]);

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

    useImperativeHandle(
      ref,
      () => ({
        onGlobalFilterChange,
        onQuickFilterChange,
        toggleToolPanel,
        toggleFloatingFilter,
        saveWidgetState,
      }),
      []
    );

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
        // if (json.name === "Data") {
        //   delete json.data;
        // }
        sheetJson.push(JSON.stringify(json));
      }
      widgetProps.sheets = sheetJson;
      widgetService.setProps(props.id, widgetProps);
    };

    const onInitialized = (designer: Spread.Sheets.Designer.Designer) => {
      designerRef.current = designer;
      spreadSheet.current = designer.getWorkbook() as GC.Spread.Sheets.Workbook;
      spreadSheet.current.clearSheets();
      let sheet = new GC.Spread.Sheets.Worksheet("Data");
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
    // const onInitializedHidden = (designer: Spread.Sheets.Designer.Designer) => {
    //     hiddenSpreadSheet.current = designer.getWorkbook() as GC.Spread.Sheets.Workbook;

    // }
    const isSizeChanged = (row:number,col:number) => {
      return spreadSheetSize.current.row !== row || spreadSheetSize.current.column!== col;
    }
    function subscribe(dataSourceId: string, visibleCols: string[]) {
      const dataServiceInstance = getDataServiceInstance();
      const insertData = new Map<string, any>();
      const subscriptionId = dataServiceInstance.subscribe(
        dataSourceId,
        visibleCols,
        {
          async onDataRecieve(messages: any[], allowMultipleInsert) {
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
                Object.keys(data).forEach((colId) => {
                  const colDef = dataColMap.current[colId];
                  if (colDef && colDef.dataType === "datetime")
                    data = dayjs.unix(data.time).format("HH:mm:ss DD-MM-YYYY");
                });
                insertData.set(id, data);
              });
              const rawData = Array.from(insertData.values());
              const filteredData = applyFilters(
                propsRef.current.filterBy,
                rawData
              );

              const transformedData: any[] = await service.transformData(
                serviceId.current,
                propsRef.current,
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
                dataSheet.setColumnCount(
                  Math.max(totalColumns, dataSheet.getColumnCount())
                );
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
          onDataUpdate(message) {},
        }
      );
      return subscriptionId;
    }

    return (
      <Box sx={{ height: "100%" }}>
        <Designer
          styleInfo={{ width: "100%", height: "100%" }}
          designerInitialized={onInitialized}
        />
      </Box>
    );
  }
);

export default React.memo(SpreadSheetComponent);
