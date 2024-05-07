import { Box, FormControl, Menu, MenuItem, MenuList, Select, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import useKeyBoardShortCut from '../keyboard-shortcut/useKeyBoardShortcut';

export type LinkColor = {
    color:string;
    type:string;
}
export type WidgetLinkProps = {
    handleWidgetLink:(linkColor:LinkColor) => void;
    linkColor:LinkColor;
    skipUnlink?:boolean;
}
export const linkColors:LinkColor[] = [
    {color:'red',type:'red'},
    {color:'green',type:'green'},
    {color:'yellow',type:'yellow'},
    {color:'cyan',type:'cyan'},
    {color:'gray',type:'unlink'}
]
const WidgetLink:React.FC<WidgetLinkProps> = (props:WidgetLinkProps) =>  {
    const [color,setColor] = useState<LinkColor>(props.linkColor || linkColors[0]);
    const [anchorEl,setAnchorEl] = useState<null|HTMLElement>(null);

    // const openLinkShortcutKey = useMemo(() => (['shift','l']),[]);

    const handleMenuSelect = (linkedColor:LinkColor) => {
        if(typeof linkedColor !== 'string') {
            setColor(linkedColor);
            props.handleWidgetLink(linkedColor);
        }
    }
    const onMenuClose = () => {
        setAnchorEl(null);
    }
    useEffect(() => {
        if(props.linkColor) setColor(props.linkColor);
    },[props.linkColor])

    return (
      <FormControl size="small" variant="standard" sx={{ pl: 0.5 }}>
        <Box
          id='widget-link-button'
          onMouseDown={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            cursor:'pointer',
            padding: 0,
            width: "11px",
            height: "11px",
            borderRadius: "50%",
            border: color.type === "unlink" ? "1px solid gray" : "0px",
            backgroundColor: color.type === "unlink" ? "inherit" : color.color,
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onMenuClose}
          disableAutoFocusItem
          disableAutoFocus
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          PaperProps={{
            sx: {
              background: "#020305",
            },
          }}
          title="Link Widget"
        >
          <Box sx={{pl:1,pr:1}}>
            <Typography fontWeight={700} variant="body2">
              Link Widget
            </Typography>
          </Box>
            {linkColors
              .filter((color) => !props.skipUnlink || color.type !== "unlink")
              .map((color) => (
                <MenuItem
                  key={color.type}
                  onMouseDown={() => handleMenuSelect(color)}
                  sx={{pl:1,pr:1,pt:0.5,pb:0.5}}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: color.color,
                    }}
                  />
                  <Typography sx={{ pl: 1,textTransform:'capitalize' }} variant="body2">
                    {color.type}
                  </Typography>
                </MenuItem>
              ))}
        </Menu>
      </FormControl>
    );
}

export default React.memo(WidgetLink);
