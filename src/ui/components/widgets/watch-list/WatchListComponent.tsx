import { Box } from "@mui/material";
import {
  ColDef,
  ColGroupDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
  RowNode,
} from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import { AgGridReact } from "ag-grid-react";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import WatchListServiceFactory from "../../../../backend/data-subcription/WatchListService";
import {
  DataSourceType,
  dataSources,
} from "../../../../redux/reducers/canvas/CanvasReducer";
import {
applyGridConfigs,
  generateGridColumnDefsFromMetaData,
  generateUniqueId,
  getGridConfigs,
} from "../../../../utilities/GridComponentUtilities";
import { DeleteButtonCellRenderer } from "../../../../utilities/cell-renderer/DeleteButtonCellRenderer";
import { WatchListChangeCellRenderer } from "../../../../utilities/cell-renderer/WatchListChangeCellRenderer";
import WidgetFactory, {
  WidgetProps,
} from "../../../canvas/services/WidgetService";
import { Filter, WidgetFilter } from "../../custom-widget/WidgetConfig";
import AddTicker from "./AddTicker";
import useKeyBoardShortCut from "../../common/keyboard-shortcut/useKeyBoardShortcut";
import { Theme } from "../ThemeModal/ThemeTemplateModal";
import { connect } from "react-redux";
import { WatchListHighCellRenderer } from "../../../../utilities/cell-renderer/WatchListHighCellRenderer";
import { WatchListLowCellRenderer } from "../../../../utilities/cell-renderer/WatchListLowCellRenderer";

type GridParams = {
  gridApi: GridApi | null;
  columnApi: ColumnApi | null;
};

export interface WatchListPropsType extends WidgetProps {
  subscribedTickers: string[];
  addToFilter?: (colId: string, value: string) => void;
  selectedTheme: Theme;
}

