import { ColDef } from "ag-grid-community";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef } from "react";
import "../../../../assets/css/aggrid_custom.css";

type LossHistogramProps = {
  histogramData: any[];
};

const LossHistogram = (props: LossHistogramProps) => {
  const rowData = useRef<
    {
      "Bin/Range": string;
      "Frequency Loss": string;
      Lots: number;
    }[]
  >([]);

  const columnDefs: ColDef[] = [
    { field: "Bin/Range", width: 100 },
    { field: "Frequency Loss", width: 150 },
    { field: "Lots", width: 180 },
  ];

  useEffect(() => {
    let totalFrequencyLoss: number = 0;
    let totalLots: number = 0;
    props.histogramData.forEach((value, index) => {
      totalFrequencyLoss += Number(value["frequency"]);
      totalLots += Number(value["lots"].toFixed(2));
      rowData.current.push({
        "Bin/Range":
          index + 1 === props.histogramData.length
            ? "More"
            : `${`${Number(value["bin"]).toFixed(2)}`}`,
        "Frequency Loss": value["frequency"],
        Lots: Number(value["lots"].toFixed(2)),
      });
    });
    rowData.current.push({
      "Bin/Range": "Total",
      "Frequency Loss": totalFrequencyLoss.toFixed(2),
      "Lots": totalLots,
    });
  }, [props.histogramData]);

  return (
    <>
      <div
        className={`ag-theme-balham-dark ag-theme-red`}
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

export default LossHistogram;
