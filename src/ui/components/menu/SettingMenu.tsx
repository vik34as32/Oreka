import { ArrowLeft } from '@mui/icons-material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import SwitchAccountOutlinedIcon from '@mui/icons-material/SwitchAccountOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import {
Box,
List,
ListItemIcon,
ListItemText,
Menu,
MenuItem,
MenuList,
Typography,
} from "@mui/material";
import React, { useState } from 'react';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Dispatch } from "redux";
import { themes } from '../../../data/colorTemplate';
import { setSelectedTheme, toggleHighLowMisMatchModal, toggleOpenColorTemplateState, toggleSymbolMarginModal, turnOnOffColor } from "../../../redux/action-handlers/app/AppActions";
import { HorizontalDivider } from "../common/dividers/Dividers";
import ThemeTemplateModal, { Theme } from '../widgets/ThemeModal/ThemeTemplateModal';
import ClosingUpdate from './ClosingUpdate';
import DefaultClientCredit from './DefaultClientCredit';
import PositionTransfer from './PositionTransfer';
import RejectLimitSetting from './RejectLimitSetting';
import SymbolMappingUploadFile from './SymbolMappingUploadFile';
import SymbolMappingView from './SymbolMappingView';
import TradeDelete from './TradeDelete';
import TransferCredit from './TransferCredit';

