import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputLabel, TextField, Typography, createFilterOptions } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateClientCredit } from "../../../redux/action-handlers/app/SettingAction";


type DefaultClientCreditProps = {
    open: boolean;
    handleClose: () => void;
    loginList: Login[];
    updateClientCredit:(login:string,credit:number) => void;
}

type Login = {
    login: string;
    name: string;
};

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 10,
});

const DefaultClientCredit = (props: DefaultClientCreditProps) => {
    if (!props.loginList) return null;

    const [login, setLogin] = useState<Login>(props.loginList[0]);
    const [limit, setLimit] = useState<number>(0);

    const onSubmit = () => {
        props.updateClientCredit(login.login,limit);
    }

    return (
        <>
            <Dialog
                open={props.open}
                fullWidth
                PaperProps={{
                    sx: {
                        background: "#131722",
                    },
                }}
                maxWidth={"sm"}
                onClose={() => props.handleClose()}
            >
                <DialogTitle
                    style={{ display: "flex", justifyContent: "space-between"}}
                    sx={{ pt: 1, pb: 1 }}
                >
                    <Typography className="header-text">
                        Default Client Credit
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
                            sx={{ alignItems: "center", pl: 2, mb: 1 }}
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
                                        Limit
                                    </InputLabel>
                                    <TextField
                                        className="normal-text"
                                        value={limit}
                                        onChange={e => setLimit(Number(e.target.value))}
                                        size="small"
                                        type="number"
                                        inputProps={{
                                            tabIndex: 2
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
                <DialogActions sx={{mr : 2}}>
                    <Button tabIndex={3} onClick={onSubmit} variant="contained" sx={{ textTransform: "none", width: "136px" }} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


function mapStateToProps(state: any) {
    return {
        loginList: state.app.clientList
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        updateClientCredit:(login:string,credit:number) => updateClientCredit(login,credit)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClientCredit);