import { Box } from "@mui/material";
import { CellClickedEvent, CellValueChangedEvent, ColDef, ColGroupDef, ColumnApi, ColumnVisibleEvent, FirstDataRenderedEvent, GetMainMenuItemsParams, GridApi, GridReadyEvent, MenuItemDef, RowClassParams, RowClickedEvent, RowNode, ToolPanelVisibleChangedEvent } from "ag-grid-community";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-enterprise';
import { AgGridReact } from "ag-grid-react";
import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import dealingPanelServiceInstance from "../../../backend/data-subcription/DealingPanelService";
import  LoginPanelServicesInstance  from '../../../backend/data-subcription/LoginPannelServices'
import { setAlertMessage, updateCellValue } from "../../../redux/action-handlers/app/AppActions";
import { DataColumn, DataColumnGroup, DataSourceType, dataSources } from "../../../redux/reducers/canvas/CanvasReducer";
import {
  applyCellStyle,
  applyGridConfigs,
  compareColSets,
  generateGridColumnDefsFromMetaData,
  generateUniqueId,
  getFilterDataTypeForGrid,
  getFilterTypeForGrid,
  getGridConfigs,
  isNumeric
} from "../../../utilities/GridComponentUtilities";
import { DealingPanelTypeCellRenderer } from "../../../utilities/cell-renderer/DealingPanelCellRenderer";
import { TimeCellRenderer } from "../../../utilities/cell-renderer/TimeCellRenderer";
import WidgetFactory, { DataColumnPropertyMap, WidgetHandles, WidgetProps } from "../../canvas/services/WidgetService";
import { Filter, WidgetFilter } from "../custom-widget/WidgetConfig";
import { Template } from "./ColorTempleteModal";
import { Theme } from "./ThemeModal/ThemeTemplateModal";
import AddDuration from "./dealing-panel/AddDuration";

export type UniqueKeyColType = {
  colId: string;
  value: any;
}

type GridParams = {
  gridApi: GridApi | null;
  columnApi: ColumnApi | null;
};

export interface LoginPanelPropsType extends WidgetProps {
  startTime?: number;
  endTime?: number;
}

