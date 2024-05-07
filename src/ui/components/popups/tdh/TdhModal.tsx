import { ArrowDropDown, KeyboardArrowDown } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
Autocomplete,
Box,
Button,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
Grid,
IconButton,
InputLabel,
MenuItem,
Select,
TextField,
Typography,
createFilterOptions,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { executeTdh, toggleTdhModal } from "../../../../redux/action-handlers/app/AppActions";

export type TdhModalProps = {
  tdhModalState: boolean;
  symbolList:string[];
  loginList:Login[];
  openTdhModal: (open: boolean) => void;
  executeTdh:(tdhData:TdhData) => void;
};
export type TdhData = {
    executionType: string;
    buyLogin:{login:number,lot:number};
    sellLogin: {login:number,lot:number},
    buyRate: number,
    sellRate: number,
    buySymbol: string,
    sellSymbol: string,
}

type Login = {
  login:string;
  name:string;
};
const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 10,
});
const TdhModal = (props: TdhModalProps) => {

  if(!props.loginList || !props.symbolList) return null;

  const [executionType, setExecutionType] = useState<string>("market");
  const [buySymbol, setBuySymbol] = useState<string>(props.symbolList[0]);
  const [sellSymbol, setSellSymbol] = useState<string>(props.symbolList[0]);
  const [buyLot, setBuyLot] = useState<string>("");
  const [sellLot, setSellLot] = useState<string>("");
  const [buyLogin, setBuyLogin] = useState<Login>(props.loginList[0]);
  const [sellLogin, setSellLogin] = useState<Login>(props.loginList[0]);
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [sellPrice, setSellPrice] = useState<string>("");

  const executeTdh = ():void => {
    props.executeTdh({
      executionType,
      buyLogin:{login:parseFloat(buyLogin.login),lot:parseFloat(buyLot)},
      sellLogin:{login:parseFloat(sellLogin.login),lot:parseFloat(sellLot)},
      buySymbol,
      sellSymbol,
      buyRate:parseFloat(buyPrice),
      sellRate:parseFloat(sellPrice)
    });
  }

  return (
  
    <Dialog
      open={props.tdhModalState}
      fullWidth
      PaperProps={{
        sx: {
          background: "#131722",
          width:458
        },
      }}
      maxWidth={false}
      onClose={() => props.openTdhModal(false)}
    >
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between", height : 40 }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography className="header-text">
          TDH
        </Typography>
        <IconButton onClick={() => props.openTdhModal(false)}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Grid
          container
          sx={{ p: 1, alignItems: "center", pl: 2, pr: 2 }}
          spacing={2}
          direction={"row"}
        >
          <Grid item xs={6}>
            <Box
              sx={{
                borderBottom: "1px solid #3CA250",
                display: "flex",
                p: 1,
                alignItems: "center",
              }}
            >
              <StorefrontIcon sx={{ mr: 1 }} htmlColor="#6A7187" />
              <Typography variant="body1" sx={{fontWeight : 500, fontSize:14}}>Buy</Typography>
            </Box>
            <Box>
              <Box sx={{ mt: 1 }}>
                <InputLabel  className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                  Symbol
                </InputLabel>
                <Autocomplete
                  ListboxProps={{sx :{
                    border : 1,
                    borderColor : "#2B3349"
                  }}}
                  options={props.symbolList}
                  value={buySymbol}
                  filterOptions={filterOptions}
                  onChange={(e, newItem:string) =>
                    newItem ? setBuySymbol(newItem) : null
                  }
                  
                  renderOption={(props,option) => (<Typography   {...props} variant="body1">{option}</Typography>)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      type={"text"}
                      
                      inputProps={{
                        ...params.inputProps,
                        tabIndex:0,
                      }}
                      InputProps={{
                        ...params.InputProps,
                        className : "normal-text",
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
              <Box sx={{ mt: 1 }}>
                <InputLabel sx={{ color: "#D5E2F0", pb: 1, pt: 1 }} className="label-text">
                  Lot
                </InputLabel>
                <TextField
                  className="normal-text"
                  value={buyLot}
                  onChange={e => setBuyLot(e.target.value)}
                  size="small"
                  type={"number"}
                  inputProps={{
                    tabIndex:2
                  }}
                  InputProps={{
                    className : "normal-text",
                    sx: {
                      height: 45,
                      background: "#0A0A0A",
                    },
                  }}
                  sx={{ width: 1 }}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <InputLabel sx={{ color: "#D5E2F0", pb: 1, pt: 1 }} className="label-text">
                  Login
                </InputLabel>
                <Autocomplete
                  ListboxProps={{sx : {
                    border : 1,
                    borderColor : "#2B3349"
                  }}}
                  className="normal-text"
                  value={buyLogin}
                  filterOptions={filterOptions}
                  onChange={(e, newItem:Login) =>
                    newItem ? setBuyLogin(newItem) : null
                  }
                  isOptionEqualToValue={(option:Login, value:Login) =>
                    option.login === value.login
                  }
                  options={props.loginList}
                  renderOption={(props,option) => (<Typography  {...props} variant="body1">{`${option.login}-${option.name.slice(0,20)}`}</Typography>)}
                  getOptionLabel={(option:Login) => `${option.login}-${option.name.slice(0,20)}`}
                  renderInput={(params) => (
                    <TextField
                      className="normal-text"
                      {...params}
                      size="small"
                      type={"text"}
                      inputProps={{
                        ...params.inputProps,
                        tabIndex:4
                      }}
                      InputProps={{
                        ...params.InputProps,
                        className : "normal-text",
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
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                borderBottom: "1px solid #BE1C19",
                display: "flex",
                p: 1,
                alignItems: "center",
              }}
            >
              <SellOutlinedIcon sx={{ mr: 1 }} htmlColor="#6A7187" />
              <Typography variant="body1" sx={{fontWeight : 500, fontSize:14}}>Sell</Typography>
            </Box>
            <Box>
              <Box sx={{ mt: 1 }}>
                <InputLabel sx={{ color: "#D5E2F0", pb: 1, pt: 1 }} className="label-text" >
                  Symbol
                </InputLabel>
                <Autocomplete
                  ListboxProps={{sx : {
                    border : 1,
                    borderColor : "#2B3349"
                  }}}
                  value={sellSymbol}
                  filterOptions={filterOptions}
                  onChange={(e, newItem) =>
                    newItem ? setSellSymbol(newItem) : null
                  }
                  options={props.symbolList}
                  renderOption={(props,option) => (<Typography {...props} variant="body1">{option}</Typography>)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      type={"text"}
                      inputProps={{
                        ...params.inputProps,
                        tabIndex:1
                      }}
                      InputProps={{
                        ...params.InputProps,
                        className : "normal-text",
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
              <Box sx={{ mt: 1 }}>
                <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                  Lot
                </InputLabel>
                <TextField
                  className="normal-text"
                  value={sellLot}
                  onChange={(e) => setSellLot(e.target.value)}
                  size="small"
                  type={"number"}
                  inputProps={{
                    tabIndex:3
                  }}
                  InputProps={{
                    className : "normal-text",
                    sx: {
                      height: 45,
                      background: "#0A0A0A",
                    },
                  }}
                  sx={{ width: 1 }}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                  Login
                </InputLabel>
                <Autocomplete
                  ListboxProps={{sx : {
                    border : 1,
                    borderColor : "#2B3349"
                  }}}
                  className="normal-text"
                  value={sellLogin}
                  filterOptions={filterOptions}
                  onChange={(e, newItem) =>
                    newItem ? setSellLogin(newItem) : null
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.login === value.login
                  }
                  options={props.loginList}
                  renderOption={(props,option) => (<Typography   {...props} variant="body1">{`${option.login}-${option.name.slice(0,20)}`}</Typography>)}
                  getOptionLabel={(option:Login) => `${option.login}-${option.name.slice(0,20)}`}
                  renderInput={(params) => (
                    <TextField
                    className="normal-text"
                      {...params}
                      size="small"
                      type={"text"}
                      inputProps={{
                        ...params.inputProps,
                        tabIndex:5
                      }}
                      InputProps={{
                        ...params.InputProps,
                        className : "normal-text",
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
            </Box>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <Box>
              <Box sx={{ mt: 1 }}>
                <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                  Execution
                </InputLabel>
                <Select
                  className="normal-text"
                  inputProps={{
                    tabIndex:6
                  }}
                  sx={{ width: 0.48, background: "#0A0A0A", height: 45,  }}
                  IconComponent={ArrowDropDown}
                  value={executionType}
                  onChange={(e) => setExecutionType(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        border : 1, borderColor : "#2B3348",
                        background: '#0A0A0A' // Change the background color of the expanded area
                      }
                    }
                  }}
                >
                  <MenuItem value="market" className="normal-text">Market</MenuItem>
                  <MenuItem value="rate" className="normal-text">Rate</MenuItem>
                </Select>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ paddingTop: 0 }}
            sx={{ display: executionType === "market" ? "none" : "initial" }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box sx={{ mt: 1, width: 0.48 }}>
                <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                  Buy Price
                </InputLabel>
                <TextField
                  className="normal-text"
                  value={buyPrice}
                  onChange={e => setBuyPrice(e.target.value)}
                  size="small"
                  type={"number"}
                  inputProps={{
                    tabIndex:7
                  }}
                  InputProps={{
                    className : "normal-text",
                    sx: {
                      height: 45,
                      background: "#0A0A0A",
                    },
                  }}
                  sx={{ width: 1 }}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 1, ml: 2.2, width: 0.49 }}>
                <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                  Sell Price
                </InputLabel>
                <TextField
                  className="normal-text"
                  value={sellPrice}
                  onChange={e => setSellPrice(e.target.value)}
                  size="small"
                  type={"number"}
                  inputProps={{
                    tabIndex:8
                  }}
                  InputProps={{
                    className : "normal-text",
                    sx: {
                      height: 45,
                      background: "#0A0A0A",
                    },
                  }}
                  sx={{ width: 1 }}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button tabIndex={9} variant="outlined" sx={{ borderColor : "#2B3349",color: "white",width : "125px", textTransform: "none" }}>
          Clear
        </Button>
        <Button tabIndex={10} variant="contained" sx={{textTransform: "none", width : "136px"}} onClick={executeTdh}>Execute</Button>
      </DialogActions>
    </Dialog>
  );
};
function mapStateToProps(state: any) {
  return {
    tdhModalState: state.app.tdhModalState,
    symbolList: state.app.symbolList,
    loginList: state.app.clientList
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    openTdhModal: (open: boolean) => dispatch(toggleTdhModal(open)),
    executeTdh: (tdhData:TdhData) => executeTdh(tdhData)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TdhModal);
