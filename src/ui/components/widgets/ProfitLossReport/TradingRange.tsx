import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef } from "react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import "../../../../assets/css/aggrid_custom.css";

type TradingRangeProps = {
  tradingRangeData: Record<string, any>;
};

const TradingRange = (props: TradingRangeProps) => {
  const highPrice = props.tradingRangeData["High"];
  const lowPrice = props.tradingRangeData["Low"];
  const closePrice = props.tradingRangeData["Close"];
  const openPrice = props.tradingRangeData["Open"];
  const range = (Math.abs(closePrice - openPrice)).toFixed(1);
  const trueRange = (Math.abs(highPrice - lowPrice)).toFixed(1);
  const rangePr = openPrice === 0 ? 0 : ((parseFloat(range) / openPrice) * 100).toFixed(2);
  const trueRangePr = openPrice === 0 ? 0 : ((parseFloat(trueRange) / openPrice) * 100).toFixed(2);
  const rowData = useRef<
    {
      "Range Calculation": string;
      Price: string;
      Percentage: string;
    }[]
  >([
    {
      "Range Calculation": "Opening Price",
      Price: openPrice,
      Percentage: "",
    },
    {
      "Range Calculation": "Closing Price",
      Price: closePrice,
      Percentage: "",
    },
    {
      "Range Calculation": "Range",
      Price: range,
      Percentage: `${rangePr}%`,
    },
    {
      "Range Calculation": "True Range",
      Price: trueRange,
      Percentage: `${trueRangePr}%`,
    },
    {
      "Range Calculation": "Lowest low",
      Price: lowPrice,
      Percentage: "",
    },
    {
      "Range Calculation": "Highest high",
      Price: highPrice,
      Percentage: "",
    },
  ]);

  const columnDefs: ColDef[] = [
    { field: "Range Calculation", width: 160 },
    { field: "Price", width: 100 },
    { field: "Percentage" },
  ];

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

export default TradingRange;