export interface GridProps extends LoginPanelPropsType {
  addToFilter?: (colId: string, value: string) => void;
  updateCellValue: (tableName: string, uniqueKey: UniqueKeyColType[], updateColId: string, updateValue: any) => void;
  isColorOn: boolean
  selectedTheme?: Theme;
  templates: Template[];
  setAlertMessage: (message: string, messageType: string) => void;
}
const LoginDevicePanelComponent = React.forwardRef<WidgetHandles, GridProps>((props: GridProps, ref): ReactElement => {
  const subscriptionId = useRef<string | null>(null);
  // const LoginPanelServices = useRef<any>(null);
  const LoginPanelServices  =useRef<any>(null);
  const filters = useRef<Filter[]>([]);
  let activeColSet = new Set<string>();
  const dataSourceRef = useRef<DataSourceType | null>(null);
  const dataColMap = useRef<DataColumnPropertyMap>({});
  let previousClickedTime : number = 0;

  const [gridParams, setGridParams] = useState<GridParams>({
    gridApi: null,
    columnApi: null
  })
   


  const [floatingFilter, setFloatingFilter] = useState<boolean>(false);

  const currentDate = new Date();

  const [startTime, setStartTime] = useState<number>(props.startTime ? props.startTime :
    Math.floor(currentDate.setHours(currentDate.getHours() - 1) / 1000)
  );
  const [endTime, setEndTime] = useState<number>(props.endTime ? props.endTime : Math.floor(Date.now() / 1000));
  const [showNowText, setShowNowText] = useState<boolean>(props.endTime ? false : true);
  const widgetService = WidgetFactory.getInstance();
  let dealingPanelCols: ColDef[] = [];

  // useEffect(() => {
  //   // unsubscribing ...
  //   if (props.endTime) {
  //     setShowNowText(false);
  //   }
  //   LoginPanelServices.current = dealingPanelServiceInstance();
  //   return () => {
  //     if (subscriptionId.current) LoginPanelServices.current.unsubscribe(subscriptionId.current);

  //   };
  // }, []);


  
   useEffect(() => {
      //unsubscribing ...
     if (props.endTime) {
       setShowNowText(false);
     }
     LoginPanelServices.current = LoginPanelServicesInstance();
     return () => {
       if (subscriptionId.current) LoginPanelServices.current.unsubscribe(subscriptionId.current);

     };
   }, []);


  useEffect(() => {
    if (!props.dataSourceId || !gridParams.gridApi) return;

    if (props.visibleCols.length === 0) {
      gridParams.gridApi.setColumnDefs([]);
    } else {
      //debugger
      const ds = dataSources.find(dataSource => dataSource.id === props.dataSourceId);
      if (ds) {
        dataSourceRef.current = ds;
        ds.columns.forEach(column => {
          if ((column as DataColumnGroup).groupingColumns) {
            (column as DataColumnGroup).groupingColumns.forEach(groupCol => {
              dataColMap.current[groupCol.field] = groupCol;
            })
          } else {
            dataColMap.current[(column as DataColumn).field] = (column as DataColumn);
          }
        })
        
        const coldef: ColDef[] = generateGridColumnDefsFromMetaData(dataSourceRef.current.columns);
        
        if (props.dataSourceId === "dealing-panel-interval") {
          dealingPanelCols = coldef;
          applyCellRenderersForDealingPanel(coldef);
        }
        gridParams.gridApi.setColumnDefs(coldef);
      }
    }
  }, [props.dataSourceId, gridParams.gridApi, props.visibleCols.length === 0])

  function applyCellRenderersForDealingPanel(colDefs: ColDef[]) {
    colDefs.forEach((colDef) => {
      switch (colDef.field) {
        case "dealingtype":
          colDef.cellRenderer = DealingPanelTypeCellRenderer;
          colDef.cellRendererParams = {
            selectedTheme: props.selectedTheme
          };
          return;
        case "time":
          colDef.cellRenderer = TimeCellRenderer;
          return;
      }
    });
  }

  useEffect(() => {
    if (!gridParams.gridApi) return;
    const colDefs: (ColDef<any> | ColGroupDef<any>)[] | undefined = gridParams.gridApi.getColumnDefs();
    if (!colDefs) return;
    applyCellRenderersForDealingPanel(colDefs);
    gridParams.gridApi.setColumnDefs(colDefs);
  }, [props.selectedTheme, gridParams])



  useEffect(() => {
    if (!props.visibleCols || !props.dataSourceId || props.visibleCols.length === 0 || !gridParams.gridApi) return;
    // if(subscriptionId.current) dataService.current.updateSubscription(props.dataSourceRef.current.id,subscriptionId.current,props.visibleCols);
    if (!subscriptionId.current) subscribe();

  }, [props.dataSourceId, props.visibleCols, gridParams.gridApi])

  useEffect(() => {
    if (!props.dataSourceId || !gridParams.columnApi || !props.visibleCols || props.visibleCols.length === 0) return;

    const colStates = gridParams.columnApi.getColumnState();
    const updatedColStates = applyGridConfigs(colStates, props.visibleCols, props.groupBy, props.splitBy, props.functionCols, props.orderBy, props.columnState);
    gridParams.columnApi.applyColumnState({
      state: updatedColStates,
      applyOrder: true
    });
    // autoSizeAllColumns();

  }, [props.visibleCols, gridParams.columnApi, props.dataSourceId, props.columnState, props.orderBy])

  useEffect(() => {
    if (!gridParams.gridApi || !props.columnState) return;
    const filterModel = Object.keys(props.columnState).reduce((prev: { [colId: string]: WidgetFilter | undefined }, curr) => {
      if (props.columnState && props.columnState[curr].filter) {
        prev[curr] = props.columnState[curr].filter;
      }
      return prev;
    }, {});
    gridParams.gridApi.setFilterModel(filterModel);
  }, [gridParams.gridApi, props.columnState])

  useEffect(() => {
    if (!gridParams.columnApi) return;
    gridParams.columnApi.setPivotMode(props.pivot);
  }, [props.pivot, gridParams.columnApi])
  useEffect(() => {
    if (gridParams.columnApi && gridParams.columnApi && props.onWidgetReady) props.onWidgetReady();
  }, [gridParams])

  useEffect(() => {
    if (gridParams.gridApi) {
      if (props.splitBy.length > 0) gridParams.gridApi.setGroupHeaderHeight(32);
      else gridParams.gridApi.setGroupHeaderHeight(0);
    }
  }, [props.splitBy.length === 0, gridParams.gridApi])

  useEffect(() => {
    if (props.filterBy.length > 0 && gridParams.gridApi && dataColMap.current) {
      const filterModel: { [colId: string]: any } = {};
      props.filterBy.forEach(filter => {
        filterModel[filter.colId] = {
          filter: filter.value,
          type: getFilterTypeForGrid(filter.filterType),
          filterType: getFilterDataTypeForGrid(dataColMap.current[filter.colId].dataType)
        }
      })
      gridParams.gridApi.setFilterModel(filterModel);
    }
  }, [props.filterBy, gridParams.gridApi])

  useImperativeHandle(ref, () => ({
    onGlobalFilterChange,
    onQuickFilterChange,
    toggleToolPanel,
    toggleFloatingFilter,
    saveWidgetState
  }))

  const onGlobalFilterChange = (globalFilters: Filter[]) => {
    if (!gridParams.gridApi) return;
    filters.current = globalFilters;
    gridParams.gridApi.onFilterChanged();
  }
  const onQuickFilterChange = (filterValue: string) => {
    if (!gridParams.gridApi) return;
    gridParams.gridApi.setQuickFilter(filterValue);
  }
  const toggleToolPanel = () => {
    if (!gridParams.gridApi) return;
    gridParams.gridApi.setSideBarVisible(!gridParams.gridApi.isSideBarVisible());
  }
  const toggleFloatingFilter = () => {
    if (!gridParams.gridApi) return;
    gridParams.gridApi.setFloatingFiltersHeight(!floatingFilter ? 32 : 0);
    setFloatingFilter(!floatingFilter);
  }
  const saveWidgetState = async () => {
    if (!gridParams.columnApi || !gridParams.gridApi) return;
    const widgetServiceInstance = WidgetFactory.getInstance();
    const widgetProps = widgetServiceInstance.getProps(props.id);
    if (!widgetProps) return;

    const colStates = gridParams.columnApi.getColumnState();
    const filterModel = gridParams.gridApi.getFilterModel();
    const newWidgetProps = getGridConfigs(colStates, filterModel, widgetProps);
    widgetServiceInstance.setProps(props.id, newWidgetProps);
  };

  const getRowNodeId = useCallback(
    (rowData: any) => {
      if (!dataSourceRef.current) return "";
      if (rowData.data) return generateUniqueId(dataSourceRef.current.uniqueKey, rowData.data);
      else return generateUniqueId(dataSourceRef.current.uniqueKey, rowData);
    },
    [props.dataSourceId]
  );

  const subscribe = () => {
    debugger;
    const prevInsertData = new Map<string, any>();
    const newInsertData = new Map<string, any>();
    subscriptionId.current = LoginPanelServices.current.getNewSubscriptionId();

    LoginPanelServices.current.subscribe(subscriptionId.current, {
      onDataRecieve: (message: any[], allowMultipleInsert = false) => {
        if (allowMultipleInsert) {
          gridParams.gridApi?.applyTransactionAsync({
            add: message
          })
        } else {
          message.forEach(data => {
            const id = getRowNodeId(data);
            if (prevInsertData.has(id)) prevInsertData.set(id, data);
            else newInsertData.set(id, data);
          })
          const insertData = Array.from(newInsertData.values());
          const updateData = Array.from(prevInsertData.values());

          newInsertData.forEach((value, key) => prevInsertData.set(key, value));
          newInsertData.clear();

          gridParams.gridApi?.applyTransactionAsync({
            add: insertData,
            update: updateData
          }, () => {

          });
        }

      }
    }, startTime, endTime);

  }

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      const updatedGridParams = { ...gridParams };
      updatedGridParams.gridApi = params.api;
      updatedGridParams.columnApi = params.columnApi;
      updatedGridParams.gridApi.closeToolPanel();
      setGridParams(updatedGridParams);
      updatedGridParams.gridApi.setSideBarVisible(false);
      updatedGridParams.gridApi.setFloatingFiltersHeight(0);
    },
    []
  );

  useEffect(() => {
    applyColDefForColor();
  }, [gridParams, props.isColorOn, props.selectedTheme]);

  const getTemplate = (templateName: string): Template | undefined => {
    let tempTemplate: Template | undefined = undefined;
    if (props.templates) {
      props.templates.forEach((element) => {
        if (templateName === element.name) {
          tempTemplate = element;
          return;
        }
      })
    }
    return tempTemplate;
  }

  const setSelectedTemplateInProps = useCallback((colId: string, template: string) => {
    const widgetServiceInstance = WidgetFactory.getInstance();
    const widgetProps = widgetServiceInstance.getProps(props.id);
    if (!widgetProps) return;
    if (!widgetProps.color) widgetProps.color = {};
    widgetProps.color[colId] = template;
    widgetServiceInstance.setProps(props.id, widgetProps);
  }, [])

  const applyColDefForColor = () => {

    const colDefs = gridParams.gridApi?.getColumnDefs();
    const widgetServiceInstance = WidgetFactory.getInstance();
    const widgetProps = widgetServiceInstance.getProps(props.id);
    if (colDefs && widgetProps) {
      let theme1: Theme | undefined = undefined;
      if (props.isColorOn) {
        theme1 = props.selectedTheme
      }

      for (let i = 0; i < colDefs.length; i++) {
        if ('children' in colDefs[i]) {
          const colGroupDef = (colDefs[i] as ColGroupDef);
          for (let j = 0; j < colGroupDef.children.length; j++) {
            const colDef = (colGroupDef.children[j] as ColDef);
            if (isNumeric(colDef.dataType) && colDef.colId && widgetProps.color && colDef.colId in widgetProps.color) {
              const templateName = widgetProps.color[colDef.colId];
              colDef.cellClass = "number-cell";

              let tempTemplate = getTemplate(templateName);
              colDef.cellStyle = (args: any) => applyCellStyle(args, tempTemplate, theme1);

              colGroupDef.children[j] = colDef;
              gridParams.gridApi?.setColumnDefs(colDefs);
            }

          }
        } else {
          const colDef = (colDefs[i] as ColDef);
          if (isNumeric(colDef.dataType) && colDef.colId && widgetProps.color && colDef.colId in widgetProps.color) {
            const templateName = widgetProps.color[colDef.colId];
            colDef.cellClass = "number-cell";

            let tempTemplate = getTemplate(templateName);

            colDef.cellStyle = (args: any) => applyCellStyle(args, tempTemplate, theme1);

            colDefs[i] = colDef;
            gridParams.gridApi?.setColumnDefs(colDefs);
          }

        }

      }
    }
  }


  const getMainMenuItems = (params: GetMainMenuItemsParams): (string | MenuItemDef)[] => {

    const updateColumnDefs = (colId: string, newDef: ColDef, templateName: string) => {
      if (!gridParams.gridApi) return;
      const newColDefs = gridParams.gridApi.getColumnDefs();

      if (newColDefs) {
        for (let i = 0; i < newColDefs.length; i++) {
          if ('children' in newColDefs[i]) {
            const newColDef: ColGroupDef = (newColDefs[i] as ColGroupDef);
            for (let j = 0; j < newColDef.children.length; j++) {
              const childColDef: ColDef = (newColDef.children[j] as ColDef);
              if (childColDef.colId === colId) {
                newColDef.children[j] = newDef;
                gridParams.gridApi.setColumnDefs(newColDefs);
                return;
              }
            }
          } else {
            const newColDef: ColDef = (newColDefs[i] as ColDef);
            if (newColDef.colId === colId) {
              newColDefs[i] = newDef;
              gridParams.gridApi.setColumnDefs(newColDefs);
              return;
            }
          }

        }
      }


    }


    let menuItems: (MenuItemDef | string)[] = params.defaultItems.slice(0);
    const widgetServiceInstance = WidgetFactory.getInstance();
    const widgetProps = widgetServiceInstance.getProps(props.id);
    if (!widgetProps) return menuItems;

    if (isNumeric(params.column.getColDef().dataType) && props.templates && props.isColorOn) {
      const colDef = params.column.getColDef();
      const subMenu = [
        {
          name: "none",
          action: () => {
            if (!colDef.field) return;
            setSelectedTemplateInProps(colDef.field, '');
            colDef.cellClass = "number-cell";
            colDef.cellStyle = { textAlign: "right", color: "#94b2d0" },
              updateColumnDefs(colDef.field, colDef, "");
          },
          checked: colDef.field !== undefined && (widgetProps.color === undefined || widgetProps.color[colDef.field] === undefined || widgetProps.color[colDef.field].length === 0)
        }
      ]

      if (props.templates) {
        props.templates.forEach((template) => {
          subMenu.push({
            name: template.name,
            action: () => {
              if (!colDef.field) return;
              setSelectedTemplateInProps(colDef.field, template.name);
              colDef.cellClass = "number-cell";
              colDef.cellStyle = (args: any) => applyCellStyle(args, template, props.selectedTheme);

              updateColumnDefs(colDef.field, colDef, template.name);

            },
            checked: colDef.field !== undefined && widgetProps.color !== undefined && widgetProps.color[colDef.field] === template.name
          })
        })
      }


      menuItems.push({
        name: 'Range',
        subMenu
      })


    }
    return menuItems;
  }





  const onColumnVisible = (event: ColumnVisibleEvent) => {

    const visibleColumns = event.columnApi
      .getColumnState()
      .filter((column) => !column.hide)
      .map((column) => column.colId);
    const newCols = new Set<string>(visibleColumns.slice(1));
    if (compareColSets(activeColSet, newCols) === false) {
      activeColSet = newCols;

      // if (subscriptionId.current && dataSourceRef.current)
      // dataService.current.updateSubscription(
      //   dataSourceRef.current.id,
      //   subscriptionId.current,
      //   Array.from(activeColSet)
      // );
    }
  }
  const onRowClicked = (event: RowClickedEvent) => {
    if (event.node.rowGroupIndex === undefined) {
      const colId = Object.keys(event.node.data)[0];
      handleFilterSelect(colId, event.node.data[colId]);
    }
    else if (event.node.rowGroupIndex === 0 && event.node.rowGroupColumn && event.node.key) {
      handleFilterSelect(event.node.rowGroupColumn.getColId(), event.node.key);
    }
  }
  const handleFilterSelect = (colId: string, value: string) => {
    if (filters.current.filter(filter => filter.colId === colId).length > 0) return;
    if (props.addToFilter) props.addToFilter(colId, value);
  }
  const isExternalFilterPresent = useCallback((): boolean => {
    return filters.current.length > 0;
  }, []);

  const doesExternalFilterPass = useCallback((node: RowNode) => {
    if (filters.current === null) return true;
    let isFiltered: boolean = true;
    filters.current.forEach(filter => {
      if (node.data[filter.colId] === undefined || node.data[filter.colId] === filter.value) return;
      isFiltered = false;
    })
    return isFiltered;
  }, []);
  const handleCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    if (!dataSourceRef.current) return;
    const uniqueKey = dataSourceRef.current.uniqueKey.map(col => ({ colId: col, value: event.node.data[col] }));
    if (dataSourceRef.current.tableName)
      props.updateCellValue(dataSourceRef.current.tableName, uniqueKey, event.column.getId(), event.newValue);
  }, []);

  const onFirstDataRendered = (event: FirstDataRenderedEvent) => {
    if (gridParams.columnApi && props.columnState && props.columnState["ag-Grid-AutoColumn"]) {
      gridParams.columnApi.setColumnWidth("ag-Grid-AutoColumn", props.columnState["ag-Grid-AutoColumn"].width ?? 200);
    }
  }

  const getRowStyle = (params: RowClassParams) => { 
    if (props.dataSourceId === "dealing-panel-interval") {
      if (params.data?.dealingtype.toLowerCase() === "step out rejection" ||
        params.data?.dealingtype.toLowerCase() === "deal deleted" ||
        params.data?.dealingtype.toLowerCase() === "common error" ||
        params.data?.dealingtype.toLowerCase() === "deal modified"
        ) {
        return { "background": "grey" };
      } else if (params.data?.dealingtype?.toLowerCase() === "deal buy stop"){
        return {"background-color": props.selectedTheme?.color[0]};
      } else if (params.data?.dealingtype?.toLowerCase() === "deal sell stop"){
        return {"background-color": props.selectedTheme?.color[5]};
      }
    } else {
      return {};
    }
  };


  useEffect(() => {
    saveStartTime(startTime);
  }, [startTime])

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

  const handleStartTimeChange = (dateTime: number) => {
    if (dateTime) {
      if(dateTime > endTime) {
        props.setAlertMessage("Please make sure the start time is earlier than the end time", "error");
        return;
      }
      setStartTime(dateTime);
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

  const handleEndTimeChange = (dateTime: number) => {
    if (dateTime) {
      if(startTime > dateTime) {
        props.setAlertMessage("Please make sure the start time is earlier than the end time", "error");
        return;
      }
      setEndTime(dateTime);
    }

  };

  const toggleNowText = (isNowVisible: boolean) => {
    setShowNowText(isNowVisible);
  };

  const FetchLoginData = () => {
    if (subscriptionId.current) {
      if(startTime > endTime) {
        props.setAlertMessage("Please make sure the start time is earlier than the end time", "error");
        return;
      }
      LoginPanelServices.current.unsubscribe(subscriptionId.current);
      subscriptionId.current = null;
      if (gridParams.gridApi) {
        gridParams.gridApi.setRowData([]);
      }
    }
    subscribe();
  }

  const isDoubleClicked = () : boolean => {
    var currentClickTime = new Date().getTime();
    const result: boolean = currentClickTime - previousClickedTime < 300;
    previousClickedTime = currentClickTime;
    return result;
  }

  const onCellClicked = (e: CellClickedEvent) => {
    if (e.event?.pointerType === "touch" && isDoubleClicked()) {
      onRowClicked(e);
    }
  }

  console.log(props,"vikkkkkkasssss")

  console.log(props.dataSourceId,"props.dataSourceId")

    

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      sx={{ backgroundColor: "#13171F" }}
    >
     
       
       {props.dataSourceId === "login-device-panel" && (
        <AddDuration
          startDateTime={startTime * 1000}
          endDateTime={endTime * 1000}
          showNowText={showNowText}
          handleStartDateTimeChange={handleStartTimeChange}
          handleEndDateTimeChange={handleEndTimeChange}
          toggleNowText={toggleNowText}
          fetchDealingData={FetchLoginData}
        />
      )}
   

      <div
        className={`ag-theme-balham-dark ${floatingFilter ? "show-filter" : "hide-filter"}`}
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact
          getRowStyle={getRowStyle}
          onGridReady={(params) => onGridReady(params)}
          getRowId={getRowNodeId}
          sideBar={true}
          asyncTransactionWaitMillis={333}
          onRowDoubleClicked={onRowClicked}
          autoGroupColumnDef={{ sortable: true, resizable: true }}
          defaultColDef={{ resizable: true, sortable: true }}
          gridOptions={{
            groupIncludeTotalFooter: true,
            suppressAggFuncInHeader: true,
            isExternalFilterPresent: isExternalFilterPresent,
            doesExternalFilterPass: doesExternalFilterPass,
            suppressRowClickSelection: true,
            rowSelection: "multiple",
            onCellClicked: onCellClicked
          }}
          onCellValueChanged={handleCellValueChanged}
          onColumnVisible={onColumnVisible}
          onFirstDataRendered={onFirstDataRendered}
          onToolPanelVisibleChanged={(e: ToolPanelVisibleChangedEvent) => {
            if (e.api.isToolPanelShowing()) e.columnApi.setPivotMode(false);
          }}
          getMainMenuItems={getMainMenuItems}
        />
      </div>
    </Box>
  );
});



function mapStateToProps(state: any) {
  return {
    isColorOn: state.app.isColorOn,
    selectedTheme: state.app.selectedTheme,
    templates: state.app.templates
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateCellValue: (tableName: string, uniqueKey: UniqueKeyColType[], updateColId: string, updateValue: any) => updateCellValue(tableName, uniqueKey, updateColId, updateValue),
    setAlertMessage: (message: string, messageType: string) => dispatch(setAlertMessage(message, messageType))
  }
}
export default React.memo(connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(LoginDevicePanelComponent));