export type SettingMenuProps = {
  open: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  openSymbolMarginModal:() => void;
  openHighLowMisMatchModal:() => void;
  handleLogout:() => void;
  turnOnOffColor : (on:boolean) => void;
  isColorOn : boolean;
  openColorTemplateState : boolean;
  toggleOpenColorTemplateState : (open : boolean) => void;
  selectedTheme : Theme | undefined;
  setSelectedTheme : (arg0: Theme | undefined) => void;
  changeSettingMenuAnchorElToNull : () => void;
  themes : Theme[];
};
const SettingMenu = (props: SettingMenuProps) => {

  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<Element | null>(null);

  const navigate = useNavigate();
  const [openThemeTemplate, setOpenThemeTemplate] = useState<boolean>(false);
  const [saturdayDeleteAnchorEl, setSaturdayDeleteAnchorEl] = useState<Element | null>(null);
  const [openTransferCredit, setOpenTransferCredit] = useState<boolean>(false);
  const [openPositionTransfer, setOpenPositionTransfer] = useState<boolean>(false);
  const [openRejectLimitSetting, setOpenRejectLimitSetting] = useState<boolean>(false);
  const [openTradeDelete, setOpenTradeDelete] = useState<boolean>(false);
  const [openDefaultClientCredit, setOpenDefaultClientCredit] = useState<boolean>(false);

  const [symbolMappingAnchorEl, setSymbolMappingAnchorEl] = useState<Element | null>(null);
  const [openSymbolMappingUploadFile, setOpenSymbolMappingUploadFile] = useState<boolean>(false);
  const [openSymbolMappingViewMapping, setOpenSymbolMappingViewMapping] = useState<boolean>(false);
  
  const [openClosingUpdate, setOpenClosingUpdate] = useState<boolean>(false);

  const handleSubmenuOpen = (event : React.MouseEvent) => {
    event.stopPropagation();
    setSubmenuAnchorEl(event.currentTarget);
  };

  const handleSaturdayDeleteOpen = (event : React.MouseEvent) => {
    event.stopPropagation();
    setSaturdayDeleteAnchorEl(event.currentTarget);
  };

  const handleSymbolMappingOpen = (event : React.MouseEvent) => {
    event.stopPropagation();
    setSymbolMappingAnchorEl(event.currentTarget);
  };

  const handleSubmenuClose = (e : React.MouseEvent) => {
    e.stopPropagation();
    setSaturdayDeleteAnchorEl(null);
    setSymbolMappingAnchorEl(null);
    setSubmenuAnchorEl(null);
    props.changeSettingMenuAnchorElToNull();
  };


  const handleThemeChange = (theme1 : Theme, e : React.MouseEvent) => {
    props.setSelectedTheme(theme1);
    handleSubmenuClose(e)
  }


  const handleColorOnOff = () => {
    props.turnOnOffColor(!props.isColorOn);
  }

  const handletoggleOpenColorTemplateState = (open : boolean) => {
    props.toggleOpenColorTemplateState(open);
  }

  return (
    <>
    <Menu
      open={props.open}
      onClose={props.handleClose}
      anchorEl={props.anchorEl}
      title="Settings"
      PaperProps={{
        sx: {
          minWidth: 250,
          background: "#020305",
        },
      }}
    >
      <Box sx={{pl : "23px", pb : "10px" }}>
        <Typography fontWeight={700} variant="body1" sx={{pt : "10px" ,pr : 0}} className='header-text'>
          Quick Settings
        </Typography>
      </Box>
      <HorizontalDivider />
      <MenuList sx={{ color: "#D5E2F0" }} >
        <MenuItem sx={{pl : "25px"}} onClick={() => {
          setOpenClosingUpdate(true)
          props.changeSettingMenuAnchorElToNull();
        }}
        >
          <ListItemIcon>
            <UpdateOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <Typography className='setting'>
            Closing Update
          </Typography>
        </MenuItem>
        <MenuItem sx={{pl : "25px"}} onClick={() => {
          props.openHighLowMisMatchModal();
          props.changeSettingMenuAnchorElToNull();
          }}>
          <ListItemIcon>
            <ReportOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>

          <Typography variant='body1' className='setting'>
            High Low Mismatch
          </Typography>
        </MenuItem>
        <MenuItem sx={{pl : "25px"}} onClick={() => {
          props.openSymbolMarginModal();
          props.changeSettingMenuAnchorElToNull();
        }}>
          <ListItemIcon>
            <AccountTreeOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <Typography variant='body1' className='setting'>
          Define Symbol Margin
            </Typography>
        </MenuItem>
        <MenuItem sx={{pl : "25px"}} onClick={() => {
          setOpenDefaultClientCredit(true);
          props.changeSettingMenuAnchorElToNull();
        }}>
          <ListItemIcon>
            <AccountTreeOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <Typography variant='body1' className='setting'>
          Default Client Credit
            </Typography>
        </MenuItem>
        <HorizontalDivider />
        {/* <MenuItem sx={{pl : "25px"}} onClick={() => {
          setOpenRejectLimitSetting(true);
          props.changeSettingMenuAnchorElToNull();
        }}>
          <ListItemIcon>
            <StopCircleOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <Typography variant='body1' className='setting'>
          Reject Limit Setting
            </Typography>
        </MenuItem> */}
        <MenuItem sx={{pl : "1px"}} onClick={handleSymbolMappingOpen}>
          <ListItemIcon>
            <ArrowLeft /> <DeleteOutlineOutlinedIcon style={{ color: "#D5E2F0"}} sx={{mr : 1}}/>
            </ListItemIcon>
            <Typography variant='body1' className='setting'>
            Symbol Mapping
          </Typography>
          <Menu
            anchorEl={symbolMappingAnchorEl}
            open={Boolean(symbolMappingAnchorEl)}
            onClose={handleSubmenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: -135,
            }}
            MenuListProps={{disablePadding : true}}
            PaperProps={{
              sx: {
                border : 1,
                borderColor : "#2B3349",
                minWidth: 100,
                background: "#020305",
              },
            }}
          >
            <MenuItem onClick={(e) => {
              setOpenSymbolMappingUploadFile(true);
              handleSubmenuClose(e);
              props.changeSettingMenuAnchorElToNull();
            }}>
              Upload File
            </MenuItem>
            <MenuItem onClick={(e) => {
              setOpenSymbolMappingViewMapping(true);
              handleSubmenuClose(e);
              props.changeSettingMenuAnchorElToNull();
            }}>
              View Mapping
            </MenuItem>
            
          </Menu>
          
        </MenuItem>
        <MenuItem sx={{pl : "1px"}} onClick={handleSaturdayDeleteOpen}>
          <Menu
            anchorEl={saturdayDeleteAnchorEl}
            open={Boolean(saturdayDeleteAnchorEl)}
            onClose={handleSubmenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: -155,
            }}
            MenuListProps={{disablePadding : true}}
            PaperProps={{
              sx: {
                border : 1,
                borderColor : "#2B3349",
                minWidth: 100,
                background: "#020305",
              },
            }}
          >
            <MenuItem onClick={(e) => {
              setOpenTransferCredit(true);
              handleSubmenuClose(e);
              props.changeSettingMenuAnchorElToNull();
            }}>
              Transfer Credit
            </MenuItem>
            <MenuItem onClick={(e) => {
              setOpenPositionTransfer(true);
              handleSubmenuClose(e);
              props.changeSettingMenuAnchorElToNull();
            }}>
              Position Transfer
            </MenuItem>
            <MenuItem onClick={(e) => {
              setOpenTradeDelete(true);
              handleSubmenuClose(e);
              props.changeSettingMenuAnchorElToNull();
            }}>
              Trade Delete
            </MenuItem>
          </Menu>
          <ListItemIcon>
          <ArrowLeft /> <DeleteOutlineOutlinedIcon style={{ color: "#D5E2F0"}} sx={{mr : 1}}/>
          </ListItemIcon>
          {/* <ListItemText>Saturday Delete</ListItemText> */}
          <Typography variant='body1' className='setting'>
          Saturday Delete
            </Typography>
        </MenuItem>
        <HorizontalDivider/>
        <MenuItem sx={{pl : "1px"}} onClick={handleSubmenuOpen} >
          <Menu
            anchorEl={submenuAnchorEl}
            open={Boolean(submenuAnchorEl)}
            onClose={handleSubmenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: -200,
            }}
            MenuListProps={{disablePadding : true}}
            PaperProps={{
              sx: {
                border : 1,
                borderColor : "#2B3349",
                minWidth: 200,
                background: "#020305",
              },
            }}
          >
            { props.themes && (
              <List sx={{
                  display : props.themes.length > 0 ? "flex" : "none",
                  flexDirection:"column",
                  maxHeight: '150px',
                  maxWidth : '200px',
                  overflowX : 'auto',
                  overflowY: 'auto',
                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: '#706c6c',
                  }
              }}>
              {props.themes.map((element)=> (
                <MenuItem selected={element.id === props.selectedTheme?.id} onClick={(e) => handleThemeChange(element,e)}>{element.name}</MenuItem>
              ))}
              </List>
            )}
            <HorizontalDivider/>
            <MenuItem onMouseDown={(e) => {
              setOpenThemeTemplate(true);
              handleSubmenuClose(e)
            }}>
                <ListItemText>Add New</ListItemText>
            </MenuItem>

          </Menu>
          <ListItemIcon>
            <ArrowLeft /> <ColorLensOutlinedIcon  style={{ color: "#D5E2F0"}} sx={{mr : 1}}/>
          </ListItemIcon>
          <ListItemText>  
          <Typography sx={{pl:"3px"}} variant='body1' className='setting'>
            Theme
          </Typography>

          </ListItemText>
          
        </MenuItem>
        <MenuItem sx={{pl : "25px"}} onClick={handleColorOnOff}>
          <ListItemIcon>
            {props.isColorOn ? <ColorLensIcon style={{ color: "#D5E2F0"}}/> : <ColorLensOutlinedIcon style={{ color: "#D5E2F0"}}/>}
          </ListItemIcon>
          <ListItemText>
          <Typography variant='body1' className='setting'>
          Color Off/On
            </Typography>
          </ListItemText>
          
        </MenuItem>
        <MenuItem sx={{pl : "25px"}} onClick={() => {
          handletoggleOpenColorTemplateState(true);
          props.changeSettingMenuAnchorElToNull();
          }}>
          <ListItemIcon>
            <ColorLensOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <ListItemText>
          <Typography variant='body1' className='setting'>
            Value Range Template
          </Typography>
          </ListItemText>
        </MenuItem>
        <HorizontalDivider />
        <MenuItem sx={{pl : "25px"}}>
          <ListItemIcon>
            <SupervisedUserCircleOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <ListItemText
            onClick={() => {
              navigate("/usermanagement");
            }}
          >
            
            <Typography variant='body1' className='setting'>
            User Management
          </Typography>
          </ListItemText>
        </MenuItem>
        <HorizontalDivider />
        <MenuItem sx={{pl : "25px"}}>
          <ListItemIcon>
            <SwitchAccountOutlinedIcon style={{ color: "#D5E2F0"}} />
          </ListItemIcon>
          <ListItemText>
          <Typography variant='body1' className='setting'>
            Switch Account
          </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem sx={{pl : "25px"}} onClick={props.handleLogout}>
          <ListItemIcon>
            <LogoutOutlinedIcon style={{ color: "#D5E2F0"}}/>
          </ListItemIcon>
          <ListItemText>
            <Typography variant='body1' className='setting'>
            Logout
          </Typography>
          </ListItemText>
        </MenuItem>
        <HorizontalDivider />
        <MenuItem sx={{pl : "25px"}}>
          <ListItemText>
          <Typography variant='body1' className='setting'>
          Version: {import.meta.env.VITE_APP_VERSION}
          </Typography>
            
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
    <ThemeTemplateModal openThemeTemplate={openThemeTemplate} handleClose = {() => setOpenThemeTemplate(false)}></ThemeTemplateModal>
    <TransferCredit open={openTransferCredit} handleClose={() => setOpenTransferCredit(false)}></TransferCredit>
    <RejectLimitSetting open={openRejectLimitSetting} handleClose={() => setOpenRejectLimitSetting(false)}></RejectLimitSetting>
    <PositionTransfer open={openPositionTransfer} handleClose={() => setOpenPositionTransfer(false)}></PositionTransfer>
    <TradeDelete open={openTradeDelete} handleClose={() => setOpenTradeDelete(false)}></TradeDelete>
    <DefaultClientCredit open={openDefaultClientCredit} handleClose={() => setOpenDefaultClientCredit(false)}></DefaultClientCredit>
    <SymbolMappingUploadFile open={openSymbolMappingUploadFile} handleClose={() => setOpenSymbolMappingUploadFile(false)}></SymbolMappingUploadFile>
    <SymbolMappingView open={openSymbolMappingViewMapping}  handleClose={() => setOpenSymbolMappingViewMapping(false)}></SymbolMappingView>
    <ClosingUpdate open={openClosingUpdate} handleClose={() => setOpenClosingUpdate(false)}></ClosingUpdate>
    </>

  );
};

function mapStateToProps(state : any) {
  return {
    isColorOn : state.app.isColorOn,
    openColorTemplateState : state.app.openColorTemplateState,
    selectedTheme : state.app.selectedTheme,
    themes : state.app.themes
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
      openSymbolMarginModal: () => toggleSymbolMarginModal(true, dispatch),
      openHighLowMisMatchModal: () => toggleHighLowMisMatchModal(true,dispatch),
      turnOnOffColor : (onOff:boolean) =>dispatch(turnOnOffColor(onOff)),
      toggleOpenColorTemplateState : (open : boolean) => dispatch(toggleOpenColorTemplateState(open)),
      setSelectedTheme : (theme : Theme | undefined) => dispatch(setSelectedTheme(theme))
  };
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(SettingMenu));
