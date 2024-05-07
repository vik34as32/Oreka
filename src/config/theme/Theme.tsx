import { createTheme, experimental_sx as sx } from '@mui/material/styles';
import { blue } from "@mui/material/colors";
import { Padding } from '@mui/icons-material';

export const inlineStyles = () => ({
    '&': {
        display: 'inline',
    },
});

export const theme = createTheme({
    components: {
        MuiAccordion: {
            styleOverrides: {
                root:{
                    m: 0,
                    p: 0
                }
            }
        },
        MuiTextField : {
            styleOverrides :{
                root: {
                    '& .MuiOutlinedInput-root': {
                      border: 'none', // Remove the default border
                      
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid #2B3349', // Apply the custom border
                    },
                    '&:disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2B3349', // Apply a different border color for disabled state
                      },
                  },
            }
        },
        MuiAutocomplete : {
            styleOverrides:{
                root: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: '1px solid #2B3349',
                         
                      },
                    
                    },
                  },
                option : {
                    background : "#0A0A0A",
                    marginRight :0,
                    fontWeight : 400,
                    fontSize : 12,
                    fontFamily : "Inter",
                    width : '100%',
                    padding : 0
                    
                },
                listbox : {
                    background : "#0A0A0A",
                    '&::-webkit-scrollbar': {
                        backgroundColor: '#0A0A0A'
                      },
                      
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#6A7187',
                      },
                      
                },
                
            }
        },
        
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& fieldset': {
                      borderColor: '#2B3349' // Change the border color
                    }
                  }
            }
        },
          

        MuiDivider:{
            styleOverrides:{
                root:{
                    color:"#2B3348",
                    border:0,
                }
            }
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    m: 0,
                    p: 0
                }
            }
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    m: 0,
                    p: 0
                }
            }
        },
        MuiDialog:{
            styleOverrides:{
                paper:{
                    background:"#020305"
                }
            },
        },
        
    },
    palette: {
        mode: 'dark',
        primary: blue,
        secondary: {
            900: "#0D47A1",
            800: "#1565C0",
            700: "#1976D2",
            600: "#1E88E5",
            500: "#2196F3",
            400: "#42A5F5",
            300: "#64B5F6",
            200: "#90CAF9",
            100: "#BBDEFB",
            50: "#E3F2FD",
            A100: "#82B1FF",
            A200: "#448AFF",
            A400: "#2979FF",
            A700: "#2962FF",
            main: "#FFFFFF"
        },
        divider: "#546E7A",
        error: {
            900: "#490F12",
            800: "#730F15",
            700: "#A70D19",
            600: "#D11925",
            500: "#DA4C51",
            400: "#DA4C51",
            300: "#EF979A",
            200: "#EF979A",
            100: "#FBE2E2",
            50: "#FBE2E2",
        },
        warning: {
            900: "#493910",
            800: "#785A18",
            700: "#BD962F",
            600: "#F0C052",
            500: "#F8DC8E",
            400: "#F8DC8E",
            300: "#FDF1CD",
            200: "#FDF1CD",
            100: "#FFFCF1",
            50: "#FFFCF1",
        },
        info: {
            900: "#493910",
            800: "#785A18",
            700: "#BD962F",
            600: "#F0C052",
            500: "#F8DC8E",
            400: "#F8DC8E",
            300: "#FDF1CD",
            200: "#FDF1CD",
            100: "#FFFCF1",
            50: "#FFFCF1",
        },
        success: {
            900: "#13412C",
            800: "#176632",
            700: "#228F46",
            600: "#32B85F",
            500: "#65D48E",
            400: "#65D48E",
            300: "#9AEDB4",
            200: "#9AEDB4",
            100: "#DEFDE7",
            50: "#DEFDE7",
        },
        grey: {
            900: "#191E28",
            800: "#4C5766",
            700: "#758296",
            600: "#A9B7C2",
            500: "#C4CCD7",
            400: "#C4CCD7",
            300: "#DAE1E8",
            200: "#DAE1E8",
            100: "#F6F7F9",
            50: "#F6F7F9",
        },
        background: {
            default: '#020305',
            paper: '#141721',
        },
        text: {
            primary: '#FFF',
            disabled: '#7c8296',
            secondary: '#CCC'
        },
        // action: mode === 'dark' ? {
        //     hover: '#EEEEEE',
        //     selected: '#222B82',
        //     active: '#4C5ACF'
        // } : {
        //     hover: '#FAFAFA',
        //     selected: '#222B82',
        //     active: '#4C5ACF'
        // }
    },
    // typography : {
    //     fontFamily : "Inter",
    
    // },
    
    // typography: {
    //     fontFamily: [
    //         'Avenir',
    //         'HelveticaNueue',
    //         '-apple-system',
    //         'BlinkMacSystemFont',
    //         '"Segoe UI"',
    //         'Roboto',
    //         '"Helvetica Neue"',
    //         'Arial',
    //         'sans-serif',
    //         '"Apple Color Emoji"',
    //         '"Segoe UI Emoji"',
    //         '"Segoe UI Symbol"',
    //     ].join(','),
    //     subtitle1: {
    //         fontFamily: [
    //             'Avenir',
    //             '-apple-system',
    //             'BlinkMacSystemFont',
    //         ].join(','),
    //         fontWeight: 300,
    //         fontSize: "15px",
    //         lineHeight: '27px',
    //         color: '#FFF',
    //     },
    //     subtitle2: {
    //         fontFamily: [
    //             'Avenir',
    //             '-apple-system',
    //             'BlinkMacSystemFont',
    //         ].join(','),
    //         fontWeight: 200,
    //         fontSize: "14px",
    //         lineHeight: '26px',
    //         color: '#fff',
    //     },
    //     body1: {
    //         fontFamily: [
    //             'Avenir',
    //             '-apple-system',
    //             'BlinkMacSystemFont',
    //         ].join(','),
    //         fontWeight: 300,
    //         fontSize: "18px",
    //         lineHeight: '30px',
    //         color: '#fff',
    //         padding: 0,
    //         margin: 0
    //     },
    //     body2: {
    //         fontFamily: [
    //             'Avenir',
    //             '-apple-system',
    //             'BlinkMacSystemFont',
    //         ].join(','),
    //         fontWeight: 300,
    //         fontSize: "17px",
    //         lineHeight: '29px',
    //         color: '#fff',
    //         padding: 0,
    //         margin: 0
    //     },
    //     h1: {
    //         fontFamily: [
    //             'HelveticaNueue',
    //             '-apple-system',
    //             'BlinkMacSystemFont',
    //         ].join(','),
    //         fontWeight: 400,
    //         fontSize: "40px",
    //         lineHeight: '52px',
    //         color: '#fff',
    //     },
    //     h2: {
    //         fontFamily: [
    //             'HelveticaNueue',
    //             '-apple-system',
    //             'BlinkMacSystemFont',
    //         ].join(','),
    //         fontWeight: 400,
    //         fontSize: "34px",
    //         lineHeight: '46px',
    //         color: '#fff',
    //     },
    //     h3: {
    //         fontFamily: [
    //             'HelveticaNueue',
    //             'BlinkMacSystemFont',
    //             '-apple-system',
    //         ].join(','),
    //         fontWeight: 400,
    //         fontSize: "26px",
    //         lineHeight: '38px',
    //         color: '#fff',
    //     },
    //     h4: {
    //         fontFamily: [
    //             'HelveticaNueue',
    //             'BlinkMacSystemFont',
    //             '-apple-system',
    //         ].join(','),
    //         fontWeight: 400,
    //         fontSize: "24px",
    //         lineHeight: '36px',
    //         color: '#fff',
    //     },
    //     h5: {
    //         fontFamily: [
    //             'HelveticaNueue',
    //             'BlinkMacSystemFont',
    //             '-apple-system',
    //         ].join(','),
    //         fontWeight: 400,
    //         fontSize: "22px",
    //         lineHeight: '34px',
    //         color: '#fff',
    //     },
    //     h6: {
    //         fontFamily: [
    //             'HelveticaNueue',
    //             'Avenir',
    //             'BlinkMacSystemFont',
    //             '-apple-system',
    //         ].join(','),
    //         fontWeight: 400,
    //         fontSize: "20px",
    //         lineHeight: '32px',
    //         color: '#fff',
    //     },
    //     "fontWeightLight": 200,
    //     "fontWeightRegular": 300,
    //     "fontWeightMedium": 500,
    //     "allVariants": {
    //         "margin": "0px",
    //         "padding": "0px",
    //         "userSelect": "text",
    //         "color": "#FFF",
    //         ...(inlineStyles() as any),
    //     },
    // }
});