// import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
// import { Box, IconButton } from "@mui/material";
// import { IJsonModel } from "flexlayout-react";
// import React, { ReactElement, useEffect, useMemo, useRef, useState } from "react";
// import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
// import { connect } from "react-redux";
// import { Dispatch } from "redux";
// import { toogleAddPageModal } from "../../../redux/action-handlers/app/AppActions";
// import { resetCanvasState, setCanvasModel } from "../../../redux/action-handlers/canvas/CanvasActions";
// import { addNewPage, deletePage, reOrderPage, reOrderPageServer, setActivePage, updatePage } from "../../../redux/action-handlers/page/PageActions";
// import { CanvasState } from "../../canvas/CanvasContainer";
// import CanvasFactory, { PageMetaInfoType } from "../../canvas/services/CanvasService";
// import useKeyBoardShortCut from "../common/keyboard-shortcut/useKeyBoardShortcut";
// import AddPageModal from "../popups/add-page/AddPageModal";
// import Page from "./Page";
// import EventEmitterService from "../../../utilities/EventEmitter";
// import { PAGE_SAVE } from "../../../utilities/Constants";

// export type PageListProps = {
//     pageList:PageMetaInfoType[];
//     canvasState: CanvasState;
//     activePage:string | null;
//     addNewPage:(pageId:string,name:string,shortName:string) => void;
//     setActivePage:(pageId:string) => void;
//     setCanvasModel:(model:IJsonModel) => void;
//     resetCanvasState: () => void;
//     deletePage: (pageId:string) => void;
//     addPageModalState: boolean;
//     toggleAddPageModal: (open:boolean) => void;
//     updatePage:(pageDetails:PageMetaInfoType) => void;
//     isPageUnsaved: boolean;
//     reOrderPage:(pages : PageMetaInfoType[]) => void;
//     reOrderPageServer:(pages:any[]) => void;
// }

// const PageList:React.FC<PageListProps> = (props:PageListProps):ReactElement => {
//     const [isDisplayLeftArrow, setIsDisplayLeftArrow] = useState<boolean>(false);
//     const [isDisplayRightArrow, setIsDisplayRightArrow] = useState<boolean>(false);
//     const [editPageId,setEditPageId] = useState<string>("");
//     const nextPageShortCutKey = useMemo(() => (['shift','pageup']),[]);
//     const backPageShortCutKey = useMemo(() => (['shift','pagedown']),[]);
//     const firstPageShortCutKey = useMemo(() => (['shift','home']),[]);
//     const lastPageShortCutKey = useMemo(() => (['shift','end']),[]);
//     const boxRef = useRef(null); // reference to the scrollable box element
//     const scrollStep = 50*5;

//     useEffect(() => {
//         const canvasService = CanvasFactory.getInstance();
//         const loginUser = localStorage.getItem('loginUser');
//         if(loginUser) canvasService.fetchPageList(loginUser);
//     },[]);

//     useEffect(() => {
      
//       if(props.pageList && props.pageList.length > 5){
//         setIsDisplayRightArrow(true);
//       } else {
//         setIsDisplayRightArrow(false);
//       }
//   },[props.pageList]);

//   useEffect(() => {
//     if(boxRef.current){
//       const container = boxRef.current;
//       container.addEventListener("scroll", handleScroll);

//       return () => {
//         container.removeEventListener("scroll", handleScroll);
//       };
//     }
    
//   }, []);

//   const handleScroll = () => {
//     if(boxRef.current){
//       const container = boxRef.current;
//       setIsDisplayLeftArrow(container.scrollLeft > 0);
//       setIsDisplayRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth -1);
//     }
    
//   };


//     useEffect(() => {
//         if(!props.activePage) return;
//         const canvasService = CanvasFactory.getInstance();
//         const user = localStorage.getItem('loginUser');
//         if(user) canvasService.fetchPageDetails(props.activePage,user);
//     },[props.activePage])

//     const handlePageChange = (selectedPage:string) => {
//         const eventEmitter = EventEmitterService.getInstance();
//         eventEmitter.emit(PAGE_SAVE);

//         props.setActivePage(selectedPage);
//         props.resetCanvasState();
//     }


