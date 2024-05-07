import "@finos/perspective-viewer";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer/dist/css/vaporwave.css";
import React, {
ReactElement,
useCallback,
useEffect,
useImperativeHandle,
useRef,
useState,
} from "react";
import "../../../../assets/css/chart.css";
import WidgetFactory, { WidgetProps } from "../../../canvas/services/WidgetService";

import perspective, {
Aggregate,
PerspectiveWorker,
Schema,
Table,
Type,
} from "@finos/perspective";
import {
HTMLPerspectiveViewerElement,
PerspectiveViewerConfig,
} from "@finos/perspective-viewer";
import getDataServiceInstance from "../../../../backend/data-subcription/DataService";
import { DataType } from "../../../../backend/worker/DataWorker";
import {
DataColumn,
DataColumnGroup,
DataSourceType,
dataSources,
} from "../../../../redux/reducers/canvas/CanvasReducer";
import { getChartState, getFilterTypeForChart, getOrderByForChart } from "../../../../utilities/ChartComponentUtilities";
import { generateUniqueId } from "../../../../utilities/GridComponentUtilities";
import { Filter } from "../../custom-widget/WidgetConfig";
import { applyFilters } from "../utilities/WidgetUtilities";

export interface ChartComponentProps extends WidgetProps {}
type ColDefMapType = {
  [colId: string]: DataColumn;
};
const ChartComponent = React.forwardRef(
  (props: ChartComponentProps, ref): ReactElement => {
    const subscriptionId = useRef<string | null>(null);
    const dataSourceRef = useRef<DataSourceType | null>(null);
    const colDefMap = useRef<ColDefMapType>({});
    const worker = useRef<PerspectiveWorker | null>(null);
    const table = useRef<Table | undefined>();
    const visibleColMap = useRef<{ [id: string]: boolean }>({});
    const [isTableReady, setIsTableReady] = useState<boolean>(false);
    const globalFilters = useRef<Filter[]>([]);
    const data = useRef<Map<string,DataType>>(new Map<string,DataType>());

    const viewer = React.useRef<HTMLPerspectiveViewerElement>(null);
    const setData = async (data: any) => {
      if (!worker.current) return;
      const buffer = data;
      return await worker.current.table(buffer);
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
    const mapDataType = (dataType: string): Type => {
      switch (dataType) {
        case "string":
        case "boolean":
        case "float":
        case "integer":
        case "date":
        case "datetime":
          return dataType;
        case "double":
          return "float";
        default:
          return "string";
      }
    };
    const getSchema = (visibleCols: string[]) => {
      const schema = visibleCols.reduce((prev: Schema, curr) => {
        prev[getKey(curr)] = mapDataType(colDefMap.current[curr].dataType);
        return prev;
      }, {});
      return schema;
    };

    useEffect(() => {
      viewer.current?.setThrottle(333);
      worker.current = perspective.worker();

      return () => {
        async function cleanUp() {
          if (worker.current) {
            await (await viewer.current?.getView())?.delete();
            table.current?.delete();
            table.current = undefined;
            worker.current.terminate();
          }
        }
        cleanUp();
      };
    }, []);

    useEffect(() => {
      if (!props.dataSourceId) return;

      const ds = dataSources.find(
        (dataSource) => dataSource.id === props.dataSourceId
      );
      if (ds) {
        dataSourceRef.current = ds;
        dataSourceRef.current.columns.forEach((col) => {
          if ("groupingColumns" in (col as DataColumnGroup)) {
            const currentCol = col as DataColumnGroup;
            currentCol.groupingColumns.forEach((childCol) => {
              colDefMap.current[childCol.field] = childCol;
            });
          } else {
            const currentCol = col as DataColumn;
            colDefMap.current[currentCol.field] = currentCol;
          }
        });
      }
    }, [props.dataSourceId]);

    useEffect(() => {
      if (props.visibleCols.length === 0) return;
      setData(getSchema(props.visibleCols)).then((tb) => {
        if (tb) {
          viewer.current?.load(tb).then((x) => {
            table.current = tb;
            setIsTableReady(true);
          });
        }
      });
      return () => {
        setIsTableReady(false);
        const currentTable = table.current;
        table.current = undefined;
        viewer.current?.getView().then((view) => {
          view.delete().then((_) => {
            currentTable?.delete();
          });
        });
      };
    }, [props.visibleCols]);

    useEffect(() => {
      if (!props.dataSourceId || !isTableReady || subscriptionId.current)
        return;
      const dataService = getDataServiceInstance();
      data.current.clear();
      subscriptionId.current = dataService.subscribe(
        props.dataSourceId,
        props.visibleCols,
        {
          async onDataRecieve(messages: any[], allowMultipleInsert) {
            if (
              Object.keys(visibleColMap.current).length === 0 ||
              !table.current
            )
              return;
            messages.forEach((message) => {
              const id = getRowNodeId(message);
              data.current.set(id, message);
            });
            const rawData = Array.from(data.current.values());
            let filteredData = applyFilters(globalFilters.current,rawData);
            filteredData = filterVisibileColumns(filteredData);
            
            if (table.current) {
              table.current.replace(filteredData);
            }
          },
          onDataUpdate(messages: any[]) {
            if (
              !table.current ||
              Object.keys(visibleColMap.current).length === 0
            )
              return;
            messages.forEach((message) => {
              const id = getRowNodeId(message);
              const prevData = data.current.get(id);
              if (prevData) {
                Object.keys(message).forEach(key => {
                  if(prevData[key]) prevData[key] = message[key] ?? prevData[key];
                })
                data.current.set(id, prevData);
              }
            });
            const rawData = Array.from(data.current.values());
            let filteredData = applyFilters(globalFilters.current,rawData);
            filteredData =  filterVisibileColumns(filteredData);
            
            table.current.replace(filteredData);
          },
        }
      );
    }, [props.dataSourceId, isTableReady]);
    useEffect(() => {
      return () => {
        if (subscriptionId.current && props.dataSourceId) {
          const dataService = getDataServiceInstance();
          dataService.unsubscribe(props.dataSourceId, subscriptionId.current);
          table.current?.delete();
          table.current = undefined;
          subscriptionId.current = null;
        }
      };
    }, [props.dataSourceId]);
    
    useEffect(() => {
      visibleColMap.current = props.visibleCols.reduce(
        (prev: { [colId: string]: boolean }, curr) => {
          prev[curr] = true;
          return prev;
        },
        {}
      );
      if (!table.current || !dataSourceRef.current || !subscriptionId.current)
        return;
      const dataService = getDataServiceInstance();
      dataService.updateSubscription(
        dataSourceRef.current.id,
        subscriptionId.current,
        props.visibleCols
      );
    }, [props.visibleCols, isTableReady]);


    useEffect(() => {
      if (isTableReady && table.current)
        viewer.current?.restore(getChartConfigs());
    }, [props.chartType,props.filterBy,props.groupBy,props.splitBy,props.functionCols, props.orderBy, isTableReady]);

    useEffect(() => {
      if(props.onWidgetReady) props.onWidgetReady();
    },[isTableReady])

    useImperativeHandle(ref,()=>({
      onGlobalFilterChange,
      onQuickFilterChange,
      toggleToolPanel,
      toggleFloatingFilter,
      saveWidgetState
    }),[]);

    const onGlobalFilterChange = (filters:Filter[]) => {
      globalFilters.current = filters;
      if(!table.current) return;
      const rawData = Array.from(data.current.values());
      let filteredData = applyFilters(globalFilters.current,rawData);
      filteredData =  filterVisibileColumns(filteredData);
      viewer.current?.flush();
      table.current.replace(filteredData);
    }
    const onQuickFilterChange = () => {
      console.debug("onQuickFilterChange not implemented for chart widget");
    }
    const toggleToolPanel = () => {
      viewer.current?.toggleConfig();
    }
    const toggleFloatingFilter = () => {
      console.debug("toggleFloatingFilter not implemented for chart widget");
    }
    const saveWidgetState = async () => {
      const configs = await viewer.current?.save();
      const widgetService = WidgetFactory.getInstance();
      const widgetProps = widgetService.getProps(props.id);
      if(configs && widgetProps){
        const headerToColIdMap = getColIdsFromHeaders();
        const newWidgetProps = getChartState(configs,widgetProps,headerToColIdMap);
        widgetService.setProps(props.id,newWidgetProps);
      }
    }
    function filterVisibileColumns (data:DataType[]):DataType[] {
      const displayData:DataType[] = [];
      data.forEach((row) => {
        const currentData:DataType = {};
        Object.keys(row).forEach(key => {
          if(visibleColMap.current[key]) {
            currentData[getKey(key)] = row[key];
          }
        });
        displayData.push(currentData);
      });
      return displayData;
    }
    function getKey(colId: string): string {
      return colDefMap.current[colId].headerName;
    }
    function getColIdsFromHeaders():{[headerName:string]:string} {
      const map:{[headerName:string]:string} = {};
      Object.keys(colDefMap.current).forEach(key => {
        map[colDefMap.current[key].headerName] = key;
      });
      return map;
    }

    function getFunction(func: string): Aggregate {
      switch (func) {
        case "avg":
        case "sum":
        case "first":
        case "last":
        case "count":
          return func;
        case "min":
          return "low";
        case "max":
          return "high";
        default:
          return "sum";
      }
    }
    function getChartConfigs(): PerspectiveViewerConfig {
      const configs: PerspectiveViewerConfig = {};
      configs.group_by = props.groupBy.map((col) => getKey(col));
      configs.columns = props.functionCols.map((col) => getKey(col[0]));
      configs.split_by = props.splitBy.map((col) => getKey(col));
      configs.filter = props.filterBy.map(filter => {
        return [getKey(filter.colId),getFilterTypeForChart(filter.filterType),filter.value]
      });
      configs.sort = props.orderBy?.map(order => {
        return [getKey(order.colId),getOrderByForChart(order.orderByType)]
      });
      configs.aggregates = props.functionCols.reduce(
        (prev: { [colId: string]: Aggregate }, curr) => {
          prev[getKey(curr[0])] = getFunction(curr[1]);
          return prev;
        },
        {}
      );
      configs.plugin = props.chartType;
      return configs;
    }

    return (
      <div className="PerspectiveViewer">
        <perspective-viewer ref={viewer}></perspective-viewer>
      </div>
    );
  }
);

export default React.memo(ChartComponent);
