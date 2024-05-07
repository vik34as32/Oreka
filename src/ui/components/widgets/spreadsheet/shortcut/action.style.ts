import { Commands, executeCommand, IShortcutActionOptionBase, ShortcutActionBase } from "../action.base";
import * as GC from "@grapecity/spread-sheets";
import { SheetUtil } from "../sheetUtil";
const SET_CELL_BOLD = 'setCellBold',
    SET_CELL_ITALICIZE = 'setCellItalicize',
    SET_CELL_UNDERLINE = 'setCellUnderline',
    SET_NUMBER_TO_PERCENT = 'setNumberToPercent';


const FONT_WEIGHT = 'font-weight',
    FONT_BOLD = 'bold',
    FONT_STYLE = 'font-style',
    FONT_NORMAL = 'normal',
    FONT_ITALIC = 'italic';

const VerticalPosition = GC.Spread.Sheets.VerticalPosition;
const HorizontalPosition = GC.Spread.Sheets.HorizontalPosition;


interface ISetCellStyleActionOption extends IShortcutActionOptionBase {
    boldState?: boolean;
    italicizeState?: boolean;
    underlineType?: number;
    handler?: (cell: GC.Spread.Sheets.CellRange) => void;
}

interface IFontInfo {
    fontStyle: string;
    fontWeight: string;
    lineHeight: string;
}

class SetCellStyleAction extends ShortcutActionBase<ISetCellStyleActionOption> {
    executeImp () {
        let self = this;
        let sheet = self.getSheet();
        let option = self._options as ISetCellStyleActionOption;
        let handler = option.handler && option.handler.bind(self);
        let activeRow = sheet.getActiveRowIndex(), activeCol = sheet.getActiveColumnIndex();
        if (handler) {
            this.setCellStyle(handler);
        }
        sheet.showCell(activeRow, activeCol, VerticalPosition.nearest, HorizontalPosition.nearest);
        return true;
    }
}

Commands[SET_CELL_BOLD] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: ISetCellStyleActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SET_CELL_BOLD;
        let selections = sheet.getSelections();
        if (selections.length > 0) {
            let style = SheetUtil.getActiveCellStyle(sheet);
            let font = style && style.font;
            let boldState = false;
            if (font) {
                let fontWeight = SheetUtil.parseFont(font).fontWeight;
                if (fontWeight !== 'normal') {
                    boldState = true;
                }
            }
            options.boldState = boldState;
            options.handler = function (cell: GC.Spread.Sheets.CellRange) {
                let fontWeight = (this as any)._options.boldState;
                let cellFont = cell.font();
                let boldString = fontWeight ? FONT_NORMAL : FONT_BOLD;
                cellFont = (this as any).getFontStyle(cellFont, FONT_WEIGHT, boldString);
                cell.font(cellFont);
            };
            return executeCommand(context, SetCellStyleAction, options, isUndo);
        }
        return false;
    }
};

Commands[SET_CELL_ITALICIZE] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: ISetCellStyleActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SET_CELL_ITALICIZE;
        let selections = sheet.getSelections();
        if (selections.length > 0) {
            let style = SheetUtil.getActiveCellStyle(sheet);
            let font = style && style.font, italicizeState = false;
            if (font) {
                let fontStyle = SheetUtil.parseFont(font).fontStyle;
                if (fontStyle.indexOf(FONT_ITALIC) !== -1) {
                    italicizeState = true;
                }
            }
            options.italicizeState = italicizeState;
            options.handler = function (cellRange: GC.Spread.Sheets.CellRange) {
                let fontStyle = (this as any)._options.italicizeState;
                let row = cellRange.row, col = cellRange.col, rowCount = cellRange.rowCount, colCount = cellRange.colCount;
                for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    for (let colIndex = 0; colIndex < colCount; colIndex++) {
                        let cell = sheet.getCell(row + rowIndex, col + colIndex);
                        let cellFont = cell.font();
                        let fontStyleString = fontStyle ? FONT_NORMAL : FONT_ITALIC;
                        cellFont = (this as any).getFontStyle(cellFont, FONT_STYLE, fontStyleString);
                        cell.font(cellFont);
                    }
                }
            };
            return executeCommand(context, SetCellStyleAction, options, isUndo);
        }
        return false;
    }
};

Commands[SET_CELL_UNDERLINE] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: ISetCellStyleActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SET_CELL_UNDERLINE;
        let selection = sheet.getSelections();
        if (selection.length > 0) {
            let style = SheetUtil.getActiveCellStyle(sheet);
            let underline = style && style.textDecoration;
            let textDecorationType = GC.Spread.Sheets.TextDecorationType;
            if (underline) {
                options.underlineType = textDecorationType.none;
            } else {
                options.underlineType = textDecorationType.underline;
            }
            options.handler = function (cell: GC.Spread.Sheets.CellRange) {
                let underType = (this as any)._options.underlineType;
                cell.textDecoration(underType);
            };
            return executeCommand(context, SetCellStyleAction, options, isUndo);
        }
        return false;
    }
};

Commands[SET_NUMBER_TO_PERCENT] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: ISetCellStyleActionOption, isUndo: boolean) {
        let sheet = context.getSheetFromName(options.sheetName);
        options.cmd = SET_NUMBER_TO_PERCENT;
        let selections = sheet.getSelections();
        if (selections.length) {
            options.handler = function (cell: GC.Spread.Sheets.CellRange) {
                cell.formatter("0%");
            };
            return executeCommand(context, SetCellStyleAction, options, isUndo);
        }
        return false;
    }
};

export function initShortcutAboutStyle (commands: GC.Spread.Commands.CommandManager) {
    commands.register(SET_CELL_BOLD, Commands[SET_CELL_BOLD], 66 /* B */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(SET_CELL_ITALICIZE, Commands[SET_CELL_ITALICIZE], 73 /* I */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(SET_CELL_UNDERLINE, Commands[SET_CELL_UNDERLINE], 85 /* U */, true /* ctrl */, false /* shift */, false /* alt */, false /* meta */);
    commands.register(SET_NUMBER_TO_PERCENT, Commands[SET_NUMBER_TO_PERCENT], 53 /* % */, true /* ctrl */, true /* shift */, false /* alt */, false /* meta */);
}