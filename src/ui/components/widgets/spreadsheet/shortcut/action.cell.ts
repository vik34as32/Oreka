import { Commands, executeCommand, IShortcutActionOptionBase, ShortcutActionBase } from "../action.base";
import * as GC from "@grapecity/spread-sheets";
import { SheetUtil } from "../sheetUtil";
const SET_DATE = 'setDate',
    COPY_CELL_DOWN = 'copyCellDown',
    COPY_CELL_RIGHT = 'copyCellRight';
const VerticalPosition = GC.Spread.Sheets.VerticalPosition;
const HorizontalPosition = GC.Spread.Sheets.HorizontalPosition;

interface ISetDateActionOption extends IShortcutActionOptionBase {
    date?: Date;
    rowIndex?: number;
    columnIndex?: number;
}

interface IAutoFillByDirectionActionOptions extends IShortcutActionOptionBase {
    direction?: GC.Spread.Sheets.Fill.FillDirection;
}

class SetDateUndoAction extends ShortcutActionBase<ISetDateActionOption> {
    executeImp (): boolean {
        let self = this;
        let sheet = self.getSheet();
        let options = self._options;
        sheet.suspendPaint();
        let activeRow = options.rowIndex as number, activeCol = options.columnIndex as number;
        let cell = sheet.getCell(activeRow, activeCol);
        if (cell.formula()) {
            cell.formula('');
        }
        let date = options.date;
        cell.value(date);
        sheet.showCell(activeRow, activeCol, VerticalPosition.nearest, HorizontalPosition.nearest);
        sheet.resumePaint();
        return true;
    }
    canUndo () {
        return true;
    }
}

Commands[SET_DATE] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, option: ISetDateActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(option.sheetName);
        if (!isUndo && !option.cmd) {
            option.cmd = SET_DATE;
            let rowIndex = sheet.getActiveRowIndex();
            let colIndex = sheet.getActiveColumnIndex();
            let date = new Date();
            date.setHours(0, 0, 0, 0);
            let value = sheet.getValue(rowIndex, colIndex);
            if (value instanceof Date) {
                if (value.getTime() === date.getTime()) {
                    return false;
                }
            }
            option.rowIndex = rowIndex;
            option.columnIndex = colIndex;
            option.date = date;
        }
        return executeCommand(context, SetDateUndoAction, option, isUndo);
    }
};

class AutoFillDirectionAction extends ShortcutActionBase<IAutoFillByDirectionActionOptions> {
    executeImp () {
        let self = this;
        let sheet = self.getSheet();
        let selections = sheet.getSelections();
        let options = self._options as IAutoFillByDirectionActionOptions;
        if (selections.length === 1) { // In excel, only work for single selection range.
            let selection = selections[0], selectRowIndex = selection.row, selectColIndex = selection.col;
            // include single cell and single range, cannot use setValue, as need copy formula too.
            let startRange: GC.Spread.Sheets.Range | null = null, fillRange;
            switch (options.direction) {
                case GC.Spread.Sheets.Fill.FillDirection.down:
                    if (selectRowIndex > 0) { // first row, skip
                        startRange = new GC.Spread.Sheets.Range(selectRowIndex - 1, selectColIndex, 1, selection.colCount);
                        fillRange = new GC.Spread.Sheets.Range(selectRowIndex - 1, selectColIndex, selection.rowCount + 1, selection.colCount);
                    }
                    break;
                case GC.Spread.Sheets.Fill.FillDirection.right:
                    if (selectColIndex > 0) { // first col, skip
                        startRange = new GC.Spread.Sheets.Range(selectRowIndex, selectColIndex - 1, selection.rowCount, 1);
                        fillRange = new GC.Spread.Sheets.Range(selectRowIndex, selectColIndex - 1, selection.rowCount, selection.colCount + 1);
                    }
                    break;
            }
            if (startRange && fillRange) {
                sheet.fillAuto(startRange, fillRange, { fillType: GC.Spread.Sheets.Fill.FillType.direction, direction: options.direction } as GC.Spread.Sheets.Fill.IFillOptions);
                sheet.showCell(startRange.row, startRange.col, VerticalPosition.nearest, HorizontalPosition.nearest);
            }
        }
        return true;
    }
}

Commands[COPY_CELL_DOWN] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IAutoFillByDirectionActionOptions, isUndo: boolean) {
        options.cmd = COPY_CELL_DOWN;
        let sheet = context.getSheetFromName(options.sheetName);
        let selections = sheet.getSelections();
        if (selections.length > 0) {
            options.direction = GC.Spread.Sheets.Fill.FillDirection.down;
            return executeCommand(context, AutoFillDirectionAction, options, isUndo);
        }
        return false;
    }
};

Commands[COPY_CELL_RIGHT] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IAutoFillByDirectionActionOptions, isUndo: boolean) {
        options.cmd = COPY_CELL_RIGHT;
        let sheet = context.getSheetFromName(options.sheetName);
        let selections = sheet.getSelections();
        if (selections.length > 0) {
            options.direction = GC.Spread.Sheets.Fill.FillDirection.right;
            return executeCommand(context, AutoFillDirectionAction, options, isUndo);
        }
        return false;
    }
};

export function initShortcutAboutCell (commands: GC.Spread.Commands.CommandManager) {
    if (SheetUtil.isFirefox()) {
        commands.register(SET_DATE, Commands[SET_DATE], 59 /* semicolon */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    } else {
        commands.register(SET_DATE, Commands[SET_DATE], 186 /* semicolon */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    }
    commands.register(COPY_CELL_DOWN, Commands[COPY_CELL_DOWN], 68 /* D */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(COPY_CELL_RIGHT, Commands[COPY_CELL_RIGHT], 82 /* R */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
}