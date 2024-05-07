import { Commands, ShortcutActionBase, executeCommand, IShortcutActionOptionBase } from "../action.base";
import * as GC from "@grapecity/spread-sheets";
import { SheetUtil } from "../sheetUtil";

interface IRange {
    row: number;
    col: number;
    rowCount: number;
    colCount: number;
}

const enum SelectionRangeType {
    Sheet = 0,
    OnlyRow = 1,
    OnlyColumn = 2,
    OnlyCells = 3,
    Mixture = 4,
}

const VerticalPosition = GC.Spread.Sheets.VerticalPosition;
const HorizontalPosition = GC.Spread.Sheets.HorizontalPosition;
const rangeToFormula = GC.Spread.Sheets.CalcEngine.rangeToFormula;
const allRelative = GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allRelative;

const INSERT_SUM_FUNCTION = 'insertSumFunction';

class InsertSumFunctionAction extends ShortcutActionBase<IShortcutActionOptionBase> {
    executeImp (): boolean {
        let self = this;
        let sheet = self.getSheet();
        let selections = sheet.getSelections();
        let formulaName = 'SUM';
        sheet.suspendCalcService();
        let result = true, edittingIndexInfo;
        if (self.getSelectionTypeWithSelection(selections) === SelectionRangeType.OnlyCells) {
            for (let selection of selections) {
                if (selection.row + selection.rowCount === sheet.getRowCount()) {
                    continue;
                } else {
                    let table = sheet.tables.find(sheet.getSelections()[0].row, sheet.getSelections()[0].col);
                    if (table) {
                        let dataRange = table.dataRange();
                        if (selection.row === dataRange.row && selection.rowCount === dataRange.rowCount && selection.col + selection.colCount <= dataRange.col + dataRange.colCount) {
                            if (!table.showFooter()) {
                                table.showFooter(true);
                            }
                        }
                    }
                }
                try {
                    edittingIndexInfo = self.setFormulaForSingleRange(selection, formulaName);
                } catch {
                    result = false;
                    break;
                }
            }
        }
        sheet.resumeCalcService();
        if (result) {
            let { edittingRowIndex, edittingColIndex } = edittingIndexInfo;
            if (sheet.getActiveRowIndex() !== edittingRowIndex || sheet.getActiveColumnIndex() !== edittingColIndex) {
                sheet.setActiveCell(edittingRowIndex, edittingColIndex);
            }
            sheet.startEdit();
        }
        return result;
    }
    getSelectionTypeWithSelection (selections: GC.Spread.Sheets.Range[]) {
        let selectionType: SelectionRangeType | undefined;
        for (let selection of selections) {
            if (selection.col === -1 && selection.row === -1) {
                return SelectionRangeType.Sheet;
            } else if (selection.row === -1) {
                if (selectionType === undefined) {
                    selectionType = SelectionRangeType.OnlyColumn;
                } else if (selectionType !== SelectionRangeType.OnlyColumn) {
                    return SelectionRangeType.Mixture;
                }
            } else if (selection.col === -1) {
                if (selectionType === undefined) {
                    selectionType = SelectionRangeType.OnlyRow;
                } else if (selectionType !== SelectionRangeType.OnlyRow) {
                    return SelectionRangeType.Mixture;
                }
            } else {
                if (selectionType === undefined) {
                    selectionType = SelectionRangeType.OnlyCells;
                } else if (selectionType !== SelectionRangeType.OnlyCells) {
                    return SelectionRangeType.Mixture;
                }
            }
        }
        return selectionType;
    }
    _noNeedSetFormula (row: number, col: number) {
        let sheet = this.getSheet(), style = sheet.getStyle(row, col);
        if (style && (style.cellType || style.cellButtons)) {
            return true;
        }
        return false;
    }

    calculateValidRange (row: number, column: number, rowCount: number, columnCount: number): IRange {
        let r = row;
        let c = column;
        let rc = rowCount;
        let cc = columnCount;
        if (r !== -1 && c !== -1) {
            let spans = this.getSheet().getSpans();
            if (spans && spans.length > 0) {
                let newSelection = this.cellRangeInflate(spans, new GC.Spread.Sheets.Range(row, column, rowCount, columnCount));
                r = newSelection.row;
                c = newSelection.col;
                rc = newSelection.rowCount;
                cc = newSelection.colCount;
            }
        }
        return {
            row: r,
            col: c,
            rowCount: rc,
            colCount: cc
        };
    }

