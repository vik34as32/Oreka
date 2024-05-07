import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef } from "react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import "../../../../assets/css/aggrid_custom.css";


type PositionAnalysisProps = {
  positionAnalysisData: any[];
};

const PositionAnalysis = (props: PositionAnalysisProps) => {
  const rowData = useRef<
    {
      Login: string;
      Time: string;
      Action: string;
      Volume: string;
      Price: string;
      High: string;
      Low: string;
    }[]
  >([]);

  const columnDefs: ColDef[] = [
    { field: "Login", width: 80 },
    { field: "Time", width: 140 },
    { field: "Action", width: 80 },
    { field: "Volume", width: 100 },
    { field: "Price", width: 100 },
    { field: "High", width: 100 },
    { field: "Low" },
  ];

  function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  function getActionValue(action: number): string {
    switch(action) {
      case 0:
        return "Buy";
      case 1:
        return "Sell";
      case 2:
        return "Buy/Sell"
      default:
        return "";
    }
  }

  useEffect(() => {
    let totalVolume: number = 0;
    let totalPrice: number = 0;
    let totalHigh: number = 0;
    let totalLow: number = 0;
    props.positionAnalysisData.forEach((value) => {
      totalVolume += Number(value['Entry Volume']);
      totalPrice += Number(value['Entry Price']);
      totalHigh += Number(value['High Price']);
      totalLow += Number(value['Low Price']);
      rowData.current.push({
        "Login": value['Login'],
        "Time": formatDate(value['Time']),
        "Action": getActionValue(value['Entry Action']),
        "Volume": value['Entry Volume'].toFixed(2),
        "Price": value['Entry Price'],
        "High": value['High Price'],
        "Low": value['Low Price']
      });
    });
    rowData.current.push({
      "Login": "Total",
      "Time": "",
      "Action": "",
      "Volume": totalVolume.toFixed(2),
      "Price": totalPrice.toFixed(2),
      "High": totalHigh.toFixed(2),
      "Low": totalLow.toFixed(2),
    });
  }, [props.positionAnalysisData]);

  return (
    <>
      <div
        className={`ag-theme-balham-dark ag-theme-green`}
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData.current}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          animateRows={true}
          sideBar
          onGridReady={(e) => {
            e.api.closeToolPanel();
          }}
        ></AgGridReact>
      </div>
    </>
  );
};

export default PositionAnalysis;
