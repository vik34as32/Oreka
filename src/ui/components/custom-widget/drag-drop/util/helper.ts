export const reorder = <T>(
    list: T[],
    startIndex: number,
    endIndex: number
  ): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

export const remove = <T>(
    list: T[],
    startIndex:number,
): T[] => {
    const result = Array.from(list);
    result.splice(startIndex,1);
    return result;
}

export const rearrange = <T>(
    sourceList: T[], 
    sourceIndex:number,
    destinationList: T[],
    destinationIndex:number
): [T[],T[]] => {
    const sourceResult = Array.from(sourceList);
    const destinationResult = Array.from(destinationList);
    const [removed] =sourceResult.splice(sourceIndex,1);
    destinationResult.splice(destinationIndex,0,removed);
    return [sourceResult,destinationResult];
}
