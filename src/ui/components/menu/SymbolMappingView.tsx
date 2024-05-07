import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { fetchSymbolMappingData } from "../../../redux/action-handlers/app/SettingAction";


type SymbolMappingViewProp = {
    open: boolean;
    handleClose: () => void;
    mappingData: any[];
    fetchData: () => void;
}


const SymbolMappingView = (props: SymbolMappingViewProp) => {

    const [columnDefs, setColumnDefs] = useState([
        {
            field: "mtsymbol",
            headerName: 'Mt Symbol',
            filter: 'agTextColumnFilter',
        },
        {
            field: "exchangesymbol",
            headerName: 'Exchange Symbol',
            filter: 'agTextColumnFilter',
        },
        {
            field: "nextmtsymbol",
            headerName: 'Next Symbol',
            filter: 'agTextColumnFilter',
        },
        {
            field: "exchangelotsize",
            headerName: 'Exchange Lot Size',
            filter: 'agNumberColumnFilter',
        },
        {
            field: "mtlotsize",
            headerName: 'Mt Lot Size',
            filter: 'agNumberColumnFilter',
        }
    ]);

    useEffect(() => {
        if(props.open) props.fetchData();
    }, [props.open])
    return (
        <>
            <Dialog
                open={props.open}
                fullWidth
                PaperProps={{
                    sx: {
                        background: "#13171F",
                        maxWidth: 1100,
                    },
                }}
                maxWidth={false}
                onClose={() => props.handleClose()}
            >
                <DialogTitle
                    style={{ display: "flex", justifyContent: "space-between" }}
                    sx={{ pt: 1, pb: 1 }}
                >
                    <Typography className="header-text" sx={{ display: "content", alignContent: "center" }}>
                        View Symbol Mapping
                    </Typography>
                    <IconButton onClick={() => props.handleClose()}>
                        <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <div
                        className={`ag-theme-balham-dark`}
                        style={{ height: 350, width: "100%" }}
                    >
                        <AgGridReact
                            rowData={props.mappingData}
                            defaultColDef={{ resizable: true, sortable: true }}
                            columnDefs={columnDefs}
                            animateRows={true}
                        >
                        </AgGridReact>

                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function mapStateToProps(state: any) {
    return {
        mappingData: state.setting.mappingData
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        fetchData: () => fetchSymbolMappingData()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolMappingView);