    cellRangeInflate (spans: GC.Spread.Sheets.Range[], cellRange: GC.Spread.Sheets.Range): IRange {
        let spansLength = spans && spans.length;
        for (let i = 0; i < spansLength; i++) {
            let cr = spans[i];
            if (cellRange.intersect(cr.row, cr.col, cr.rowCount, cr.colCount)) {
                spans.splice(i, 1);
                return this.cellRangeInflate(spans, cellRange.union(cr));
            }
        }
        return cellRange;
    }

    getFormulaRange (range: GC.Spread.Sheets.Range): IRange | undefined {
        let self = this;
        let sheet = self.getSheet(),
            leftCell = sheet.getValue(range.row, range.col - 1),
            topCell = sheet.getValue(range.row - 1, range.col), startWithLeft = false;
        startWithLeft = self.getStartRangeDirection(range, sheet, leftCell, topCell);
        let calculateRange = self.calculateRange(startWithLeft, range);
        let row = calculateRange.row, col = calculateRange.col, rowCount = calculateRange.rowCount, colCount = calculateRange.colCount;

        if (col !== undefined && row !== undefined) {
            return;
        }
        if (col === undefined && row === undefined) {
            return range;
        } else if (col === undefined) {
            let r = row as number;
            return self.calculateValidRange(r, range.col, range.row - r, colCount);
        }
        return self.calculateValidRange(range.row, col, rowCount, range.col - col);
    }

    calculateRange (startWithLeft: boolean, range: GC.Spread.Sheets.Range) {
        let row, col, rowCount = 1, colCount = 1, sheet = this.getSheet(), pureNull = false;
        //top
        if (startWithLeft === false) {
            for (let i = range.row - 1; i >= 0; i--) {
                let value = sheet.getValue(i, range.col);
                if (this.valueIsNumber(value)) {
                    pureNull = true;
                    if (i === 0) {
                        row = 0;
                    }
                } else if (pureNull === true && !this.valueIsNumber(value)) {
                    row = i + 1;
                    break;
                }
            }
        }
        //left
        if (!pureNull) {
            for (let i = range.col - 1; i >= 0; i--) {
                let value = sheet.getValue(range.row, i);
                if (this.valueIsNumber(value)) {
                    pureNull = true;
                    if (i === 0) {
                        col = 0;
                    }
                } else if (pureNull === true && !this.valueIsNumber(value)) {
                    col = i + 1;
                    break;
                }
            }
        }
        return {
            row: row,
            col: col,
            rowCount: rowCount,
            colCount: colCount
        };
    }

    getStartRangeDirection (range: GC.Spread.Sheets.Range, sheet: GC.Spread.Sheets.Worksheet, leftCellValue: any, aboveCellValue: any) {
        let leftRangeHaveNumberValue = false, topRangeFirstValueFormula = false, startWithLeft = false;
        //Make sure the range on the left, sort from right to left,
        //(the first non-empty cell is number), and the formula is empty
        for (let i = range.col - 1; i >= 0; i--) {
            let value = sheet.getValue(range.row, i), formula = sheet.getFormula(range.row, i);
            if (formula) {
                break;
            }
            if (this.valueIsNumber(value)) {
                leftRangeHaveNumberValue = true;
                break;
            }
        }
        //Make sure the top range, sort from bottom up,
        //the first empty cell exists (empty cell refers to all cells that are not of type number
        //and the formula is empty) is number,
        for (let i = range.row - 1; i >= 0; i--) {
            let value = sheet.getValue(i, range.col), formula = sheet.getFormula(i, range.col);
            if (formula) {
                topRangeFirstValueFormula = true;
                break;
            }
            if (this.valueIsNumber(value)) {
                break;
            }
        }
        if ((this.valueIsNumber(leftCellValue) && !this.valueIsNumber(aboveCellValue)) || (leftRangeHaveNumberValue && topRangeFirstValueFormula)) {
            startWithLeft = true;
        }
        return startWithLeft;
    }

    valueIsNumber (value: any) {
        if (typeof value === 'number') {
            return true;
        }
        return false;
    }

