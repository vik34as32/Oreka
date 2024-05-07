import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputLabel, TextField, Typography, createFilterOptions } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { fetchRejectLimitSettings, updateRejectLimitSettings } from "../../../redux/action-handlers/app/SettingAction";

type RejectLimitSettingProps = {
    open: boolean;
    handleClose: () => void;
    symbolList: string[];
    loginList: Login[];
    updateRejectLimitSetting:(clientLimits:any[]) => void;
}

type Login = {
    login: string;
    name: string;
};

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 10,
});


const RejectLimitSetting:React.FC<RejectLimitSettingProps> = (props: RejectLimitSettingProps):ReactElement => {
    if (!props.loginList || !props.symbolList) return <></>;

    const [symbol, setSymbol] = useState<string>(props.symbolList[0]);
    const [login, setLogin] = useState<Login>(props.loginList[0]);
    const [buyLimit, setBuyLimit] = useState<string>("");
    const [sellLimit, setSellLimit] = useState<string>("");
    const [limit, setLimit] = useState<string>("");


    const executeRejectLimit = () => {
        // props.updateRejectLimitSetting([{
        //     login,
        //     symbolgroup:symbol,
        //     symbolwisebuylimit:buyLimit,
        // }])
        // TODO: confirm actual format of request
    }

    return (
        <>
            <Dialog
                open={props.open}
                fullWidth
                PaperProps={{
                    sx: {
                        background: "#131722",
                        width: 600,
                        height: 300
                    },
                }}
                maxWidth={false}
                onClose={() => props.handleClose()}
            >
                <DialogTitle
                    style={{ display: "flex", justifyContent: "space-between", height: 40 }}
                    sx={{ pt: 1, pb: 1 }}
                >
                    <Typography className="header-text">
                        Reject Limit Setting
                    </Typography>
                    <IconButton onClick={() => props.handleClose()}>
                        <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box

                    >
                        <Grid
                            container
                            sx={{ alignItems: "center", pl: 2, mb: 3 }}
                            spacing={2}
                            direction={"row"}
                        >
                            <Grid xs={5.75}>
                                <Box sx={{ mt: 1 }}>
                                    <InputLabel sx={{ color: "#D5E2F0", pb: 1, pt: 1 }} className="label-text">
                                        Login
                                    </InputLabel>
                                    <Autocomplete
                                        ListboxProps={{
                                            sx: {
                                                border: 1,
                                                borderColor: "#2B3349"
                                            }
                                        }}
                                        className="normal-text"
                                        value={login}
                                        defaultValue={login}
                                        filterOptions={filterOptions}
                                        onChange={(e, newItem: Login) =>
                                            newItem ? setLogin(newItem) : null
                                        }
                                        isOptionEqualToValue={(option: Login, value: Login) =>
                                            option.login === value.login
                                        }
                                        options={props.loginList}
                                        renderOption={(props, option) => (<Typography  {...props} variant="body1">{`${option.login}-${option.name.slice(0, 20)}`}</Typography>)}
                                        getOptionLabel={(option: Login) => `${option.login}-${option.name.slice(0, 20)}`}
                                        renderInput={(params) => (
                                            <TextField
                                                className="normal-text"
                                                {...params}
                                                size="small"
                                                type={"text"}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    tabIndex: 1
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
                                </Box>
                            </Grid>
                            <Grid xs={0.5}>

                            </Grid>
                            <Grid xs={5.75}>
                                <Box sx={{ mt: 1 }}>
                                    <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                                        Symbol
                                    </InputLabel>
                                    <Autocomplete
                                        ListboxProps={{
                                            sx: {
                                                border: 1,
                                                borderColor: "#2B3349"
                                            }
                                        }}
                                        options={props.symbolList}
                                        value={symbol}
                                        filterOptions={filterOptions}
                                        onChange={(e, newItem: string) =>
                                            newItem ? setSymbol(newItem) : null
                                        }

                                        renderOption={(props, option) => (<Typography   {...props} variant="body1">{option}</Typography>)}
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
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{ alignItems: "center", pl: 2 }}
                            spacing={2}
                            direction={"row"}
                        >
                            <Grid xs={3.66}>
                                <Box sx={{ mt: 1 }}>
                                    <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                                        Buy Limit
                                    </InputLabel>
                                    <TextField
                                        className="normal-text"
                                        value={buyLimit}
                                        onChange={e => setBuyLimit(e.target.value)}
                                        size="small"
                                        type="number"
                                        inputProps={{
                                            tabIndex: 3
                                        }}
                                        InputProps={{
                                            className: "normal-text",
                                            sx: {
                                                height: 45,
                                                background: "#0A0A0A",
                                            },
                                        }}
                                        sx={{ width: 1 }}
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid xs={0.5}></Grid>
                            <Grid xs={3.66}>
                                <Box sx={{ mt: 1 }}>
                                    <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                                        Sell Limit
                                    </InputLabel>
                                    <TextField
                                        className="normal-text"
                                        value={sellLimit}
                                        onChange={e => setSellLimit(e.target.value)}
                                        size="small"
                                        type="number"
                                        inputProps={{
                                            tabIndex: 4
                                        }}
                                        InputProps={{
                                            className: "normal-text",
                                            sx: {
                                                height: 45,
                                                background: "#0A0A0A",
                                            },
                                        }}
                                        sx={{ width: 1 }}
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid xs={0.5}></Grid>
                            <Grid xs={3.66}>
                                <Box sx={{ mt: 1 }}>
                                    <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                                        Limit
                                    </InputLabel>
                                    <TextField
                                        className="normal-text"
                                        value={limit}
                                        onChange={e => setLimit(e.target.value)}
                                        size="small"
                                        type="number"
                                        inputProps={{
                                            tabIndex: 5
                                        }}
                                        InputProps={{
                                            className: "normal-text",
                                            sx: {
                                                height: 45,
                                                background: "#0A0A0A",
                                            },
                                        }}
                                        sx={{ width: 1 }}
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button tabIndex={10} onClick={executeRejectLimit} variant="contained" sx={{ textTransform: "none", width: "136px" }} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function mapStateToProps(state: any) {
    return {
      symbolList: state.app.symbolList,
      loginList: state.app.clientList
    };
  }
  
  function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
      updateRejectLimitSetting:(clientLimits:any[]) => updateRejectLimitSettings(clientLimits)
    };
  }


export default connect(mapStateToProps, mapDispatchToProps)(RejectLimitSetting);