import {
  GridReadyEvent,
  RowDoubleClickedEvent,
  RowNode,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useState } from "react";

const AlertNotificationComponent = () => {
  const [floatingFilter, setFloatingFilter] = useState<boolean>(false);
  const onGridReady = useCallback((params: GridReadyEvent) => {}, []);
  const getRowNodeId = useCallback((rowData: any) => {}, []);
  const onRowClicked = (event: RowDoubleClickedEvent) => {};
  const isExternalFilterPresent = useCallback((): boolean => {
    return false;
  }, []);
  const doesExternalFilterPass = useCallback((node: RowNode) => {
    return false;
  }, []);
  return (
    <div
      className={`ag-theme-balham-dark ${
        floatingFilter ? "show-filter" : "hide-filter"
      }`}
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
  );
};

export default AlertNotificationComponent;