    getSpan (row: number, col: number): GC.Spread.Sheets.Range {
        return new GC.Spread.Sheets.Range(row, col, 1, 1);
    }

    setFormulaForSingleRange (range: GC.Spread.Sheets.Range, formulaName: string): any {
        let self = this, sheet = self.getSheet(), spread = sheet.getParent();
        let startRowIndex = range.row, startColIndex = range.col;
        let span = self.getSpan(startRowIndex, startColIndex);
        let rangeIsSpan = false;
        if (span && span.equals(range)) {
            rangeIsSpan = true;
        }
        let useR1C1 = spread.options.referenceStyle === 1 /* R1C1 */;
        let edittingRowIndex = range.row, edittingColIndex = range.col;
        if ((range.colCount === 1 && range.rowCount === 1) || rangeIsSpan) { // single cell
            self.setFormulaToSingleCell(range, formulaName, useR1C1);
        } else if (range.colCount === 1) {
            let lastRowIndex = startRowIndex + range.rowCount - 1, col = startColIndex;
            if (!sheet.getText(startRowIndex, col)) {
                // If the first cell of selected range has value, set formula to last cell of selected range. If not, set formula to the first cell.
                self.setFormulaToSingleCell(range, formulaName, useR1C1);
            } else {
                if (!sheet.getText(lastRowIndex, col)) { // If the last cell of selected range has value, set formula to next null row.
                    let formulaRange = {
                        row: startRowIndex,
                        col: col,
                        colCount: range.colCount,
                        rowCount: range.rowCount - 1
                    };
                    edittingRowIndex = lastRowIndex;
                    let formulaString = rangeToFormula(formulaRange as GC.Spread.Sheets.Range, lastRowIndex, col, allRelative, spread.options.referenceStyle === 1/* useR1C1 */);
                    self.setFormulaToSheet(sheet, lastRowIndex, col, formulaName, formulaString);
                } else if (lastRowIndex + 1 < sheet.getRowCount()) {
                    edittingRowIndex = lastRowIndex + 1;
                    let formulaString = rangeToFormula(range, lastRowIndex + 1, col, allRelative, useR1C1);
                    self.setFormulaToSheet(sheet, lastRowIndex + 1, col, formulaName, formulaString);
                }
            }
        } else if (range.rowCount === 1) {
            let row = startRowIndex, lastColIndex = startColIndex + range.colCount - 1;
            if (!sheet.getText(row, startColIndex)) {
                self.setFormulaToSingleCell(range, formulaName, useR1C1);
            } else {
                if (!sheet.getText(row, lastColIndex)) {
                    let formulaRange = {
                        row: row,
                        col: startColIndex,
                        colCount: range.colCount - 1,
                        rowCount: range.rowCount
                    };
                    edittingColIndex = lastColIndex;
                    let formulaString = rangeToFormula(formulaRange as GC.Spread.Sheets.Range, row, lastColIndex, allRelative, useR1C1);
                    self.setFormulaToSheet(sheet, row, lastColIndex, formulaName, formulaString);
                } else if (lastColIndex + 1 < sheet.getColumnCount()) {
                    edittingColIndex = lastColIndex + 1;
                    let formulaString = rangeToFormula(range, row, lastColIndex + 1, allRelative, useR1C1);
                    self.setFormulaToSheet(sheet, row, lastColIndex + 1, formulaName, formulaString);
                }
            }
        } else {
            self.setMultiRowColRangeFormula(range, formulaName);
        }
        return { edittingRowIndex, edittingColIndex };
    }

    setFormulaToSingleCell (range: GC.Spread.Sheets.Range, formulaName: string, useR1C1: boolean) {
        let self = this, sheet = self.getSheet(), startRowIndex = range.row, startColIndex = range.col;
        if (self._noNeedSetFormula(startRowIndex, startColIndex)) {
            return;
        }
        let formulaRange = self.getFormulaRange(range);
        let formulaString = '';
        if (formulaRange) {
            if (formulaRange.rowCount !== 1 || formulaRange.colCount !== 1 || formulaRange.row !== startRowIndex || formulaRange.col !== startColIndex) {
                formulaString = rangeToFormula(formulaRange as GC.Spread.Sheets.Range, startRowIndex, startColIndex, allRelative, useR1C1);
            }
        }
        self.setFormulaToSheet(sheet, startRowIndex, startColIndex, formulaName, formulaString);
    }

