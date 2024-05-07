import AddIcon from '@mui/icons-material/Add';
import GroupIcon from "@mui/icons-material/Group";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import {
Box,
IconButton,
Stack,
Tooltip
} from "@mui/material";
import OrekaIcon from '@svg/OrekaIconColored.svg';
import OrekaTitle from '@svg/OrekaTitle.svg';
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { WebSocketConnectionState } from "../../backend/websocket/WebsocketConnectionState";
// import { HeaderTabs } from "../../models/HeaderModel";
import * as appActions from "../../redux/action-handlers/app/AppActions";
import DateComponent from "./DateComponent";
import useConnection from './common/connection-check/useConnection';
import { VerticalDivider } from "./common/dividers/Dividers";
import SettingMenu from "./menu/SettingMenu";
import PageList from "./page/PageList";
import { AddTaskOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  websocketConnectionStatus: WebSocketConnectionState;
  headerTabs: HeaderTabs[];
  tdhModalState: boolean;
  addPageModalState: boolean;
  onDateChange: (time: number) => void;
  addCustomWidgetDialog: () => void;
  toggleTdhModal: (open: boolean) => void;
  toggleAddPageModal: (open:boolean) => void;
  activateOrder: () => void;
  logoutUser:() => void;
};
const Header:React.FC<HeaderProps> = (props:HeaderProps) => {

  const navigate = useNavigate();
  const [settingMenuAnchorEl,setSettingMenuAnchorEl] = useState<HTMLElement | null>(null);
  const isConnected = useConnection();

  const onDateChange = (time: number) =>  {
    props.onDateChange(time);
  }

  const handleAddCustomDialog = () => {
    props.addCustomWidgetDialog();
  }
  const handleLogout = () => {
    props.logoutUser();
    navigate('/login',{replace:true});
  }

  const changeSettingMenuAnchorElToNull = () => {
    setSettingMenuAnchorEl(null);
  }

  return (
    <Stack
      id="Header"
      direction={"row"}
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: "left",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        background: "#131722",
      }}
    >
      <Box>
        {isConnected ? (
          <WifiIcon color="success" fontSize="medium" />
        ) : (
          <WifiOffIcon color="disabled" />
        )}
      </Box>
      <VerticalDivider />
      {/* <img id={"LeftMenuIcon"} src={'@svg/LeftMenu.svg'} /> */}
      <Box pt={1}>
      <OrekaIcon />
      </Box>
      <Box className="orekaTitle" pt={1}>
      <OrekaTitle  />
      </Box>
      <VerticalDivider />
      <DateComponent
        dateChangeCallback={onDateChange}
        defaultTime={Date.now()}
      />
      <Box className="HeaderVerticalSeperator"></Box>
      <Box className="HeaderTabs">
        <PageList />
        <Tooltip title='Add Page'>
            <IconButton
              sx={{pb:1.5}}
              onClick={(e) => props.toggleAddPageModal(!props.addPageModalState)}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
      </Box>
      <Box className="HeaderOptions">
        <VerticalDivider />
        <Box sx={{ pl: 1, pr: 1, display: "flex"}}>
          <Tooltip title='TDH'>
            <IconButton
              onClick={(e) => props.toggleTdhModal(!props.tdhModalState)}
            >
              <GroupIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Activate Order'>
            <IconButton
              onClick={props.activateOrder}
            >
              <AddTaskOutlined/>
            </IconButton>
          </Tooltip>
        </Box>
        <VerticalDivider />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ pl: 2, mt: 0.5 }}>
            <IconButton
              onClick={(e) => setSettingMenuAnchorEl(e.currentTarget)}
            >
              <SettingsOutlinedIcon />
            </IconButton>
            <SettingMenu
              anchorEl={settingMenuAnchorEl}
              open={Boolean(settingMenuAnchorEl)}
              handleClose={() => setSettingMenuAnchorEl(null)}
              handleLogout={handleLogout}
              changeSettingMenuAnchorElToNull = {changeSettingMenuAnchorElToNull}
            />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

function mapStateToProps(state: any) {
  return {
    websocketConnectionStatus: state.app.websocketConnectionStatus,
    headerTabs: state.app.headers,
    customDate: state.app.customDate,
    tdhModalState: state.app.tdhModalState,
    addPageModalState: state.app.addPageModalState
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    onDateChange: (time: number) =>
      appActions.onDateChange(time),
    addCustomWidgetDialog: () =>
      appActions.openCustomWidgetAddModal(true),
    toggleTdhModal: (open: boolean) => dispatch(appActions.toggleTdhModal(open)),
    toggleAddPageModal: (open:boolean) => dispatch(appActions.toogleAddPageModal(open)),
    activateOrder: () => appActions.activateOrder(),
    logoutUser:() => dispatch(appActions.logout())
  };
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Header));
