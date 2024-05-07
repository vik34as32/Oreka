import { useCallback, useEffect, useState } from "react";

const getInitialKeyMapping = (shortCutKeys:string[]) => {
    return shortCutKeys.reduce((curr:{[id:string]:boolean},key:string) => {
        curr[key] = false;
        return curr;
    },{});
}
const blackListTargets = ['INPUT','PERSPECTIVE-VIEWER', 'TEXTAREA'];
const useKeyBoardShortCut = (shortCutKeys:string[],callBack:() => void, setToDefault? : boolean ) => {
    if(!Array.isArray(shortCutKeys)) {
        throw new Error("The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings." );
    }
    if (!shortCutKeys.length)  
        throw new Error(    
            "The first parameter to `useKeyboardShortcut` must contain at least one `KeyboardEvent.key` string."  
        );
    if (!callBack || typeof callBack !== "function")  
        throw new Error(    
            "The second parameter to `useKeyboardShortcut` must be a function that will be invoked when the keys are pressed."  );

    const [keys,setKeys] = useState(getInitialKeyMapping(shortCutKeys));
    
    const keyDownEventListener = useCallback((keyDownEvent:KeyboardEvent) => {
        const { target, repeat } = keyDownEvent;
        let key = keyDownEvent.key.toLowerCase();
        if(repeat) return;
        if(blackListTargets.includes((target as HTMLElement).tagName) || (target as HTMLElement).hasAttribute("gcuielement")) return;
        if (!shortCutKeys.includes(key)) return;
        keyDownEvent.preventDefault();
        if(!keys[key]) setKeys({...keys,[key]:true});

    },[keys,shortCutKeys])

    const keyUpEventListener = useCallback((keyUpEvent:KeyboardEvent) => {
        const { target, repeat } = keyUpEvent;
        let key = keyUpEvent.key.toLowerCase();
        if(repeat) return;
        if(keys.hasOwnProperty("?") && keys.hasOwnProperty("shift")){

        } else if(blackListTargets.includes((target as HTMLElement).tagName)){
            return;
        }
        if (!shortCutKeys.includes(key)) return;
        keyUpEvent.preventDefault();
        if(keys[key]) setKeys({...keys,[key]:false});
        
    },[keys,shortCutKeys])

    useEffect(() => {
        window.addEventListener("keyup",keyUpEventListener,true);
        return () => {
            window.removeEventListener("keyup",keyUpEventListener,true);
        }
    },[keyUpEventListener])

    useEffect(() => {
        window.addEventListener("keydown",keyDownEventListener,true);
        return () => {
            window.removeEventListener("keydown",keyDownEventListener,true);    
        }
    },[keyDownEventListener])

    useEffect(() => {
        if(Object.values(keys).filter(value => !value).length === 0) {
            callBack();
            if(setToDefault){
                Object.keys(keys).forEach((k) => keys[k] = false);
                setKeys({...keys});
            }
            
        }
    },[keys])
    

}
export default useKeyBoardShortCut;