//     const handleNextPage = () => {
//       const index = props.pageList.findIndex((page) => page.pageId === props.activePage);
//       if(index !== -1){
//         if(props.pageList.length > index + 1){
//           try {
//             if(index + 1 > 4){
//               scrollRight();
//             }
//             const nextPageId = props.pageList[index +1].pageId;
//             handlePageChange(nextPageId);
//           } catch (err){

//           }
//         }
//       }
//     }

//     useKeyBoardShortCut(nextPageShortCutKey, handleNextPage);

//     const handleBackPage = () => {
//       const index = props.pageList.findIndex((page) => page.pageId === props.activePage);
//       if(index > 0){

//           try {
//             if(index -1 < 4){
//             } else {
//               scrollLeft();
//             }
//             const backPageId = props.pageList[index -1].pageId;
//             handlePageChange(backPageId);
//           } catch (err){

//           }

//       }
//     }

//     useKeyBoardShortCut(backPageShortCutKey, handleBackPage);

//     useKeyBoardShortCut(firstPageShortCutKey, () => {
//       if(props.pageList.length > 0){
        
//         handlePageChange(props.pageList[0].pageId);
//         if(boxRef.current){
//           boxRef.current.scrollBy({
//             left: -(scrollStep*props.pageList.length),
//             behavior: "smooth", // Use smooth behavior for smooth scrolling
//           });
//         }
        
//       }
//     });

//     useKeyBoardShortCut(lastPageShortCutKey, () => {
//       if(props.pageList.length > 0){
//         if(props.pageList.length > 5){
          
//         }
//         handlePageChange(props.pageList[props.pageList.length - 1].pageId);
//         if(boxRef.current){
//           boxRef.current.scrollBy({
//             left: +(scrollStep*props.pageList.length),
//             behavior: "smooth", // Use smooth behavior for smooth scrolling
//           });
//         }
//       }
//     });


//     const deletePage = (pageId:string) => {
//         if(props.pageList.length > 1) {
//             const canvasService = CanvasFactory.getInstance();
//             const deletedPageIndex = props.pageList.findIndex((val) => {return val.pageId === pageId});
//             canvasService.deletePage(pageId);
//             props.deletePage(pageId);
//             props.setActivePage(props.pageList.at(deletedPageIndex - 1)!.pageId);
//             props.resetCanvasState();
//         }
//     }
//     const editPage = (pageId:string) => {
//       setEditPageId(pageId);
//       props.toggleAddPageModal(true);
//     }
//     const savePage = (pageId:string) => {
//       const canvasService = CanvasFactory.getInstance();
//       const widgetProps = canvasService.getAllComponentPropsForPage(pageId);
//       const pageInfo = props.pageList.find(page => page.pageId === pageId);
      
//       if(!widgetProps || !pageInfo) return;
      
//       canvasService.savePage(pageInfo,props.canvasState,widgetProps,true)
//     }
//     const onPageUpdate = (page:PageMetaInfoType) => {
//         props.updatePage(page);
//         setEditPageId("");
//     }

//     const reorder = (list : PageMetaInfoType[], startIndex : number, endIndex : number) => {
//       const result = Array.from(list);
//       const [removed] = result.splice(startIndex, 1);
//       result.splice(endIndex, 0, removed);

//       return result;
//     };

//     const onDragEnd = (result : DropResult) => {
//       if (!result.destination) {
//         return;
//       }

//       const reOrderedPageList = reorder(
//         props.pageList,
//         result.source.index,
//         result.destination.index
//       );

//       reOrderedPageList.forEach((page: any, index: number) => {
//         page.sequence = index;
//       });

//       // const newPageList = updateSequenceNumbers(reOrderedPageList, result.source.index, result.destination.index);
//       // newPageList.sort((a, b) => a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0)
//       props.reOrderPage(reOrderedPageList);

//       // construct array of object to send event for changing order of page
//       const updateSequenceObject = [];

//       for (let i = 0; i < reOrderedPageList.length; i++) {
//         const { pageId, sequence } = reOrderedPageList[i];
//         updateSequenceObject.push({ pageId, sequence });
//       }
//       reOrderPageServer(updateSequenceObject);
//     }

//     const scrollLeft = () => {
//       if(boxRef.current){
//         boxRef.current.scrollBy({
//           left: -scrollStep,
//           behavior: "smooth",
//         });
//       }
      
