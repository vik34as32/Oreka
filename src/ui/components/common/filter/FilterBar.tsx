import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SegmentIcon from '@mui/icons-material/Segment';
import { Box, Chip, InputAdornment, Stack, TextField, styled } from '@mui/material';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Filter } from '../../custom-widget/WidgetConfig';
import { VerticalDivider } from '../dividers/Dividers';
import WidgetLink, { LinkColor } from '../widget-link/WidgetLink';
import useKeyBoardShortCut from '../keyboard-shortcut/useKeyBoardShortcut';
import { DragIndicator } from '@mui/icons-material';
import "../../../../../src/assets/css/theme.css";

export interface FilterBarProps {
    filters:Filter[],
    filterColor:LinkColor,
    onFilterDelete:(colId:string,filterColor:LinkColor) => void;
    onFilterColorChange:(newFilterColor:LinkColor) => void;
    onQuickFilterChange:(filterValue:string) => void;
}

const FilterBar:React.FC<FilterBarProps> = (props:FilterBarProps) => {
    const [quickFilterValue,setQuickFilterValue] = useState<string>('');

    const inputref = useRef<HTMLInputElement | null>(null);
    const globalSearchShortcutKey = useMemo(() => (['shift','?']),[]);
    const clearLinkedFilterShortcutKey = useMemo(() => (['shift','dead']),[]);

    const handleDelete = (colId:string) => {
        props.onFilterDelete(colId,props.filterColor);
    }
    const handleFilterColorSelect = (linkColor:LinkColor) => {
        props.onFilterColorChange(linkColor);
    }
    const handleQuickFilterChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setQuickFilterValue(e.target.value);
    };

    const handleClearLinkedFilter = () => {
        let popped = props.filters.pop();
        if(popped){
            handleDelete(popped?.colId);
        }  
    }

    useKeyBoardShortCut(clearLinkedFilterShortcutKey, handleClearLinkedFilter);

    const handleGlobalSearchSelect = () => {
        if(inputref && inputref.current){
            inputref.current.focus();
        }
    };

    useKeyBoardShortCut(globalSearchShortcutKey , handleGlobalSearchSelect);

    return (
        <Box sx={{p:0.5, height:36, background:'#131722', mt:0.5, mb:0.5, display:'flex',alignItems:'center'}}>
            <Box sx={{ml:1,mr:1}}>
                <SegmentIcon/>
            </Box>
            <VerticalDivider width='2px'/>
            <Box sx={{p:0,mt:1.5,ml:1,mr:1}}>
                <WidgetLink handleWidgetLink={handleFilterColorSelect} linkColor={props.filterColor} skipUnlink/>
            </Box>
            <Stack direction={'row'} spacing={1} sx={{ml:1}}>
                {
                    props.filters.map(filter => <Chip icon={<DragIndicator style={{ color: '#6A7187', marginLeft : "8px" }}/>} key={filter.colId} sx={{backgroundColor:'#1E2532',color:'#9DA6C0', marginRight : 1}}  className='label-text' size='small' label={filter.value} deleteIcon={<CloseIcon style={{fontSize:12, marginRight : "9px"}} htmlColor='#6A7187'/>} onDelete={() => handleDelete(filter.colId)}/>)
                }
            </Stack>
            <Box sx={{ml:'auto',mr:1,display:'flex',alignItems:'center'}}>
                <SearchTextField style={{color : "#6A7187" }} sx={{color : "#6A7187"}} inputProps={{color : "#6A7187"}} inputRef={inputref} id="global-text-filter"  placeholder='Type to filter' onKeyPress={e => e.key==='Enter'?props.onQuickFilterChange(quickFilterValue):''} variant="outlined" value={quickFilterValue} onChange={handleQuickFilterChange} InputProps={{sx:{
                    height:25,
                    p:0.5,
                    maxWidth:200,
                    fontWeight : 400,
                    fontSize : "12px",
                },
                
                
                endAdornment:(
                    <InputAdornment position='end' sx={{mr:0,cursor:'pointer'}}>
                        <CloseIcon htmlColor='#6A7187' fontSize='small' onClick={e => setQuickFilterValue("")}/>
                    </InputAdornment>
                ),
                startAdornment:(
                    <InputAdornment position='start' sx={{mr:1,cursor:'pointer'}}>
                        <FilterListIcon style={{width : "14px"}} htmlColor='#6A7187' fontSize='small'/>
                    </InputAdornment>
                )
                }}
                
                />
            </Box>
        </Box>
    )
}

const SearchTextField = styled(TextField)({
    input :{
        "&::placeholder" :{
            color : "#9b9fb0",
            fontWeight : 500
        }
    },
    '& label.Mui-focused': {
        color: '#6A7187',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#6A7187',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#222634',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#6A7187',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6A7187',
      },
    },
  });
export default React.memo(FilterBar);