const WatchListComponent = React.forwardRef(
  (props: WatchListPropsType, ref): ReactElement => {
    const watchListService = useRef<any>(null);
    const filters = useRef<Filter[]>([]);
    const [gridParams, setGridParams] = useState<GridParams>({
      gridApi: null,
      columnApi: null,
    });
    const subscriptionId = useRef<string | null>(null);
    const dataSourceRef = useRef<DataSourceType | null>(null);
    const prevInsertData = useRef<Map<string, any>>(new Map<string, any>());
    const newInsertData = useRef<Map<string, any>>(new Map<string, any>());
    const [subscribedTickers, setSubscribedTickers] = useState<string[]>([]);
    const subscribedTickersRef = useRef<string[]>([]);
    const deleteTickerShortCutKey = useMemo(() => ["delete"], []);
    const [floatingFilter, setFloatingFilter] = useState<boolean>(false);
    const handleRowDelete = useCallback(() => {
      if (!gridParams.gridApi) return;
      const rows = gridParams.gridApi.getSelectedRows();
      const deletedTickers = rows.map((row) => row.symbol);
      handleTickersRemove(deletedTickers);
      gridParams.gridApi.applyTransactionAsync(
        {
          remove: rows,
        }
      );
    }, [gridParams]);

    useKeyBoardShortCut(deleteTickerShortCutKey, handleRowDelete);

    const onDataRecieve = (message: any[], allowMultipleInsert = false) => {
      if (!gridParams.gridApi) return;
      if (allowMultipleInsert) {
        gridParams.gridApi.applyTransactionAsync({
          add: message,
        });
      } else {
        message.forEach((data) => {
          const id = getRowNodeId(data);
          data["change"] = data["bid"] - data["last"]; // for computing change (this column is not present in incoming data)
          if (prevInsertData.current.has(id))
            prevInsertData.current.set(id, data);
          else newInsertData.current.set(id, data);
        });
        gridParams.gridApi.applyTransactionAsync(
          {
            add: Array.from(newInsertData.current.values()),
            update: Array.from(prevInsertData.current.values()),
          }
        );
        newInsertData.current.forEach((value, key) =>
          prevInsertData.current.set(key, value)
        );
        newInsertData.current.clear();
      }
    };
    const onDataUpdate = (message: any[]) => {
      if (!gridParams.gridApi) return;
      message.forEach((item: any) => {
        const rowId = getRowNodeId(item);
        if (gridParams.gridApi) {
          const rowNode = gridParams.gridApi.getRowNode(rowId);
          if (!rowNode) return;
          for (const key in rowNode.data) {
            if (!item[key]) item[key] = rowNode.data[key] || 0;
          }
          item["change"] = item["bid"] - item["last"]; // for computing change (this column is not present in incoming data)
        }
      });

      gridParams.gridApi.applyTransactionAsync(
        {
          update: message,
        }
      );
    };

    useEffect(() => {
      if (!gridParams.gridApi) return;
      watchListService.current = WatchListServiceFactory.getInstance();
      subscriptionId.current = watchListService.current.register({
        onDataRecieve,
        onDataUpdate,
      });
      return () => {
        if (subscriptionId.current)
          watchListService.current.deregister(subscriptionId.current);
      };
    }, [gridParams]);

    useEffect(() => {
      if (!props.dataSourceId || !gridParams.gridApi) return;
      //debugger
      const ds = dataSources.find(
        (dataSource) => dataSource.id === props.dataSourceId
      );
      if (ds) {
        dataSourceRef.current = ds;
        const colDefs: ColDef[] = generateGridColumnDefsFromMetaData(
          dataSourceRef.current.columns
        );
        applyCellRenderers(colDefs);
        gridParams.gridApi.setColumnDefs(colDefs);
      }
    }, [props.dataSourceId, gridParams.gridApi]);


    useEffect(() => {
      if (!gridParams.columnApi) return;
      gridParams.columnApi.setPivotMode(props.pivot);
    }, [props.pivot, gridParams.columnApi]);

    useEffect(() => {
      // applyCellRenderersForDealingPanel(dealingPanelCols);
      if (!gridParams.gridApi) return;
      const colDefs: (ColDef<any> | ColGroupDef<any>)[] | undefined = gridParams.gridApi.getColumnDefs();
      if (!colDefs) return;
      applyCellRenderers(colDefs);
      gridParams.gridApi.setColumnDefs(colDefs);
    }, [props.selectedTheme, gridParams])

    useEffect(() => {
      subscribedTickersRef.current = subscribedTickers;
    }, [subscribedTickers]);

    useEffect(() => {
      if (gridParams.gridApi && props.subscribedTickers) {
        const currentTickers = new Set<string>(subscribedTickers);
        let changed: boolean = false;
        props.subscribedTickers.forEach((ticker) => {
          if (currentTickers.has(ticker)) return;
          changed = true;
        });
        if (changed) {
          setSubscribedTickers(props.subscribedTickers);
          addSubscribedTickersToWidgetProps(props.subscribedTickers);
          watchListService.current.subscribeToTicker(
            subscriptionId.current,
            props.subscribedTickers
          );
        }
      }
    }, [props.subscribedTickers, gridParams]);

    useEffect(() => {
      if (
        !props.dataSourceId ||
        !gridParams.columnApi ||
        !props.visibleCols ||
        props.visibleCols.length === 0
      )
        return;

        const colStates = gridParams.columnApi.getColumnState();
        const updatedColStates = applyGridConfigs(colStates,props.visibleCols,props.groupBy,props.splitBy,props.functionCols,props.orderBy,props.columnState);
        gridParams.columnApi.applyColumnState({
          state:updatedColStates,
          applyOrder:true
        });

    }, [props.visibleCols, gridParams.columnApi, props.dataSourceId,props.columnState, props.orderBy]);

    useEffect(() => {
      if(!gridParams.gridApi || !props.columnState) return;
      const filterModel = Object.keys(props.columnState).reduce((prev:{[colId:string]:WidgetFilter | undefined},curr) => {
        if(props.columnState && props.columnState[curr].filter) {
            prev[curr] = props.columnState[curr].filter;
        }
        return prev;
      },{});
      gridParams.gridApi.setFilterModel(filterModel);
    },[gridParams.gridApi,props.columnState])

    const handleTickersRemove = (deletedTickers: string[]): void => {
      const deletedTickerSet = new Set<string>(deletedTickers);
      const newTickers = subscribedTickersRef.current.filter(
        (ticker) => !deletedTickerSet.has(ticker)
      );
      setSubscribedTickers(newTickers);
      addSubscribedTickersToWidgetProps(newTickers);
      deletedTickerSet.forEach((ticker) =>
        prevInsertData.current.delete(ticker)
      ); // to allow new inserts
      watchListService.current.unsubscribeTicker(
        subscriptionId.current,
        Array.from(deletedTickerSet)
      );
    };
    const handleDeleteRow = (tickerToDelete:string):void => {
      handleTickersRemove([tickerToDelete]);
    }

    function applyCellRenderers(colDefs: ColDef[]) {
      colDefs.forEach((colDef) => {
        switch (colDef.field) {
          case "change":
            colDef.cellRenderer = WatchListChangeCellRenderer;
            colDef.cellRendererParams = {
              selectedTheme: props.selectedTheme
            }
            return;
          case "high":
            colDef.cellRenderer = WatchListHighCellRenderer;
            colDef.cellRendererParams = {
              selectedTheme: props.selectedTheme
            }
          return;
          case "low":
            colDef.cellRenderer = WatchListLowCellRenderer;
            colDef.cellRendererParams = {
              selectedTheme: props.selectedTheme
            }
          return;
          case "delete":
            colDef.cellRenderer = DeleteButtonCellRenderer;
            colDef.cellRendererParams = {
              handleDelete: handleDeleteRow,
            };
        }
      });
    }
    const toggleToolPanel = () => {
      if (!gridParams.gridApi) return;
      gridParams.gridApi.setSideBarVisible(
        !gridParams.gridApi.isSideBarVisible()
      );
    };
    const toggleFloatingFilter = (enabled: boolean) => {
      if (!gridParams.gridApi) return;
      gridParams.gridApi.setFloatingFiltersHeight(enabled ? 32 : 0);
      setFloatingFilter(!floatingFilter);
    };

    useImperativeHandle(ref, () => ({
      onGlobalFilterChange,
      onQuickFilterChange,
      toggleToolPanel,
      toggleFloatingFilter,
      saveWidgetState
    }));
    const onGlobalFilterChange = (globalFilters: Filter[]) => {
      if (!gridParams.gridApi) return;
      filters.current = globalFilters;
      gridParams.gridApi.onFilterChanged();
    };
    const onQuickFilterChange = (filterValue: string) => {
      if (!gridParams.gridApi) return;
      gridParams.gridApi.setQuickFilter(filterValue);
    };
    const autoSizeAllColumns = () => {
      if (gridParams.columnApi) {
        const allCols = gridParams.columnApi.getColumns();
        if (allCols) gridParams.columnApi.autoSizeColumns(allCols, true);
      }
    };

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

    const onGridReady = useCallback((params: GridReadyEvent) => {
      const updatedGridParams = { ...gridParams };
      updatedGridParams.gridApi = params.api;
      updatedGridParams.columnApi = params.columnApi;
      updatedGridParams.gridApi.closeToolPanel();
      setGridParams(updatedGridParams);
      updatedGridParams.gridApi.setSideBarVisible(false);
      updatedGridParams.gridApi.setFloatingFiltersHeight(0);
    }, []);

    const handleTickerAdd = (ticker: string | string[]) => {
      var tickerSet = new Set(ticker);
      subscribedTickers.find((symbol) => {
        if(tickerSet.has(symbol)){
          tickerSet.delete(symbol);
        }
      })
      const newTickers = [...subscribedTickers, ...tickerSet];
      setSubscribedTickers(newTickers);
      addSubscribedTickersToWidgetProps(newTickers);
      watchListService.current.subscribeToTicker(subscriptionId.current,[...tickerSet]);
    };

    function addSubscribedTickersToWidgetProps(subscribedTickers: string[]) {
      const widgetService = WidgetFactory.getInstance();
      const widgetProps = widgetService.getProps(props.id);

      if (!widgetProps) return;
      widgetProps.subscribedTickers = subscribedTickers;
      widgetService.setProps(widgetProps.id, widgetProps);
    }
    const onRowClicked = (event: RowDoubleClickedEvent) => {
      if (event.node.rowGroupIndex === undefined) {
        const colId = Object.keys(event.node.data)[0];
        handleFilterSelect(colId, event.node.data[colId]);
      } else if (
        event.node.rowGroupIndex === 0 &&
        event.node.rowGroupColumn &&
        event.node.key
      ) {
        handleFilterSelect(
          event.node.rowGroupColumn.getColId(),
          event.node.key
        );
      }
    };
    const handleFilterSelect = (colId: string, value: string) => {
      if (filters.current.filter((filter) => filter.colId === colId).length > 0)
        return;
      if (props.addToFilter) props.addToFilter(colId, value);
    };
    const isExternalFilterPresent = useCallback((): boolean => {
      return filters.current.length > 0;
    }, []);
    const doesExternalFilterPass = useCallback((node: RowNode) => {
      if (filters.current === null) return true;
      let isFiltered: boolean = true;
      filters.current.forEach((filter) => {
        if (
          node.data[filter.colId] === undefined ||
          node.data[filter.colId] === filter.value
        )
          return;
        isFiltered = false;
      });
      return isFiltered;
    }, []);
    const saveWidgetState = () => {
      if (!gridParams.columnApi || !gridParams.gridApi) return;
      const widgetServiceInstance = WidgetFactory.getInstance();
      const widgetProps = widgetServiceInstance.getProps(props.id);
      if (!widgetProps) return;

      const colStates = gridParams.columnApi.getColumnState();
      const filters = gridParams.gridApi.getFilterModel();

      const newWidgetProps = getGridConfigs(colStates, filters, widgetProps);
      widgetServiceInstance.setProps(props.id, newWidgetProps);
    };
    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        sx={{ backgroundColor: "#13171F" }}
      >
        <AddTicker onTickerAdd={handleTickerAdd} subscribedTickers={props.subscribedTickers} isWatchListTicker={true}/>
        <div
          className={`ag-theme-balham-dark ${floatingFilter ? "show-filter" : "hide-filter"}`}
          style={{ height: "100%", width: "100%", flexGrow: 1 }}
        >
          <AgGridReact
            onGridReady={(params) => onGridReady(params)}
            getRowId={getRowNodeId}
            sideBar={true}
            asyncTransactionWaitMillis={50}
            onRowDoubleClicked={onRowClicked}
            autoGroupColumnDef={{ sortable: true, resizable: true }}
            defaultColDef={{ resizable: true, sortable: true }}
            gridOptions={{
              suppressAggFuncInHeader: true,
              isExternalFilterPresent: isExternalFilterPresent,
              doesExternalFilterPass: doesExternalFilterPass,
              groupHeaderHeight: 0,
              suppressRowClickSelection: true,
              animateRows: true,
              rowSelection: "multiple",
            }}
          />
        </div>
      </Box>
    );
  }
);

function mapStateToProps(state:any) {
  return {
      selectedTheme: state.app.selectedTheme
  }
}

export default React.memo(connect(mapStateToProps, null)(WatchListComponent));
