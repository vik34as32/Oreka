import CloseIcon from "@mui/icons-material/Close";
import {
Box,
Button,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
Divider,
IconButton,
TextField,
Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridReadyEvent, RowNode } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import dayjs, { Dayjs } from "dayjs";
import { MuiFileInput } from "mui-file-input";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setAlertMessage } from "../../../redux/action-handlers/app/AppActions";
import {
sendClosingDateAndName,
sendClosingUpdateData,
} from "../../../redux/action-handlers/app/SettingAction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FILE_UPLOAD_ENDPOINT = import.meta.env.VITE_FILE_UPLOAD_ENDPOINT;

type ClosingUpdateProp = {
  open: boolean;
  handleClose: () => void;
  sendClosingDateAndName: (closingDate: string, fileName: string) => void;
  sendClosingUpdateData: (data: any[]) => void;
  data: ClosingUpdateData[];
  setAlertMessage: (message: string, messageType: string) => void;
};

const CheckBoxRender = (props) => {
  const checkHandler = (event) => {
    let checked = event.target.checked;
    let colId = props.column.colId;
    props.node.setDataValue(colId, checked);
  };
  return (
    <input type="checkbox" onChange={checkHandler} checked={props.value} />
  );
};
const columnDefs:ColDef[] = [
  {
    field:"ignore",
    headerName:"Ignore",
    editable:true,
    cellEditor:"agSelectCellEditor",
    cellRenderer:CheckBoxRender,
    width:100
  }
  ,
  {
    field: "mtsymbol",
    headerName: "Mt Symbol",
    filter: "agTextColumnFilter",
    editable: true,
  },
  {
    field: "exsymbol",
    headerName: "Exchange Symbol",
    filter: "agTextColumnFilter",
    editable: true,
  },
  {
    field: "closingprice",
    headerName: "Closing Price",
    filter: "agNumberColumnFilter",
    editable: true,
  },
  {
    field: "high",
    headerName: "High",
    filter: "agNumberColumnFilter",
    editable: true,
  },
  {
    field: "low",
    headerName: "Low",
    filter: "agNumberColumnFilter",
    editable: true,
  },
]
export interface ClosingUpdateData {
  ignore?:boolean,
  mtsymbol:string,
  exsymbol:string,
  closingprice:number,
  high:number,
  low:number
}
const ClosingUpdate = (props: ClosingUpdateProp) => {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [gridApi,setGridApi] = useState<GridApi|null>(null);
  const [colApi,setColApi] = useState<ColumnApi|null>(null);

  const handleFileSubmit = (fileName: string) => {
    if (fileName && date) {
      props.setAlertMessage("File uploaded successfully", "success");
      props.sendClosingDateAndName(date.format("DD-MMM-YYYY"), fileName);
    } else {
      props.setAlertMessage("Error in uploading the file", "warning");
    }
  };

  const handleFileUpload = () => {
    if (file !== null) {
      const formData = new FormData();
      formData.append("File", file, file.name);
      fetch(`${API_BASE_URL}${FILE_UPLOAD_ENDPOINT}`, {
        method: "POST",
        body: formData,
        redirect: "follow",
      })
        .then((res) => res.json())
        .then((res) => handleFileSubmit(res[0]));
    } else {
      props.setAlertMessage("Please upload file", "error");
    }
  };

  const updateClosingUpdate = () => {
    const data: any = [];
    if (gridApi) {
      gridApi.forEachNode((node:RowNode) => {
        if(node.data.ignore) 
          data.push(node.data);
      });
      props.sendClosingUpdateData(data);
    }
  };
  const onGridReady = useCallback((event:GridReadyEvent) => {
    setGridApi(event.api);
    setColApi(event.columnApi);
  },[]);
  
  const onFirstDataRendered = useCallback((event:FirstDataRenderedEvent) => {
    const data:ClosingUpdateData[] = []; 
    event.api.forEachNode(rowNode => {
      rowNode.data.ignore = true;
      data.push(rowNode.data);
    });
    event.api.setRowData(data);
  },[]);

  return (
    <>
      <Dialog
        open={props.open}
        fullWidth
        PaperProps={{
          sx: {
            background: "#13171F",
            width: 800,
          },
        }}
        maxWidth={false}
        onClose={() => props.handleClose()}
      >
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
          sx={{ pt: 1, pb: 1 }}
        >
          <Typography
            className="header-text"
            sx={{ display: "contents", alignContent: "center" }}
          >
            Closing Update
          </Typography>
          <IconButton onClick={() => props.handleClose()}>
            <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  mb: 3,
                  color: "#D5E2F0",
                  fontFamily: "Inter",
                  fontSize: 14,
                }}
              >
                Re upload MT Position File
              </Typography>
              <Box sx={{ display: "flex", height: 40, mr: 3 }}>
                <MuiFileInput
                  label="Choose file"
                  placeholder="Choose a file"
                  value={file}
                  size="small"
                  onChange={(file) => setFile(file)}
                  sx={{ mr: 1, height: "inherit", width: 300 }}
                  InputProps={{
                    sx: {
                      height: 40,
                      color: "#D5E2F0",
                      fontSize: 12,
                      fontFamily: "Inter",
                    },
                  }}
                  className="normal-text"
                />
                <Button
                  onClick={() => handleFileUpload()}
                  tabIndex={3}
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Upload
                </Button>
              </Box>
            </Box>
            <Box sx={{ width: 2, mr: 3 }}>
              <Divider
                sx={{ width: 2 }}
                color="#2B3348"
                orientation="vertical"
              />
            </Box>

            <Box sx={{width:1}}>
              <Typography
                sx={{
                  mb: 3,
                  color: "#D5E2F0",
                  fontFamily: "Inter",
                  fontSize: 14,
                }}
              >
                Select Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Choose from calender"
                  value={date}
                  inputFormat="DD-MM-YYYY"
                  disableFuture
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: 1 }}
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          height: 40,
                          color: "#D5E2F0",
                          fontSize: 14,
                          fontFamily: "Inter",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>
          <div
            className={`ag-theme-balham-dark`}
            style={{ height: 350, width: "100%" }}
          >
            <AgGridReact
              onGridReady={onGridReady}
              rowData={props.data}
              defaultColDef={{ resizable: true, sortable: true }}
              columnDefs={columnDefs}
              onFirstDataRendered={onFirstDataRendered}
              animateRows={true}
            ></AgGridReact>
          </div>
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button
            tabIndex={9}
            onClick={() => props.handleClose()}
            variant="outlined"
            sx={{
              borderColor: "#2B3349",
              color: "white",
              width: "125px",
              textTransform: "none",
            }}
          >
            Close
          </Button>
          <Button
            tabIndex={9}
            onClick={() => updateClosingUpdate()}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Update to server
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    data: state.setting.closingUpdate.data,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    sendClosingDateAndName: (closingDate: string, fileName: string) => sendClosingDateAndName(closingDate, fileName),
    sendClosingUpdateData: (data: any[]) => sendClosingUpdateData(data),
    setAlertMessage: (message: string, messageType: string) =>
      dispatch(setAlertMessage(message, messageType)),
  };
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(ClosingUpdate));
