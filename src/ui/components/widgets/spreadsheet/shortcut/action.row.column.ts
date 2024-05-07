import * as GC from "@grapecity/spread-sheets";
import { ShortcutActionBase, Commands, executeCommand } from "../action.base";
import { SheetUtil } from "../sheetUtil";

const VerticalPosition = GC.Spread.Sheets.VerticalPosition;
const HorizontalPosition = GC.Spread.Sheets.HorizontalPosition;
interface IShortcutActionOptionBase {
    cmd?: string;
    sheetName: string;
}

interface IRowInfo {
    startRowIndex: number;
    rowCount: number;
}

interface IColInfo {
    startColIndex: number;
    colCount: number;
}

interface IHideSelectRowsActionOption extends IShortcutActionOptionBase {
    rowInfo?: IRowInfo[];
}

interface IOperateEntireRowOrColumnOption extends IShortcutActionOptionBase {
    isRow?: boolean;
    rowInfos?: IRowInfo[];
    colInfos?: IColInfo[];
    isDelete?: boolean;
}

interface IGroupRangeActionOption extends IShortcutActionOptionBase {
    selection?: GC.Spread.Sheets.Range;
    isGroup?: boolean;
}

export const enum RangeType {
    singleRange = 0,
    fullRow = 1,
    fullColumn = 2,
    entireSheet = 3,
}

const DELETE_ROW_OR_COLUMN = 'deleteEntireRowOrColumn',
    HIDE_SELECT_ROWS = 'hideSelectRows',
    GROUP_SELECT_RANGE = 'groupSelectRange',
    UNGROUP_SELECT_RANGE = 'ungroupSelectRange',
    INSERT_ROW_OR_COLUMN = 'InsertRowOrColumn';


class OperateEntireRowOrColumnUndoAction extends ShortcutActionBase<IOperateEntireRowOrColumnOption> {
    executeImp () {
        let self = this;
        let sheet = self.getSheet();
        let options = self._options as IOperateEntireRowOrColumnOption;
        let activeRow = sheet.getActiveRowIndex(), activeCol = sheet.getActiveColumnIndex();
        let isDelete = options.isDelete;
        let i = 0;
        if (options.isRow) {
            let rowInfos = options.rowInfos;
            if (rowInfos) {
                if (isDelete) {
                    for (i = rowInfos.length - 1; i >= 0; i--) {
                        let rowInfo = rowInfos[i];
                        sheet.deleteRows(rowInfo.startRowIndex, rowInfo.rowCount);
                    }
                } else {
                    for (i = 0; i < rowInfos.length; i++) {
                        let rowInfo = rowInfos[i];
                        sheet.addRows(rowInfo.startRowIndex, rowInfo.rowCount);
                    }
                }
            }
        } else {
            let colInfos = options.colInfos;
            if (colInfos) {
                if (isDelete) {
                    for (i = colInfos.length - 1; i >= 0; i--) {
                        let colInfo = colInfos[i];
                        sheet.deleteColumns(colInfo.startColIndex, colInfo.colCount);
                    }
                } else {
                    for (i = 0; i < colInfos.length; i++) {
                        let colInfo = colInfos[i];
                        sheet.addColumns(colInfo.startColIndex, colInfo.colCount);
                    }
                }
            }
        }
        sheet.showCell(activeRow, activeCol, VerticalPosition.nearest, HorizontalPosition.nearest);
        return true;
    }
}

