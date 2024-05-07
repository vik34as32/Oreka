import { Commands, IShortcutActionOptionBase } from "../action.base";
import * as GC from "@grapecity/spread-sheets";
import { SheetUtil } from "../sheetUtil";
const SELECT_ENTIRE_ROW = 'selectEntireRow',
    GO_SHEET_BEGINNING = 'goToSheetBeginning',
    SELECT_ENTIRE_COLUMN = 'selectEntireColumn',
    GO_SHEET_BOTTOM_RIGHT = 'goToSheetBottomRight',
    GO_TO_PRECEDENTS = 'goToPrecedent',
    SELECT_VISIBLE_CELLS = 'selectVisibleCells',
    GO_TO_DEPENDENTS = 'goToDependents',
    SELECT_ALL = 'SelectAll',
    SELECTION_HOME = 'selectionHome',
    SELECTION_END = 'selectionEnd',
    SELECTION_TOP = 'selectionTop',
    SELECTION_BOTTOM = 'selectionBottom';


const VerticalPosition = GC.Spread.Sheets.VerticalPosition;
const HorizontalPosition = GC.Spread.Sheets.HorizontalPosition;

Commands[SELECT_ENTIRE_ROW] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SELECT_ENTIRE_ROW;
        if (sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
            let selections = sheet.getSelections(), lastSelctionIndex = selections.length - 1;
            // In excel, when multi range selected, only larger last range's entire row, keep other range selected.
            let lastSelection = selections[lastSelctionIndex];
            if (lastSelection) {
                lastSelection.col = -1;
                lastSelection.colCount = sheet.getColumnCount();
                sheet.repaint();
            }
            return true;
        }
        return false;
    }
};

Commands[SELECT_ENTIRE_COLUMN] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SELECT_ENTIRE_COLUMN;
        if (sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
            let selections = sheet.getSelections(), lastSelctionIndex = selections.length - 1;
            // In excel, when multi range selected, only larger last range's entire column, keep other range selected.
            let lastSelection = selections[lastSelctionIndex];
            if (lastSelection) {
                lastSelection.row = -1;
                lastSelection.rowCount = sheet.getRowCount();
                sheet.repaint();
            }
            return true;
        }
        return false;
    }
};

Commands[GO_SHEET_BEGINNING] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = GO_SHEET_BEGINNING;
        if (sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
            sheet.suspendPaint();
            sheet.showCell(0, 0, GC.Spread.Sheets.VerticalPosition.nearest, GC.Spread.Sheets.HorizontalPosition.nearest);
            sheet.setSelection(0, 0, 1, 1);
            sheet.resumePaint();
            return true;
        }
        return false;
    }
};

Commands[GO_SHEET_BOTTOM_RIGHT] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = GO_SHEET_BOTTOM_RIGHT;
        if (sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
            let lastNonNullRow = (sheet as any).getLastNonNullRow();
            let lastNonNullCol = (sheet as any).getLastNonNullColumn();
            sheet.showCell(lastNonNullRow, lastNonNullCol, VerticalPosition.nearest, HorizontalPosition.nearest);
            sheet.setSelection(lastNonNullRow, lastNonNullCol, 1, 1);
            return true;
        }
        return false;
    }
};

function getPrecedentsOrDependentsFromSelections (sheet: GC.Spread.Sheets.Worksheet, isPrecedents: boolean): GC.Spread.Sheets.ICellsInfo[] {
    let selections = sheet.getSelections();
    let result: GC.Spread.Sheets.ICellsInfo[] = [];
    selections.forEach((selection) => {
        let row = selection.row, col = selection.col;
        let rowCount = selection.rowCount, colCount = selection.colCount;
        for (let i = row; i < row + rowCount; i++) {
            for (let j = col; j < col + colCount; j++) {
                if (isPrecedents) {
                    result = result.concat(sheet.getPrecedents(i, j));
                } else {
                    result = result.concat(sheet.getDependents(i, j));
                }
            }
        }
    });
    return result;
}

