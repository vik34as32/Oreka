import "@finos/perspective-viewer";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer/dist/css/vaporwave.css";
import React, { useEffect } from "react";
import "../../../../assets/css/profit_loss_chart.css";
import perspective, {
  Aggregate,
  ColumnName,
  PerspectiveWorker,
  Schema,
  Table,
  TableData,
  Type,
} from "@finos/perspective";
import {
  HTMLPerspectiveViewerElement,
  PerspectiveViewerConfig,
} from "@finos/perspective-viewer";

type ChartProps = {
  profitData: any[];
  potentialProfitData: any[];
  lossData: any[];
  potentialLossData: any[];
};

const Chart = (props: ChartProps) => {
  const viewer = React.useRef<HTMLPerspectiveViewerElement>(null);
  const worker = React.useRef<PerspectiveWorker | null>(null);
  const table = React.useRef<Table | undefined>();
  const [isTableReady, setIsTableReady] = React.useState<boolean>(false);
  const tableData: TableData = {
    Bin: [],
    "Frequency Profit": [],
    "Frequency PP": [
      
    ],
    "Frequency Loss": [
    ],
    "Frequency PL": [
    ],
  };

  const schema = {
    Bin: "integer",
    "Frequency Profit": "integer",
    "Frequency PP": "integer",
    "Frequency Loss": "integer",
    "Frequency PL": "integer",
  };

  const setData = async (data: any) => {
    if (!worker.current) return;
    const buffer = data;
    return await worker.current.table(buffer);
  };

  function getChartConfigs(): PerspectiveViewerConfig {
    const configs: PerspectiveViewerConfig = {};
    configs.group_by = ["Bin"];
    configs.columns = [
      "Frequency Profit",
      "Frequency PP",
      "Frequency Loss",
      "Frequency PL",
    ];
    configs.aggregates = {
      "Frequency Profit": "sum",
      "Frequency PP": "sum",
      "Frequency Loss": "sum",
      "Frequency PL": "sum",
    };
    configs.plugin = "Y Line";
    return configs;
  }

  useEffect(() => {
    props.profitData.forEach((value, index) => {
      tableData["Frequency Profit"].push(value["frequency"]);
      tableData["Bin"].push(value["bin"]);
    });
    props.potentialProfitData.forEach((value, index) => {
      tableData["Frequency PP"].push(value["frequency"]);
    });
    props.lossData.forEach((value, index) => {
      tableData["Frequency Loss"].push(value["frequency"]);
    });
    props.potentialLossData.forEach((value, index) => {
      tableData["Frequency PL"].push(value["frequency"]);
    });
  }, [props.profitData]);

  useEffect(() => {
    worker.current = perspective.worker();
    setData(schema).then((tb) => {
      if (tb && viewer.current) {
        viewer.current.load(tb).then((x) => {
          table.current = tb;
          table.current?.update(tableData);
          setIsTableReady(true);
        });
        viewer.current.restyleElement();
      }
    });
  }, []);

  useEffect(() => {
    if (isTableReady) {
      viewer.current?.restore(getChartConfigs());
    }
  }, [isTableReady]);

  return (
    <div className="ProfitLossChart">
      <perspective-viewer ref={viewer}></perspective-viewer>
    </div>
  );
};

export default React.memo(Chart);
