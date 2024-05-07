import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
createFilterOptions,
} from "@mui/material";
import { ColDef, ColumnApi, GridApi, GridReadyEvent, RowNode } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { fetchRejectLimitSettings, fetchAllSymbolGroup, updateRejectLimitSettings } from "../../../../redux/action-handlers/app/SettingAction";
// import { DeleteButtonCellRenderer } from "../../../../utilities/cell-renderer/DeleteButtonCellRenderer";

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 10,
});

export interface LoginSettingsProps {
  open: boolean;
  onClose: () => void;
  loginValue: string;
  fetchRejectLimitSettings: (loginValue: string) => void;
  rejectLimitSettings: any[];
  fetchAllSymbolGroup: () => void;
  symbolGroups:string[];
  updateRejectLimitSettings:(clientLimits:any[]) => void;
}
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

const colDefs: ColDef[] = [
  // {
  //   field: "login",
  //   headerName: "Login",
  //   filter: "agTextColumnFilter",
  // },
  {
    field: "symbolgroup",
    headerName: "Symbol Group",
    filter: "agTextColumnFilter",
  },
  {
    field: "symbolwisebuylimit",
    headerName: "Buy Limit",
    filter: "agNumberColumnFilter",
    editable: true,
  },
  {
    field: "symbolwiseselllimit",
    headerName: "Sell Limit",
    filter: "agNumberColumnFilter",
    editable: true,
  },
  {
    field: "symbolwisependingorderenabledisable",
    headerName: "Pending Order",
    cellEditor:"agSelectCellEditor",
    cellRenderer:CheckBoxRender,
    editable: true,
  },
  {
    field: "symbolPositionLimit",
    headerName: "Position Limit",
    filter: "agNumberColumnFilter",
    editable: true,
  },
  {
    field: "qtyLimitMultiplayer",
    headerName: "Qty Limit Multiplyer",
    filter: "agNumberColumnFilter",
    editable: true,
  },
  {
    field:"delete",
  }
];

const LoginSettings: React.FC<LoginSettingsProps> = (
  props: LoginSettingsProps
): ReactElement => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [colApi, setColApi] = useState<ColumnApi | null>(null);
  const [symbolGroup,setSymbolGroup] = useState<string>("");
  const rowIds = useRef<Set<string>>(new Set<string>());

  useEffect(() => {
    if (props.open) {
      props.fetchRejectLimitSettings(props.loginValue);
      props.fetchAllSymbolGroup();
    }
  }, [props.open]);
  useEffect(() => {
    if(!gridApi) return;
    rowIds.current.clear();
    props.rejectLimitSettings.forEach(setting => {
      rowIds.current.add(setting.symbolgroup);
    })
  },[props.rejectLimitSettings, gridApi]);
  const handleClose = useCallback(() => {
    props.onClose();
  },[])
  const addData = useCallback(() => {
    if (!gridApi) return;
    if(rowIds.current.has(symbolGroup)) return;
    rowIds.current.add(symbolGroup);
    gridApi.applyTransaction({
      add: [{ login: props.loginValue, symbolgroup: symbolGroup }],
    });
  }, [gridApi,symbolGroup]);
  const updateRejectLimitSettings = useCallback(() => {
    if(!gridApi) return;
    const data: any = [];
    if (gridApi) {
      gridApi.forEachNode((node:RowNode) => {
          data.push(node.data);
      });
      props.updateRejectLimitSettings(data);
    }
  },[gridApi]);
  const removeSymbolGroupSetting = useCallback((symbolGroup:string) => {
    rowIds.current.delete(symbolGroup);
  },[]);
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
    setGridApi(params.api);
    setColApi(params.columnApi);
    const deleteColDef = params.api.getColumnDef("delete");
    if(!deleteColDef) return;
    deleteColDef.cellRenderer = DeleteButtonCellRenderer;
    deleteColDef.cellRendererParams = {
      handleDelete:removeSymbolGroupSetting
    }
  }, []);
  const getRowId = useCallback((rowData:any) => {
    return rowData.data.symbolgroup;
  },[]);
  return (
    <Dialog
      open={props.open}
      fullWidth
      PaperProps={{
        sx: {
          background: "#131722",
        },
      }}
      maxWidth={"md"}
      onClose={() => props.onClose()}
    >
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography
          className="header-text"
          sx={{ marginLeft: "-8px" }}
          variant="h6"
          fontWeight={700}
        >
          Login Settings
        </Typography>
        <IconButton onClick={() => props.onClose()}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 1 }}>
          <Box display={"flex"}>
            <TextField
              sx={{ p: 1 }}
              InputProps={{sx:{
                height: 45,
                background: "#0A0A0A",
              }}}
              size="small"
              disabled
              value={props.loginValue}
            />
            <Autocomplete
              ListboxProps={{
                sx: {
                  border: 1,
                  borderColor: "#2B3349",
                },
              }}
              options={props.symbolGroups}
              value={symbolGroup}
              sx={{
                p:1
              }}
              filterOptions={filterOptions}
              onChange={(e, newItem: string, reason) =>
                newItem ? setSymbolGroup(newItem) : null
              }
              renderOption={(props, option) => (
                <Typography {...props} variant="body1">
                  {option}
                </Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  type={"text"}
                  inputProps={{
                    ...params.inputProps,
                    tabIndex: 2,
                  }}
                  InputProps={{
                    ...params.InputProps,
                    className: "normal-text",
                    sx: {
                      height: 45,
                      background: "#0A0A0A",
                    },
                  }}
                  sx={{ width: 1 }}
                  variant="outlined"
                />
              )}
            />
            <Button
              onClick={addData}
              variant="contained"
              sx={{
                textTransform: "capitalize",
                paddingLeft: 1,
                paddingRight: 1,
                height:40,
                paddingTop: 0,
                paddingBottom: 0,
                alignSelf:'center'
              }}
            >
              Add Data
            </Button>
          </Box>
          <div
            className="ag-theme-balham-dark hide-filter"
            style={{
              height: 400,
              width: "100%",
            }}
          >
            <AgGridReact
              onGridReady={onGridReady}
              columnDefs={colDefs}
              rowData={props.rejectLimitSettings}
              getRowId={getRowId}
              defaultColDef={{
                resizable: true,
                sortable: true,
              }}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
      <Button variant="outlined" sx={{ borderColor : "#2B3349",color: "white",width : "125px", textTransform: "none" }} onClick={handleClose}>
          Cancel
        </Button>
        <Button tabIndex={10} variant="contained" sx={{textTransform: "none", width : "136px"}} onClick={updateRejectLimitSettings}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    loginValue: state.setting.loginSettingsModalState.loginValue,
    rejectLimitSettings:
      state.setting.loginSettingsModalState.rejectLimitSettings,
    symbolGroups:state.setting.loginSettingsModalState.symbolGroups
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchRejectLimitSettings: (loginValue: string) =>
      fetchRejectLimitSettings(loginValue),
    fetchAllSymbolGroup: () => fetchAllSymbolGroup(),
    updateRejectLimitSettings: (clientLimits:any[]) => updateRejectLimitSettings(clientLimits)
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(LoginSettings)
);
