import { AnyAction } from 'redux';
import { ReducerConstants } from '../../../config/reducers/ReducerConstants';
import initialState from '../../../config/reducers/ReducerInitialState';
import { PageMetaInfoType } from '../../../ui/canvas/services/CanvasService';

export default function PageReducer(state = initialState.page,action:AnyAction) {
    switch(action.type) {
        case ReducerConstants.REORDER_PAGE:
            return {
                ...state,
                pages : action.pages
            }
        case ReducerConstants.ADD_NEW_PAGE:
            let pages:PageMetaInfoType[] = state.pages;
            const nextSequence = pages.length ? pages[pages.length-1].sequence + 1 : 0;
            return {
                ...state,
                activePageId:action.pageId,
                pages:[...pages,{pageId:action.pageId,name:action.name,shortName:action.shortName, sequence : nextSequence}]
            }
        case ReducerConstants.SET_ACTIVE_PAGE:
            return {
                ...state,
                activePageId:action.pageId
            }
        case ReducerConstants.PAGE_LIST:{
            return {
                ...state,
                activePageId:action.pages[0].pageId,
                pages:action.pages
            }
        }
        case ReducerConstants.DELETE_PAGE: {
            const pageId = action.pageId;
            const newPages:PageMetaInfoType[] = state.pages.filter((page:PageMetaInfoType) => page.pageId !== pageId);
            return {
                ...state,
                pages:newPages,
                activePageId:newPages[0].pageId
            }
        }
        case ReducerConstants.UPDATE_PAGE: {
            const pageDetails:PageMetaInfoType = action.pageDetails;
            const newPages = state.pages.map((page:PageMetaInfoType) => {
                if(page.pageId === pageDetails.pageId) return pageDetails;
                return page;
            })
            return {
                ...state,
                pages:newPages
            }
        }
        case ReducerConstants.SET_IS_PAGE_UNSAVED:{
            return {
                ...state,
                isPageUnsaved:action.value
            }
        }
        default:
            return state;
    }
}