//     };

//     const scrollRight = () => {
//       if(boxRef.current){
//         boxRef.current.scrollBy({
//           left: scrollStep,
//           behavior: "smooth",
//         });
//       }
      
//     };

//     return (
//       <Box>
//       <IconButton
//           size="small"
//           sx={{ display: isDisplayLeftArrow ? "initial" :"none", width : "40px"}}
//           onClick={scrollLeft}
//         ><KeyboardArrowLeft /> 
//       </IconButton>
//       <Box ref={boxRef} maxWidth={250}  sx={{ marginLeft : isDisplayLeftArrow ? "0px" : "40px", marginRight : isDisplayRightArrow ? "0px" : "40px", overflowX: props.pageList.length > 5 ? "scroll" : "hidden", mt: 1,display: "flex",flexDirection: "row", scrollbarWidth:"none"}}>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="droppable" direction="horizontal">
//           {(provided, snapshot) => (
//             <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             style={{
//               display: "flex",
//               flexDirection: "row",
              
//             }}
//             >
//               {props.pageList.map((page, index) => (
//                 <Draggable key={page.pageId} draggableId={page.pageId} index={index}>
//                   {(provided) => (
//                     <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                       <Box onClick={() => handlePageChange(page.pageId)}>
//                         <Page
//                           pageId={page.pageId}
//                           name={page.name}
//                           deletePage={deletePage}
//                           shortName={page.shortName}
//                           isActive={page.pageId === props.activePage}
//                           isDeletable={props.pageList.length > 1}
//                           editPage={editPage}
//                           savePage={savePage}
//                         isPageUnsaved={props.isPageUnsaved}/>
//                       </Box>
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}

//         </Droppable>
//         </DragDropContext>
//         </Box>
//         <IconButton
//           size="small"
//           sx={{ display: isDisplayRightArrow ? "initial" : "none",width : isDisplayRightArrow ? "40px" : "0px" }}
//           onClick={scrollRight}
//         ><KeyboardArrowRight /> 
//         </IconButton>
        
//         <AddPageModal pageId={editPageId} onPageUpdate={onPageUpdate} onUpdateCancel={() => setEditPageId("")}/>
//       </Box>
//     );
// }

// function updateSequenceNumbers(pageMetaInfoArray : PageMetaInfoType[] ,startIndex : number, endIndex : number) {
//   const direction = startIndex < endIndex ? 1 : -1;

//   for (let i = startIndex; i !== endIndex; i += direction) {
//     const temp = pageMetaInfoArray[i].sequence;
//     pageMetaInfoArray[i].sequence = pageMetaInfoArray[i + direction].sequence;
//     pageMetaInfoArray[i + direction].sequence = temp;

//     const t = pageMetaInfoArray[i];
//     pageMetaInfoArray[i] = pageMetaInfoArray[i+direction];
//     pageMetaInfoArray[i+ direction] = t;
//   }

//   return pageMetaInfoArray;
// }

// function mapStateToProps(state:any) {
//     return {
//         activePage:state.page.activePageId,
//         canvasState:state.canvas,
//         pageList:state.page.pages,
//         addPageModalState: state.app.addPageModalState,
//         isPageUnsaved:state.page.isPageUnsaved
//     }
// }
// function mapDispatchToProps(dispatch:Dispatch) {
//     return {
//         addNewPage:(pageId:string,name:string,shortName:string) => dispatch(addNewPage(pageId,name,shortName)),
//         setActivePage:(pageId:string) => dispatch(setActivePage(pageId)),
//         setCanvasModel:(model:IJsonModel) => dispatch(setCanvasModel(model)),
//         resetCanvasState:() => dispatch(resetCanvasState()),
//         deletePage: (pageId:string) => dispatch(deletePage(pageId)),
//         toggleAddPageModal: (open:boolean) => dispatch(toogleAddPageModal(open)),
//         updatePage:(pageDetails:PageMetaInfoType) =>  dispatch(updatePage(pageDetails)),
//         reOrderPage:(pages : PageMetaInfoType[]) => dispatch(reOrderPage(pages)),
//         reOrderPageServer:(pages : any) => reOrderPageServer(pages)
//     }
// }

// export default React.memo(connect(mapStateToProps,mapDispatchToProps)(PageList));