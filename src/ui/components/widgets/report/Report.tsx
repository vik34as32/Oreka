import {
ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  ToolPanelVisibleChangedEvent,
} from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  WidgetHandles,
  WidgetProps,
} from "../../../canvas/services/WidgetService";
import { Autocomplete, Box, TextField } from "@mui/material";
import Loader from "../../common/loader/Loader";

export type UniqueKeyColType = {
  colId: string;
  value: any;
};

type GridParams = {
  gridApi: GridApi | null;
  columnApi: ColumnApi | null;
};

export interface ReportProps extends WidgetProps {}
interface ReportType {
  name: string;
  endPoint: string;
  colDefs:ColDef[]
}
const reportTypes: ReportType[] = [
  {
    name: "Profit Base Effect",
    endPoint: "profitbaseeffect",
    colDefs:[
        {
            field:"80% Confident",
            headerName:"80% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"95% Confident",
            headerName:"95% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Broker",
            headerName:"Broker",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"COV",
            headerName:"COV",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Coefficient of MAD",
            headerName:"Coefficient of MAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Coefficient of WMAD",
            headerName:"Coefficient of WMAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Company",
            headerName:"Company",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Entry Price",
            headerName:"Entry Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Side",
            headerName:"Entry Side",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Time",
            headerName:"Entry Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Price",
            headerName:"Exit Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Time",
            headerName:"Exit Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Kurtosis UnBiased",
            headerName:"Kurtosis UnBiased",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Login",
            headerName:"Login",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"MAD",
            headerName:"MAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Max",
            headerName:"Max",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Mean (Avg)",
            headerName:"Mean (Avg)",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Min",
            headerName:"Min",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"No Of Trades",
            headerName:"No Of Trades",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Point",
            headerName:"Point",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Pop Kurtosis (Biased)",
            headerName:"Pop Kurtosis (Biased)",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Pop Skewness (Biased)",
            headerName:"Pop Skewness (Biased)",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"RS Deviation",
            headerName:"RS Deviation",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Range",
            headerName:"Range",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Running Sum (RS) Vol",
            headerName:"Running Sum (RS) Vol",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Skewness UnBiased",
            headerName:"Skewness UnBiased",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Standard Deviation",
            headerName:"Standard Deviation",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Standard Error",
            headerName:"Standard Error",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"SubBroker",
            headerName:"SubBroker",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Symbol",
            headerName:"Symbol",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Time Duration",
            headerName:"Time Duration",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"User",
            headerName:"User",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Variance",
            headerName:"Variance",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Volume",
            headerName:"Volume",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted 80% Confident",
            headerName:"Weighted 80% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted 95% Confident",
            headerName:"Weighted 95% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted COV",
            headerName:"Weighted COV",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted MAD",
            headerName:"Weighted MAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted Mean",
            headerName:"Weighted Mean",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted RS Deviation",
            headerName:"Weighted RS Deviation",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted SD",
            headerName:"Weighted SD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted SE",
            headerName:"Weighted SE",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted Variance",
            headerName:"Weighted Variance",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        }
    ]
  },
  {
    name: "Loss Base Effect",
    endPoint: "lossbaseeffect",
    colDefs:[
        {
            field:"80% Confident",
            headerName:"80% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"95% Confident",
            headerName:"95% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Broker",
            headerName:"Broker",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"COV",
            headerName:"COV",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Coefficient of MAD",
            headerName:"Coefficient of MAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Coefficient of WMAD",
            headerName:"Coefficient of WMAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Company",
            headerName:"Company",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Entry Price",
            headerName:"Entry Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Side",
            headerName:"Entry Side",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Time",
            headerName:"Entry Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Price",
            headerName:"Exit Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Time",
            headerName:"Exit Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Kurtosis UnBiased",
            headerName:"Kurtosis UnBiased",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Login",
            headerName:"Login",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"MAD",
            headerName:"MAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Max",
            headerName:"Max",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Mean (Avg)",
            headerName:"Mean (Avg)",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Min",
            headerName:"Min",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"No Of Trades",
            headerName:"No Of Trades",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Point",
            headerName:"Point",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Pop Kurtosis (Biased)",
            headerName:"Pop Kurtosis (Biased)",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Pop Skewness (Biased)",
            headerName:"Pop Skewness (Biased)",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"RS Deviation",
            headerName:"RS Deviation",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Range",
            headerName:"Range",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Running Sum (RS) Vol",
            headerName:"Running Sum (RS) Vol",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Skewness UnBiased",
            headerName:"Skewness UnBiased",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Standard Deviation",
            headerName:"Standard Deviation",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Standard Error",
            headerName:"Standard Error",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"SubBroker",
            headerName:"SubBroker",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Symbol",
            headerName:"Symbol",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Time Duration",
            headerName:"Time Duration",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"User",
            headerName:"User",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Variance",
            headerName:"Variance",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Volume",
            headerName:"Volume",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted 80% Confident",
            headerName:"Weighted 80% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted 95% Confident",
            headerName:"Weighted 95% Confident",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted COV",
            headerName:"Weighted COV",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted MAD",
            headerName:"Weighted MAD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted Mean",
            headerName:"Weighted Mean",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted RS Deviation",
            headerName:"Weighted RS Deviation",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted SD",
            headerName:"Weighted SD",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted SE",
            headerName:"Weighted SE",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Weighted Variance",
            headerName:"Weighted Variance",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        }
    ]
  },
  {
    name: "Balance Analysis",
    endPoint: "balanceanalysis",
    colDefs:[
        {
            field:"Balance",
            headerName:"Balance",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"DealId",
            headerName:"DealId",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Entry Action",
            headerName:"Entry Action",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Price",
            headerName:"Entry Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Volume",
            headerName:"Entry Volume",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Action",
            headerName:"Exit Action",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit DealId",
            headerName:"Exit DealId",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Order",
            headerName:"Exit Order",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Price",
            headerName:"Exit Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Timer",
            headerName:"Exit Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Exit Volume",
            headerName:"Exit Volume",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Login",
            headerName:"Login",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Loss Point",
            headerName:"Loss Point",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Multiplier",
            headerName:"Multiplier",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Order",
            headerName:"Order",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Profit Point",
            headerName:"Profit Point",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Symbol",
            headerName:"Symbol",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Time",
            headerName:"Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        }
    ]
  },
  {
    name: "Position Analysis",
    endPoint: "positionanalysis",
    colDefs:[
        {
            field:"Current Price",
            headerName:"Current Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"DealId",
            headerName:"DealId",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Entry Action",
            headerName:"Entry Action",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Price",
            headerName:"Entry Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Entry Volume",
            headerName:"Entry Volume",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"High Price",
            headerName:"High Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"High Time",
            headerName:"High Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Login",
            headerName:"Login",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Low Price",
            headerName:"Low Price",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Low Time",
            headerName:"Low Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Order",
            headerName:"Order",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        },
        {
            field:"Symbol",
            headerName:"Symbol",
            filter:"agTextColumnFilter",
            enablePivot:true,
            enableRowGroup:true,
            enableValue:false
        },
        {
            field:"Time",
            headerName:"Time",
            filter:"agNumberColumnFilter",
            enablePivot:true,
            enableRowGroup:false,
            enableValue:true
        }
    ]
  },
];
interface DataType {
    [id:string]:any
}
const ReportComponent = React.forwardRef<WidgetHandles, ReportProps>(
  (props: ReportProps, ref): ReactElement => {
    const [gridParams, setGridParams] = useState<GridParams>({
      gridApi: null,
      columnApi: null,
    });
    const [report, setReport] = useState<ReportType>(reportTypes[0]);
    const [data,setData] = useState<DataType[]>([]);
    const [loader, setLoader] = useState<boolean>(false);

    const onGridReady = useCallback((params: GridReadyEvent) => {
      const updatedGridParams = { ...gridParams };
      updatedGridParams.gridApi = params.api;
      updatedGridParams.columnApi = params.columnApi;
      setGridParams(updatedGridParams);
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        setLoader(true);
        const res = await fetch(
          `https://auttrading.com:18080/${report.endPoint}`
        );
        const tableData = await res.json();
        setData(tableData.data);
        setLoader(false);
      };
      fetchData();
    }, [report]);

    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        sx={{ backgroundColor: "#13171F", pt: 1 }}
      >
        <Autocomplete
          value={report}
          onChange={(event: any, newValue: ReportType | null) => {
            if (newValue) setReport(newValue);
          }}
          options={reportTypes}
          renderInput={(params) => <TextField {...params} label="Table" />}
          getOptionLabel={(option) => option.name}
          disablePortal
          size="small"
          sx={{ width: 300, mb: 1 }}
        />
        <Box sx={{height:"100%"}}>
          {loader ? (
            <Loader size={20} />
          ) : (
            <div
              className={`ag-theme-balham-dark`}
              style={{ height: "100%", width: "100%" }}
            >
              <AgGridReact
                onGridReady={(params) => onGridReady(params)}
                sideBar={true}
                rowData={data}
                columnDefs={report.colDefs}
                asyncTransactionWaitMillis={333}
                autoGroupColumnDef={{ sortable: true, resizable: true }}
                defaultColDef={{ resizable: true, sortable: true }}
                gridOptions={{
                  groupIncludeTotalFooter: true,
                  suppressAggFuncInHeader: true,
                  suppressRowClickSelection: true,
                  rowSelection: "multiple",
                }}
              />
            </div>
          )}
        </Box>
      </Box>
    );
  }
);

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {};
}
export default React.memo(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    ReportComponent
  )
);
