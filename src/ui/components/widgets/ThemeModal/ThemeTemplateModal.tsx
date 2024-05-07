import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from 'uuid';
import { deleteTheme, fetchThemes, saveTheme, setAlertMessage } from "../../../../redux/action-handlers/app/AppActions";
import MessageComponent from "../../common/message/MessageComponent";
import ThemeColorPicker from "./ThemeColorPicker";
import { cloneDeep } from "lodash";

export type ColorTempleteModalProps = {
  openThemeTemplate: boolean;
  saveTheme: (data: any, id: string) => void;
  fetchThemes: () => void;
  themes: Theme[],
  deleteTheme: (id: string) => void;
  setAlertMessage: (message: string, messageType: string) => void;
  handleClose: () => void;
};

export const GridTheme = {
  spacing: 1,
  col1: 3,
  col2: 3,
  col3: 6,
};


export type Theme = {
  id: string,
  name: string,
  color: string[],
  fontColor: string[],
  default?: boolean
}

const defaultTheme = {
  id: "0",
  name: "Default",
  color: ["#13171F", "#13171F", "#13171F", "#13171F", "#13171F", "#13171F", "#13171F"],
  fontColor: ["#C3C3C3", "#C3C3C3", "#C3C3C3", "#C3C3C3", "#C3C3C3", "#C3C3C3", "#C3C3C3"],
  default: true
}


const ThemeTemplateModal = (props: ColorTempleteModalProps) => {
  const [themeName, setThemeName] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<Theme>(defaultTheme);

  const changeValue = (index: number, color: string, fontColor: string) => {
    let currentTheme = cloneDeep(selectedTheme);
    currentTheme.color[index] = color;
    currentTheme.fontColor[index] = fontColor;
    setSelectedTheme(currentTheme);
  }

  useEffect(() => {
    fetchThemes();
  }, [])


  const handleSave = () => {
    let theme: Theme = {
      name: themeName,
      id: uuidv4(),
      color: selectedTheme.color,
      fontColor: selectedTheme.fontColor,
      default: false
    };

    if (themeName === "" || themeName.toLowerCase() === "none" || themeName === "undefined" || themeName.trim() === "") {
      props.setAlertMessage("Enter Proper Theme name", "error");
      return;
    }

    props.themes.forEach((t) => {
      if (selectedTheme.id === t.id && selectedTheme.name === t.name) {
        theme.id = t.id;
        return;
      }
    })
    props.saveTheme(theme, theme.id);
    fetchThemes();
    props.setAlertMessage("Theme Saved Successfully", "success");
  };



  const handleDelete = () => {

    if (selectedTheme) {
      props.deleteTheme(selectedTheme.id);
      setSelectedTheme(defaultTheme);
      fetchThemes();
      props.setAlertMessage("Theme Deleted Successfully", "success");
      setThemeName("");
    }
  }

  const handleThemeChange = (event: any, value: any, reason: string) => {
    if (props.themes) {
      var temp = props.themes.filter((data) => data.name === value?.name);

      if (temp.length > 0) {
        setSelectedTheme(temp[0]);
        setThemeName(temp[0].name);
      }
    } else {
      setSelectedTheme(defaultTheme);
      setThemeName(defaultTheme.name);
    }

  }


  const handleModalClose = () => {
    props.handleClose();
    setSelectedTheme(defaultTheme);
    setThemeName("");
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={props.openThemeTemplate}
        onClose={() => { handleModalClose() }}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
          sx: {
            background: "#13171F"
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title" sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Theme</Typography>
          <IconButton onClick={() => handleModalClose()}>
            <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small">
            <Box display={"flex"} sx={{ mt: 1, background: "#0A0A0A" }}>
              <Autocomplete
                ListboxProps={{sx :{
                  border : 1,
                  borderColor : "#2B3349"
                }}}
                aria-expanded={false}
                options={props.themes || []}
                // sx={{height : '40px'}}
                fullWidth
                freeSolo
                autoHighlight
                getOptionLabel={(option: any) => option.name || ""}

                renderOption={(props, option) => (
                  <Box sx={{ display: 'flex', mt: 1, cursor: 'pointer', alignItems: 'center' }} {...props}>
                    <Box sx={{ width: 24, height: 24, mr: 1, bgcolor: option.color[0] }} />
                    <Box sx={{ width: 24, height: 24, mr: 1, bgcolor: option.color[6] }} />
                    {option.name}
                  </Box>
                )}
                inputValue={themeName}
                onInputChange={(event, newInputValue) => {
                  setThemeName(newInputValue);
                  setSelectedTheme({ ...selectedTheme, name: newInputValue });
                }}

                value={selectedTheme}
                onChange={handleThemeChange}
                renderInput={(params) =>
                  <TextField
                    required
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      margin: "none",
                      sx: {
                        m: 0,
                        // height: 40,
                        background: "#0A0A0A",
                      },
                    }}
                    label="Name"
                  />}
              />
            </Box>

            <br />

            <Grid
              container
              spacing={GridTheme.spacing}
            >
              <Grid item xs={GridTheme.col1}>
                <Typography variant="caption" gutterBottom>
                  Field Color
                </Typography>
              </Grid>
              <Grid item xs={GridTheme.col2}>
                <Typography variant="caption" gutterBottom>
                  Font Color
                </Typography>
              </Grid>
              <Grid item xs={GridTheme.col3}>
                <Typography variant="caption" gutterBottom>
                  Sample
                </Typography>
              </Grid>
            </Grid>
            {selectedTheme.color.map((data, index) => (
              <ThemeColorPicker
                key={index}
                selectedTheme={selectedTheme}
                index={index}
                changeValue={changeValue}
              />
            ))}

          </FormControl>
        </DialogContent>
        <DialogActions>
          <Box>
            {selectedTheme && !selectedTheme.default && (
              <Button onClick={() => { handleDelete() }} sx={{ mr: 1, width: '108px', height: '43px', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} size="large" variant="outlined" color="error">
                Delete
              </Button>
            )}
            <Button onClick={() => { handleModalClose() }} sx={{ mr: 1, width: '108px', height: '43px', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} size="large" autoFocus variant="outlined" >
              Cancel
            </Button>
            <Button sx={{ mr: 2, width: '108px', height: '43px', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} size="large" variant="contained" onClick={handleSave} autoFocus>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <MessageComponent />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    themes: state.app.themes,
    message: state.app.message.text,
    type: state.app.message.type
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    saveTheme: (data: any, id: string) => saveTheme(data, id),
    fetchThemes: () => fetchThemes(),
    deleteTheme: (id: string) => deleteTheme(id),
    setAlertMessage: (message: string, messageType: string) => dispatch(setAlertMessage(message, messageType))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ThemeTemplateModal);

