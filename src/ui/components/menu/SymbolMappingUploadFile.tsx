import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setAlertMessage } from "../../../redux/action-handlers/app/AppActions";
import { startFileProcessing } from "../../../redux/action-handlers/app/SettingAction";

type SymbolMappingUploadFileProp = {
    open: boolean;
    handleClose: () => void;
    startFileProcessing: (fileName: string) => void;
    setAlertMessage: (message: string, messageType: string) => void;
}


const SymbolMappingUploadFile = (props: SymbolMappingUploadFileProp) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileSubmit = (fileName: string) => {
        if (file !== null) {
            if (fileName) {
                props.setAlertMessage(`${fileName} uploaded successfully`, "success");

                props.startFileProcessing(fileName);
            }
            else props.setAlertMessage(`${file.name} upload failure`, "danger");
        }

    }

    const handleUpload = () => {
        if (file !== null) {
            const formData = new FormData();
            formData.append("File", file, file.name);
            fetch("https://auttrading.com:4002/UploadFile/api/UploadFile", {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            })
                .then(res => res.json())
                .then(res => handleFileSubmit(res[0]));
        } else {
            props.setAlertMessage("Please select the file", "warning");
        }
    }

    return (
        <>
            <Dialog
                open={props.open}
                fullWidth
                PaperProps={{
                    sx: {
                        background: "#13171F",
                        width: 500,
                    },
                }}
                maxWidth={false}
                onClose={() => props.handleClose()}
            >
                <DialogTitle
                    style={{ display: "flex", justifyContent: "space-between" }}
                    sx={{ pt: 1, pb: 1 }}
                >
                    <Typography className="header-text" sx={{ display: "contents", alignContent: "center" }}>
                        Symbol Mapping
                    </Typography>
                    <IconButton onClick={() => props.handleClose()}>
                        <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box>
                        <Typography sx={{ mb: 3, color: "#D5E2F0", fontFamily: "Inter", fontSize: 16 }}>
                            Upload Symbol Mapping File
                        </Typography>
                        <Box sx={{ display: "flex", height: 40 }}>
                            <MuiFileInput
                                fullWidth
                                label="Choose file"
                                placeholder="Choose a file"
                                value={file}
                                onChange={(file) => setFile(file)}
                                sx={{ height: "inherit" }}
                                InputProps={{
                                    sx: { height: 40 }
                                }}
                                className="normal-text"
                            />

                        </Box>
                    </Box>


                </DialogContent>
                <DialogActions>
                    <Button tabIndex={9} onClick={() => props.handleClose()} variant="outlined" sx={{ borderColor: "#2B3349", color: "white", width: "125px", textTransform: "none" }}>
                        Close
                    </Button>
                    <Button onClick={() => handleUpload()} tabIndex={3} variant="contained" sx={{ textTransform: "none", width: "136px" }} >
                        Upload
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    );
}

function mapStateToProps(state: any) {
    return {

    }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        startFileProcessing: (fileName: string) => dispatch(startFileProcessing(fileName)),
        setAlertMessage: (message: string, messageType: string) => dispatch(setAlertMessage(message, messageType))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolMappingUploadFile);