function isRangeAdjacentOrIntersect (range: GC.Spread.Sheets.ICellsInfo, compareRange: GC.Spread.Sheets.ICellsInfo, isRow: boolean): boolean {
    if (isRow) {
        if (range.row === compareRange.row && range.rowCount === compareRange.rowCount) {
            let [leftRange, rightRange] = range.col < compareRange.col ? [range, compareRange] : [compareRange, range];
            let maxColIndex = leftRange.col + leftRange.colCount!, minColIndex = leftRange.col;
            if (rightRange.col >= minColIndex && rightRange.col <= maxColIndex) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        if (range.col === compareRange.col && range.colCount === compareRange.colCount) {
            let [topRange, bottomRange] = range.row < compareRange.row ? [range, compareRange] : [compareRange, range];
            let maxRowIndex = topRange.row + topRange.rowCount!, minRowIndex = topRange.row;
            if (bottomRange.row >= minRowIndex && bottomRange.row <= maxRowIndex) {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}


function getRangeAfterMerge (ranges: GC.Spread.Sheets.ICellsInfo[]): GC.Spread.Sheets.ICellsInfo[] {
    let len = ranges.length;
    if (len === 1) {
        return ranges;
    } else if (len === 0) {
        return [];
    } else {
        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                let range = ranges[i], compareRange = ranges[j];
                if (!compareRange || range.sheetName !== compareRange.sheetName) {
                    break;
                } else {
                    if (isRangeAdjacentOrIntersect(range, compareRange, true)) {
                        let col = Math.min(range.col, compareRange.col);
                        let endColAfterMerge = Math.max(range.col + range.colCount!, compareRange.col + compareRange.colCount!);
                        let colCount = endColAfterMerge - col;
                        let newRange: GC.Spread.Sheets.ICellsInfo = {
                            sheetName: range.sheetName,
                            row: range.row,
                            rowCount: range.rowCount,
                            col: col,
                            colCount: colCount
                        };
                        ranges.splice(j, 1);
                        ranges.splice(i, 1, newRange);
                        break;
                    } else if (isRangeAdjacentOrIntersect(range, compareRange, false)) {
                        let row = Math.min(range.row, compareRange.row);
                        let endRowAfterMerge = Math.max(range.row + range.rowCount!, compareRange.row + compareRange.rowCount!);
                        let rowCount = endRowAfterMerge - row;
                        let newRange: GC.Spread.Sheets.ICellsInfo = {
                            sheetName: range.sheetName,
                            row: row,
                            rowCount: rowCount,
                            col: range.col,
                            colCount: range.colCount
                        };
                        ranges.splice(j, 1);
                        ranges.splice(i, 1, newRange);
                        break;
                    }
                }
            }
        }
    }
    if (ranges.length === len) {
        return ranges;
    } else {
        return getRangeAfterMerge(ranges);
    }
}

function setSelectionForSheet (sheet: GC.Spread.Sheets.Worksheet, selectionInfos: any) {
    for (let i = 0; i < selectionInfos.length; i++) {
        let info = selectionInfos[i], row = info.row, col = info.col, rowCount = info.rowCount, colCount = info.colCount;
        if (i === 0) {
            sheet.setActiveCell(row, col);
            sheet.showCell(row, col, VerticalPosition.nearest, HorizontalPosition.nearest);
            if (rowCount > 1 || colCount > 1) {
                sheet.getSelections()[0].rowCount = rowCount;
                sheet.getSelections()[0].colCount = colCount;
            }
        } else {
            sheet.addSelection(row, col, rowCount, colCount);
        }
    }
}

function handlePrecedentOrDependent (context: GC.Spread.Sheets.Workbook, currentSheetName: string, isPrecedent: boolean) {
    let sheet = context.getSheetFromName(currentSheetName);
    let infos = getPrecedentsOrDependentsFromSelections(sheet, isPrecedent);
    if (infos.length > 0 && sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
        sheet.suspendPaint();
        infos = getRangeAfterMerge(infos);
        let toSheetName = currentSheetName, selectionInfos = [];
        for (let i = 0; i < infos.length; i++) {
            let info = infos[i], sheetName = info.sheetName;
            if (i === 0) {
                toSheetName = sheetName;
            } else if (sheetName !== toSheetName) {
                continue;
            }
            selectionInfos.push(info);
        }
        // Ref to the first reference's sheet.
        let toSheet = sheet;
        if (toSheetName !== currentSheetName) {
            toSheet = context.getSheetFromName(toSheetName);
            context.setActiveSheet(toSheetName);
        }
        setSelectionForSheet(toSheet, selectionInfos);

        sheet.resumePaint();
        return true;
    }
    return false;
}

Commands[GO_TO_DEPENDENTS] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: any, isUndo) {
        return handlePrecedentOrDependent(context, options.sheetName, false /* isPrecedent */);
    }
};

