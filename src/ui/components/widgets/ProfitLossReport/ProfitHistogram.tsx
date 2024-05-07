import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef, } from "react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import "../../../../assets/css/aggrid_custom.css";

type ProfitHistogramProps = {
  histogramData: any[];
};

const ProfitHistogram = (props: ProfitHistogramProps) => {
  const rowData = useRef<
    {
      "Bin/Range": string;
      "Frequency Profit": string;
      Lots: number;
    }[]
  >([]);

  const columnDefs: ColDef[] = [
    { field: "Bin/Range", width: 100 },
    { field:  "Frequency Profit", width: 150 },
    { field: "Lots", width: 180 },
  ];

  useEffect(() => {
    let totalFrequencyProfit: number = 0;
    let totalLots: number = 0;
    props.histogramData.forEach((value, index) => {
      totalFrequencyProfit += Number(value["frequency"]);
      totalLots += Number(value["lots"].toFixed(2));
      rowData.current.push({
        "Bin/Range":
          index + 1 === props.histogramData.length
            ? "More"
            : `${Number(value["bin"]).toFixed(2)}`,
        "Frequency Profit": value["frequency"],
        Lots: Number(value["lots"].toFixed(2)),
      });
    });
    rowData.current.push({
      "Bin/Range": "Total",
      "Frequency Profit": totalFrequencyProfit.toFixed(2),
      "Lots": Number(totalLots.toFixed(3)),
    });
  }, [props.histogramData]);


  return (
    <>
      <div
        className={`ag-theme-balham-dark ag-theme-green`}
        style={{ height: "100%", width: "100%", overflowY: "scroll" }}
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

export default ProfitHistogram;
