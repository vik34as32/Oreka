import * as GC from "@grapecity/spread-sheets";
import { RangeType } from "./shortcut/action.row.column";

interface IFontInfo {
    fontStyle: string;
    fontWeight: string;
    lineHeight: string;
}

interface IClosedInterval {
    startIndex: number;
    endIndex: number;
}


export class SheetUtil {
    static parseFont (font: string): IFontInfo {
        let fontStyle = '', fontWeight = 'normal',
            lineHeight = 'normal';
        let elements = font.split(/\s+/);
        for (let element of elements) {
            switch (element) {
                case "normal":
                    break;
                case "italic":
                    if (fontStyle.indexOf("bold") !== -1) {
                        fontStyle = "bold italic";
                    } else {
                        fontStyle = element;
                    }
                    break;
                case "bold":
                    if (fontStyle.indexOf("italic") !== -1) {
                        fontStyle = "bold italic";
                    } else {
                        fontStyle = element;
                    }
                    fontWeight = "bold";
                    break;
                case "100":
                case "200":
                case "300":
                case "400":
                case "500":
                case "600":
                case "700":
                case "800":
                case "900":
                    fontWeight = element;
                    break;
                case "lighter":
                    fontWeight = "lighter";
                    break;
            }
        }
        if (!fontStyle) {
            fontStyle = "normal";
        }
        return {
            fontStyle: fontStyle,
            fontWeight: fontWeight,
            lineHeight: lineHeight,
        };
    }

    static getActiveCellStyle (sheet: GC.Spread.Sheets.Worksheet) {
        return sheet.getActualStyle(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
    }

    static getInvisibleInfo (infos: boolean[]): number[] {
        let result = [];
        for (let i = 0; i < infos.length; i++) {
            let info = infos[i];
            if (info) {
                result.push(i);
            }
        }
        return result;
    }

    static getNextStartIndex (arr: number[], index: number): number {
        let num = arr[index];
        do {
            index++;
            num++;
        } while (num === arr[index]);
        return num;
    }

    static getContinuousVisibleInterval (totalLength: number, array: number[]): IClosedInterval[] {
        let result: IClosedInterval[] = [];
        array = array.sort((first: number, last: number) => first - last);
        let startIndex = 0, endIndex = 0;
        while (endIndex < totalLength) {
            if (array.indexOf(endIndex) > -1) {
                result.push({
                    startIndex: startIndex,
                    endIndex: endIndex - 1,
                });
                let nextStartIndex = SheetUtil.getNextStartIndex(array, array.indexOf(endIndex));
                startIndex = endIndex = nextStartIndex;
            } else {
                endIndex++;
            }
        }
        if (startIndex < endIndex) {
            result.push({
                startIndex: startIndex,
                endIndex: endIndex - 1,
            });
        }
        return result;
    }

    static getInvisibleRange (sheet: GC.Spread.Sheets.Worksheet) {
        let result: GC.Spread.Sheets.Range[] = [];
        let rowInfos = this.getAxisInfo(sheet, true);
        let colInfos = this.getAxisInfo(sheet, false);
        let invisibleCols = this.getInvisibleInfo(colInfos);
        let invisibleRows = this.getInvisibleInfo(rowInfos);
        if (invisibleCols.length !== 0 || invisibleRows.length !== 0) {
            let continuousInvisibleRows = this.getContinuousVisibleInterval(sheet.getRowCount(), invisibleRows);
            let continuousInvisibleColumns = this.getContinuousVisibleInterval(sheet.getColumnCount(), invisibleCols);
            continuousInvisibleRows.forEach((invisibleRowInterval) => {
                continuousInvisibleColumns.forEach((invisibleColInterval) => {
                    let startRowIndex = invisibleRowInterval.startIndex, rowCount = invisibleRowInterval.endIndex - startRowIndex + 1;
                    let startColIndex = invisibleColInterval.startIndex, colCount = invisibleColInterval.endIndex - startColIndex + 1;
                    let range = new GC.Spread.Sheets.Range(startRowIndex, startColIndex, rowCount, colCount);
                    result.push(range);
                });
            });
        }
        return result;
    }

    static getRangeType (range: GC.Spread.Sheets.Range): RangeType {
        let row = range.row;
        let col = range.col;
        if (row === -1) {
            if (col === -1) {
                return RangeType.entireSheet;
            } else {
                return RangeType.fullColumn;
            }
        } else {
            if (col === -1) {
                return RangeType.fullRow;
            } else {
                return RangeType.singleRange;
            }
        }
    }

    static getAxisInfo (sheet: GC.Spread.Sheets.Worksheet, isRow: boolean) {
        let result = [];
        if (isRow) {
            let rowCount = sheet.getRowCount();
            for (let i = 0; i < rowCount; i++) {
                let rowHeight = sheet.getRowHeight(i);
                result.push(rowHeight === 0);
            }
        } else {
            let colCount = sheet.getColumnCount();
            for (let i = 0; i < colCount; i++) {
                let colWidth = sheet.getColumnWidth(i);
                result.push(colWidth === 0);
            }
        }
        return result;
    }

    static isFirefox (): boolean {
        return !!navigator.userAgent.match(/Firefox/g);
    }

    static getBrowserCulture (): string {
        return navigator.language;
    }

    static getNeedAdjustSelection(selections: GC.Spread.Sheets.Range[], rowIndex: number, colIndex: number) {
        let sel = null;
        for (let selItem of selections) {
            if (selItem.contains(rowIndex, colIndex, 1, 1)) {
                sel = selItem;
            }
        }
        return sel;
    }

    static findFirstNotNullColIndex (sheet: GC.Spread.Sheets.Worksheet, fixRow: number, offset: number, stop: number) {
        while (offset > stop) {
            if (sheet.getValue(fixRow, offset) !== null) {
                break;
            }
            offset--;
        }
        return offset;
    }

    static findNextNotNullColIndex (sheet: GC.Spread.Sheets.Worksheet, fixRow: number, offset: number, stop: number) {
        while (offset < stop) {
            if (sheet.getValue(fixRow, offset) !== null) {
                break;
            }
            offset++;
        }
        return offset;
    }

    static findFirstNotNullRowIndex (sheet: GC.Spread.Sheets.Worksheet, fixCol: number, offset: number, stop: number) {
        while (offset > stop) {
            if (sheet.getValue(offset, fixCol) !== null) {
                break;
            }
            offset--;
        }
        return offset;
    }

    static findNextNotNullRowIndex (sheet: GC.Spread.Sheets.Worksheet, fixCol: number, offset: number, stop: number) {
        while (offset < stop) {
            if (sheet.getValue(offset, fixCol) !== null) {
                break;
            }
            offset++;
        }
        return offset;
    }
}