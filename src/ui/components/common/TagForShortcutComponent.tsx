import { Chip } from "@mui/material";
import { ReactElement } from "react";

type TagComponentProps = {
    shortcut: string[];
}


const TagForShortcutComponent: React.FC<TagComponentProps> = (props: TagComponentProps): ReactElement => {

    if (props.shortcut.length !== 2) return <></>;
    return (
        <div style={{ marginLeft: '5px' }}>
            <Chip label={props.shortcut[0]} size="small" sx={{ pt : "1px",borderRadius: '5px', height: '13px', fontSize: '11px' }} ></Chip>
            <span> + </span>
            <Chip label={props.shortcut[1]} size="small" sx={{ pt : "1px",borderRadius: '5px', height: '13px',width : '31px', fontSize: '11px' }} ></Chip>
        </div>

    )
}

export default TagForShortcutComponent;