import CloseIcon from "@mui/icons-material/Close";
import {
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
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ReducerInitialState from "../../../../config/reducers/ReducerInitialState";
import { setAlertMessage, toogleAddPageModal } from "../../../../redux/action-handlers/app/AppActions";
import { setCanvasModel } from "../../../../redux/action-handlers/canvas/CanvasActions";
import { addNewPage } from "../../../../redux/action-handlers/page/PageActions";
import { CanvasState } from "../../../canvas/CanvasContainer";
import CanvasFactory, { DefaultCanvasModel, PageMetaInfoType } from "../../../canvas/services/CanvasService";
import { WidgetConfigsType } from "../../custom-widget/WidgetConfig";
import { checkWidget } from "../../common/widget-menu/WidgetMenu";
import { IJsonModel } from "flexlayout-react";

export type AddPageModalProps = {
  open: boolean;
  pageId?:string | null;
  handleClose: (open: boolean) => void;
  canvasState: CanvasState;
  addNewPage:(pageId:string,name:string,shortName:string) => void;
  pageList: PageMetaInfoType[];
  onPageUpdate:(page:PageMetaInfoType) => void;
  onUpdateCancel:() => void;
  setAlertMessage:(message :string, messageType : string) => void;
  setCanvasModel:(model:IJsonModel) => void;
};

const AddPageModal: React.FC<AddPageModalProps> = (props): ReactElement => {
  const [name, setName] = useState<string>("");
  const [shortName, setShortName] = useState<string>("");
  useEffect(() => {
    if(props.open) setName(""),setShortName("");
  },[props.open])
  useEffect(() => {
    if(props.pageId && props.open) {
      const page = props.pageList.find(page => page.pageId === props.pageId);
      if(page) {
        setName(page.name);
        setShortName(page.shortName);
      }
    }
  },[props.pageId,props.open])

  const addNewPage = () => {
    if(name.length === 0 || shortName.length === 0) return;

    const canvasService = CanvasFactory.getInstance();
    const pageId = canvasService.addNewPage();
    props.addNewPage(pageId,name,shortName);
    const newState:CanvasState = {...ReducerInitialState.canvas};
    newState.canvasModel = {...DefaultCanvasModel};
    const sequence = props.pageList[props.pageList.length -1].sequence + 1;
    canvasService.savePage({pageId,name,shortName,sequence},newState,{});
    handleClose();
    return pageId;
  }
  const updatePageName = () => {
    if(name.length === 0 || shortName.length === 0 || !props.pageId) return;
    
    const canvasService = CanvasFactory.getInstance();
    const page : PageMetaInfoType | undefined = props.pageList.find(page => page.pageId === props.pageId);
    const widgetProps = canvasService.getAllComponentPropsForPage(props.pageId);
    
    if(!widgetProps || !page) return;
    
    canvasService.savePage({
      pageId:page.pageId,
      name,
      shortName,
      sequence : page.sequence
    },props.canvasState,widgetProps,true);
    props.onPageUpdate({pageId:page.pageId,name,shortName, sequence : page.sequence});
    handleClose();
  }
  const getShortName = () => {
    let tempName = name.trim();
    setName(tempName);
    if(tempName.length  ===  0) return ;
    const parts = tempName.split(/\s+/);
    if(parts.length === 1) setShortName(parts[0].substring(0,2).toUpperCase());
    else setShortName(parts[0][0].concat(parts[1][0]).toUpperCase()); 
  }
  const handleClose = () => {
    props.handleClose(false);
    if(props.pageId)
      props.onUpdateCancel();
  }

  
  const handleFileUpload = (event : ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = handleFileRead;
    reader.readAsText(file);
  };

  const handleFileRead = (event : ProgressEvent<FileReader>) => {
    if(event && event.target){
      try {
        const content : string = event.target?.result as string;
        const jsonData = JSON.parse(content);
      
        if (jsonData.hasOwnProperty('layout') && jsonData.hasOwnProperty('widgetConfigs')) {
          const hasNumericWeight = checkNumericWeight(jsonData["layout"]);
          const widgetConfigs = jsonData["widgetConfigs"];
          let isProblem = false;
          Object.keys(widgetConfigs).forEach((key) => {
            const widgetConfig = widgetConfigs[key];
            if(!checkWidget(widgetConfig)){
              isProblem = true;
            }
          });
          if(isProblem){
            props.setAlertMessage("Problem in file","error");
            return;
          }
          if(hasNumericWeight){
            ImportPage(jsonData["layout"], widgetConfigs); 
          } else{
            props.setAlertMessage("Problem in file","error");
          }  
        } else {
          props.setAlertMessage("Problem in file","error");
        }
      } catch (error) {
        props.setAlertMessage("Problem in file","error");
      }
      
    }
    
  };


  function checkNumericWeight(jsonObj: any): boolean {
    if (typeof jsonObj === "object") {
      if (jsonObj.hasOwnProperty("weight")) {
        const widthValue = jsonObj["weight"];
        if (typeof widthValue !== "number") {
          return false;
        }
      }
      for (const key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          const childResult = checkNumericWeight(jsonObj[key]);
          if (!childResult) {
            return false;
          }
        }
      }
    }
    return true;
  }

  const ImportPage = (canvasState:CanvasState,widgetProps:{[id:string]:WidgetConfigsType}) => {
    if(name.length === 0 || shortName.length === 0) {
      props.setAlertMessage("Please enter page name", "info")
      return;
    }
    const pageId = addNewPage();
    const canvasService = CanvasFactory.getInstance();
    if(pageId!== undefined) 
      canvasService.savePage({pageId,name,shortName,sequence:props.pageList[props.pageList.length -1].sequence},canvasState,widgetProps, true);
    handleClose();
  }


  return (
    <Dialog
      open={props.open}
      fullWidth
      PaperProps={{
        sx: {
          background: "#131722",
          maxWidth: 300,
          minHeight: 180,
        },
      }}
      onClose={handleClose}
    >
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ p: 1, pt: 1, pb: 1 }}
      >
        <Typography fontWeight={700}>Add Page</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, mr: 1 }}>
        <Grid container sx={{ pl: 1, pr: 1, alignItems: "center" }} spacing={1}>
          <Grid item xs={5}>
            <InputLabel sx={{ color: "#D5E2F0" }}>Name</InputLabel>
          </Grid>
          <Grid item xs={7}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={getShortName}
              size="small"
              type={"text"}
              inputProps={{
                tabIndex: 0,
              }}
              InputProps={{
                sx: {
                  height: 30,
                  background: "#0A0A0A",
                },
              }}
              sx={{ width: 1 }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={5}>
            <InputLabel sx={{ color: "#D5E2F0" }}>Short Name</InputLabel>
          </Grid>
          <Grid item xs={7}>
            <TextField
              value={shortName}
              onChange={(e) => {
                if(e.target.value.length < 3){
                  setShortName(e.target.value.toUpperCase())
                }
              }}
              size="small"
              type={"text"}
              inputProps={{
                tabIndex: 0,
              }}
              InputProps={{
                sx: {
                  height: 30,
                  background: "#0A0A0A",
                },
              }}
              sx={{ width: 1 }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ mr: 2 }} >
          <Button sx={{mr : '70px', display : props.pageId ? "none" : "initial"}}
            variant="contained"
            component="label"

          >
            Import Page
            <input
              type="file"
              accept=".json"
              hidden
              onChange={(event) => {
                event.target.files = null; 
                handleFileUpload(event);
              }}
            />
          </Button>
        {props.pageId ? (
          <Button variant="contained" onClick={updatePageName}>
            Update
          </Button>
        ) : (
          <Button variant="contained" onClick={addNewPage}>
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    open: state.app.addPageModalState,
    canvasState:state.canvas,
    pageList: state.page.pages
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setCanvasModel: (canvasModel:IJsonModel) => dispatch(setCanvasModel(canvasModel)),
    handleClose: (open: boolean) => dispatch(toogleAddPageModal(open)),
    addNewPage:(pageId:string,name:string,shortName:string) => dispatch(addNewPage(pageId,name,shortName)),
    setAlertMessage : (message : string, messageType : string) => dispatch(setAlertMessage(message, messageType))
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(AddPageModal)
);
