import { Box, Tooltip, Typography } from "@mui/material";
import React, { ReactElement, forwardRef, useEffect } from "react";
import PageMenu from "./menu/PageMenu";
import { Theme } from "../widgets/ThemeModal/ThemeTemplateModal";
import { connect } from "react-redux";

export type PageInfoProp = {
    pageId:string;
    name:string;
    shortName:string;
    isActive:boolean;
    isDeletable:boolean;
    deletePage: (pageId:string) => void;
    editPage: (pageId:string) => void;
    savePage: (pageId:string) => void;
    isPageUnsaved:boolean;  
    selectedTheme: Theme;
}
const Page:React.FC<PageInfoProp> = (props:PageInfoProp):ReactElement => {

    return (
      <Box
        sx={{
          display: "flex",
          width: 50,
          alignItems: "center",
          color: props.isActive ? "#FFF" : "#9DA6C0",
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            borderBottom: "3px solid",
            borderColor: props.isActive ? props.selectedTheme.color[0] : "transparent",
            mr: props.isActive && props.isPageUnsaved ? 0.5 : 1,
            ml: 1,
            fontWeight: 700,
            h: 0.85,
            width: "fit-content",
          }}
        >
          <Tooltip title={props.name} sx={{ mb: 0.5 }}>
            <Typography variant="body2">{props.isActive && props.isPageUnsaved ? "*" : null}{props.shortName}</Typography>
          </Tooltip>
        </Box>
        <PageMenu
          name={props.name}
          visible={props.isActive}
          isDeletable={props.isDeletable}
          pageId={props.pageId}
          deletePage={props.deletePage}
          editPage={props.editPage}
          savePage={props.savePage}
        />
      </Box>
    );
}

function mapStateToProps(state: any) {
  return {    
    selectedTheme: state.app.selectedTheme
  }
}

export default React.memo(connect(mapStateToProps, null, null, {forwardRef: true})(Page));