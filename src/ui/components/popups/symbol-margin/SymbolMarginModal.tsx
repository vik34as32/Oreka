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
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { toggleSymbolMarginModal } from "../../../../redux/action-handlers/app/AppActions";
import { updateSymbolMargin } from "../../../../redux/action-handlers/app/SettingAction";

export type SymbolMarginModalProps = {
  symbolMarginModalState: boolean;
  openSymbolMarginModal: (open: boolean) => void;
  symbolList : string[];
  updateSymbolMargin:(symbol:string,margin:string) => void;

};
type Symbol = {
  label: string;
};

const getSymbolList = (): Symbol[] => {
  const items = ["AAPL", "GOOGL", "TSLA"].map((item) => {
    return { label: item };
  });
  return items;
};

const SymbolMarginModal = (props: SymbolMarginModalProps) => {

  if(!props.symbolList) return null;
  const symbols = getSymbolList();
  const [symbol, setSymbol] = useState<string>(props.symbolList[0]);
  const [margin, setMargin] = useState<string>("");

  const onSubmit = () => {
    props.updateSymbolMargin(symbol, margin);
}

  return (
    <Dialog
      open={props.symbolMarginModalState}
      fullWidth
      PaperProps={{
        sx: {
          background: "#131722",
        },
      }}
      maxWidth={"sm"}
      onClose={() => props.openSymbolMarginModal(false)}
    >
      <DialogTitle
        id="responsive-dialog-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography className="header-text" sx={{display : "contents",alignContent : "center"}}>
          Define Symbol Margin
        </Typography>
        <IconButton onClick={() => props.openSymbolMarginModal(false)}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Grid
          container
          sx={{ p: 1, alignItems: "center", pl: 2, pr: 2 }}
          spacing={2}
          direction={"row"}
        >
          <Grid item xs={6}>
            <Box sx={{ mt: 1 }}>
              <InputLabel sx={{ color: "#D5E2F0", pb: 1, pt: 1 }} className="label-text">
                Symbol
              </InputLabel>
              <Autocomplete
                ListboxProps={{sx :{
                  border : 1,
                  borderColor : "#2B3349"
                }}}
                options={props.symbolList}
                value={symbol}
                onChange={(e, newItem:string) =>
                  newItem ? setSymbol(newItem) : null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    type={"text"}
                    InputProps={{
                      ...params.InputProps,
                      className: "normal-text",
                      sx: {
                        height: 50,
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
          <Grid item xs={6}>
            <Box sx={{ mt: 1 }}>
              <InputLabel className="label-text" sx={{ color: "#D5E2F0", pb: 1, pt: 1 }}>
                Margin
              </InputLabel>
              <TextField
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                size="small"
                type={"number"}
                InputProps={{
                  className: "normal-text",
                  sx: {
                    height: 50,
                    background: "#0A0A0A",
                  },
                }}
                sx={{ width: 1 }}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button sx={{textTransform: "none"}} variant="contained" onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
function mapStateToProps(state: any) {
  return {
    symbolMarginModalState: state.app.symbolMarginModalState,
    symbolList: state.app.symbolList,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    openSymbolMarginModal: (open: boolean) =>
      toggleSymbolMarginModal(open, dispatch),
      updateSymbolMargin:(symbol:string,margin:string) => updateSymbolMargin(symbol,margin)
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolMarginModal);
