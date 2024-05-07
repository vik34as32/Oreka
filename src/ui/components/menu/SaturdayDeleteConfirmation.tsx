import { Box, Divider, Grid, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";

export type PositionConfirmation = {
    time: string;
    message: string;
    type: string;
}

interface SaturdayDeleteConfirmationProps {
    confirmationMessages: PositionConfirmation[];
}


const SaturdayDeleteConfirmation = (props: SaturdayDeleteConfirmationProps) => {

    

    const [columnDefs, setColumnDefs] = useState([
        { field: 'time' },
        { field: 'message' },
        { field: 'type' }
    ]);


    return (
        <>
            <div
                className={`ag-theme-balham-dark`}
                style={{ height: 250, width: "100%" }}
            >
                <AgGridReact
                    rowData={props.confirmationMessages}
                    defaultColDef={{ resizable: true, sortable: true }}
                    columnDefs={columnDefs}
                    animateRows={true}
                >
                </AgGridReact>

            </div>
        </>
    )
}


export default SaturdayDeleteConfirmation;