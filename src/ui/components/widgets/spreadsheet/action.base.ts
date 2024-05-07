import * as GC from "@grapecity/spread-sheets";
export interface IShortcutActionOptionBase {
    cmd?: string;
    sheetName: string;
}

interface ICommand {
    canUndo: boolean;
    execute: (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) => boolean;
}

interface ICommands {
    [key: string]: ICommand;
}

export let Commands: ICommands = {};

export abstract class ShortcutActionBase<T extends IShortcutActionOptionBase> {
    private _spread: GC.Spread.Sheets.Workbook;
    protected _options: T;

    constructor (spread: GC.Spread.Sheets.Workbook, options: T) {
        this._spread = spread;
        this._options = options;
    }

    canExecute (): boolean {
        return true;
    }
    canUndo (): boolean {
        return true;
    }

    abstract executeImp (): boolean;

    undoImp (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        context.suspendPaint();
        GC.Spread.Sheets.Commands.undoTransaction(context, options);
        context.resumePaint();
        return true;
    }

    execute (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean): boolean {
        let self = this, flag = false;
        if (isUndo) {
            flag = self.undoImp.call(self, context, options, isUndo);
        } else if (self.canExecute()) {
            let commands = GC.Spread.Sheets.Commands;
            commands.startTransaction(context, options);
            context.suspendPaint();
            try {
                flag = self.executeImp();
            } finally {
                context.resumePaint();
                commands.endTransaction(context, options);
            }
        }
        return flag;
    }

    getSheet () {
        let self = this;
        return self._spread.getSheetFromName(self._options.sheetName);
    }

    getSpread () {
        return this._spread;
    }

    setCellStyle (func: (cell: GC.Spread.Sheets.CellRange) => void) {
        let self = this;
        let sheet = self.getSheet();
        let selections = sheet.getSelections();
        sheet.suspendPaint();
        selections.forEach((selection) => {
            let { row, col, rowCount, colCount } = selection;
            let cellRange = sheet.getRange(row, col, rowCount, colCount);
            func(cellRange);
        });
        sheet.resumePaint();
    }

    getFontStyle (font: string, attribute: any, value: any) {
        let span = document.createElement("span");
        span.style.font = font;
        span.style[attribute] = value;
        return span.style.font;
    }
}

export function executeCommand (context: GC.Spread.Sheets.Workbook, action: any, options: IShortcutActionOptionBase, isUndo: boolean | undefined): boolean {
    let cmd = new action(context, options) as ShortcutActionBase<IShortcutActionOptionBase>;
    return cmd.execute(context, options, !!isUndo);
}