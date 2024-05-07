import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
import { deleteTemplate, fetchTemplates, fetchThemes, saveTemplate, setAlertMessage, toggleOpenColorTemplateState } from "../../../redux/action-handlers/app/AppActions";
import MessageComponent from "../common/message/MessageComponent";
import ColorRangeModal from "./ColorRangeModal";
import { Theme } from "./ThemeModal/ThemeTemplateModal";


export type ColorTempleteModalProps = {
  openColorTemplate: boolean;
  toggleOpenColorTemplateState: (open: boolean) => void;
  saveEditTemplate: (data: any, id: string) => void;
  fetchTemplates: () => void;
  templates: Template[],
  deleteTemplate: (id: string) => void;
  setAlertMessage: (message: string, messageType: string) => void;
  themes: Theme[],
  selectedTheme : Theme | undefined;
};

export const GridTheme = {
  spacing: 1,
  col1: 2,
  col2: 5,
  col3: 5,
};


export type Template = {
  name: string;
  id: string;
  range: number[];
}

const ColorTempleteModal = (props: ColorTempleteModalProps) => {
  const [templateName, setTemplateName] = useState<string>("");
  const [range, setRange] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [theme, setTheme] = useState<Theme[]>(props.themes);
  const [selectedTheme, setSelectedTheme] = useState<Theme | undefined>(props.selectedTheme);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>();

  const changeValue = (index: number, value: number) => {
    let currentRange = [...range];
    currentRange[index] = value;
    if (index === 5) {
      currentRange[index + 1] = currentRange[index] - 1;
    }
    setRange(currentRange);
  }


  useEffect(() => {
    fetchTemplates();
    setSelectedTheme(props.selectedTheme);
  }, [props.selectedTheme])


  const handleSave = () => {
    let template: Template = {
      name: templateName,
      id: templateName,
      range: range
    };

    if (templateName === "" || templateName.toLowerCase() === "none" || templateName.toLowerCase() === "undefined" || templateName.trim() === "") {
      props.setAlertMessage("Enter Proper Template name", "error");
      return;
    }


    range.forEach((value, index) => {
      if (index > 0) {
        if (value > range[index - 1]) {
          props.setAlertMessage("Please check the order of range, they are not in the correct order!", "error");
          return;
        }
      }
    })


    props.saveEditTemplate(template, template.id);
    fetchTemplates();
    props.setAlertMessage("Template Saved Successfully", "success");
  };



  const handleDelete = () => {

    if (selectedTemplate) {
      props.deleteTemplate(selectedTemplate.id);
      setRange([0, 0, 0, 0, 0, 0, 0]);
      setSelectedTemplate(null);
      fetchTemplates();
      props.setAlertMessage("Template Deleted Successfully", "success");
      setTemplateName("");
    }
  }

  const handletoggleOpenColorTemplateState = (open: boolean) => {
    props.toggleOpenColorTemplateState(open);
  }

  const handleThemeChange = (event: any, value: any, reason: string) => {
    if (value != null) {
      var temp = props.themes.filter((data) => data.name === value.name);
      if (temp.length > 0) {
        setSelectedTheme(temp[0]);
      }
    }

  }



  const handleTemplateChange = (event: any, value: any, reason: string) => {
    if (value != null && props.templates) {
      var temp = props.templates.filter((data) => data.name === value.name);

      if (temp.length > 0) {
        setSelectedTemplate(temp[0]);
        let tempRange = [0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < tempRange.length; i++) {
          tempRange[i] = temp[0].range[i];
        }
        setRange(tempRange);
        setTemplateName(temp[0].name);
      }
    } else {
      setSelectedTemplate(null);
    }

  }


  const handleModalClose = () => {
    handletoggleOpenColorTemplateState(false);
    setRange([0, 0, 0, 0, 0, 0, 0]);
    setSelectedTemplate(null);
    setTemplateName("");
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={props.openColorTemplate}
        onClose={() => { handleModalClose() }}
        PaperProps={{
          sx: {
            background: "#13171F",
            width : "512px",
            height : "750px"
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title" sx={{ display: "flex", justifyContent: "space-between", height : 45 }}>
          <Typography className="header-text">Edit Colour Template</Typography>
          <IconButton onClick={() => handleModalClose()}>
            <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
            <Box  sx={{ mt: 1 }}>
                <InputLabel  className="label-text" sx={{ pb: 1, pt: 1 }}>
                  Name
                </InputLabel>
              <Autocomplete
                ListboxProps={{sx :{
                  border : 1,
                  borderColor : "#2B3349"
                }}}
                options={props.templates || []}
                fullWidth
                freeSolo
                getOptionLabel={(option: any) => option.name}

                inputValue={templateName}
                onInputChange={(event, newInputValue) => {
                  setTemplateName(newInputValue);
                }}

                value={selectedTemplate}
                onChange={handleTemplateChange}
                renderInput={(params) =>
                  <TextField
                    required
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
                          height: 40,
                          background: "#0A0A0A",
                        },
                      }}
                      sx={{ width: 1 }}
                      variant="outlined"
                  />}
              />
            </Box>


            <Box sx={{ mt: 1, }}>
            <InputLabel  className="label-text" sx={{ pb: 1, pt: 1 }}>
              Choose Color Template:
                </InputLabel>
              <Autocomplete
                ListboxProps={{sx :{
                  border : 1,
                  borderColor : "#2B3349"
                }}}
                aria-expanded={false}
                options={props.themes.filter((data) => data.name != "none")}
                fullWidth
                autoHighlight
                autoSelect={true}
                selectOnFocus={true}
                disablePortal={true}
                getOptionLabel={(option: any) => option.name || ""}

                renderOption={(props, option) => (
                  <Box sx={{ display: 'flex', mt: 1, cursor: 'pointer', alignItems: 'center' }} {...props}>
                    <Box sx={{ width: 24, height: 24, mr: 1, bgcolor: option.color[0] }} />
                    <Box sx={{ width: 24, height: 24, mr: 1, bgcolor: option.color[6] }} />
                    {option.name}
                  </Box>
                )}
                onChange={handleThemeChange}

                value={selectedTheme}
                renderInput={(params) =>
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
                      height: 40,
                      background: "#0A0A0A",
                    },
                  }}
                  sx={{ width: 1 }}
                  variant="outlined"
                  />}
              />
            </Box>
            <br />

            <Grid
              container
              spacing={GridTheme.spacing}
            >
              <Grid item xs={GridTheme.col1}>
                <Typography className="label-text" variant="caption" gutterBottom>
                  Field Color
                </Typography>
              </Grid>
              <Grid item xs={GridTheme.col2}>
                <Typography className="label-text" variant="caption" gutterBottom>
                  Start Point
                </Typography>
              </Grid>
              <Grid item xs={GridTheme.col3}>
                <Typography className="label-text" variant="caption" gutterBottom>
                  Range
                </Typography>
              </Grid>
            </Grid>
            {selectedTheme?.color.map((data, index) => (
              <ColorRangeModal
                key={index}
                selectedTheme={selectedTheme}
                index={index}
                changeValue={changeValue}
                range={range}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Box>
            {selectedTemplate && (
              <Button onClick={() => { handleDelete() }} sx={{ textTransform: "none",mr: 1, width: '108px', height: '43px', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} size="large" variant="outlined" color="error">
                Delete
              </Button>
            )
            }
            <Button onClick={() => { handleModalClose() }} sx={{borderColor : "#2B3349" ,color : "white", textTransform: "none", mr: 1, width: '108px', height: '43px', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} size="large" autoFocus variant="outlined" >
              Cancel
            </Button>
            <Button sx={{ textTransform: "none",mr: 2, width: '108px', height: '43px', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} size="large" variant="contained" onClick={handleSave} autoFocus>
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
    openColorTemplate: state.app.openColorTemplateState,
    templates: state.app.templates,
    message: state.app.message.text,
    type: state.app.message.type,
    selectedTheme : state.app.selectedTheme
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    toggleOpenColorTemplateState: (open: boolean) => dispatch(toggleOpenColorTemplateState(open)),
    saveEditTemplate: (data: any, id: string) => saveTemplate(data, id),
    fetchTemplates: () => fetchTemplates(),
    deleteTemplate: (id: string) => deleteTemplate(id),
    setAlertMessage: (message: string, messageType: string) => dispatch(setAlertMessage(message, messageType))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ColorTempleteModal);