    setFormulaToSheet (sheet: GC.Spread.Sheets.Worksheet, row: number, col: number, formulaName: string, formulaString: string) {
        let formula = '=' + formulaName + '(' + formulaString + ')';
        sheet.setFormula(row, col, formula);
        sheet.showCell(row, col, VerticalPosition.nearest, HorizontalPosition.nearest);
    }

    setMultiRowColRangeFormula (range: GC.Spread.Sheets.Range, formulaName: string) {
        let self = this, lastRow = range.row + range.rowCount - 1,
            lastCol = range.col + range.colCount - 1, sheet = self.getSheet(), setNextCell = true, setRightCell = true;
        for (let i = range.col; i < range.col + range.colCount; i++) {
            if (sheet.getValue(lastRow, i)) {
                setNextCell = false;
                break;
            }
        }
        for (let i = range.row; i < range.row + range.rowCount; i++) {
            if (sheet.getValue(i, lastCol)) {
                setRightCell = false;
                break;
            }
        }
        if (!setRightCell) {
            self.setWholeRowFormula(setNextCell, lastRow, range, formulaName);
        } else if (!setNextCell && setRightCell) {
            self.setWholeColFormula(lastCol, range, formulaName);
        } else {
            self.setWholeRowFormula(setNextCell, lastRow, range, formulaName);
            self.setWholeColFormula(lastCol, range, formulaName);
        }
    }
    setWholeRowFormula (setNextCell: boolean, lastRow: number, range: GC.Spread.Sheets.Range, formulaName: string) {
        let setFormulaCellRow = setNextCell ? lastRow : lastRow + 1, self = this;
        for (let i = range.col; i < range.col + range.colCount; i++) {
            if (self._noNeedSetFormula(setFormulaCellRow, i)) {
                break;
            }
            let formulaRange = {
                col: i,
                colCount: 1,
                row: range.row,
                rowCount: range.rowCount + (setNextCell ? -1 : 0)
            };
            let formula = rangeToFormula(formulaRange as GC.Spread.Sheets.Range, setFormulaCellRow, i, allRelative, self.getSpread().options.referenceStyle === 1/* useR1C1 */);
            formula = '=' + formulaName + '(' + formula + ')';
            self.getSheet().setFormula(setFormulaCellRow, i, formula);
            self.getSheet().showCell(setFormulaCellRow, i, VerticalPosition.nearest, HorizontalPosition.nearest);
        }
    }

    setWholeColFormula (lastCol: number, range: GC.Spread.Sheets.Range, formulaName: string) {
        let self = this;
        for (let i = range.row; i < range.row + range.rowCount; i++) {
            if (self._noNeedSetFormula(i, lastCol)) {
                break;
            }
            let formulaRange = {
                col: range.col,
                colCount: range.colCount - 1,
                row: i,
                rowCount: 1
            };
            let formula = rangeToFormula(formulaRange as GC.Spread.Sheets.Range, i, lastCol - 1, allRelative, self.getSpread().options.referenceStyle === 1/* useR1C1 */);
            formula = '=' + formulaName + '(' + formula + ')';
            self.getSheet().setFormula(i, lastCol, formula);
            self.getSheet().showCell(i, lastCol, VerticalPosition.nearest, HorizontalPosition.nearest);
        }
    }
}

Commands[INSERT_SUM_FUNCTION] = {
    canUndo: true,
    execute: function (context: GC.Spread.Sheets.Workbook, options: IShortcutActionOptionBase, isUndo: boolean) {
        options.cmd = INSERT_SUM_FUNCTION;
        return executeCommand(context, InsertSumFunctionAction, options, isUndo);
    }
};

export function initShortcutAboutCalc (commands: GC.Spread.Commands.CommandManager) {
    if (SheetUtil.isFirefox()) {
        commands.register(INSERT_SUM_FUNCTION, Commands[INSERT_SUM_FUNCTION], 61 /* = */, false /* ctrl */, false /* shift */, true /* alt */, false /* meta */);
    } else {
        commands.register(INSERT_SUM_FUNCTION, Commands[INSERT_SUM_FUNCTION], 187 /* = */, false /* ctrl */, false /* shift */, true /* alt */, false /* meta */);
    }
}