Commands[GO_TO_PRECEDENTS] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: any, isUndo) {
        return handlePrecedentOrDependent(context, options.sheetName, true /* isPrecedent */);
    }
};

Commands[SELECT_VISIBLE_CELLS] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SELECT_VISIBLE_CELLS;
        let visibleRanges = SheetUtil.getInvisibleRange(sheet);
        if (visibleRanges.length > 0 && sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
            sheet.suspendPaint();
            sheet.clearSelection();
            visibleRanges.forEach((visibleRange) => {
                sheet.addSelection(visibleRange.row, visibleRange.col, visibleRange.rowCount, visibleRange.colCount);
            });
            sheet.resumePaint();
        }
        return true;
    }
};

Commands[SELECT_ALL] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SELECT_ALL;
        let rowCount = sheet.getRowCount(), colCount = sheet.getColumnCount();
        sheet.suspendPaint();
        sheet.clearSelection();
        if (sheet.editorStatus() === GC.Spread.Sheets.EditorStatus.ready) {
            sheet.setSelection(-1, -1, rowCount, colCount);
        }
        sheet.resumePaint();
        return true;
    }
};

Commands[SELECTION_HOME] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName), activeRowIndex = sheet.getActiveRowIndex(), activeColIndex = sheet.getActiveColumnIndex();

        let selNeedAdjust = SheetUtil.getNeedAdjustSelection(sheet.getSelections(), activeRowIndex, activeColIndex);
        if (selNeedAdjust !== null) {
            let rangeChangeSmall = selNeedAdjust.col === activeColIndex && selNeedAdjust.colCount > 1;
            let stopSearchIndex = rangeChangeSmall ? activeColIndex : 0;
            let startSearchIndex = rangeChangeSmall ? (selNeedAdjust.col + selNeedAdjust.colCount - 1 - 1) : (selNeedAdjust.col - 1);

            let findResult = SheetUtil.findFirstNotNullColIndex(sheet, activeRowIndex, startSearchIndex, stopSearchIndex);

            if (findResult >= 0) {
                selNeedAdjust.colCount = rangeChangeSmall ? (findResult - selNeedAdjust.col + 1) : (selNeedAdjust.col - findResult + selNeedAdjust.colCount);
                selNeedAdjust.col = rangeChangeSmall ? selNeedAdjust.col : findResult;
                sheet.repaint();
            }
        }

        return true;
    }
};

Commands[SELECTION_END] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName), sheetColCount = sheet.getColumnCount(),
            activeRowIndex = sheet.getActiveRowIndex(), activeColIndex = sheet.getActiveColumnIndex();

        let selNeedAdjust = SheetUtil.getNeedAdjustSelection(sheet.getSelections(), activeRowIndex, activeColIndex);
        if (selNeedAdjust !== null) {
            let rangeChangeSmall = ((selNeedAdjust.col + selNeedAdjust.colCount - 1) === activeColIndex) && selNeedAdjust.colCount > 1;
            let stopSearchIndex = rangeChangeSmall ? activeColIndex : sheetColCount;
            let startSearchIndex = rangeChangeSmall ? (selNeedAdjust.col + 1) : (selNeedAdjust.col + selNeedAdjust.colCount);

            let findResult = SheetUtil.findNextNotNullColIndex(sheet, activeRowIndex, startSearchIndex, stopSearchIndex);

            if (findResult <= sheetColCount) {
                selNeedAdjust.colCount = rangeChangeSmall ? (selNeedAdjust.colCount + selNeedAdjust.col - findResult) : (findResult - selNeedAdjust.col + 1);
                selNeedAdjust.col = rangeChangeSmall ? findResult : selNeedAdjust.col;
                sheet.repaint();
            }
        }
        return true;
    }
};