function selectionHandler (selections: GC.Spread.Sheets.Range[], options: IOperateEntireRowOrColumnOption) {
    if (selections.length === 0) {
        return false;
    } else if (selections.length === 1) {
        let selection = selections[0];
        let rangeType = SheetUtil.getRangeType(selection);
        if (rangeType === RangeType.entireSheet) { //select all sheet.
            return true;
        } else if (rangeType === RangeType.fullColumn) {
            options.isRow = false;
            options.colInfos = [{
                startColIndex: selection.col,
                colCount: selection.colCount
            }];
        } else if (rangeType === RangeType.fullRow) {
            options.isRow = true;
            options.rowInfos = [{
                startRowIndex: selection.row,
                rowCount: selection.rowCount
            }];
        } else {
            return true;
        }
    } else {
        let startRangeType = SheetUtil.getRangeType(selections[0]);
        if (startRangeType === RangeType.singleRange || startRangeType === RangeType.entireSheet) {
            return true;
        } else if (startRangeType === RangeType.fullColumn) {
            options.isRow = false;
        } else if (startRangeType === RangeType.fullRow) {
            options.isRow = true;
        }
        options.rowInfos = [];
        options.colInfos = [];
        for (let selection of selections) {
            let rangeType = SheetUtil.getRangeType(selection);
            if (rangeType !== startRangeType) {
                return true;
            }
        }
        selections.forEach((selection: GC.Spread.Sheets.Range) => {
            let rangeType = SheetUtil.getRangeType(selection);
            if (rangeType === RangeType.fullRow) {
                options.rowInfos && options.rowInfos.push({
                    startRowIndex: selection.row,
                    rowCount: selection.rowCount,
                });
            } else if (rangeType === RangeType.fullColumn) {
                options.colInfos && options.colInfos.push({
                    startColIndex: selection.col,
                    colCount: selection.colCount
                });
            }
        });
    }
}

Commands[DELETE_ROW_OR_COLUMN] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IOperateEntireRowOrColumnOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = DELETE_ROW_OR_COLUMN;
        if (!isUndo) {
            options.isDelete = true;
            let selections = sheet.getSelections();
            selectionHandler(selections, options);
        }
        return executeCommand(context, OperateEntireRowOrColumnUndoAction, options, isUndo);
    }
};

Commands[INSERT_ROW_OR_COLUMN] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IOperateEntireRowOrColumnOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = INSERT_ROW_OR_COLUMN;
        if (!isUndo) {
            options.isDelete = false;
            let selections = sheet.getSelections();
            selectionHandler(selections, options);
        }
        return executeCommand(context, OperateEntireRowOrColumnUndoAction, options, isUndo);
    }
};

class HideSelectRowsUndoAction extends ShortcutActionBase<IHideSelectRowsActionOption> {
    executeImp () {
        let self = this;
        let sheet = self.getSheet(), options = self._options as IHideSelectRowsActionOption;
        let rowInfos = options.rowInfo as IRowInfo[];
        if (rowInfos.length > 0) {
            sheet.suspendPaint();
            sheet.suspendEvent();
            let activeRow = sheet.getActiveRowIndex(), activeCol = sheet.getActiveColumnIndex();
            rowInfos.forEach((rowInfo) => {
                let startIndex = rowInfo.startRowIndex < 0 ? 0 : rowInfo.startRowIndex, rowCount = rowInfo.rowCount, endIndex = startIndex + rowCount;
                for (let i = startIndex; i < endIndex; i++) {
                    sheet.setRowVisible(i, false);
                }
            });
            sheet.showCell(activeRow, activeCol, VerticalPosition.nearest, HorizontalPosition.nearest);
            sheet.resumeEvent();
            sheet.resumePaint();
            return true;
        }
        return false;
    }
}

Commands[HIDE_SELECT_ROWS] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IHideSelectRowsActionOption, isUndo: boolean) {
        options.cmd = HIDE_SELECT_ROWS;
        let sheet = context.getSheetFromName(options.sheetName);
        let selections = sheet.getSelections();
        let rowInfos: IRowInfo[] = [];
        if (!isUndo && selections.length > 0) {
            selections.forEach((selection) => {
                let startIndex = selection.row;
                let rowCount = selection.rowCount;
                rowInfos.push({
                    startRowIndex: startIndex,
                    rowCount: rowCount,
                });
            });
            options.rowInfo = rowInfos;
        }
        return executeCommand(context, HideSelectRowsUndoAction, options, isUndo);
    }
};



