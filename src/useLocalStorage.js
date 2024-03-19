import { useState, useEffect } from "react";

export function useLocalStorage(initial, key){
    const [value, setValue] = useState(function(){
        const ls = localStorage.getItem(key);
        return ls ? JSON.parse(ls) : initial;
      });

      useEffect(function(){
        localStorage.setItem(key, JSON.stringify(value))
      },[value, key])
    
    return [value, setValue]
}