Commands[SELECTION_TOP] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName), activeRowIndex = sheet.getActiveRowIndex(), activeColIndex = sheet.getActiveColumnIndex();

        let selNeedAdjust = SheetUtil.getNeedAdjustSelection(sheet.getSelections(), activeRowIndex, activeColIndex);
        if (selNeedAdjust !== null) {
            let rangeChangeSmall = selNeedAdjust.row === activeRowIndex && selNeedAdjust.rowCount > 1;
            let stopSearchIndex = rangeChangeSmall ? activeRowIndex : 0;
            let startSearchIndex = rangeChangeSmall ? (selNeedAdjust.row + selNeedAdjust.rowCount - 1 - 1) : (selNeedAdjust.row - 1);
            let findResult = SheetUtil.findFirstNotNullRowIndex(sheet, activeColIndex, startSearchIndex, stopSearchIndex);

            if (selNeedAdjust !== null && findResult >= 0) {
                selNeedAdjust.rowCount = rangeChangeSmall ? (findResult - selNeedAdjust.row + 1) : (selNeedAdjust.row - findResult + selNeedAdjust.rowCount);
                selNeedAdjust.row = rangeChangeSmall ? selNeedAdjust.row : findResult;
                sheet.repaint();
            }
        }
        return true;
    }
};

Commands[SELECTION_BOTTOM] = {
    canUndo: false,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName), sheetRowCount = sheet.getRowCount(),
            activeRowIndex = sheet.getActiveRowIndex(), activeColIndex = sheet.getActiveColumnIndex();

        let selNeedAdjust = SheetUtil.getNeedAdjustSelection(sheet.getSelections(), activeRowIndex, activeColIndex);
        if (selNeedAdjust) {
            let rangeChangeSmall = (selNeedAdjust.row + selNeedAdjust.rowCount - 1 === activeRowIndex) && selNeedAdjust.rowCount > 1;
            let stopSearchIndex = rangeChangeSmall ? activeRowIndex : sheetRowCount;
            let startSearchIndex = rangeChangeSmall ? (selNeedAdjust.row + 1) : (selNeedAdjust.row + selNeedAdjust.rowCount);

            let findResult = SheetUtil.findNextNotNullRowIndex(sheet, activeColIndex, startSearchIndex, stopSearchIndex);

            if (selNeedAdjust !== null && findResult <= sheetRowCount) {
                selNeedAdjust.rowCount = rangeChangeSmall ? (selNeedAdjust.rowCount + selNeedAdjust.row - findResult) : (findResult - selNeedAdjust.row + 1);
                selNeedAdjust.row = rangeChangeSmall ? findResult : selNeedAdjust.row;
                sheet.repaint();
            }
        }
        return true;
    }
};

export function initShortcutAboutSelection (commands: GC.Spread.Commands.CommandManager) {
    commands.register(SELECT_ENTIRE_ROW, Commands[SELECT_ENTIRE_ROW], 32 /* SPACE*/, false /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    commands.register(SELECT_ENTIRE_COLUMN, Commands[SELECT_ENTIRE_COLUMN], 32 /* SPACE */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(GO_SHEET_BEGINNING, Commands[GO_SHEET_BEGINNING], 36 /* HOME */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(GO_SHEET_BOTTOM_RIGHT, Commands[GO_SHEET_BOTTOM_RIGHT], 35 /* END */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(GO_TO_DEPENDENTS, Commands[GO_TO_DEPENDENTS], 221 /* ] */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(GO_TO_PRECEDENTS, Commands[GO_TO_PRECEDENTS], 219 /* [ */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(SELECT_ALL, Commands[SELECT_ALL], 65 /* A */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    if (SheetUtil.isFirefox()) {
        commands.register(SELECT_VISIBLE_CELLS, Commands[SELECT_VISIBLE_CELLS], 59 /* semicolon */, false /* ctrl */, false /* shift */, true /* alt */, false /* meta */);
    } else {
        commands.register(SELECT_VISIBLE_CELLS, Commands[SELECT_VISIBLE_CELLS], 186 /* semicolon */, false /* ctrl */, false /* shift */, true /* alt */, false /* meta */);
    }
    commands.register(SELECTION_HOME, Commands[SELECTION_HOME], 37 /* left */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    commands.register(SELECTION_END, Commands[SELECTION_END], 39 /* right */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    commands.register(SELECTION_TOP, Commands[SELECTION_TOP], 38 /* up */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
    commands.register(SELECTION_BOTTOM, Commands[SELECTION_BOTTOM], 40 /* down */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
}