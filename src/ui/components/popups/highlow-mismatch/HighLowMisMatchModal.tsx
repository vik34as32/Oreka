import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchHighLowMisMatchData,
  toggleHighLowMisMatchModal,
} from "../../../../redux/action-handlers/app/AppActions";
export type HighLowMisMatchModalProps = {
  highLowMisMatchModalState: boolean;
  closeHighLowMisMatchModal: () => void;
  fetchHighLowMisMatchData: (date: string) => void;
  highLowMisMatchData: HighLowMisMatchData[];
};
// "dealdate":1673457972,"deal":101,"order":206,"login":1001,"symbol":"GOLDFEB","rate":57000,"comment":"TestDeal"
export type HighLowMisMatchData = {
  dealdate: string;
  deal: number;
  order: string;
  login: string;
  symbol: string;
  rate: string;
  comment: string;
};

/*
{
    "dealdate": 1673518795, x
    "deal": 102, x 
    "order": 207,
    "login": 1001, x 
    "symbol": "GOLDFEB", x
    "rate": 57000, x
    "comment": "TestDeal"x
}
*/
const columnDefs = [
  {
    field: "deal",
    headerName: "Deal No.",
    filter: "agNumberColumnFilter",
    sortable: true,
    resizable: true,
    floatingFilter: true,
  },
  {
    field: "login",
    headerName: "Login",
    sortable: true,
    filter: "agTextColumnFilter",
    resizable: true,
    floatingFilter: true,
  },
  {
    field: "dealdate",
    headerName: "Deal Date",
    sortable: true,
    type: "dateColumn",
    filter: "agDateColumnFilter",
    resizable: true,
    floatingFilter: true,
    cellRenderer: (data: ICellRendererParams) => {
      return dayjs.unix(data.value).format("MM/DD/YYYY");
    },
  },

  {
    field: "rate",
    headerName: "Rate",
    sortable: true,
    filter: "agNumberColumnFilter",
    resizable: true,
    floatingFilter: true,
  },
  {
    field: "symbol",
    headerName: "Symbol",
    sortable: true,
    filter: "agTextColumnFilter",
    resizable: true,
    floatingFilter: true,
  },
  {
    field: "order",
    headerName: "Order",
    sortable: true,
    filter: "agNumberColumnFilter",
    resizable: true,
    floatingFilter: true,
  },
  {
    field: "comment",
    headerName: "Comment",
    sortable: true,
    filter: "agTextColumnFilter",
    resizable: true,
    floatingFilter: true,
  },
];
const HighLowMisMatchModal = (props: HighLowMisMatchModalProps) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const gridRef = useRef<any>(null);
  const fetchData = () => {
    if (date) {
      props.fetchHighLowMisMatchData(date.format("DD-MMM-YYYY"));
    }
  };
  useEffect(() => {
    if (props.highLowMisMatchData.length && gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [props.highLowMisMatchData]);
  return (
    <Dialog
      open={props.highLowMisMatchModalState}
      fullWidth
      PaperProps={{
        sx: {
          background: "#131722",
        },
      }}
      maxWidth={props.highLowMisMatchData.length ? "md" : "sm"}
      onClose={() => props.closeHighLowMisMatchModal()}
    >
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography className="header-text" sx={{marginLeft : "-8px"}} variant="h6" fontWeight={700}>
          High low Mismatch
        </Typography>
        <IconButton onClick={() => props.closeHighLowMisMatchModal()}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <InputLabel sx={{ color: "#D5E2F0", pb: 1, pl: 2 }}>
          Select Date
        </InputLabel>
        <Grid
          container
          sx={{ pl: 3, pr: 3, alignItems: "center" }}
          spacing={1}
          direction={"row"}
        >
          <Grid item xs={9} style={{ paddingLeft: 0 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Choose from calender"
                value={date}
                inputFormat="DD-MM-YYYY"
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ width: 1 }}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        height: 50,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: "white", width: 1 , textTransform: "none"}}
              onClick={fetchData}
            >
              Fetch
            </Button>
          </Grid>
          <Grid item xs={12} style={{ padding: "10px 0px" }}>
            <div
              className="ag-theme-balham-dark"
              style={{
                height: 400,
                width: "100%",
                display: props.highLowMisMatchData.length ? "block" : "none",
              }}
            >
              <AgGridReact
                ref={gridRef}
                onGridReady={(params) => {
                  params.api.sizeColumnsToFit();
                }}
                columnDefs={columnDefs}
                rowData={props.highLowMisMatchData}
              />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
function mapStateToProps(state: any) {
  return {
    highLowMisMatchModalState: state.app.highLowMisMatchModalState,
    highLowMisMatchData: state.app.highLowMisMatchData,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    closeHighLowMisMatchModal: () =>
      toggleHighLowMisMatchModal(false, dispatch),
    fetchHighLowMisMatchData: (date: string) => fetchHighLowMisMatchData(date),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighLowMisMatchModal);