class GroupSelectRangeUndoAction extends ShortcutActionBase<IGroupRangeActionOption> {
    executeImp (): boolean {
        let self = this;
        let command = self._options as IGroupRangeActionOption;
        let sheet = self.getSheet();
        let selection = command.selection, isGroup = command.isGroup;
        if (!selection) {
            return false;
        }
        let selectRangeType = SheetUtil.getRangeType(selection);
        try {
            sheet.suspendPaint();
            if (selectRangeType === RangeType.fullColumn) {
                let col = selection.col, colCount = selection.colCount;
                if (isGroup) {
                    sheet.columnOutlines.group(col, colCount);
                } else {
                    sheet.columnOutlines.ungroupRange(col, colCount);
                }
                sheet.showCell(0, col, VerticalPosition.nearest, HorizontalPosition.nearest);
            } else if (selectRangeType === RangeType.fullRow) {
                let row = selection.row, rowCount = selection.rowCount;
                if (isGroup) {
                    sheet.rowOutlines.group(row, rowCount);
                } else {
                    sheet.rowOutlines.ungroupRange(row, rowCount);
                }
                sheet.showCell(row, 0, VerticalPosition.nearest, HorizontalPosition.nearest);
            }
        } finally {
            sheet.resumePaint();
        }
        return true;
    }
    canUndo () {
        return true;
    }
}

Commands[GROUP_SELECT_RANGE] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IGroupRangeActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = GROUP_SELECT_RANGE;
        if (!isUndo) {
            let selections = sheet.getSelections();
            options.isGroup = true;
            if (selections.length === 1) {
                let selection = selections[0];
                let selectionType = SheetUtil.getRangeType(selection);
                if (selectionType === RangeType.fullRow || selectionType === RangeType.fullColumn) {
                    options.selection = selection;
                }
            }
        }
        if (options.selection) {
            return executeCommand(context, GroupSelectRangeUndoAction, options, isUndo);
        } else {
            return false;
        }
    }
};

Commands[UNGROUP_SELECT_RANGE] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IGroupRangeActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = UNGROUP_SELECT_RANGE;
        if (!isUndo) {
            let selections = sheet.getSelections();
            options.isGroup = false;
            if (selections.length === 1) {
                let selection = selections[0];
                let selectionType = SheetUtil.getRangeType(selection);
                if (selectionType === RangeType.fullRow || selectionType === RangeType.fullColumn) {
                    options.selection = selection;
                }
            }
        }
        if (options.selection) {
            return executeCommand(context, GroupSelectRangeUndoAction, options, isUndo);
        } else {
            return false;
        }
    }
};



export function initShortcutAboutRowsAndColumns (commands: GC.Spread.Commands.CommandManager) {
    commands.register(HIDE_SELECT_ROWS, Commands[HIDE_SELECT_ROWS], 57 /* 9 */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(GROUP_SELECT_RANGE, Commands[GROUP_SELECT_RANGE], 39 /* Right Arrow*/, false /* ctrl */, true /* shift */, true /* alt */, false /* meta */);
    commands.register(UNGROUP_SELECT_RANGE, Commands[UNGROUP_SELECT_RANGE], 37 /* Left Arrow*/, false /* ctrl */, true /* shift */, true /* alt */, false /* meta */);
    commands.register(DELETE_ROW_OR_COLUMN, Commands[DELETE_ROW_OR_COLUMN], 109 /* - */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(INSERT_ROW_OR_COLUMN, Commands[INSERT_ROW_OR_COLUMN], 107 /* + */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    if (SheetUtil.isFirefox()) {
        commands.register(DELETE_ROW_OR_COLUMN, Commands[DELETE_ROW_OR_COLUMN], 173 /* - */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
        commands.register(INSERT_ROW_OR_COLUMN, Commands[INSERT_ROW_OR_COLUMN], 61 /* + */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    } else {
        commands.register(DELETE_ROW_OR_COLUMN, Commands[DELETE_ROW_OR_COLUMN], 189 /* - */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
        commands.register(INSERT_ROW_OR_COLUMN, Commands[INSERT_ROW_OR_COLUMN], 187 /* + */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    }
}
