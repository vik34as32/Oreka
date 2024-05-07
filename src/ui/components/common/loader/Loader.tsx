import { Box, CircularProgress } from "@mui/material";
import React, { ReactElement } from "react";

export type LoaderProps = {
    size:number;
    disableShrink?:boolean;
}

const Loader:React.FC<LoaderProps>  = (props):ReactElement => {
    return (
        <Box sx={{ width: "100%", height:"100%", position:"relative"}}>
            <CircularProgress disableShrink={props.disableShrink} size={props.size} sx={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%, -50%)"}}/>
        </Box>
    )
}

export default Loader;