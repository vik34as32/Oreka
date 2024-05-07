import React, { Component, ReactNode } from "react";
import { Box, FormControl, Input, InputAdornment, InputLabel, MenuItem, Modal, Select, Stack, styled, TextField, Typography } from "@mui/material";
import { ArrowRightTwoTone } from "@mui/icons-material";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

type AddWidgetCustomModalProps = {
    open: boolean,
    handleOpen: () => void,
    handleClose: () => void,
    addWidget: (item: any) => void,
    datasources: any,
}

type AddWidgetCustomModalState = {

}

export default class AddWidgetCustomModal extends Component<AddWidgetCustomModalProps, AddWidgetCustomModalState> {
    render() {
        return (
            <Modal
                open={this.props.open}
                onClose={e => this.props.handleClose()}
                sx={{ border: "none", background: "none" }}
            >
                <Stack direction={"row"}>
                    <Stack direction={"column"}>
                        <Stack direction={"row"} sx={{ height: "10%" }}>

                        </Stack>
                        <Stack direction={"row"}>
                            <AddWidgetCustomColumns
                                handleClose={() => this.props.handleClose()}
                                handleOpen={() => this.props.handleOpen()}
                                addWidget={(e) => this.props.addWidget(e)}
                                columnMetaData={this.props.datasources} />
                        </Stack>
                    </Stack>
                </Stack>
            </Modal>
        );
    }
}



const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
    padding: "0px",
    margin: "0px",
    background: "none"
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowRightTwoTone sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        padding: "0px",
        margin: "0px",
        border: "none"
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
}));

type AddWidgetCustomColumnsProps = {
    handleOpen: () => void,
    handleClose: () => void,
    addWidget: (item: any) => void,
    datasources: any,
}

class AddWidgetCustomColumns extends Component<AddWidgetCustomColumnsProps> {

    createTree(data: any[], level: number): ReactNode[] {
        if (data == undefined)
            return []
        var childs: ReactNode[] = []

        var defaultFontSize = 16;

        data.forEach((item: any) => {
            if (item.child != undefined) {
                childs.push(
                    <Accordion disableGutters sx={{
                        p: 0, m: 0, pl: level, '&:before': {
                            display: 'none',
                        }, "min-height": "0px",
                    }} elevation={0}>
                        <AccordionSummary style={{ margin: "0px", padding: "0px" }} sx={{ p: 0, m: 0, "min-height": "0px", }}
                            classes={{
                                root: "accordion-no-padding",
                                expanded: "accordion-no-padding",
                                content: "accordion-no-padding",
                                gutters: "accordion-no-padding",
                            }}
                            className="accordion-no-padding">
                            <Typography sx={{ fontSize: (defaultFontSize - 2 * level) + "px" }}>{item.headerName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ e: 0, p: 0, m: 0, pl: level, "minHeight": "0px", }} className="accordion-no-padding" classes={{ root: "accordion-no-padding" }}>
                            <Stack direction={"column"} sx={{ p: 0, m: 0 }}>
                                {this.createTree(item.child, level + 1)}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                )
            } else {
                childs.push(
                    <Typography sx={{ p: 0, m: 0, pl: level, fontSize: (defaultFontSize - 2 * level) + "px" }} onClick={(e) => {
                        this.props.handleClose();
                        this.props.addWidget(item)
                    }}>{item.name}</Typography>
                )
            }
        })

        return childs;
    }

    render() {
        return (
            <Box>
                {this.createTree(this.props.datasources[0].columns, 0)}
            </Box>
        );
    }
}