import { Item } from "../common/checkbox-tree/CheckBoxList";

const items:Item[] = [
    {
        id:"rajat",
        name:"Rajat",
        dataType:"string"
    },
    {
        id:"rajat1",
        name:"Rajat1",
        dataType:"string",
        parentId:"rajat"
    },
    {
        id:"rajat2",
        name:"Rajat2",
        dataType:"string",
        parentId:"rajat"
    },
    {
        id:"rajat11",
        name:"Rajat11",
        dataType:"int",
        parentId:"rajat1"
    }
]

export {items};