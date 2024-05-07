import { ColDef } from "ag-grid-community";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef } from "react";
import "../../../../assets/css/aggrid_custom.css";

type WeightedStatisticalAnalysisProps = {
  weightedStatisticalAnalysisData: any[];
  openValue: number;
};

const WeightedStatisticalAnalysis = (
  props: WeightedStatisticalAnalysisProps
) => {
  const rowData = useRef<
    {
      "Statistical Components": string;
      "Point profits": string;
      "Point profits%": string;
      PP: string;
      "PP%": string;
      "Point Loss": string;
      "Point Loss%": string;
      PL: string;
      "PL%": string;
    }[]
  >([]);

  const columnDefs: ColDef[] = [
    { field: "Statistical Components", width: 160 },
    { field: "Point profits", width: 100 },
    { field: "Point profits%", width: 110 },
    { field: "PP", width: 50 },
    { field: "PP%", width: 70 },
    { field: "Point Loss", width: 90 },
    { field: "Point Loss%", width: 100 },
    { field: "PL", width: 70 },
    { field: "PL%" },
  ];

  useEffect(() => {
    props.weightedStatisticalAnalysisData.forEach((value, index) => {
      rowData.current.push({
        "Statistical Components": value["Statistical Components"],
        "Point profits": value["Point profits"],
        "Point profits%": props.openValue === 0 ? "0" : `${(
          (value["Point profits"] / props.openValue) *
          100
        ).toFixed(2)}%`,
        PP: value["PP"],
        "PP%":
          props.openValue === 0
            ? "0"
            : `${((value["PP"] / props.openValue) * 100).toFixed(2)}%`,
        "Point Loss": value["Point Loss"],
        "Point Loss%":
          props.openValue === 0
            ? "0"
            : `${((value["Point Loss"] / props.openValue) * 100).toFixed(2)}%`,
        PL: value["PL"],
        "PL%":
          props.openValue === 0
            ? "0"
            : `${((value["PL"] / props.openValue) * 100).toFixed(2)}%`,
      });
    });
  }, [props.weightedStatisticalAnalysisData]);

  return (
    <>
      <div
        className={`ag-theme-balham-dark ag-theme-statistical`}
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

export default WeightedStatisticalAnalysis;
